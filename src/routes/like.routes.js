import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
const router=Router()

router.route("/:videoId").post(verifyJWT,toggleVideoLike)
router.route("/:commentId").post(verifyJWT,toggleCommentLike)
router.route("/:tweetId").post(verifyJWT,toggleTweetLike)
router.route("/:userId").get(verifyJWT,getLikedVideos)



export default router