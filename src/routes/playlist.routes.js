import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
const router=Router()
router.route("/").post(verifyJWT,createPlaylist)
router.route("/:playlistId/add/:videoId").patch(verifyJWT,addVideoToPlaylist)
router.route("/:playlistId/remove/:videoId").patch(verifyJWT,removeVideoFromPlaylist)
router.route("/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/:playlistId/update").patch(verifyJWT,updatePlaylist)
router.route("/:playlistId").get(getPlaylistById)
router.route("/user/:userId").get(verifyJWT,getUserPlaylists)



export default router