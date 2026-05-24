import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
// import { FileSpreadsheet } from "lucide-react";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/FileUpload.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser= asyncHandler(async(req,res)=>{

    // first check your usermpdel then proceed with further
   
    //STEP1: get information from frontend --------------------------------------------->
    const {fullname,username,email,passward}=req.body;
    console.log("email",email);


    // STEP2: validation----------------------------------------------------------------->
                     // if(fullname===""){
                     //     throw ApiError(400,"full name is required");
                     // }-----can check using if else
        if(
            [fullname,username,email,passward].some((field)=>
                field?.trim()==="")
        ){
            throw new ApiError(400,"All field  is required");
        }

        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if(!gmailRegex.test(email)){
            throw new  ApiError(400,"only valid email is allowed");
        }


    //STEP3: check krenge user already exist or not------------------------------------------------>
        const userExist= User.findOne({
            $or: [{ username },{ email }]
        })

        if(userExist){
            throw new ApiError(409,"User already exist");
        }


    //STEP4: check for img and avatar----------------------------------------------------------------------->
        const avatarLocalPath= req.files?.avatar[0]?.path;
        console.log(avatarLocalPath);
        const coverImageLocalPath= req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"avatar file is required");
        }
    //STEP5:upload them to cloudinary avatar

    const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"avatar file is required");
    }

    //STEP6:create user object- create entry in db

    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        passward,
        username: username.toLowerCase()
    })

    //STEP7: remove pswd and token field from res
    const createdUser= await User.findById(user_id).select(
        "-passward -refreshToken"
    )   // by mongodb 

    //STEP 8: check for user crestion
    if(!createdUser){
        throw new ApiError(500,"smthg went wrong during registration");
    }

    //STEP 9:return res

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user register Succesfully")
    )
})

export {registerUser};