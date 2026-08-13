"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { uploadImage } from "@/utils/image-upload";

interface BlogAuthorAvatarProps {
  value?: string;
  onChange: (url: string) => void;
  error?: string;
}

export default function BlogAuthorAvatar({
  value,
  onChange,
  error,
}: BlogAuthorAvatarProps) {
  /*
   * Properly type the file input ref.
   */
  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * preview = image currently displayed in the UI.
   *
   * It can be:
   * 1. An existing server URL when editing
   * 2. A temporary blob URL while uploading
   * 3. The newly uploaded server URL
   */
  const [preview, setPreview] = useState<string | null>(value || null);

  /*
   * Keep track of the avatar that existed BEFORE
   * the current upload started.
   *
   * This is what we restore when the user cancels
   * or an upload fails.
   */
  const [previousValue, setPreviousValue] = useState<string | null>(
    value || null,
  );

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  /*
   * -------------------------------------------------------
   * SYNC VALUE FROM REACT HOOK FORM
   * -------------------------------------------------------
   *
   * This is the important part for EDIT mode.
   *
   * When the component first renders, the blog may not
   * have loaded yet:
   *
   *     value = ""
   *
   * Later, React Hook Form receives:
   *
   *     value = "https://.../avatar.jpg"
   *
   * useState() does NOT automatically update when props
   * change, so we synchronize it here.
   */
  useEffect(() => {
    /*
     * Don't overwrite the temporary local preview while
     * the user is currently uploading a new image.
     */
    if (isUploading) {
      return;
    }

    /*
     * Display the existing avatar from the database.
     */
    setPreview(value || null);

    /*
     * An existing server image is already uploaded,
     * therefore treat it as 100% complete.
     */
    setProgress(value ? 100 : 0);

    /*
     * Keep previousValue synchronized with the form value
     * when the value changes externally, such as when the
     * edit page loads.
     */
    setPreviousValue(value || null);
  }, [value, isUploading]);

  /*
   * -------------------------------------------------------
   * FILE SELECTION / UPLOAD
   * -------------------------------------------------------
   */
  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Remember the currently displayed avatar.
     *
     * Example:
     *
     * Existing avatar:
     *     https://site.com/old-avatar.jpg
     *
     * User selects:
     *     new-avatar.png
     *
     * If the upload is cancelled/fails, we restore
     * old-avatar.jpg.
     */
    setPreviousValue(value || null);

    /*
     * Create a temporary browser URL.
     *
     * This allows the user to see the image immediately
     * without waiting for the server upload.
     */
    const localPreview = URL.createObjectURL(file);

    setPreview(localPreview);
    setProgress(0);
    setIsUploading(true);

    try {
      /*
       * Upload the image to your server/storage.
       */
      const uploadedUrl = await uploadImage(file, (currentProgress) => {
        setProgress(currentProgress);
      });

      /*
       * Save the permanent URL into React Hook Form.
       */
      onChange(uploadedUrl);

      /*
       * Replace the temporary blob URL with the
       * permanent server URL.
       */
      setPreview(uploadedUrl);

      /*
       * This is now the avatar we should restore if
       * another upload is cancelled later.
       */
      setPreviousValue(uploadedUrl);

      setProgress(100);

      /*
       * The temporary blob URL is no longer necessary.
       */
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error("Avatar upload failed:", error);

      /*
       * The temporary preview is no longer needed.
       */
      URL.revokeObjectURL(localPreview);

      /*
       * Restore the previous avatar.
       */
      setPreview(previousValue);

      onChange(previousValue || "");

      setProgress(previousValue ? 100 : 0);
    } finally {
      setIsUploading(false);

      /*
       * Reset the file input so the user can select
       * the same file again.
       */
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  /*
   * -------------------------------------------------------
   * REMOVE AVATAR
   * -------------------------------------------------------
   */
  function handleRemoveAvatar() {
    /*
     * If the current preview is a temporary blob URL,
     * release it from browser memory.
     */
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    /*
     * Clear React Hook Form value.
     */
    onChange("");

    /*
     * Clear UI preview.
     */
    setPreview(null);

    /*
     * There is now no previous avatar.
     */
    setPreviousValue(null);

    setProgress(0);
    setIsUploading(false);

    /*
     * Reset file input.
     */
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  /*
   * -------------------------------------------------------
   * CANCEL CURRENT UPLOAD
   * -------------------------------------------------------
   *
   * IMPORTANT:
   *
   * This does not actually abort the network request.
   * It restores the UI/form value while the upload may
   * still technically be running.
   *
   * For a true network cancellation, uploadImage() would
   * need to support AbortController.
   */
  function handleCancelUpload() {
    /*
     * Restore previous avatar.
     */
    setPreview(previousValue);

    /*
     * Restore React Hook Form value.
     */
    onChange(previousValue || "");

    /*
     * Reset progress/UI.
     */
    setProgress(previousValue ? 100 : 0);
    setIsUploading(false);

    /*
     * Reset file input.
     */
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {/* ================================================= */}
      {/* AVATAR + CONTROLS                                */}
      {/* ================================================= */}

      <div className="flex items-center gap-7">
        {/* Avatar */}
        <div className="relative h-20 w-20 shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border bg-muted">
            {preview ? (
              /*
               * Existing avatar AND newly selected avatar
               * are both displayed here.
               */
              <img
                src={preview}
                alt="Author avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              /*
               * No avatar exists.
               */
              <div className="flex h-full w-full items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
            )}

            {/* Uploading overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* REMOVE BUTTON                                     */}
          {/* ================================================= */}

          {preview && !isUploading && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="
                absolute
                -right-1
                -top-1
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                border
                border-border
                bg-background
                text-muted-foreground
                shadow-sm
                transition-colors
                hover:bg-destructive
                hover:text-white
                cursor-pointer
              "
              aria-label="Remove avatar"
              title="Remove avatar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* ================================================= */}
          {/* CANCEL UPLOAD BUTTON                              */}
          {/* ================================================= */}

          {isUploading && (
            <button
              type="button"
              onClick={handleCancelUpload}
              className="
                absolute
                -right-1
                -top-1
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                border
                border-border
                bg-background
                text-muted-foreground
                shadow-sm
                transition-colors
                hover:bg-destructive
                hover:text-white
                cursor-pointer
                z-10
              "
              aria-label="Cancel upload"
              title="Cancel upload"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* ================================================= */}
        {/* CONTROLS                                          */}
        {/* ================================================= */}

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="
              inline-flex
              items-center
              gap-2
              rounded-md
              border
              border-border
              bg-card
              px-3
              py-2
              text-xs
              font-semibold
              hover:bg-muted
              disabled:cursor-not-allowed
              disabled:opacity-50
              mt-4
              cursor-pointer
            "
          >
            <Camera className="h-3.5 w-3.5" />

            {isUploading ? "Uploading..." : "Change Avatar"}
          </button>

          <p className="text-[10px] text-center text-muted-foreground">
            JPG, PNG or WebP
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* UPLOAD PROGRESS                                   */}
      {/* ================================================= */}

      {isUploading && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Uploading avatar...</span>

            <span className="font-medium text-primary">{progress}%</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-200"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* VALIDATION ERROR                                  */}
      {/* ================================================= */}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
