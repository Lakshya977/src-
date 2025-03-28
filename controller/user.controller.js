import { asynchandler } from "../utils/aysnchandler.js";
import { apierror } from "../utils/apierror.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken";
 const generateAccessAndRefreshToken = async(userId) => {
  try{
      const user  = await User.findById(userId)
      const  accesstoken = user.generateAccessToken();
      const refreshtoken = user.generateRefreshToken();
      user.refresttoken = refreshtoken;
      await user.save(
        {validateBeforeSave : false}
      );
      return {accesstoken,refreshtoken}
  } catch(error){
    throw new apierror(500,"Something went wrong")
  }
 }
const registerUser = asynchandler(  async (req,res)=>{
  //get user details from frontend
  const {username,email,fullname,password} = req.body
     if([fullname,email,username,password].some((field)=> field?.trim()==="")
    ){
         throw new apierror(400,"field missing")
    }
     
    const existed = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existed) {
        throw new apierror(409, "email/username already exists");
      }
      
        const avatarlocalpath = req.files?.avatar?.[0]?.path
        const coverimagelocalpath = req.files?.coverimage?.[0]?.path
        if(!avatarlocalpath){
            throw new apierror(404,"avatar is already")
        }
        const avatar =await uploadOnCloudinary(avatarlocalpath)
        const coverimage = await uploadOnCloudinary(coverimagelocalpath)
        if(!avatar){
            throw new apierror(404,"avatar is already")
        }
        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverimage: coverimage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })
      const checkuser = await User.findById(user._id).select(
        "-password -refresttoken" 
      )

      if(!checkuser){
        throw new apierror(503,"Something went wrong while checking the user")
      }
      return res.status(201).json(
       new Apiresponse(200,checkuser,"user registered sucessfully")
      )
})

const loginuser = asynchandler(async(req,res)=>{
      const {email,username,password}= req.body
      if(!username || !email){
        throw new apierror(400,"Username or email is required")
      }
    const user =  await User.findOne({
          $or :[{email},{username}]
        }
      )

      if(!user){
        throw new apierror(404,"User does not exsit")
      }
      const ispasswordvalid = await user.comparePassword(password)
      if(!ispasswordvalid){
        throw new apierror(404,"Invalid")
      }
     const {accesstoken,refreshtoken} = await generateAccessAndRefreshToken(user._id)

    const loggedinuser = await User.findById(user._id).select("-password ")     

    const options = {
      httpOnly : true,
      secure : true
    }
    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
      new Apiresponse(200,
        {
          user:loggedinuser,accesstoken,refreshtoken
        },
        "User loggin successfully"

      )
    )


})
const logoutuser = asynchandler(async(req,res)=>{
     User.findByIdAndUpdate(req.user._id,{
      $set:{
        refresttoken:undefined
      }
     },{
      new:true
     })
     const options={
      httpOnly:true
      ,secure : true
     }
     return res.status(200).clearCookie("accesstoken",accesstoken).clearCookie("refreshtoken",refreshtoken).json(new Apiresponse(200,{},"user logged out successfully"))
})
const refreshaccesstoken = asynchandler( async(req,res)=>{
   const incomingrefreshtoken =  req.cookies.refreshtoken || req.body.refreshtoken
   if(incomingrefreshtoken){
    throw new apierror(401,"unauth req")
   }
 try {
   const decodedtoken = jwt.verify(incomingrefreshtoken,process.env.JWT_SECRET)
   const user = User.findById(decodedtoken?._id)
   if(!user){
     throw new apierror(404, "invalid token");
   }
   if(incomingrefreshtoken !== refresttoken){
     throw new apierror(404,"invalid token")
   }
   const {accesstoken,newrefreshtoken} = await generateAccessAndRefreshToken(user._id);
   return res.status(202).cookie("accesstoken",accesstoken).cookie("refreshtoken",newrefreshtoken).json("access token refreshed")
    
 } catch (error) {
  throw new apierror(404,"invaled token")
 }
})
export { registerUser,loginuser,logoutuser,refreshaccesstoken}
