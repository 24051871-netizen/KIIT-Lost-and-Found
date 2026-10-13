import { NextRequest, NextResponse } from "next/server";
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: "No image payload provided" }, { status: 400 });
    }

    const secureUrl = await uploadImage(imageBase64, "kiit-lost-found");

    return NextResponse.json({
      success: true,
      imageUrl: secureUrl,
      provider: isCloudinaryConfigured() ? "Cloudinary CDN" : "Local Data Storage",
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
