import { Router } from "express";
import  {loginuser, logoutuser, registerUser}  from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();


userRouter.route("/register").post(
    upload.fields([
      {name: "avatar",
        maxCount : 1 
      },{
        name: "coverimage",
        maxCount : 1
      }
    
    ]),
    registerUser)

userRouter.route("/login").post(loginuser)

userRouter.route("/logout").post(verifyJWT,logoutuser)
export default userRouter