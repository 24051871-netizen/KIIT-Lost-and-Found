import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/Item";
import Claim from "@/models/Claim";
import AuditLog from "@/models/AuditLog";
import { mockStore } from "@/lib/mock-store";
import { generateSignedQrToken } from "@/lib/qr";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { claimId, action, reviewerEmail, reviewerName } = body; // action: "APPROVE" | "REJECT"

    if (!claimId || !action) {
      return NextResponse.json(
        { success: false, error: "claimId and action ('APPROVE' or 'REJECT') are required." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const item = await Item.findById(id);
      const claim = await Claim.findById(claimId);

      if (!item || !claim) {
        return NextResponse.json({ success: false, error: "Item or Claim not found" }, { status: 404 });
      }

      if (action === "APPROVE") {
        const { token, payload } = generateSignedQrToken(
          item._id.toString(),
          claim.claimantEmail,
          claim.claimantName,
          claim._id.toString(),
          1440 // 24 hours
        );

        claim.status = "APPROVED";
        claim.qrToken = token;
        await claim.save();

        item.status = "CLAIM_APPROVED";
        item.claimedBy = {
          email: claim.claimantEmail,
          name: claim.claimantName,
          rollNumber: claim.claimantRollNumber,
          claimedAt: new Date().toISOString(),
        };
        item.qrTokenHash = token;
        item.qrExpiresAt = new Date(payload.expiresAt).toISOString();
        await item.save();

        await AuditLog.create({
          itemId: item._id,
          action: "CLAIM_APPROVED",
          performedByEmail: reviewerEmail || "finder@kiit.ac.in",
          performedByName: reviewerName || "Item Reporter",
          notes: `Approved claim for ${claim.claimantName} (${claim.claimantEmail}) with QR Token.`,
        });

        return NextResponse.json({
          success: true,
          action: "APPROVED",
          qrToken: token,
          expiresAt: payload.expiresAt,
          message: "Claim approved. Verification QR token issued to claimant.",
        });
      } else {
        claim.status = "REJECTED";
        await claim.save();

        item.status = "ACTIVE";
        await item.save();

        return NextResponse.json({
          success: true,
          action: "REJECTED",
          message: "Claim rejected. Item returned to ACTIVE catalog.",
        });
      }
    }

    // Mock store fallback
    const item = mockStore.getItemById(id);
    const claim = mockStore.getClaimById(claimId);

    if (!item || !claim) {
      return NextResponse.json({ success: false, error: "Item or Claim not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      const { token, payload } = generateSignedQrToken(
        id,
        claim.claimantEmail,
        claim.claimantName,
        claimId,
        1440
      );

      mockStore.updateClaim(claimId, "APPROVED", token);
      mockStore.updateItemStatus(id, "CLAIM_APPROVED", {
        claimedBy: {
          email: claim.claimantEmail,
          name: claim.claimantName,
          rollNumber: claim.claimantRollNumber,
          claimedAt: new Date().toISOString(),
        },
        qrTokenHash: token,
        qrExpiresAt: new Date(payload.expiresAt).toISOString(),
      });

      return NextResponse.json({
        success: true,
        action: "APPROVED",
        qrToken: token,
        expiresAt: payload.expiresAt,
        message: "Claim approved. Verification QR token issued to claimant.",
      });
    } else {
      mockStore.updateClaim(claimId, "REJECTED");
      mockStore.updateItemStatus(id, "ACTIVE");

      return NextResponse.json({
        success: true,
        action: "REJECTED",
        message: "Claim rejected. Item returned to ACTIVE catalog.",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
