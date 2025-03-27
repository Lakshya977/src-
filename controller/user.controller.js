import { asynchandler } from "../utils/aysnchandler.js";
import { apierror } from "../utils/apierror.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/apiresponse.js";
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

export { registerUser}