"use client";

import { useEffect, useRef, useState } from "react";
import { FileImage, UploadCloud, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage } from "@/utils/file-upload";

interface SingleImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  error?: string;
}

export function BlogImageUploader({
  value,
  onChange,
  label = "Featured Image",
  error,
}: SingleImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  const [filename, setFilename] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // ============================================================
  // EDIT FIX #1
  // ============================================================
  // `value` can arrive/change AFTER this component has mounted.
  //
  // This happens on your edit page because:
  //
  // 1. Component renders.
  // 2. Blog API request is still loading.
  // 3. `featuredImage` is initially empty.
  // 4. Blog data arrives.
  // 5. React Hook Form updates `value`.
  //
  // useState() does NOT re-run when `value` changes, so we
  // synchronize the local preview whenever the form value changes.
  //
  useEffect(() => {
    // Don't overwrite the local blob preview while a new image
    // is currently being uploaded.
    if (isUploading) return;

    setPreviewUrl(value || null);

    // Existing image from the database is already uploaded.
    // It does NOT need upload progress.
    //
    // We use 100 here so the existing image can use the same
    // "uploaded image" rendering state.
    setProgress(value ? 100 : 0);

    // Clear the filename because this is an existing server image,
    // not a newly selected local file.
    setFilename(null);
  }, [value, isUploading]);

  async function handleFile(file: File) {
    // Local preview while upload is happening.
    const localPreview = URL.createObjectURL(file);

    setPreviewUrl(localPreview);
    setFilename(file.name);
    setProgress(0);
    setIsUploading(true);

    try {
      //  Pass "blogs" folder target
      const uploadedUrl = await uploadImage(
        file,
        "blogs",
        (currentProgress) => {
          setProgress(currentProgress);
        },
      );

      // Store the uploaded URL in React Hook Form.
      onChange(uploadedUrl);

      // Replace blob preview with the real uploaded URL.
      setPreviewUrl(uploadedUrl);

      setProgress(100);

      // The local blob URL is no longer needed.
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error("Image upload failed:", error);

      URL.revokeObjectURL(localPreview);

      // Restore the previous form value.
      setPreviewUrl(value || null);
      setFilename(null);
      setProgress(value ? 100 : 0);

      onChange(value || "");
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    handleFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (isUploading) return;

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    handleFile(file);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleRemove(event: React.MouseEvent) {
    event.stopPropagation();

    // Revoke blob URL if we're removing a newly selected image.
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setFilename(null);
    setProgress(0);

    // Clear the React Hook Form value.
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="bg-card border border-border p-5 rounded-md space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          if (!isUploading) {
            inputRef.current?.click();
          }
        }}
        className="relative aspect-video w-full cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {/* =====================================================
              EDIT FIX #2
              
              BEFORE:
              
              previewUrl && progress === 100
              
              This caused existing database images to disappear
              because they don't have an upload progress state.

              NOW:
              
              previewUrl
              
              If we have an image URL, display it.
              
              `isUploading` controls the upload state separately.
              ===================================================== */}
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full overflow-hidden rounded-md border border-border group"
            >
              <img
                src={previewUrl}
                alt="Featured image preview"
                className="h-full w-full object-cover"
              />

              {/* Upload overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-xs font-semibold">
                    Uploading {progress}%
                  </div>
                </div>
              )}

              {/* Remove button */}
              {!isUploading && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 bg-destructive text-white rounded-full hover:scale-105 transition-transform"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Remove Image
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{
                borderColor: "var(--primary)",
              }}
              className="w-full h-full border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center text-center bg-background/20"
            >
              <div className="p-3 bg-muted rounded-full text-muted-foreground mb-3">
                <UploadCloud className="h-5 w-5" />
              </div>

              <p className="text-xs font-bold text-foreground">
                Upload Featured Image
              </p>

              <p className="text-[10px] text-muted-foreground mt-1">
                PNG, JPG or WebP
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload progress */}
      {filename && isUploading && (
        <div className="p-3 bg-background border border-border rounded-md">
          <div className="flex items-center gap-3">
            <FileImage className="h-4 w-4 text-primary shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-mono font-bold truncate">
                  {filename}
                </p>

                <span className="text-xs font-mono font-bold text-primary">
                  {progress}%
                </span>
              </div>

              <div className="w-full bg-input h-1 rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    width: `${progress}%`,
                  }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
