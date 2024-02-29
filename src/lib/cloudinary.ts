import SiteConfig from "@/config/site";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (image: File) => {
  const mime = image.type;
  const encoding = "base64";
  const arrayBuffer = await image.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

  const options = {
    invalidate: true,
    folder: SiteConfig.name,
  };

  try {
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const result = cloudinary.uploader
          .upload(fileUri, options)
          .then((result) => {
            console.log(result);
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };

    const result = await uploadToCloudinary();
    return result as UploadApiResponse;
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
