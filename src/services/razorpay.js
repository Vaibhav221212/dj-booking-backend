import Razorpay from 'razorpay'
import dotenv from 'dotenv'
export const razorpay=new Razorpay({
    key_id:process.env.RAZOR_API_KEY,
    key_secret:process.env.RAZOR_SECRET
})

