import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/Item";
import Claim from "@/models/Claim";
import AuditLog from "@/models/AuditLog";
import { mockStore } from "@/lib/mock-store";
import { verifyQrToken } from "@/lib/qr";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { token, scannedByEmail, scannedByName, handoverNotes } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: "QR verification token is required." }, { status: 400 });
    }

    // Verify cryptographic signature and expiration
    const verification = verifyQrToken(token);
    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { success: false, error: verification.reason || "Invalid QR token." },
        { status: 400 }
      );
    }

    // Validate that token matches this specific item
    if (verification.payload.itemId !== id) {
      return NextResponse.json(
        {
          success: false,
          error: "QR token mismatch! This QR code belongs to a different lost item.",
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const item = await Item.findById(id);
      if (!item) {
        return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
      }

      if (item.status === "RETURNED") {
        return NextResponse.json(
          { success: false, error: "This item has already been marked as RETURNED." },
          { status: 400 }
        );
      }

      item.status = "RETURNED";
      await item.save();

      if (verification.payload.claimId) {
        await Claim.findByIdAndUpdate(verification.payload.claimId, { status: "COMPLETED" });
      }

      await AuditLog.create({
        itemId: item._id,
        action: "QR_HANDOVER_VERIFIED",
        performedByEmail: scannedByEmail || "security@kiit.ac.in",
        performedByName: scannedByName || "Campus Security Desk",
        notes: handoverNotes || `Item successfully handed over to ${verification.payload.claimantName} (${verification.payload.claimantEmail}). Verified via QR.`,
      });

      return NextResponse.json({
        success: true,
        message: "Handover successfully verified! Item status updated to RETURNED.",
        item,
        claimant: verification.payload,
      });
    }

    // Mock store fallback
    const item = mockStore.getItemById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    if (item.status === "RETURNED") {
      return NextResponse.json(
        { success: false, error: "This item has already been marked as RETURNED." },
        { status: 400 }
      );
    }

    mockStore.updateItemStatus(id, "RETURNED");
    if (verification.payload.claimId) {
      mockStore.updateClaim(verification.payload.claimId, "COMPLETED");
    }

    return NextResponse.json({
      success: true,
      message: "Handover successfully verified! Item marked as RETURNED.",
      item: mockStore.getItemById(id),
      claimant: verification.payload,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
