import app from "./app.js";
import dbConnect from "./db/db.js";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

dbConnect().then(() => {
  app.listen(3000, () => {
    console.log("Server running");
  });
});
