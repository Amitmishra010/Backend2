import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js"
import { ApiErrors } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteCloudinary.js";
import mongoose from "mongoose";
//getallvideos
//videopublish
//videoDelete
//updatevideo
//getvideosbyid
//togglepublishedstatus
const uploadVideo=asyncHandler(async (req,res)=>{
//hame video chahiye(video details like description, title, thumbnail)
//hame file bhi to chahiye video ki
//validate details
//upload on cloudinary(storage)
//create video(database) or linking to user

const {title,description}=req.body
if(!title || !description){
    throw new ApiErrors(400,"title or description is missing")
}
const videofileLocalPath=req.files?.videofile?.[0]?.path;
const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path;
if(!videofileLocalPath){
    throw new ApiErrors(401,"videofile path not found")
}
if(!thumbnailLocalPath){
    throw new ApiErrors(402,"videofile path not found")
}
//till here means we got the file
//now we upload this on cloudinary
const videofile=await uploadOnCloudinary(videofileLocalPath)
const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
//ab hame video create karni hogi but usse pahle check karna hoga agar videofile ya thumbnail missing hai upload nahi karna hai
if(!videofile.url ||!thumbnail.url){
    throw new ApiErrors(404,"uploading failed")
}
try {
    const video=Video.create({
    description:description.trim(),
    title:title.trim(),
    //public_id is must while uploading because it's useful when we are deleting
    videofile:{
        url:videofile.url,
        public_id:videofile.public_id
    },
    thumbnail:{
        url:thumbnail.url,
        public_id:thumbnail.public_id
    },
    duration:videofile.duration,
    views:0,
    owner:req.user._id
})
return res.status(200)
.json(
    new ApiResponse(200,video,"successfully uploaded video")
)
} catch (error) {
    if(!videofile?.public_id){
        await deleteFromCloudinary(videofile.public_id,"video")
    }
    if(!thumbnail?.public_id){
        await deleteFromCloudinary(thumbnail.public_id,"image")
    }
    throw error;
}


})
const getvideosbyid=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!videoId){
        throw new ApiErrors(400,"videoid not found")
    }
    //check if id is valid mongodb id
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiErrors(400,"invalid id format")
    }
   
    //if jis user ne request kari hai exist karta hai to
    
    //to prevent crash if user id is undefined
    const userId=req.user?._id ? new mongoose.Types.ObjectId(req.user._id):null;
    
    if(userId){
        await Video.findByIdAndUpdate(videoId,{$inc:{views:1}},
            {new:true}
        );
    }
    //ab we start pipeline
    const getVideoDetails=await Video.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(videoId)}
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as:"comments",
                pipeline:[
                    {
                        $sort:{createdAt:-1}
                    },{
                        $limit:10
                    },
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"commentOwnerDetails",
                            pipeline:[{
                                $project:{
                                    username:1,
                                    avatar:1
                                }
                            }]
                        }
                    },
                    {
                        $addFields:{
                            commentOwnerDetails:{$first:"$commentOwnerDetails"}
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"likes"
            }
           
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[{
                    $project:{
                        username:1,
                        avatar:1
                    }
                },{
                    $lookup:{
                        from:"subscriptions",
                        localField:"_id",
                        foreignField:"channel",
                        as:"subscribers"
                    }
                },{
                    $addFields:{
                        subscriberCount:{$size:"$subscribers"},
                        isSubscribed:{$cond:{
                            if:{$and:[{$ne:[userId,null]},{$in:[userId,"$subscribers.subscriber"]}]},
                            then:true,
                            else:false
                        }}
                    }
                },{
                    $project:{
                        username:1,avatar:1,subscriberCount:1,isSubscribed:1
                    }
                }
            ]
            }
        },{
            $addFields:{
                totalLikes:{$size:"$likes"},
                isLiked:{
                    $cond:{
                        if:{$and:[{$ne:[userId,null]},{ $in:[userId,"$likes.likedBy"]}]},
                        then:true,
                        else:false
                    }
                },
                owner:{$first:"$owner"},
            }
        }
    ])
        
    if(getVideoDetails.length===0){
        throw new ApiErrors(404,"video doesn't exist")
    }
    return res.status(200).json(
        new ApiResponse(200,getVideoDetails[0],"successfully fetched video details")
    )
})
const updateVideo=asyncHandler(async(req,res)=>{
    //video update karne ke liye video chahiye(wo id se milegi)
    //validate karo video
    //user authenticated hona chahiye jiski video ho wahi update kar sake
    //validate karo userdetails(if owner of video same as logged in user then he can)
    //kya kya update kar sakte hai(not can update owner,views,likes)
    const {videoId}=req.params
    const {title,description}=req.body
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiErrors(404,"video not exist")
    }
    //check owner of video
    if(video.owner.toString()!==req.user._id.toString()){
        throw new ApiErrors(403,"you are not allowed to update details of this video")
    }
    //update only allowed details
    if(title) video.title=title;
    if(description) video.description=description;
    await video.save();
    return res.status(200)
    .json(new ApiResponse(200,video,"details updated successfully"));


})
const deleteVideo=asyncHandler(async(req,res)=>{
    //videoId chahiye
    //check if video is in db or not
    //owner validation
    const {videoId}=req.params
    if(!videoId){
        throw new ApiErrors(400,"videoId is required ")
    }
    //use findoneand delete more efficient
    const video=await Video.findOneAndDelete({
        _id:videoId,
        owner:req.user._id
    });
    if(!video){
        throw new ApiErrors(400,"video not found or unauthorised")
    }
    await deleteFromCloudinary(video.videofile.public_id,"video")
    await deleteFromCloudinary(video.thumbnail.public_id,"image")
    return res.status(200)
    .json(new ApiResponse(200,{},"video successfully deleted"))
})
export {
    uploadVideo,
    getvideosbyid,
    updateVideo,
    deleteVideo
}