import express from 'express'
import { registerUser, userLogin, logout, getUser, 
<<<<<<< HEAD
    sendOtpRegister, resetPassword, updatePassword ,check } from "../controller/user.js"
=======
    sendOtpRegister, resetPassword, updatePassword, 
    check} from "../controller/user.js"
>>>>>>> cec121b (fix: smtp issue fixed)
import { checkUser } from '../middleware/auth.middleware.js';

 
const router=express.Router();

router.post("/veryfy-token-and-register",registerUser)
router.post("/userLogin",userLogin)
router.post("/logout",logout)
router.get("/getUser",checkUser,getUser)
router.post("/sendOtpRegister",sendOtpRegister)
router.post("/reset-password",resetPassword)
router.patch("/update-password",updatePassword)
<<<<<<< HEAD
router.get("/check-response",check)
=======
router.patch("/check-response",check)

>>>>>>> cec121b (fix: smtp issue fixed)

router.get("/get-response",(req,res)=>
    {    
       return  res.json({
              message:"server is started to send response..,"
        })
    }) 

export default router;
