import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User}from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser=asyncHandler((req,res)=>{
    //get user details from frontend
    //validate details-not empty,syntax
    //check if user already exist username,email
    //get files(images,avatar)
    //if yes upload on cloudinary 
    // if data recieved then create that user object in db-using create
    //remove password and refresh token field from response
    //return response
    const {username,email,fullname,password}=req.body
    console.log("email:",email);
    //files handle karne ke liye jane se pahle milte jana means multer middleware ka use karo (upload.fields([]))
    //now validate
    //--> you can check using multiple if condition or using an array of these fields and .some()method on them

    if(
        [fullname,username,email,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"all fields are required")
    }
    const existedUser=User.findOne(
        {
            $or:[{email},{username}]
        }
    )
    if(existedUser){
        throw new ApiError(409,"user already exist")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverimageLocalPath=req.files?.coverimage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required")
    }
   const avatar= await uploadOnCloudinary(avatarLocalPath)
   const coverimage=uploadOnCloudinary(coverimageLocalPath)
   if(!avatar){
    throw new ApiError(400,"avatar file is required")
   }
   const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverimage:coverimage?.url||"",
    email,
    password,
    username:username.toLowerCase()
   })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  )
  if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully")
  )


})
export {registerUser}