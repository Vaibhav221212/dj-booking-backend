
import mognoose  from 'mongoose'

async function dbConnect()
{
     try{
             await mognoose.connect("mongodb://vaibhavpingale51_db_user:Vaibhav@ac-uag5k6i-shard-00-00.wtchmyi.mongodb.net:27017,ac-uag5k6i-shard-00-01.wtchmyi.mongodb.net:27017,ac-uag5k6i-shard-00-02.wtchmyi.mongodb.net:27017/djapp?ssl=true&replicaSet=atlas-tg0ggq-shard-0&authSource=admin&retryWrites=true&w=majority")
             console.log("data base cnnected`")
     }
     catch(e)
     {
        console.log(e.message)
     }
}

export default dbConnect;
