import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Ensure upload directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

    filename: (_req, file, cb) => {
      cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`);
    },
  }),

  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
    }

    cb(null, true);
  },
});
