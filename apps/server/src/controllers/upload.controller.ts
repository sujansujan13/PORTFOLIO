import type { Request, Response } from "express";

import { buildUploadedImageUrl } from "../service/upload.service";

export function uploadImageController(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      message: "No image uploaded",
    });
  }

  const url = buildUploadedImageUrl(req, req.file.filename);

  return res.status(201).json({
    url,
  });
}
