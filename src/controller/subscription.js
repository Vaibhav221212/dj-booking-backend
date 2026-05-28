import subscriptionModel from "../models/subscription.model.js";
import { razorpay } from "../services/razorpay.js";
import crypto from "crypto";
import dotenv from "dotenv";

export const createSubscription = async (req, res) => {
  try {
    const { vendorId, plan, amount } = req.body;
    console.log("userdata:",vendorId, plan, amount )
    // check already pending payment
    const existingSubscription = await subscriptionModel.findOne({
      vendorId,
      status: "pending",
    });

    if (existingSubscription) {
      return res.json({
        success: false,
        message: "Already payment in progress",
      });
    }

    // create subscription entry
    const subscription = await subscriptionModel.create({
      vendorId,
      plan,
      amount,
      status: "pending",
    });

    // create razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // paisa
      currency: "INR",
      receipt: `sub_${subscription._id}`,
    });

    // save razorpay order id
    subscription.razorpayOrderId = order.id;
    await subscription.save();

    return res.json({
      success: true,
      message: "Subscription order created",
      subscriptionId: subscription._id,
      order,
    });
  } catch (e) {
    console.log(e);

    return res.json({
      success: false,
      message: e.message,
    });
  }
};

export const confirmSubscription = async (req, res) => {
  try {
    const {
      subscriptionId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // find subscription
    const subscription = await subscriptionModel.findById(subscriptionId);

    if (!subscription) {
      return res.json({
        success: false,
        message: "Subscription not found",
      });
    }

    // already active protection
    if (subscription.status === "active") {
      return res.json({
        success: false,
        message: "Subscription already activated",
      });
    }

    // signature verify
    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // start & end date
    const startDate = new Date();
    const endDate = new Date(startDate);

    // plan wise expiry
    if (subscription.plan === "1 Month") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (subscription.plan === "6 Months") {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (subscription.plan === "1 Year") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // update subscription
    const updatedSubscription = await subscriptionModel.findByIdAndUpdate(
      subscriptionId,
      {
        status: "active",
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        startDate,
        endDate,
      },
      { new: true },
    );

    return res.json({
      success: true,
      message: "Subscription activated",
      subscription: updatedSubscription,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const checkSubscription = async (req, res) => {
  const user = req.user;
  // check
  const isSub = await subscriptionModel.findOne({ vendorId: user._id });

  if (!isSub || isSub.status !== "active") {
    return res.json({
      success: false,
      message: "vendor not subscribed",
    });
  }
    return res.json({ success: true });
};


export const cancelPayment=async(req,res)=>
{
   const {id}=req.body
   console.log("id:=>",id)
      await subscriptionModel.findByIdAndDelete(id)

   return res.json(
    {
      success:true,
    
    }
   )
}
