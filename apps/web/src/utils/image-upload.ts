import { env } from "@my-portfolio/env/web";
import axios from "axios";
export async function uploadImage(
  file: File,
  onProgress: (progress: number) => void,
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post<{ url: string }>(
    `${env.NEXT_PUBLIC_SERVER_URL}/api/uploads/image`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (!event.total) return;

        const progess = Math.round((event.loaded * 100) / event.total);
        onProgress?.(progess);
      },
    },
  );

  return response.data.url;
}

// #Using Fetch

// import { env } from "@/env";

// export async function uploadImage(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("image", file);

//   const response = await fetch(
//     `${env.NEXT_PUBLIC_SERVER_URL}/api/uploads/image`,
//     {
//       method: "POST",
//       body: formData,
//       credentials: "include",
//     },
//   );

//   if (!response.ok) {
//     throw new Error("Image upload failed");
//   }

//   const data = (await response.json()) as {
//     url: string;
//   };

//   return data.url;
// }
