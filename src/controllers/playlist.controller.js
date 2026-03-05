import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description,videos} = req.body
    if(!name || !description){
        throw new ApiErrors(400,"name and description of playlist is required")
    }
    //TODO: create playlist
    const playlist=await Playlist.create({
        name,
        description,
        videos,
        owner:req.user._id
    })
    return res.status(200)
    .json(new ApiResponse(200,playlist,"playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const playlists=await Playlist.find({owner:userId})
    return res.status(200)
    .json(new ApiResponse(200,playlists,"this is user's playlist"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist=await Playlist.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(playlistId)}
        },
        {
            $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videos"
            }

        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner"
            }
        },
        {
            $addFields:{
                totalVideos:{$size:"$videos"},
                totalDuration:{$size:"$videos.duration"},
                owner:{$first:"$owner"}
            }
        }
    ])
    return res.status(200)
    .json(new ApiResponse(200,playlist,"playlist by id fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId){
        throw new ApiErrors(400,"playlistid and videoid is required")
    }
    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiErrors(400,"playlist not found")
    }
    if(playlist.owner.toString()!==req.user._id.toString()){
        throw new ApiErrors(404,"Unauthorised to add in playlist")
    }
    //for handling duplicate videos we can use set
    playlist.videos.push(videoId)
    await playlist.save()
    return res.status(200)
    .json(new ApiResponse(200,playlist,"video added successfully in playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!playlistId || !videoId){
        throw new ApiErrors(400,"playlistid and videoid is required")
    }
    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiErrors(400,"playlist not found")
    }
    if(playlist.owner.toString()!==req.user._id.toString()){
        throw new ApiErrors(404,"Unauthorised to remove from playlist")
    }
    await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{videos:videoId}
        },{new:true}
    )
    await playlist.save()
    return res.status(200)
    .json(new ApiResponse(200,playlist,"video removed successfully in playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
   if (!playlistId) {
        throw new ApiErrors(400, "playlistId is required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiErrors(404, "playlist not found");
    }

    // owner check
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "unauthorised");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!name || !description){
        throw new ApiErrors(400,"name and description is required")
    }
    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiErrors(400,"playlist not found")
    }
    if(playlist.owner.toString()!==req.user._id.toString()){
        throw new ApiErrors(404,"Unauthorised")
    }
    const updatedPlaylist=await Playlist.findByIdAndUpdate(playlistId,{name:name,description:description},{new:true})
    
    return res.status(200)
    .json(new ApiResponse(200,updatePlaylist,"playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}