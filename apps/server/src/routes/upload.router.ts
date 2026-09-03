import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { uploadController } from "../controllers/upload.controller";

const router = Router();

// Handles POST /api/uploads and POST /api/uploads/image
router.post(["/image", "/"], uploadMiddleware.single("file"), uploadController);

export { router as uploadRouter };
