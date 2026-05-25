import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
// import { FileSpreadsheet } from "lucide-react";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/FileUpload.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken= async(userId)=>{
    try{
        const user=await User.findById(userId)
        const AcessToken= await generateAccessToken()
        const RefrehToken=await generateRefreshToken()

        user.RefrehToken= RefrehToken
        await user.save({validateBeforeSave:false})

        return {AcessToken,RefrehToken}

    }catch(err){
        throw new ApiError(500,"smthg went wrong while generating tokens")
    }
}

const registerUser= asyncHandler(async(req,res)=>{

    // first check your usermpdel then proceed with further
   
    //STEP1: get information from frontend --------------------------------------------->
    const {fullname,username,email,password}=req.body;
    console.log("email",email);


    // STEP2: validation----------------------------------------------------------------->
                     // if(fullname===""){
                     //     throw ApiError(400,"full name is required");
                     // }-----can check using if else
        if(
            [fullname,username,email,password].some((field)=>
                field?.trim()==="")
        ){
            throw new ApiError(400,"All field  is required");
        }

        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if(!gmailRegex.test(email)){
            throw new  ApiError(400,"only valid email is allowed");
        }


    //STEP3: check krenge user already exist or not------------------------------------------------>
        const userExist= await User.findOne({
            $or: [{ username },{ email }]
        })

        if(userExist){
            throw new ApiError(409,"User already exist");
        }


    //STEP4: check for img and avatar----------------------------------------------------------------------->
        const avatarLocalPath= req.files?.avatar[0]?.path;
        console.log(avatarLocalPath);
        // const coverImageLocalPath= req.files?.coverImage[0]?.path;

        let coverImageLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
            coverImageLocalPath=req.files.coverImage[0].path;
        }

        if(!avatarLocalPath){
            throw new ApiError(400,"avatar file is required");
        }
    //STEP5:upload them to cloudinary avatar

    const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

//     console.log(req.files);
// console.log("Avatar Path:", avatarLocalPath);
// console.log("Cover Path:", coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"avatar file is required");
    }

    //STEP6:create user object- create entry in db

    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //STEP7: remove pswd and token field from res
    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
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

const loginUser=asyncHandler(async(req,res)=>{
    //req body--> data
    const {username,email,password}= req.body;

    //enter username or email se login
    if(!username || !email){
        throw new ApiError(400,"email or password is required");
    }

    // find the user
    const user= await User.findOne
    ({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"user not exist");
    }

    // password check
    const isPasswordValid= await isPasswordValid(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid User credentials")
    }

    //access and refresh token

    const {AcessToken,RefrehToken}=await generateAccessTokenAndRefreshToken(user._id)

    const logIn= await user.findById(user._id).select("-password -refreshToken")

     //send cookie - small data saved in browser by server

     const option= {
        httpOnly: true,
        secure:true
     }

     return res.status(200).
     cookie("acessToken",AcessToken,option).
     cookie("refreshToken",RefrehToken,option)
     .json(
        new ApiResponse(
            200,
            {
                user: logIn,AcessToken,RefrehToken
            },
            "user logged in succcesfully"
        )
    )
})

const logOutUser= await asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        }  
    )

    const option= {
        httpOnly: true,
        secure:true
     }

    return req.status(200)
    .clearCookie("accessToken".option)
    .clearCookie("RefreshToken".option)
    .json(new ApiResponse(200,{},"user logged out"))
})

export {registerUser};
export {loginUser};
export {logOutUser};