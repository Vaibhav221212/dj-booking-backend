
import mongoose from "mongoose";
import validator from 'validator'
const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            validate:[validator.isEmail,"invalid email"],
            lowercase:true,
            unique:true
        },
        mobile:
        {
            type:Number,
            required:[true,]
        },
        role:
        {
            type:String,
            required:true,
            enum:["user","vendor","admin"],
            default:"user"
        },
        password:
        {
            type:String,
            required:[true, "pasasword is required "],
            select:false
         
        },
        dj:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"dj",
            default:null,

        }
    }
)

const userModel=mongoose.model("user",userSchema)

export default userModel;
