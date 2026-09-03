import multer from "multer";

// Keep files in RAM buffer (no local disk storage)
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB Maximum File Size
  },
  fileFilter: (_req, file, cb) => {

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Unsupported file type. Only JPEG, PNG, WEBP, GIF, and PDF allowed.",
        ),
      );
    }
  },
});

// import crypto from "node:crypto";
// import fs from "node:fs";
// import path from "node:path";
// import multer from "multer";

// export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
// const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// // Ensure upload directory exists
// fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// export const imageUpload = multer({
//   storage: multer.diskStorage({
//     destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

//     filename: (_req, file, cb) => {
//       cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`);
//     },
//   }),

//   limits: {
//     fileSize: MAX_FILE_SIZE,
//   },

//   fileFilter: (_req, file, cb) => {
//     if (!ALLOWED_TYPES.includes(file.mimetype)) {
//       return cb(new Error("Only JPEG, PNG, WEBP images and PDF documents are allowed"));
//     }

//     cb(null, true);
//   },
// });
