import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'


export const checkVendor=async(req,res ,next)=>
{
       const token= req.cookies.token
       console.log("token:",token)
       console.log("req.cookies:",req.cookies)
       if(!token)
       {
        return res.json({
            success:false,
            message:"not autherised"
        })
       }
       console.log("continue.,")

       const decode=await jwt.verify(token, "rDRiyK6octEQz0yTLZ3o6m8QvtcIUxQkEFRyRc3U3Oa")

       const user=await userModel.findOne({_id:decode.id})
       if(user.role !=="vendor")
       {
        return res.json({
            success:false,
            message:"not autherised"
        })
       }

       req.user=user
       next()
}

