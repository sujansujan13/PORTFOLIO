import express from "express";
import * as uploadController from "../controllers/upload.controller";
import { imageUpload } from "@/middlewares/upload.middleware";

const router = express.Router();

router.post(
  "/image",
  // <input type="file" name="image" />
  imageUpload.single("image"),
  uploadController.uploadImageController,
);

export { router as uploadRouter };
