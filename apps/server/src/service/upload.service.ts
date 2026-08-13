import type { Request } from "express";
export function buildUploadedImageUrl(req: Request, filename: string) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return `${baseUrl}/uploads/${filename}`;
}
