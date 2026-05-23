import app from "./app.js";
import dbConnect from "./db/db.js";

async function startServer()
{
  app.listen(process.env.PORT || 500 , () => {
  console.log("server running");
});
   console.log("server started")
}


dbConnect()
startServer()
