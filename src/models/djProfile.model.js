import mongoose from "mongoose";

const djSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    stageName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    genres: [
      {
        type: String,
      },
    ],
    profileImage: {
      type: String,
    },
    galleryImage: [
      {
        type: String,
      },
    ],
    equipment: {
      type: String,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    isVeryfied: {
      type: Boolean,
      default: true,
    },
    avgRating:{
      type:Number,
      default:0
    }
  },
  { timestamps: true },
);

export const djModel = mongoose.model("dj", djSchema);
