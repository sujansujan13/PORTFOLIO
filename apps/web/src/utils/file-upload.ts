import { env } from "@my-portfolio/env/web";
import axios from "axios";

export type UploadFolderType =
  | "avatars"
  | "projects"
  | "blogs"
  | "documents"
  | "tiptap-images";

export async function uploadFile(
  file: File,
  type?: UploadFolderType,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const queryType = type ? `?type=${type}` : "";

  const response = await axios.post<{ url: string }>(
    `${env.NEXT_PUBLIC_SERVER_URL}/api/uploads${queryType}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded * 100) / event.total);
        onProgress?.(progress);
      },
    },
  );

  return response.data.url;
}

export const uploadImage = uploadFile;
