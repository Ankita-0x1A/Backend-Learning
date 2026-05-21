import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.REFRESH_TOKEN_SECRET, 
        api_secret: process.env.REFRESH_TOKEN_EXPIRY
});

const uploadOnCloudinary= async(localFilePath)=>{
    try{
        if(!uploadOnCloudinary) return null;

        //upload file on cloudinary
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //file upload succesfully
        console.log("file uploaded successfully ", response.url);
        return response;

    }catch(err){
        fs.unlink(localFilePath) //remove local temp. saved file as upload operation failed
        return null;
    }

}

export {uploadOnCloudinary}