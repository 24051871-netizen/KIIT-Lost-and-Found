import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(cloudName && apiKey && apiSecret);
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Uploads a base64 image or remote URL to Cloudinary, or falls back to local data URL
 */
export async function uploadImage(fileData: string, folder: string = "kiit-lost-found"): Promise<string> {
  if (!isCloudinaryConfigured()) {
    // If Cloudinary credentials are not yet configured, return the data URI or fallback placeholder
    if (fileData.startsWith("data:image/")) {
      return fileData;
    }
    return "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80";
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: folder,
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed, falling back to local data:", error);
    return fileData;
  }
}
