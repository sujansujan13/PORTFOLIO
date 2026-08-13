"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileImage, X, Eye } from "lucide-react";
import { uploadImage } from "@/utils/image-upload";

interface AssetState {
  filename: string | null;
  progress: number;
  previewUrl: string | null; // 1. Added field to store the local image preview URL
}
interface FileUploaderProps {
  onHeroChange: (url: string) => void;
  onThumbnailChange: (url: string) => void;
  heroUrl?: string; // Optional prop to set the initial hero image URL
  thumbnailUrl?: string; // Optional prop to set the initial thumbnail image URL
}

export function FileUploader({
  onHeroChange,
  onThumbnailChange,
  heroUrl,
  thumbnailUrl,
}: FileUploaderProps) {
  const [hero, setHero] = useState<AssetState>({
    filename: null,
    progress: 0,
    previewUrl: null,
  });
  const [thumbnail, setThumbnail] = useState<AssetState>({
    filename: null,
    progress: 0,
    previewUrl: null,
  });

  const [activeDrag, setActiveDrag] = useState<"hero" | "thumbnail" | null>(
    null,
  );

  const heroInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File, type: "hero" | "thumbnail") => {
    const updater = type === "hero" ? setHero : setThumbnail;

    // Remove previous preview URL to avoid memory leaks
    if (type === "hero" && hero.previewUrl) {
      URL.revokeObjectURL(hero.previewUrl);
    }

    if (type === "thumbnail" && thumbnail.previewUrl) {
      URL.revokeObjectURL(thumbnail.previewUrl);
    }

    // 2. Generate a local browser URL for the image preview
    const previewUrl = URL.createObjectURL(file);

    updater({ filename: file.name, progress: 0, previewUrl: previewUrl });

    try {
      const uploadedUrl = await uploadImage(file, (progress) => {
        updater({
          filename: file.name,
          progress,
          previewUrl,
        });
      });

      if (type === "hero") {
        onHeroChange(uploadedUrl);
      } else {
        onThumbnailChange(uploadedUrl);
      }

      updater({
        filename: file.name,
        progress: 100,
        previewUrl,
      });
    } catch (error) {
      URL.revokeObjectURL(previewUrl);

      updater({
        filename: null,
        progress: 0,
        previewUrl: null,
      });

      console.error(error);
    }

    // let currentProgress = 0;
    // const interval = setInterval(() => {
    //   currentProgress += 20; // Accelerated for snappy testing
    //   updater({
    //     filename: file.name,
    //     progress: currentProgress,
    //     previewUrl: previewUrl,
    //   });

    //   if (currentProgress === 100) {
    //     clearInterval(interval);
    //   }
    // }, 60);
  };

  const onDragOverZone = (e: React.DragEvent, type: "hero" | "thumbnail") => {
    e.preventDefault();
    setActiveDrag(type);
  };

  const onDropZone = (e: React.DragEvent, type: "hero" | "thumbnail") => {
    e.preventDefault();
    setActiveDrag(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0], type);
    }
  };

  const clearAsset = (e: React.MouseEvent, type: "hero" | "thumbnail") => {
    e.stopPropagation(); // Stop click from reopening the selector box
    if (type === "hero") {
      if (hero.previewUrl) URL.revokeObjectURL(hero.previewUrl); // Free up browser memory
      setHero({ filename: null, progress: 0, previewUrl: null });
      onHeroChange("");
      if (heroInputRef.current) heroInputRef.current.value = "";
    } else {
      if (thumbnail.previewUrl) URL.revokeObjectURL(thumbnail.previewUrl);
      setThumbnail({ filename: null, progress: 0, previewUrl: null });
      onThumbnailChange("");
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (heroUrl) {
      setHero({
        filename: null,
        progress: 100,
        previewUrl: heroUrl,
      });
    }
  }, [heroUrl]);

  useEffect(() => {
    if (thumbnailUrl) {
      setThumbnail({
        filename: null,
        progress: 100,
        previewUrl: thumbnailUrl,
      });
    }
  }, [heroUrl]);

  return (
    <div className="w-full bg-card border border-border p-5 rounded-md space-y-6 text-left">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Project Assets
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= HERO IMAGE ZONE ================= */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-foreground">
            Hero Image
          </label>
          <input
            type="file"
            ref={heroInputRef}
            onChange={(e) =>
              e.target.files?.[0] &&
              handleImageUpload(e.target.files[0], "hero")
            }
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          {/* Box Container */}
          <div className="relative aspect-video w-full">
            <AnimatePresence mode="wait">
              {hero.previewUrl && hero.progress === 100 ? (
                // 3. Render Image Preview if complete
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full rounded-md border border-border overflow-hidden group"
                >
                  <img
                    src={hero.previewUrl}
                    alt="Hero Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  {/* Hover Delete Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={(e) => clearAsset(e, "hero")}
                      className="p-2 bg-destructive text-destructive-foreground rounded-full hover:scale-105 transition-transform cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Remove Image
                    </span>
                  </div>
                </motion.div>
              ) : (
                // Default Upload Dropzone Box
                <motion.div
                  whileHover={{ borderColor: "var(--primary)" }}
                  onDragOver={(e) => onDragOverZone(e, "hero")}
                  onDragLeave={() => setActiveDrag(null)}
                  onDrop={(e) => onDropZone(e, "hero")}
                  onClick={() => heroInputRef.current?.click()}
                  style={{
                    borderColor: activeDrag === "hero" ? "var(--primary)" : "",
                  }}
                  className="w-full h-full border-2 border-dashed border-border flex flex-col items-center justify-center text-center bg-background/20 cursor-pointer group rounded-md transition-colors duration-200"
                >
                  <div className="p-2.5 bg-muted rounded-full text-muted-foreground group-hover:text-primary transition-colors duration-200 mb-2">
                    <UploadCloud className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Upload Hero Image
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Indicator Block */}
          {hero.filename && hero.progress < 100 && (
            <div className="p-3 bg-background border border-border rounded-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileImage className="h-4 w-4 text-primary shrink-0" />
                <div className="w-full min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-mono font-bold text-foreground truncate max-w-[70%]">
                      {hero.filename}
                    </p>
                    <span className="text-xs font-mono font-bold text-primary">
                      {hero.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-input h-1 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${hero.progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= THUMBNAIL IMAGE ZONE ================= */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-foreground">
            Thumbnail Image
          </label>
          <input
            type="file"
            ref={thumbnailInputRef}
            onChange={(e) =>
              e.target.files?.[0] &&
              handleImageUpload(e.target.files[0], "thumbnail")
            }
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />

          {/* Box Container */}
          <div className="relative aspect-video w-full">
            <AnimatePresence mode="wait">
              {thumbnail.previewUrl && thumbnail.progress === 100 ? (
                // Render Thumbnail Image Preview if complete
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full rounded-md border border-border overflow-hidden group "
                >
                  <img
                    src={thumbnail.previewUrl}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Hover Delete Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={(e) => clearAsset(e, "thumbnail")}
                      className="p-2 bg-destructive text-destructive-foreground rounded-full hover:scale-105 transition-transform cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Remove Image
                    </span>
                  </div>
                </motion.div>
              ) : (
                // Default Upload Dropzone Box
                <motion.div
                  whileHover={{ borderColor: "var(--primary)" }}
                  onDragOver={(e) => onDragOverZone(e, "thumbnail")}
                  onDragLeave={() => setActiveDrag(null)}
                  onDrop={(e) => onDropZone(e, "thumbnail")}
                  onClick={() => thumbnailInputRef.current?.click()}
                  style={{
                    borderColor:
                      activeDrag === "thumbnail" ? "var(--primary)" : "",
                  }}
                  className="w-full h-full border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center text-center bg-background/20 cursor-pointer group transition-colors duration-200"
                >
                  <div className="p-2.5 bg-muted rounded-full text-muted-foreground group-hover:text-primary transition-colors duration-200 mb-2">
                    <UploadCloud className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Upload Thumbnail
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Indicator Block */}
          {thumbnail.filename && thumbnail.progress < 100 && (
            <div className="p-3 bg-background border border-border rounded-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileImage className="h-4 w-4 text-primary shrink-0" />
                <div className="w-full min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-mono font-bold text-foreground truncate max-w-[70%]">
                      {thumbnail.filename}
                    </p>
                    <span className="text-xs font-mono font-bold text-primary">
                      {thumbnail.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-input h-1 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${thumbnail.progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
