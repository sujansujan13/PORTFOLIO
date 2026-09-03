import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
}

/**
 * Uploads a file buffer directly to Cloudinary CDN
 * @param fileBuffer Buffer from multer memory storage
 * @param folder Target folder inside Cloudinary Media Library
 * @param resourceType "image" for images, "raw" for PDFs/Documents, "auto" for auto-detect
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = "portfolio/uploads",
  resourceType: "image" | "raw" | "auto" = "auto",
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // Auto-format images to WebP/AVIF and auto-compress quality
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete an asset from Cloudinary when deleted from your database
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" = "image",
) {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
