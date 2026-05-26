import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    plan: {
      type: String,
      enum: ["1 Month", "6 Months", "1 Year"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending",
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const subscriptionModel = mongoose.model(
  "subscription",
  subscriptionSchema
);

export default subscriptionModel;