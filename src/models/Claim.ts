import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClaimDocument extends Document {
  itemId: mongoose.Types.ObjectId;
  claimantEmail: string;
  claimantName: string;
  claimantRollNumber?: string;
  challengeAnswer: string;
  proofType?: string;
  hardwareSerialSubmitted?: string;
  proofDocumentUrl?: string;
  physicalUnlockConfirmed?: boolean;
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
    proofType: {
      type: String,
      enum: [
        "INSTITUTIONAL_ROLL_MATCH",
        "HARDWARE_SERIAL_HASH",
        "PRE_LOSS_INVOICE_PROOF",
        "PHYSICAL_DEVICE_UNLOCK",
        "DOUBLE_BLIND_CHALLENGE",
      ],
      default: "DOUBLE_BLIND_CHALLENGE",
    },
    hardwareSerialSubmitted: { type: String },
    proofDocumentUrl: { type: String },
    physicalUnlockConfirmed: { type: Boolean, default: false },
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
