import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/Item";
import Claim from "@/models/Claim";
import { mockStore } from "@/lib/mock-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      const item = await Item.findById(id);
      if (!item) {
        return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
      }
      const claims = await Claim.find({ itemId: id }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, item, claims });
    }

    const item = mockStore.getItemById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    const claims = mockStore.getClaimsByItem(id);

    return NextResponse.json({ success: true, item, claims, source: "mock_store" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
