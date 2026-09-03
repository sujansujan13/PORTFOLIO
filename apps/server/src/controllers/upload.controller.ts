import type { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/cloudinary";

export async function uploadController(req: Request, res: Response) {
  try {
    const file = req.file || (req as any).files?.image?.[0];

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file attached" });
    }

    const isPdf = file.mimetype === "application/pdf";
    const type = (req.query.type as string) || (req.body?.type as string);

    // Route dynamically to Cloudinary 4 folders
    let folder = isPdf ? "portfolio/documents" : "portfolio/uploads";
    if (type === "avatars") folder = "portfolio/avatars";
    else if (type === "projects") folder = "portfolio/projects";
    else if (type === "blogs") folder = "portfolio/blogs";
    else if (type === "documents") folder = "portfolio/documents";

    const resourceType = isPdf ? "raw" : "image";

    const uploadResult = await uploadToCloudinary(
      file.buffer,
      folder,
      resourceType,
    );

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully to Cloudinary CDN",
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        bytes: uploadResult.bytes,
      },
    });
  } catch (error: any) {
    console.error("Upload Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred during upload",
    });
  }
}
