
import mongoose from 'mongoose'

const userSchema=new mongoose.Schema(
    {
        name:String,
        email:
        {
            type:String,
            unique:true,
            required:true
        },
        mobile:Number,
        role:String,
        token:String,
        password:String ,
        toExpires:Date
    }
)

const pendingUserModel=mongoose.model("pendingUser",userSchema)

export default pendingUserModel;
