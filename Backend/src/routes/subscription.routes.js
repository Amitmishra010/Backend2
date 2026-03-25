import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
const router=Router()
router.route("/:userId").get(verifyJWT,getSubscribedChannels)
router.route("/:channelId").post(verifyJWT,toggleSubscription)
router.route("/:channelId").get(verifyJWT,getUserChannelSubscribers)



export default router