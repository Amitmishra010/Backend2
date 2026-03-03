import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const skip=(page-1)*limit;
    const comments=await Comment.find({video:videoId})
    .populate("owner","username")
    .sort({createdAt:-1})
    .skip(skip)
    .limit(limit)
    return res.status(200)
    .json(new ApiResponse(200,comments,"top comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    //get userid and validate it and is logged in
    const {videoId}=req.params
    const {content}=req.body
    
    if(!content){
        throw new ApiErrors(400,"content is required");
    }
    if(!videoId){
        throw new ApiErrors(400,"videoId is required");
    }
    const comment=await Comment.create({
        content:content,
        video:videoId,
        owner:req.user._id
    })
    return res.status(200)
    .json(new ApiResponse(200,comment,"comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content}=req.body
    const {commentId}=req.params//us comment ki id hai jo comment document create hua hai
    if(!content){
        throw new ApiErrors(400,"content is required")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiErrors(400,"comment not found")
    }
    if(comment.owner.toString()!==req.user._id.toString()){
        throw new ApiErrors(400,"Unauthorized")
    }
    comment.content=content
    await comment.save();
    return res.status(200)
    .json(200,comment,"commentupdated successfully")
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiErrors(400,"comment not found")
    }
    if(comment.owner.toString()!==req.user._id.toString()){
        throw new ApiErrors(404,"unauthorised")
    }
    await comment.deleteOne();
    return res.status(200)
    .json(new ApiResponse(200,{},"comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }