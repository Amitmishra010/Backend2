import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";



const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    //check user logged in
    //find channel if exist and if not subscribed then subscribe
    if (!channelId) {
        throw new ApiErrors(400, "channel id is required");
    }
    //instead of the array we use each subscription as a seperate document(subscription model)
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })
    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200).
            json(new ApiResponse(200, {}, "Unsubscribed successfully"));

    }
    else {
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        return res.status(200).
            json(new ApiResponse(200, {}, "Subscribed successfully"));
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if(!channelId){
        throw new ApiErrors(400,"channelId is required");
    }
    //for just count of subscribers
    const subscriberCount=await Subscription.countDocuments({channel:channelId});
    //for fulllist of subscribers
    const subscribers=await Subscription.find({channel:channelId}).populate("subscriber","username")
    //more faster running both seperatly run parallel using promise.all()
    return res.status(200).
    json(new ApiResponse(200,subscriberCount,subscribers,"subscriber fetched successfully"))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const  userId  = req.user._id;
    
    if(!userId){
        throw new ApiErrors(400,"userId is required")
    }
    //now we check in subscription documents where subscriber is match with subscriberId
   
    const channelSubscribed=await Subscription.find({subscriber:userId}).populate("channel","username");
    
    return res.status(200)
    .json(new ApiResponse(200,channelSubscribed,"subscribed channels fetched successfully"))
})
export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}