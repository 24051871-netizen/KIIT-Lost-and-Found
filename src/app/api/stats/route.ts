import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/Item";
import { mockStore } from "@/lib/mock-store";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (db) {
      const [total, lost, found, returned, active, idCards] = await Promise.all([
        Item.countDocuments(),
        Item.countDocuments({ itemType: "LOST" }),
        Item.countDocuments({ itemType: "FOUND" }),
        Item.countDocuments({ status: "RETURNED" }),
        Item.countDocuments({ status: "ACTIVE" }),
        Item.countDocuments({ category: "KIIT_ID_CARD", status: "RETURNED" }),
      ]);

      const recoveryRate = total > 0 ? Math.round((returned / total) * 100) : 0;

      return NextResponse.json({
        success: true,
        stats: {
          total,
          lost,
          found,
          returned,
          active,
          idCardsRecovered: idCards,
          recoveryRate,
        },
      });
    }

    const stats = mockStore.getStats();
    return NextResponse.json({ success: true, stats, source: "mock_store" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
