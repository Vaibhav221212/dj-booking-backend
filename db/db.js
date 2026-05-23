
import mognoose  from 'mongoose'

async function dbConnect()
{
     try{
             await mognoose.connect("mongodb://localhost:27017")
             console.log("data base cnnected`")
     }
     catch(e)
     {
        console.log(e.message)
     }
}

export default dbConnect;