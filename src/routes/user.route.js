import express from 'express'
import { registerUser, userLogin, logout, getUser, 
    sendOtpRegister, resetPassword, updatePassword } from "../controller/user.js"
import { checkUser } from '../middleware/auth.middleware.js';

 
const router=express.Router();

router.post("/veryfy-token-and-register",registerUser)
router.post("/userLogin",userLogin)
router.post("/logout",logout)
router.get("/getUser",checkUser,getUser)
router.post("/sendOtpRegister",sendOtpRegister)
router.post("/reset-password",resetPassword)
router.patch("/update-password",updatePassword)
router.patch("/check-response",check)

router.get("/get-response",(req,res)=>
    {    
       return  res.json({
              message:"server is started to send response..,"
        })
    }) 

export default router;
