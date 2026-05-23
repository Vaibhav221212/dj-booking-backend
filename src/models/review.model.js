import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    dj: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dj",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    comment: String,

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    }
  },
  { timestamps: true },
);

const reviewModel=mongoose.model("review",reviewSchema)

export default reviewModel;
