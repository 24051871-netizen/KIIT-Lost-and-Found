import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Item from "@/models/Item";
import Claim from "@/models/Claim";
import { mockStore } from "@/lib/mock-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { claimantEmail, claimantName, claimantRollNumber, challengeAnswer, proofDescription } = body;

    if (!claimantEmail || !claimantName || !challengeAnswer) {
      return NextResponse.json(
        { success: false, error: "Email, Name, and Verification Challenge Answer are required." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const item = await Item.findById(id);
      if (!item) {
        return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
      }

      // Check if answer matches (case-insensitive substring or exact match)
      const answerNormalized = challengeAnswer.trim().toLowerCase();
      const isDirectMatch =
        item.secretAnswerHash &&
        (item.secretAnswerHash === answerNormalized ||
          answerNormalized.includes(item.secretAnswerHash) ||
          item.secretAnswerHash.includes(answerNormalized));

      const newClaim = await Claim.create({
        itemId: item._id,
        claimantEmail,
        claimantName,
        claimantRollNumber,
        challengeAnswer,
        proofDescription,
        status: isDirectMatch ? "APPROVED" : "PENDING",
      });

      // Update item status
      item.status = isDirectMatch ? "CLAIM_APPROVED" : "CLAIM_PENDING";
      await item.save();

      return NextResponse.json({
        success: true,
        claim: newClaim,
        directMatch: isDirectMatch,
        message: isDirectMatch
          ? "Verification Challenge answered correctly! Your claim has been pre-approved."
          : "Claim submitted. The reporter will review your challenge answer.",
      });
    }

    // Mock store fallback
    const item = mockStore.getItemById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    const answerNormalized = challengeAnswer.trim().toLowerCase();
    const isDirectMatch =
      item.secretAnswerHash &&
      (item.secretAnswerHash === answerNormalized ||
        answerNormalized.includes(item.secretAnswerHash) ||
        item.secretAnswerHash.includes(answerNormalized));

    const claim = mockStore.addClaim({
      itemId: id,
      claimantEmail,
      claimantName,
      claimantRollNumber,
      challengeAnswer,
      proofDescription,
    });

    if (isDirectMatch) {
      claim.status = "APPROVED";
      mockStore.updateItemStatus(id, "CLAIM_APPROVED", {
        claimedBy: {
          email: claimantEmail,
          name: claimantName,
          rollNumber: claimantRollNumber,
          claimedAt: new Date().toISOString(),
        },
      });
    } else {
      mockStore.updateItemStatus(id, "CLAIM_PENDING");
    }

    return NextResponse.json({
      success: true,
      claim,
      directMatch: isDirectMatch,
      message: isDirectMatch
        ? "Verification Challenge answered correctly! Claim approved."
        : "Claim submitted. Awaiting reporter review.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
