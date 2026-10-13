import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || "kiit_default_hmac_secret_key_2026";

export interface QrPayload {
  itemId: string;
  claimantEmail: string;
  claimantName: string;
  claimId: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Generates an HMAC-SHA256 signed QR token payload
 */
export function generateSignedQrToken(
  itemId: string,
  claimantEmail: string,
  claimantName: string,
  claimId: string,
  validityMinutes: number = 1440 // 24 hours
): { token: string; payload: QrPayload } {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + validityMinutes * 60 * 1000;

  const payload: QrPayload = {
    itemId,
    claimantEmail,
    claimantName,
    claimId,
    issuedAt,
    expiresAt,
  };

  const payloadString = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payloadString)
    .digest("hex");

  // Format: Base64(payloadString).signature
  const encodedPayload = Buffer.from(payloadString).toString("base64url");
  const token = `KIIT-HANDOVER.${encodedPayload}.${signature}`;

  return { token, payload };
}

/**
 * Validates the signed QR token, checks expiration and tamper protection
 */
export function verifyQrToken(token: string): {
  valid: boolean;
  reason?: string;
  payload?: QrPayload;
} {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3 || parts[0] !== "KIIT-HANDOVER") {
      return { valid: false, reason: "Invalid QR code format. Not a KIIT Handover token." };
    }

    const encodedPayload = parts[1];
    const signature = parts[2];

    const payloadString = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const expectedSignature = crypto
      .createHmac("sha256", SECRET)
      .update(payloadString)
      .digest("hex");

    if (signature !== expectedSignature) {
      return { valid: false, reason: "Cryptographic signature mismatch! QR code may be tampered." };
    }

    const payload: QrPayload = JSON.parse(payloadString);

    if (Date.now() > payload.expiresAt) {
      return { valid: false, reason: "This verification QR code has expired. Please request a new one." };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, reason: "Corrupted QR code payload." };
  }
}
