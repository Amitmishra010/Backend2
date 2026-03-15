import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiErrors}from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Like } from "../models/like.model.js"
import mongoose from "mongoose"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const isliked =await Like.findOne({
        video:videoId,
        likedBy:req.user._id
    })
    if(isliked){
        await Like.findByIdAndDelete(isliked._id)
        return res.status(200).json({liked:false})
    }
    else{
        const likedVideo=await Like.create({
            video:videoId,
            likedBy:req.user._id
        })
        return res.status(200)
    .json({liked:true})
    }
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const existinglikeComment=await Like.findOne({
        likedBy:req.user._id,
        comment:commentId
    })
    if(existinglikeComment){
        await Like.findByIdAndDelete(existinglikeComment._id)
        return res.status(200).json(new ApiResponse(200,{},"comment unliked"))
    }
    else{
        const likedComment=await Like.create({
            likedBy:req.user._id,
            comment:commentId
        })
        return res.status(200).json(new ApiResponse(200,likedComment,"comment liked"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const existinglikedtweet=await Like.findOne({
        likedBy:req.user._id,
        tweet:tweetId
    })
    if(existinglikedtweet){
        await Like.findByIdAndDelete(existinglikedtweet._id)
        return res.status(200).json(new ApiResponse(200,{},"tweet unliked"))
    }
    else{
        const likedTweet=await Like.create({
            likedBy:req.user._id,
            tweet:tweetId
        })
        return res.status(200).json(new ApiResponse(200,likedTweet,"tweet liked"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
   const likedVideos=await Like.find({
    likedBy:req.user._id,
    video:{$ne:null}
   }).populate("video")
   const videos=likedVideos.map(Like=>Like.video)
   return res.status(200).json(new ApiResponse(200,likedVideos,"all liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}