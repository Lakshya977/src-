import { asynchandler } from "../utils/aysnchandler.js";

const registerUser = asynchandler(  async (req,res)=>{
    res.send(200).json({
        message:ok
    })
})

export {registerUser}