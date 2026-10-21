export type ItemType = "LOST" | "FOUND";

export type ItemStatus =
  | "ACTIVE"
  | "CLAIM_PENDING"
  | "CLAIM_APPROVED"
  | "RETURNED"
  | "ARCHIVED";

export type ItemCategory =
  | "KIIT_ID_CARD"
  | "HOSTEL_KEYS"
  | "ELECTRONICS"
  | "LAB_COAT_RECORD"
  | "CYCLE_ACCESSORY"
  | "WALLET_DOCS"
  | "BAGS_BOOKS"
  | "OTHER";

export type VerificationProofType =
  | "INSTITUTIONAL_ROLL_MATCH" // Auto-enforced for KIIT ID Cards
  | "HARDWARE_SERIAL_HASH"     // Deterministic zero-knowledge matching for Electronics
  | "PRE_LOSS_INVOICE_PROOF"   // Original purchase receipt / box photo
  | "PHYSICAL_DEVICE_UNLOCK"   // Biometric / PIN unlock in front of Security Guard
  | "DOUBLE_BLIND_CHALLENGE";  // Asymmetric hidden detail challenge

export interface Item {
  _id: string;
  title: string;
  description: string;
  itemType: ItemType;
  category: ItemCategory;
  campusId: string;
  campusName: string;
  specificLocation: string; // e.g., "Campus 15, 3rd Floor Lab 302"
  imageUrls: string[];
  status: ItemStatus;
  secretChallengeQuestion?: string; // Double-blind question
  secretAnswerHash?: string;
  verificationProofType?: VerificationProofType;
  targetRollNumber?: string; // If ID Card: only this roll number can claim
  hardwareIdentifierHash?: string; // SHA-256 hash of serial number / IMEI
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
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  _id: string;
  itemId: string;
  claimantEmail: string;
  claimantName: string;
  claimantRollNumber?: string;
  challengeAnswer: string;
  proofType?: VerificationProofType;
  hardwareSerialSubmitted?: string;
  proofDocumentUrl?: string; // Invoice / original photo URL from Cloudinary
  physicalUnlockConfirmed?: boolean;
  proofDescription?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  qrToken?: string;
  createdAt: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  category: "ACADEMIC" | "HOSTEL" | "SPORTS" | "COMMON";
  landmark: string;
  description: string;
}

export interface UserProfile {
  email: string;
  name: string;
  image?: string;
  rollNumber?: string;
  hostel?: string;
  role: "STUDENT" | "SECURITY" | "ADMIN";
  karmaPoints: number;
}
