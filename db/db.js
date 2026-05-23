
import mognoose  from 'mongoose'

async function dbConnect()
{
     try{
             await mognoose.connect(process.env.MONGO_URI)
             console.log("data base cnnected`")
     }
     catch(e)
     {
        console.log(e.message)
     }
}

export default dbConnect;
