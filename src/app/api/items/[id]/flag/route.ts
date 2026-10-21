import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/Item";
import AuditLog from "@/models/AuditLog";
import { mockStore } from "@/lib/mock-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason, reporterEmail, notes } = body;

    const db = await connectToDatabase();

    if (db) {
      const item = await Item.findById(id);
      if (!item) {
        return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
      }

      const newFlagCount = (item.flagCount || 0) + 1;
      item.flagCount = newFlagCount;

      const isQuarantined = newFlagCount >= 3;
      if (isQuarantined) {
        item.status = "ARCHIVED";
      }
      await item.save();

      // Log flag event to AuditLog
      await AuditLog.create({
        itemId: item._id,
        action: isQuarantined ? "ITEM_QUARANTINED" : "FLAGGED_SPAM",
        performedByEmail: reporterEmail || "anonymous_student@kiit.ac.in",
        performedByName: "Campus Community Member",
        notes: `Reason: ${reason || "SPAM"}. Notes: ${notes || "None"}. Total Flags: ${newFlagCount}. ${
          isQuarantined ? "THRESHOLD REACHED: Item auto-quarantined from public search." : ""
        }`,
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: isQuarantined
          ? "Item flagged and automatically quarantined from public search due to multiple spam reports."
          : "Listing flagged for review by campus security.",
        flagCount: newFlagCount,
        isQuarantined,
      });
    }

    // Mock store fallback
    const result = mockStore.flagItem(id, reason || "SPAM");
    return NextResponse.json({
      success: true,
      message: result.isQuarantined
        ? "Item flagged and automatically quarantined from public search."
        : "Listing flagged for review by campus security.",
      flagCount: result.flagCount,
      isQuarantined: result.isQuarantined,
    });
  } catch (error: any) {
    console.error("POST /api/items/[id]/flag error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
