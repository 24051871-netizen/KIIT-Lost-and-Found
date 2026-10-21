import { Item, Claim } from "@/types";

// Seed data reflecting authentic daily student occurrences across KIIT
let mockItems: Item[] = [
  {
    _id: "kiit-item-1",
    title: "KIIT Smart ID Card (Roll: 2205128)",
    description: "Found blue lanyard with KIIT Smart Card near the entrance stairs of Campus 15 Auditorium.",
    itemType: "FOUND",
    category: "KIIT_ID_CARD",
    campusId: "campus-15",
    campusName: "Campus 15 (School of Computer Engineering)",
    specificLocation: "Ground Floor Auditorium entrance steps",
    imageUrls: [
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
    ],
    status: "ACTIVE",
    secretChallengeQuestion: "What is the student's branch and father's initial on the card reverse?",
    secretAnswerHash: "cse",
    contactEmail: "2105999@kiit.ac.in",
    contactName: "Aman Sharma",
    reporterRollNumber: "2105999",
    reporterHostel: "KP-7",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    _id: "kiit-item-2",
    title: "Casio fx-991CW Scientific Calculator",
    description: "Left behind on bench 4 in Digital Electronics Lab (3rd floor) during afternoon practicals.",
    itemType: "LOST",
    category: "ELECTRONICS",
    campusId: "campus-3",
    campusName: "Campus 3 (School of Civil & Mechanical)",
    specificLocation: "3rd Floor Lab 312, Bench 4",
    imageUrls: [
      "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
    ],
    status: "ACTIVE",
    secretChallengeQuestion: "What sticker is attached to the sliding back cover?",
    secretAnswerHash: "batman",
    contactEmail: "2205432@kiit.ac.in",
    contactName: "Sneha Roy",
    reporterRollNumber: "2205432",
    reporterHostel: "QC-4",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    _id: "kiit-item-3",
    title: "Hostel Room Key with Marvel Keychain",
    description: "Found single brass Godrej key with a Captain America shield keychain dropped near Kathajodi Food Court.",
    itemType: "FOUND",
    category: "HOSTEL_KEYS",
    campusId: "food-court-chintan",
    campusName: "Food Court (Chintan / Kathajodi / KP Street)",
    specificLocation: "Near Kathajodi juice counter table",
    imageUrls: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    ],
    status: "ACTIVE",
    secretChallengeQuestion: "What number is punched onto the key head?",
    secretAnswerHash: "402",
    contactEmail: "2305881@kiit.ac.in",
    contactName: "Rohan Verma",
    reporterRollNumber: "2305881",
    reporterHostel: "KP-6",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: "kiit-item-4",
    title: "Black Dell 65W Type-C Laptop Charger",
    description: "Lost during evening study session at Central Library, 2nd floor reading hall.",
    itemType: "LOST",
    category: "ELECTRONICS",
    campusId: "campus-6",
    campusName: "Campus 6 (Central Library & Convention Centre)",
    specificLocation: "2nd Floor Silent Reading Section, Table 12",
    imageUrls: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    ],
    status: "CLAIM_APPROVED",
    secretChallengeQuestion: "What color electrical tape is wrapped around the cord tip?",
    secretAnswerHash: "red",
    contactEmail: "2005112@kiit.ac.in",
    contactName: "Priyanjali Das",
    reporterRollNumber: "2005112",
    reporterHostel: "QC-8",
    claimedBy: {
      email: "2205999@kiit.ac.in",
      name: "Debashish Mohanty",
      rollNumber: "2205999",
      claimedAt: new Date().toISOString(),
    },
    qrTokenHash: "DEMO_QR_TOKEN_CAMPUS6_CHARGER",
    qrExpiresAt: new Date(Date.now() + 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "kiit-item-5",
    title: "Hercules Roadeo Bicycle (Matte Black)",
    description: "Locked at Campus 15 cycle stand opposite to KP-7 gate. Cycle lock was mysteriously removed.",
    itemType: "LOST",
    category: "CYCLE_ACCESSORY",
    campusId: "campus-15",
    campusName: "Campus 15 (School of Computer Engineering)",
    specificLocation: "Main Cycle Parking Shed behind Cafeteria",
    imageUrls: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    ],
    status: "ACTIVE",
    secretChallengeQuestion: "What brand is the water bottle holder attached to the frame?",
    secretAnswerHash: "btwin",
    contactEmail: "2305101@kiit.ac.in",
    contactName: "Aniket Ghosh",
    reporterRollNumber: "2305101",
    reporterHostel: "KP-14",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    _id: "kiit-item-6",
    title: "White Chemistry Lab Coat (Embroidery on pocket)",
    description: "Found in Chemistry Lab, Campus 3. Clean condition with name tag inside collar.",
    itemType: "FOUND",
    category: "LAB_COAT_RECORD",
    campusId: "campus-3",
    campusName: "Campus 3 (School of Civil & Mechanical)",
    specificLocation: "Ground Floor Chemistry Lab Rack 2",
    imageUrls: [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
    ],
    status: "RETURNED",
    contactEmail: "2105342@kiit.ac.in",
    contactName: "Tanya Sen",
    reporterRollNumber: "2105342",
    reporterHostel: "QC-2",
    claimedBy: {
      email: "2305012@kiit.ac.in",
      name: "Rishi Kant",
      rollNumber: "2305012",
      claimedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

let mockClaims: Claim[] = [
  {
    _id: "claim-101",
    itemId: "kiit-item-4",
    claimantEmail: "2205999@kiit.ac.in",
    claimantName: "Debashish Mohanty",
    claimantRollNumber: "2205999",
    challengeAnswer: "Red electrical tape",
    proofDescription: "I have the Dell invoice on my email and left it during Friday late study.",
    status: "APPROVED",
    qrToken: "DEMO_QR_TOKEN_CAMPUS6_CHARGER",
    createdAt: new Date().toISOString(),
  }
];

export const mockStore = {
  getItems: (filters?: {
    search?: string;
    campusId?: string;
    category?: string;
    itemType?: string;
    status?: string;
  }) => {
    let result = [...mockItems];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.specificLocation.toLowerCase().includes(q)
      );
    }

    if (filters?.campusId && filters.campusId !== "ALL") {
      result = result.filter((item) => item.campusId === filters.campusId);
    }

    if (filters?.category && filters.category !== "ALL") {
      result = result.filter((item) => item.category === filters.category);
    }

    if (filters?.itemType && filters.itemType !== "ALL") {
      result = result.filter((item) => item.itemType === filters.itemType);
    }

    if (filters?.status && filters.status !== "ALL") {
      result = result.filter((item) => item.status === filters.status);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getItemById: (id: string) => {
    return mockItems.find((item) => item._id === id);
  },

  getActiveCountByEmail: (email: string) => {
    return mockItems.filter(
      (item) => item.contactEmail.toLowerCase() === email.toLowerCase() && item.status === "ACTIVE"
    ).length;
  },

  hasRecentDuplicate: (email: string, title: string) => {
    const normalized = title.trim().toLowerCase();
    return mockItems.some(
      (item) =>
        item.contactEmail.toLowerCase() === email.toLowerCase() &&
        item.title.trim().toLowerCase() === normalized &&
        item.status === "ACTIVE"
    );
  },

  getLastListingTime: (email: string) => {
    const userItems = mockItems.filter(
      (item) => item.contactEmail.toLowerCase() === email.toLowerCase()
    );
    if (userItems.length === 0) return null;
    return Math.max(...userItems.map((i) => new Date(i.createdAt).getTime()));
  },

  flagItem: (id: string, reason: string) => {
    const item = mockItems.find((i) => i._id === id);
    if (!item) return { success: false, flagCount: 0, isQuarantined: false };
    item.flagCount = (item.flagCount || 0) + 1;
    const isQuarantined = item.flagCount >= 3;
    if (isQuarantined) {
      item.status = "ARCHIVED";
    }
    return { success: true, flagCount: item.flagCount, isQuarantined };
  },

  addItem: (itemData: Omit<Item, "_id" | "createdAt" | "updatedAt" | "status">) => {
    const newItem: Item = {
      ...itemData,
      _id: "kiit-item-" + (mockItems.length + 1) + "-" + Date.now().toString(36),
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockItems.unshift(newItem);
    return newItem;
  },

  updateItemStatus: (id: string, status: Item["status"], extra?: Partial<Item>) => {
    const index = mockItems.findIndex((i) => i._id === id);
    if (index !== -1) {
      mockItems[index] = {
        ...mockItems[index],
        status,
        ...extra,
        updatedAt: new Date().toISOString(),
      };
      return mockItems[index];
    }
    return null;
  },

  addClaim: (claim: Omit<Claim, "_id" | "status" | "createdAt">) => {
    const newClaim: Claim = {
      ...claim,
      _id: "claim-" + Date.now().toString(36),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    mockClaims.unshift(newClaim);
    return newClaim;
  },

  getClaimsByItem: (itemId: string) => {
    return mockClaims.filter((c) => c.itemId === itemId);
  },

  getClaimById: (claimId: string) => {
    return mockClaims.find((c) => c._id === claimId);
  },

  updateClaim: (claimId: string, status: Claim["status"], qrToken?: string) => {
    const claim = mockClaims.find((c) => c._id === claimId);
    if (claim) {
      claim.status = status;
      if (qrToken) claim.qrToken = qrToken;
      return claim;
    }
    return null;
  },

  getStats: () => {
    const total = mockItems.length;
    const lost = mockItems.filter((i) => i.itemType === "LOST").length;
    const found = mockItems.filter((i) => i.itemType === "FOUND").length;
    const returned = mockItems.filter((i) => i.status === "RETURNED").length;
    const active = mockItems.filter((i) => i.status === "ACTIVE").length;
    const idCardsRecovered = mockItems.filter(
      (i) => i.category === "KIIT_ID_CARD" && i.status === "RETURNED"
    ).length;

    return {
      total,
      lost,
      found,
      returned,
      active,
      idCardsRecovered,
      recoveryRate: total > 0 ? Math.round((returned / total) * 100) : 0,
    };
  },
};
