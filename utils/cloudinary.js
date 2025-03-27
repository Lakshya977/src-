import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: 'dp57vjwyl', 
    api_key: '546586713529885', 
    api_secret: process.env.CLOUDINARY_KEY
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("No file path provided!");
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", 
        });
         console.log("file is uplaoded",result.url);
        return result
    } catch (error) {
      
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }

};
 export  {uploadOnCloudinary}
