
import mongoose  from 'mongoose'

async function dbConnect()
{
     try{
         await mongoose.connect(process.env.MONGO_URI);
             console.log("data base cnnected`")
     }
     catch(e)
     {
        console.log(e.message)
     }
}

export default dbConnect;
