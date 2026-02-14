import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

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

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    //thinking->1. ab hame ek user chahiye hoga jiski field me jake ham password verify karwa paye
    //and if wo apna password change kar pa raha hai means wo logged in hai aur ye possible ho paya auth middleware laga hone ki wajah se
    //if middleware then req.user me user available hai
    //and wahan se mai user id nikal sakta hu
    const user=await User.findById(req.user?._id);
    //ab is user me password and sari details ja rahi hai and password check karne ke liye hamne user models me methods banaye the
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiErrors(400,"invalid password")
    }
    user.password=newPassword //abhi hamne ye object me set kara hai save nahi kara hai to save karne par hamare jo hook hai pre wo call hoga
    await user.save({validateBeforeSave:false})
    // ab response bhej denge
    return res.status(200)
    .json(new ApiResponse(
        200,{},"password changed successfully"
    ))

})
//current user ko get kar pao
const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"current user get successfully"))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body
    if(!fullname || !email){
        throw new ApiErrors(400,"fullname or email is required")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            //yahan hame milte hai operators
            $set:{
                fullname:fullname,
                email:email
            }
        },//ye object hota hai
        {new:true}//isse update hone ke baad jo info hoti hai wo return hoti hai
    ).select("-password")
    //change password wale me to ek hi details thi so directly update karke save kar diya (jo ki hook tha)
    //yahan find by id and update direct call karke update kara denge
return res.status(200),
json(
    new ApiResponse(200,user,"account details updated successfully")
)
})
//file update karte samay bas middlewares par dhyan dena padega 1st is multer and 
const updateAvatar=asyncHandler(async(req,res)=>{
     //avatar lenge req.file ke through ki multer middleware hame ye deta hai
     const avatarLocalPath=req.file?.path
     if(!avatarLocalPath){
        throw new ApiErrors(400,"avatar is missing")
     }
     //Todo:delete avatar old image
     const avatar=await uploadOnCloudinary(avatarLocalPath)
     if(!avatar.url){
        throw new ApiErrors(400,"error while uploading avatar")
     }
     //ab update karenge object
     const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url//sirf avatar nahi likhna kyuki wo pura object ho jayega upload
            }
        },
        {new:true}
     ).select("password")
     return res.status(200)
     .json(
        new ApiResponse(200,user,"avatar updated successfully")
     )
})

const updateCoverimage=asyncHandler(async(req,res)=>{
     //avatar lenge req.file ke through ki multer middleware hame ye deta hai
     const coverimageLocalPath=req.file?.path
     if(!coverimageLocalPath){
        throw new ApiErrors(400,"coverimage is missing")
     }
     const coverimage=await uploadOnCloudinary(coverimageLocalPath)
     if(!coverimage.url){
        throw new ApiErrors(400,"error while uploading coverimage")
     }
     //ab update karenge object
     const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverimage:coverimage.url//sirf avatar nahi likhna kyuki wo pura object ho jayega upload
            }
        },
        {new:true}
     ).select("password")
     return res.status(200)
     .json(
        new ApiResponse(200,user,"coverimage updated successfully")
     )
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
 const {username}=req.params
 if(!username?.trim()){
    throw new ApiErrors(400,"username is missing")
 }

 //it's good to use match instead of find() to find user kyuki ek document de dega ham direct aggregation pipeline laga sakte hai
 //pipelines likhne ke baad jo value aati hai wo array aati hai
 const channel=await User.aggregate([
    {
        $match:{
            username:username?.toLowerCase()
        }
    },//ab ye ek document mil gaya
    {
        $lookup:{
            from:"subscription",//kahan se dekhna hai-->subscription model se
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
    },
    {
        $lookup:{
            from:"subscription",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },//ab dono fields aa gye hamare pass but inhe ab add bhi karna hoga
    {
        $addFields:{
            subscribersCount:{
               $size:"$subscribers"
            },
            channelsSubscribedToCount:{
                $size:"$subscribedTo"
            },
            isSubscribed:{
                if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                then:true,
                else:false
            }
        }
    },
    {
    $project:{
        fullname:1,
        username:1,
        subscribersCount:1,
        channelsSubscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverimage:1
    }
    }
 ])
console.log("mil gaya channel pipeline se",channel)
if(!channel?.length){
    throw new ApiErrors(404,"channel does not found")
}

return res.status(200)
.json(
    new ApiResponse(200,channel[0],"User channel fetched successfully")
)
})
const getWatchHistory=asyncHandler(async (req,res)=>{
    const user=User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"video",
                localField:"watchhistory",
                foreignField:"_id",
                as:"watchhistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"user",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
                    
                
            }
        }
    ])
    return res.status(200)
    .json(
        new ApiResponse(
            200,user[0].watchhistory,"watchhistory fetched successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverimage,
    getUserChannelProfile,
    getWatchHistory

}