import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImageBuffer = async (arrayBuffer: ArrayBuffer) => {
  const options = { folder: "kapde" };

  try {
    const buffer = new Uint8Array(arrayBuffer);
    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(options, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(buffer);
    });
    return uploadResult as UploadApiResponse;
  } catch (error) {
    console.error(error);
  }
};

export interface UploadApiResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: Array<string>;
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  moderation: Array<string>;
  access_control: Array<string>;
  context: object;
  metadata: object;
}
