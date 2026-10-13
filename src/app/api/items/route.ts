import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/Item";
import { mockStore } from "@/lib/mock-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const campusId = searchParams.get("campusId") || undefined;
    const category = searchParams.get("category") || undefined;
    const itemType = searchParams.get("itemType") || undefined;
    const status = searchParams.get("status") || undefined;

    const db = await connectToDatabase();

    if (db) {
      const query: any = {};

      if (campusId && campusId !== "ALL") query.campusId = campusId;
      if (category && category !== "ALL") query.category = category;
      if (itemType && itemType !== "ALL") query.itemType = itemType;
      if (status && status !== "ALL") query.status = status;

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { specificLocation: { $regex: search, $options: "i" } },
        ];
      }

      const items = await Item.find(query).sort({ createdAt: -1 }).limit(50);
      return NextResponse.json({ success: true, count: items.length, items });
    }

    // Fallback to resilient in-memory mock store
    const items = mockStore.getItems({ search, campusId, category, itemType, status });
    return NextResponse.json({ success: true, count: items.length, items, source: "mock_store" });
  } catch (error: any) {
    console.error("GET /api/items error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      itemType,
      category,
      campusId,
      campusName,
      specificLocation,
      imageUrls,
      secretChallengeQuestion,
      secretAnswer,
      contactEmail,
      contactName,
      reporterRollNumber,
      reporterHostel,
    } = body;

    if (!title || !description || !itemType || !category || !campusId || !contactEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for reporting item." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const newItem = await Item.create({
        title,
        description,
        itemType,
        category,
        campusId,
        campusName: campusName || campusId,
        specificLocation: specificLocation || "Campus premises",
        imageUrls: imageUrls || [],
        status: "ACTIVE",
        secretChallengeQuestion: secretChallengeQuestion || undefined,
        secretAnswerHash: secretAnswer ? secretAnswer.toLowerCase().trim() : undefined,
        contactEmail,
        contactName: contactName || "KIIT Member",
        reporterRollNumber,
        reporterHostel,
      });

      return NextResponse.json({ success: true, item: newItem }, { status: 201 });
    }

    // Fallback to in-memory store
    const newItem = mockStore.addItem({
      title,
      description,
      itemType,
      category,
      campusId,
      campusName: campusName || campusId,
      specificLocation: specificLocation || "Campus premises",
      imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : [
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
      ],
      secretChallengeQuestion,
      secretAnswerHash: secretAnswer ? secretAnswer.toLowerCase().trim() : undefined,
      contactEmail,
      contactName: contactName || "KIIT Member",
      reporterRollNumber,
      reporterHostel,
    });

    return NextResponse.json({ success: true, item: newItem, source: "mock_store" }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/items error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
