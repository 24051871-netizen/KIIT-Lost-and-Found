import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClaimDocument extends Document {
  itemId: mongoose.Types.ObjectId;
  claimantEmail: string;
  claimantName: string;
  claimantRollNumber?: string;
  challengeAnswer: string;
  proofDescription?: string;
  proofImageUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  qrToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema = new Schema<IClaimDocument>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true, index: true },
    claimantEmail: { type: String, required: true },
    claimantName: { type: String, required: true },
    claimantRollNumber: { type: String },
    challengeAnswer: { type: String, required: true },
    proofDescription: { type: String },
    proofImageUrl: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
      index: true,
    },
    qrToken: { type: String },
  },
  { timestamps: true }
);

const Claim: Model<IClaimDocument> =
  mongoose.models.Claim || mongoose.model<IClaimDocument>("Claim", ClaimSchema);

export default Claim;
