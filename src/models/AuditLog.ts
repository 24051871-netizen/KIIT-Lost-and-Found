import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLogDocument extends Document {
  itemId: mongoose.Types.ObjectId;
  action:
    | "REPORTED"
    | "CLAIM_SUBMITTED"
    | "CLAIM_APPROVED"
    | "QR_HANDOVER_VERIFIED"
    | "DISPUTED"
    | "FLAGGED_SPAM"
    | "ITEM_QUARANTINED"
    | "QUOTA_EXCEEDED_BLOCKED";
  performedByEmail: string;
  performedByName: string;
  notes?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true, index: true },
    action: {
      type: String,
      enum: [
        "REPORTED",
        "CLAIM_SUBMITTED",
        "CLAIM_APPROVED",
        "QR_HANDOVER_VERIFIED",
        "DISPUTED",
        "FLAGGED_SPAM",
        "ITEM_QUARANTINED",
        "QUOTA_EXCEEDED_BLOCKED",
      ],
      required: true,
    },
    performedByEmail: { type: String, required: true },
    performedByName: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const AuditLog: Model<IAuditLogDocument> =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>("AuditLog", AuditLogSchema);

export default AuditLog;
