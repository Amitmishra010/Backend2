import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { Router } from "express";
const router=Router()
router.route("/create-playlist").post(createPlaylist)
router.route("/:playlistId").post(verifyJWT,addVideoToPlaylist)
router.route("/:playlistId/remove").patch(verifyJWT,removeVideoFromPlaylist)
router.route("/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/:playlistId/update").patch(verifyJWT,updatePlaylist)
router.route("/:playlistId").get(getPlaylistById)
router.route("/:userId").get(verifyJWT,getUserPlaylists)



export default router