import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const checkUser = async (req, res, next) => {
  try {
    const { isLogin } = req.params;
    const token = req.cookies.token;
    if (!token) {
      return res.json({
        success: false,
        message: "invalid user",
      });
    }

    const decode = await jwt.verify(
      token,
      "rDRiyK6octEQz0yTLZ3o6m8QvtcIUxQkEFRyRc3U3Oa",
    );

    const user = await userModel.findOne({ _id: decode.id });

    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }

    if (isLogin) {
      return res.json({
        success: true,
        message: "user Login",
      });
    }
    req.user = user;
    next();
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

export const isAdmin=async(req,res,next)=>
{
    const {token}=req.cookies

    if(!token)
    {
      return res.json({
        success:false,
        message:"you are not admin"
      })
    }
    const decode=jwt.verify(token,"rDRiyK6octEQz0yTLZ3o6m8QvtcIUxQkEFRyRc3U3Oa")

    const admin=await userModel.findById(decode.id)

    if(!admin)
    {
       return res.json({
        success:false,
        message:"unauthrised admin"
      })
    }

    req.admin=admin
    next()
}