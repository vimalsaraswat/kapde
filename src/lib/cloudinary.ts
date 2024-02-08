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
    return uploadResult;
  } catch (error) {
    console.error(error);
  }
};
