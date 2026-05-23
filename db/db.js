import mongoose from "mongoose";

async function dbConnect() {
  try {
    await mongoose.connect(
      "mongodb+srv://vaibhavpingale51_db_user:Vaibhav@cluster0.wtchmyi.mongodb.net/djapp?retryWrites=true&w=majority&family=4"
    );

    console.log("✅ Database connected");
  } catch (e) {
    console.log("❌ DB Error:", e);
  }
}

export default dbConnect;
