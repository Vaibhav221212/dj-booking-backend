
import mongoose  from 'mongoose'

async function dbConnect()
{
     try{
         await mongoose.connect("mongodb+srv://vaibhavpingale51_db_user:Vaibhav@cluster0.wtchmyi.mongodb.net/djapp?retryWrites=true&w=majority&family=4");
             console.log("data base cnnected`")
     }
     catch(e)
     {
        console.log(e.message)
     }
}

export default dbConnect;
