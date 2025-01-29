import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

export const uploadImage = async (urlFile, idImage) => {
  // Configuration
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  try {
    //console.log("uploading:.. ", urlFile);
    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(urlFile, {
        public_id: idImage,
      })
      .catch((error) => {
        console.log(error);
      });

    //console.log("uploadResult: ", uploadResult);
    const { url } = uploadResult;
    if (url) {
      return url;
    }
    
  } catch (error) {
    console.error(error);
  }
};
