import app from "./app.js";
import dbConnect from "./db/db.js";

async function startServer()
{
  app.listen(3000, "0.0.0.0", () => {
  console.log("server running");
});
   console.log("server started")
}


dbConnect()
startServer()
