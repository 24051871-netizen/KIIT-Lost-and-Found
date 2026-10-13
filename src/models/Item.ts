import mongoose, { Schema, Document, Model } from "mongoose";
import { ItemType, ItemStatus, ItemCategory } from "@/types";

export interface IItemDocument extends Document {
  title: string;
  description: string;
  itemType: ItemType;
  category: ItemCategory;
  campusId: string;
  campusName: string;
  specificLocation: string;
  imageUrls: string[];
  status: ItemStatus;
  secretChallengeQuestion?: string;
  secretAnswerHash?: string;
  contactEmail: string;
  contactName: string;
  reporterRollNumber?: string;
  reporterHostel?: string;
  claimedBy?: {
    email: string;
    name: string;
    rollNumber?: string;
    claimedAt: string;
  };
  qrTokenHash?: string;
  qrExpiresAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItemDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    itemType: { type: String, enum: ["LOST", "FOUND"], required: true, index: true },
    category: {
      type: String,
      enum: [
        "KIIT_ID_CARD",
        "HOSTEL_KEYS",
        "ELECTRONICS",
        "LAB_COAT_RECORD",
        "CYCLE_ACCESSORY",
        "WALLET_DOCS",
        "BAGS_BOOKS",
        "OTHER",
      ],
      required: true,
      index: true,
    },
    campusId: { type: String, required: true, index: true },
    campusName: { type: String, required: true },
    specificLocation: { type: String, required: true },
    imageUrls: [{ type: String }],
    status: {
      type: String,
      enum: ["ACTIVE", "CLAIM_PENDING", "CLAIM_APPROVED", "RETURNED", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },
    secretChallengeQuestion: { type: String },
    secretAnswerHash: { type: String },
    contactEmail: { type: String, required: true, index: true },
    contactName: { type: String, required: true },
    reporterRollNumber: { type: String },
    reporterHostel: { type: String },
    claimedBy: {
      email: { type: String },
      name: { type: String },
      rollNumber: { type: String },
      claimedAt: { type: String },
    },
    qrTokenHash: { type: String },
    qrExpiresAt: { type: String },
  },
  { timestamps: true }
);

// Compound index for fast filter queries
ItemSchema.index({ campusId: 1, itemType: 1, status: 1 });
ItemSchema.index({ title: "text", description: "text", specificLocation: "text" });

const Item: Model<IItemDocument> =
  mongoose.models.Item || mongoose.model<IItemDocument>("Item", ItemSchema);

export default Item;
