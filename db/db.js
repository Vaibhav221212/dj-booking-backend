
import mongoose  from 'mongoose'

async function dbConnect()
{
     try{
         await mongoose.connect("mongodb+srv://vaibhavpingale51_db_user:R1JwkAJLm2t6hrMR
@cluster0.wtchmyi.mongodb.net/");
             console.log("data base cnnected`")
     }
     catch(e)
     {
        console.log(e.message)
     }
}

export default dbConnect;
