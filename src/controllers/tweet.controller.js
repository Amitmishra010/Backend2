import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Tweet} from "../models/tweet.model.js"
import mongoose from "mongoose";
//test karna hai
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    
    const {content}=req.body
    if(!content||content.trim()===""){
        throw new ApiErrors(400,"content is required")
    }
    const tweet=await Tweet.create({
        owner:req.user._id,
        content:content.trim()
    })
    return res.status(200)
    .json(new ApiResponse(200,tweet,"tweet is created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId=req.user._id
    if(!userId){
        throw new ApiErrors(400,"user id is required")
    }
    const tweets=await Tweet.find({
        owner:userId
    }).sort({createdAt:-1})
    return res.status(200)
    .json(new ApiResponse(200,tweets,"all tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params
    const {content}=req.body
    if(!content){
        throw new ApiErrors(400,"content is required")
    }
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiErrors(404,"tweet not found")
    }
    if(tweet.owner.toString()!==req.user._id.toString()){
        throw new ApiErrors(403,"Unauthorised")
    }
    tweet.content=content.trim()
    await tweet.save()
    return res.status(200)
    .json(new ApiResponse(200,tweet,"tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiErrors(404,"tweet not found")
    }
    if(tweet.owner.toString()!==req.user._id.toString()){
        throw new ApiErrors(403,"unauthorised")
    }
    await Tweet.deleteOne()
    return res.status(200)
    .json(new ApiResponse(200,{},"tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}