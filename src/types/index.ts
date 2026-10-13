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
