import { djModel } from "../models/djProfile.model.js";
import reviewModel from "../models/review.model.js";
import mongoose from "mongoose";
export const addReview = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { rating, comment } = req.body;

    const djProfile = await djModel.findById(id);

    if (!djProfile) {
      return res.json({
        success: false,
        message: "DJ not found",
      });
    }

    const review = await reviewModel.create({
      dj: id,
      user: user._id,
      comment,
      rating,
    });
    // update DJ
    await updateDjRating(id); // call function to update avgRating
    return res.json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDjRating = async (djId) => {
  console.log("dj-id:", djId);
  const result = await reviewModel.aggregate([
    { $match: { dj: new mongoose.Types.ObjectId(djId) } },
    {
      $group: {
        _id: "$dj",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (result.length > 0) {
    await djModel.findByIdAndUpdate(djId, {
      avgRating: result[0].avgRating,
    });
  } else {
    await djModel.findByIdAndUpdate(djId, {
      avgRating: 0,
      totalReviews: 0,
    });
  }
};

export const getAllDj_withSorting = async (req, res) => {
  try {
    const djs = await djModel.find().sort({ avgRating: -1 });
    
    return res.json({
      success: true,
      message: "top rated djs fetched",
      djs: djs,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllReviewForSingleDj = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("continue.,1");
    const reviews = await reviewModel
      .find({ dj: id })
      .populate("user", "name email");

    console.log(reviews);
    if (!reviews) {
      return res.json({
        success: false,
        message: "currently no any reviews found..,",
      });
    }
    console.log("continue.,2");
    // const totalReview = reviews.length;

    // const averageRating =
    //   totalReview == 0 ? 0 : reviews.reduce((acc, r) => acc + r.rating, 0);

    return res.json({
      success: true,
      message: "get sucesfully",
      reviews,
    });
    console.log("continue.,3 ");
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

export const getAverageRating = async () => {};

// already reviewed check
// const alreadyReview = await reviewModel.findOne({
//   dj: id,
//   user: user._id,
// });

// if (alreadyReview) {
//   return res.json({
//     success: false,
//     message: "Already review added",
//   });
// }
