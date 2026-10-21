import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/Item";
import AuditLog from "@/models/AuditLog";
import { mockStore } from "@/lib/mock-store";
import mongoose from "mongoose";

const MAX_ACTIVE_LISTINGS = 3;
const COOLDOWN_MINUTES = 5;

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

    if (title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Title must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (description.trim().length < 15) {
      return NextResponse.json(
        {
          success: false,
          error: "Description must be at least 15 characters to provide verifiable campus context.",
        },
        { status: 400 }
      );
    }

    if (specificLocation && specificLocation.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Specific location must be at least 5 characters (e.g., 'Campus 15, Lab 302').",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = contactEmail.toLowerCase().trim();
    const db = await connectToDatabase();

    if (db) {
      // 1. Quota Check: Max 3 active listings per student
      const activeCount = await Item.countDocuments({
        contactEmail: normalizedEmail,
        status: "ACTIVE",
      });

      if (activeCount >= MAX_ACTIVE_LISTINGS) {
        await AuditLog.create({
          itemId: new mongoose.Types.ObjectId(),
          action: "QUOTA_EXCEEDED_BLOCKED",
          performedByEmail: normalizedEmail,
          performedByName: contactName || "KIIT Member",
          notes: `Listing Quota Block: User has ${activeCount} active listings (max ${MAX_ACTIVE_LISTINGS}).`,
        }).catch(() => {});

        return NextResponse.json(
          {
            success: false,
            error: `Active Listing Quota Exceeded: You currently have ${activeCount} active campus listings (maximum permitted: ${MAX_ACTIVE_LISTINGS}). Under KIIT anti-spam policy, resolve or close your existing items at a Safe Zone before reporting new property.`,
          },
          { status: 429 }
        );
      }

      // 2. Velocity Rate Limiting: Minimum 5-minute cooldown between listings
      const recentListing = await Item.findOne({
        contactEmail: normalizedEmail,
        createdAt: { $gte: new Date(Date.now() - COOLDOWN_MINUTES * 60 * 1000) },
      });

      if (recentListing) {
        return NextResponse.json(
          {
            success: false,
            error: `Anti-Flood Cooldown: Please wait ${COOLDOWN_MINUTES} minutes before submitting another listing.`,
          },
          { status: 429 }
        );
      }

      // 3. Duplicate Listing Detection
      const escapedTitle = title.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const duplicate = await Item.findOne({
        contactEmail: normalizedEmail,
        title: { $regex: new RegExp(`^${escapedTitle}$`, "i") },
        status: "ACTIVE",
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: `Duplicate Listing Detected: You already have an active listing for "${title}". Please update your existing report.`,
          },
          { status: 409 }
        );
      }

      const newItem = await Item.create({
        title: title.trim(),
        description: description.trim(),
        itemType,
        category,
        campusId,
        campusName: campusName || campusId,
        specificLocation: specificLocation.trim(),
        imageUrls: imageUrls || [],
        status: "ACTIVE",
        secretChallengeQuestion: secretChallengeQuestion || undefined,
        secretAnswerHash: secretAnswer ? secretAnswer.toLowerCase().trim() : undefined,
        contactEmail: normalizedEmail,
        contactName: contactName || "KIIT Member",
        reporterRollNumber,
        reporterHostel,
      });

      // Immutable Audit Log for Item Creation
      await AuditLog.create({
        itemId: newItem._id,
        action: "REPORTED",
        performedByEmail: normalizedEmail,
        performedByName: contactName || "KIIT Member",
        notes: `Item reported under verified student roll ${reporterRollNumber || "N/A"}. Quota: ${activeCount + 1}/${MAX_ACTIVE_LISTINGS}.`,
      }).catch(() => {});

      return NextResponse.json({ success: true, item: newItem }, { status: 201 });
    }

    // Fallback to in-memory store
    const activeCount = mockStore.getActiveCountByEmail(normalizedEmail);
    if (activeCount >= MAX_ACTIVE_LISTINGS) {
      return NextResponse.json(
        {
          success: false,
          error: `Active Listing Quota Exceeded: You currently have ${activeCount} active campus listings (max allowed: ${MAX_ACTIVE_LISTINGS}).`,
        },
        { status: 429 }
      );
    }

    const lastListingTime = mockStore.getLastListingTime(normalizedEmail);
    if (lastListingTime && Date.now() - lastListingTime < COOLDOWN_MINUTES * 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          error: `Anti-Flood Cooldown: Please wait ${COOLDOWN_MINUTES} minutes before submitting another listing.`,
        },
        { status: 429 }
      );
    }

    if (mockStore.hasRecentDuplicate(normalizedEmail, title)) {
      return NextResponse.json(
        {
          success: false,
          error: `Duplicate Listing Detected: You already have an active listing for "${title}".`,
        },
        { status: 409 }
      );
    }

    const newItem = mockStore.addItem({
      title: title.trim(),
      description: description.trim(),
      itemType,
      category,
      campusId,
      campusName: campusName || campusId,
      specificLocation: specificLocation.trim(),
      imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : [
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
      ],
      secretChallengeQuestion,
      secretAnswerHash: secretAnswer ? secretAnswer.toLowerCase().trim() : undefined,
      contactEmail: normalizedEmail,
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
