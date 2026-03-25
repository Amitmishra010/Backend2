//ye middleware sirf verify karega ki user hai ya nahi hai

import { ApiErrors } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT=asyncHandler(async (req,res,next)=>{
//ab token lenge kaise->req se kyuki iske paas cookies ka access hai
//? kar lete hai kyuki ho sakta hai na ho ya user ek custom header bhej raha ho
//-->like postman me header ke through- Authorization: bearer<token>
try {
    const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
    if(!token){
        throw new ApiErrors(404,"Unauthorised request")
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
        //todo:discuss about frontend
        throw new ApiErrors(401,"invalid access token")
    }
    req.user=user;
    next()
} catch (error) {
    throw new ApiErrors(404,error?.message||"invalid access token")
}
})