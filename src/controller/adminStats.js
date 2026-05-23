import { bookModel } from "../models/booking.model.js"
import { djModel } from "../models/djProfile.model.js"
import reviewModel from "../models/review.model.js"
import userModel from "../models/user.model.js"

export const getAdminStats=async(req,res)=>
{
     try{
const admin=req.admin

     const users=await userModel.countDocuments()
     const djs=await djModel.countDocuments()
     const bookings=await bookModel.countDocuments()
     const  reviews=await reviewModel.countDocuments()


     return res.json(
             {success:true,
                users,djs,bookings,reviews,
                role:"admin"
             }
        
     )
     }
     catch(e)
     {
       return res.json({
           success:false,
           message:e.message
       })
     }
}