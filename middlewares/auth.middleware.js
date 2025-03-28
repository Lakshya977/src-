import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/aysnchandler.js";
import  jwt  from "jsonwebtoken";
import { User } from "../models/users.models.js";






export const verifyJWT = asynchandler(async(req,res,next) =>{
    try {
        const token =  req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
         if(!token){
            throw new apierror(401,"Unauthorized request")
         }
         const decodedtoken = jwt.verify(token,process.env.ACCESS_SECRET)
    const user = await User.findById(decodedtoken?._id).select("-password")
    
    if(!user){
        throw new apierror(405,"Invalid access token")
    }
         req.user = user;
         next()
    } catch (error) {
        throw new apierror(401,"Invalid token")
    }
}) 