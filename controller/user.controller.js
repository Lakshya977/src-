import { asynchandler } from "../utils/aysnchandler.js";

const registerUser = asynchandler(  async (req,res)=>{
   return res.send(200).json({
        message:"ok"
    })
})

export { registerUser}