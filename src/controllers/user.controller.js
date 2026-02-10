import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens=async (userId)=>{
    //ye bas method bana hai
    try {
        // console.log(userId)
       const user= await User.findById(userId)
       console.log(user)
       
       const accessToken= await user.generateAccessToken()
       const refreshToken= await user.generateRefreshToken()
       //ab db me bhi to save karana padega generate karne ke baad
        console.log(accessToken)
        console.log(refreshToken)
       user.refreshToken=refreshToken
       console.log(user)
       await user.save({validateBeforeSave:false})
       
       return {accessToken,refreshToken}
    } catch (error) {
        console.log(error)
        throw new ApiErrors(500,"something went wrong while generating access token",)
    }
}
const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validate details-not empty,syntax
    //check if user already exist username,email
    //get files(images,avatar)
    //if yes upload on cloudinary 
    // if data recieved then create that user object in db-using create
    //remove password and refresh token field from response
    //return response
    console.log("Register user me aa gaye")
    const { username, email, fullname, password } = req.body
    //console.log("email:",email);
    //files handle karne ke liye jane se pahle milte jana means multer middleware ka use karo (upload.fields([]))
    //now validate
    //--> you can check using multiple if condition or using an array of these fields and .some()method on them

    console.log(req.body)
    if (
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiErrors(400, "all fields are required")
    }
    const existedUser = await User.findOne(
        {
            $or: [{ email }, { username }]
        }
    )
    if (existedUser) {
        throw new ApiErrors(409, "user already exist")
    }
    console.log("Above the local paths")
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverimageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiErrors(400, "avatar is required")
    }
    console.log("Above the local uploadOnCloudinary")
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverimageLocalPath)
    if (!avatar) {
        throw new ApiErrors(400, "avatar file is required")
    }
    console.log("Just above the create on mongoDB")
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    if (!createdUser) {
        throw new ApiErrors(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )


})
const loginUser = asyncHandler(async (req, res) => {
    //get username and password
    //validate details
    //find user
    //validate password
    //if correct then user ke liye access and refresh token generate karne padenge
    //ab token ko bhej do(send cookies)
    //
    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiErrors(404, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    console.log("user mil gaya", user);
    if (!user) {
        throw new ApiErrors(402, "user not found")
    }
    //console.log("ye raha password",this.password);
    const isPasswordValid = await user.isPasswordCorrect(password)//ye true ya false me value de dega
    if (!isPasswordValid) {
        throw new ApiErrors(401, "password is incorrect")
    }
    //access and refresh token wala kaam itna common hai ki hame baar baar use karn pad sakta hai to isse ek seperate method me kar lete hai
    console.log(user._id)
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    console.log("aage")
    //yahan pe user ke pass refresh token nahi hai to user ko update karna padega kyuki ye upar wala user hai db wala
    const loggedInUser=await User.findById(user._id)
    .select("-password -refreshToken")
    //ab bhejenge cookies and iske liye hame options design karne padte hai
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})
const logoutUser=asyncHandler(async(req,res)=>{
  //sabse pahle cookies clear karni padegi
  //refresh token bhi reset karna padega
  //-->ham yahan auth middleware se verify hone ke baad pahuche hai means user ka access hai hamare pass
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    }
  )
  const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(
                new ApiResponse(200,{},"User logged out")
            )
})
//token refresh karane ke liye ek endpoint hit karna padega(api banani padegi)
const refreshAccessToken=asyncHandler(async (req,res)=>{
//send refresh token(ye cookies se mil jayega ya koi mobile app se bhej raha ho to req.body me aayega)
//validate refresh token through refresh token in the db

const incomingRefreshToken= req.cookies.refreshToken ||req.body.refreshToken
if(!incomingRefreshToken){
    throw new ApiErrors(401,"unauthorized request")
}
//ab verify kaise karenge aane ke baad(using jwt)
try {
    const decodedToken=jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const user=await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiErrors(400,"invalid refresh token")
    }
    //ab match karanyenge jo decoded token hai aur jo encoded token hamne generate kiya tha
    if(incomingRefreshToken!==user?.refreshToken){
        throw new ApiErrors( 401,"refresh token is expired")
    }
    //ab sab kuch verify ho gya hai to naya generate kar dete hai and cookies me rakhna hai to options rakne padenge
    const options={
        httpOnly:true,
        secure:true
    }
    const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
    
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken:newRefreshToken},
            "accessToken refreshed"
        )
    )
} catch (error) {
    throw new ApiErrors(401,error?.message||"invalid refresh token")
}


})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}