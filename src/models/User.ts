import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  name: string;
  image?: string;
  rollNumber?: string;
  hostel?: string;
  role: "STUDENT" | "SECURITY" | "ADMIN";
  karmaPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    image: { type: String },
    rollNumber: { type: String, index: true },
    hostel: { type: String },
    role: { type: String, enum: ["STUDENT", "SECURITY", "ADMIN"], default: "STUDENT" },
    karmaPoints: { type: Number, default: 10 },
  },
  { timestamps: true }
);

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
