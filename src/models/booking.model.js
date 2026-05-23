
import mongoose from "mongoose";

 const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  dj: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "dj",
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventLocation:
  {
    type:String,
    required:true
  },
  totalHours:
  {
    type:Number,
    required:true
  },
  message:{
    type:String
  },
  status:
  {
    type:String,
    enum:["pending","rejected","accepted","compleated"],
    default:"pending"
  }
},
{
    timestamps:true
});

export const bookModel=mongoose.model("book",bookSchema)


