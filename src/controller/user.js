import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import tokenModel from "../models/tokenBL.model.js";
import pendingUserModel from "../models/pendindUser.model.js";
import "dotenv/config";

import crypto from "crypto";
import path from "path";
import transporter from "../services/mailService.js";


const sendOtpRegister = async (req, res) => {
  try {
    console.log("step-1");
    const { name, email, mobile, role, password } = req.body;

    console.log(email);
    if (!name || !email || !mobile || !role || !password) {
      return res.json({
        success: false,
        message: "all feilds required",
      });
    }
    console.log("step-2");
    console.log("user-info:", name, email, mobile, role, password);
    const userPresent = await userModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (userPresent) {
      return res.json({
        success: false,
        message: "email or mobile no allready exist",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const otpExpire = Date.now() + 5 * 60 * 1000;

    await pendingUserModel.findOneAndUpdate(
      { email },
      {
        name,
        email,
        mobile,
        role,
        token,
        password,
        otpExpire,
      },
      {
        upsert: true,
        new: true,
      },
    );
    console.log("step-3");

    const verifyLink = `https://dmixx.netlify.app/verify-token/${token}`;
 
    console.log("before mail");
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
    // try {
    //  const info= await transporter.sendMail({
    //     from: `"DJ Booking" <${process.env.EMAIL_USER}>`,
    //     to: email,
    //     subject: "Test Mail",
    //     html: "<h1>Mail Working</h1>",
    //   });

    //   console.log("mail sent", info.response);
    // } catch (err) {
    //   console.log("mail error", err);
    // }
    // const verifyLink = ` http://10.138.90.235:5173/verify-token/${token}`;

    const info=await transporter.sendMail({
      from: "DJ Booking from Dj_BABUU",

      to: email,

      subject: "Verify Your Account",

      html: `

    <div style="
        max-width:600px;
        margin:auto;
        padding:40px;
        font-family:Arial,sans-serif;
        background:#f8fafc;
        text-align:center;
        border-radius:16px;
    ">

        <h1 style="
            color:#7c3aed;
            margin-bottom:10px;
        ">
            DJ Booking
        </h1>

        <h2 style="
            color:#111827;
        ">
            Verify Your Email
        </h2>

        <p style="
            color:#6b7280;
            font-size:16px;
            line-height:1.7;
        ">
            Thanks for registering.
            Please click the button
            below to verify your
            account.
        </p>

        <a
            href="${verifyLink}"
            style="
                display:inline-block;
                margin-top:20px;
                background:#7c3aed;
                color:white;
                text-decoration:none;
                padding:14px 30px;
                border-radius:10px;
                font-size:16px;
                font-weight:bold;
            "
        >
            Verify Account
        </a>

        <p style="
            margin-top:30px;
            color:#9ca3af;
            font-size:14px;
        ">
            This verification link
            will expire in 5 minutes.
        </p>

    </div>
    `,
    });
    
    console.log("mail sent");
    return res.json({
      success: true,
      message: "email verification sent successfully",
    });
  } catch (e) {
    console.log(e.message);

    console.log(e.message);

    return res.json({
      success: false,
      message: e.message,
    });
  }
};
console.log("step-5");
const registerUser = async (req, res) => {
  try {
    const { token } = req.body;

    console.log();
    if (!token) {
      return res.json({
        success: false,
        message: "give and otp",
      });
    }

    const findPending = await pendingUserModel.findOne({ token });

    if (!findPending) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }
    console.log("step-6");
    if (findPending.toExpires < Date.now()) {
      return res.json({
        success: false,
        message: "invalid otp",
      });
    }

    const hashpass = await bcrypt.hash(findPending.password, 10);

    const user = await userModel.create({
      name: findPending.name,
      email: findPending.email,
      mobile: findPending.mobile,
      role: findPending.role,
      password: hashpass,
    });

    await pendingUserModel.findByIdAndDelete(findPending._id);

    const newToken = await jwt.sign(
      { id: user._id },
      "rDRiyK6octEQz0yTLZ3o6m8QvtcIUxQkEFRyRc3U3Oa",
    );

res.cookie("token", newToken, {
  httpOnly: false,     
  secure: true,        
  sameSite: "none", 
});
    console.log("step-7");
    return res.json({
      success: true,
      message: "user register succefully",
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res.json({
        success: false,
        message: "email or password missing",
      });
    }

    //    user have register
    const user = await userModel.findOne({ email: email }).select("+password");

    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.json({
        success: false,
        message: "password invalid",
      });
    }

    const token = await jwt.sign(
      { id: user._id },
      "rDRiyK6octEQz0yTLZ3o6m8QvtcIUxQkEFRyRc3U3Oa",
    );

res.cookie("token", token, {
  httpOnly: false,     
  secure: true,       
  sameSite: "none",    
});

    return res.json({
      success: true,
      message: "login sucessfully",
      user: user,

      role: user.role,

      role: user,

      token: token,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = await req.cookies.token;

    console.log(token);
    await tokenModel.create({ token: token });

    await res.clearCookie("token");

    return res.json({
      success: true,
      message: "logout successfully",
      isLogout: true,
    });
  } catch (e) {
    console.log(e.message);
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

const getUser = async (req, res) => {
  const user = req.user;

  const userData = await userModel.findById(user._id);

  return res.json({
    success: true,
    message: "user details",
    userData: userData,
  });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: "please enter a email to reset password",
    });
  }
  try {
    const isUser = await userModel.findOne({ email: email });
    if (!isUser) {
      return res.json({
        success: false,
        message: "you are not register User",
      });
    }

    const url = `http://10.138.90.235:5173/reset-password/${email}`;

    await transporter.sendMail({
      from: "dj booking  from DJ_BABUU",
      to: email,
      subject: "Click to Reset Your Password Securely",
      html: `<div style="text-align:center; margin:30px 0;">
    <a href="${url}"
       style="background:linear-gradient(135deg,#d946ef,#7c3aed);
              color:#fff;
              padding:14px 28px;
              text-decoration:none;
              border-radius:12px;
              font-weight:bold;
              display:inline-block;">
      Reset Password
    </a>
  </div>`,
    });

    return res.json({
      success: true,
      message: "password reset link send in your email",
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;

    if (!newPassword || !email) {
      return res.json({
        success: false,
        message: "please enter a password or email",
      });
    }
    const isUser = await userModel.findOne({ email: email });
    if (!isUser) {
      return res.json({
        success: false,
        message: "you are not register User",
      });
    }

    const hasPass = await bcrypt.hash(newPassword, 10);

    isUser.password = hasPass;

    await isUser.save();

    return res.json({
      success: true,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

const check = async (req, res) => {
  await transporter.sendMail({
    from: "DJ Booking from Dj_BABUU",

    to: "vaibhavpingale51@gmail.com",

    subject: "Verify Your Account",

    html: `
    
    <div style="
        max-width:600px;
        margin:auto;
        padding:40px;
        font-family:Arial,sans-serif;
        background:#f8fafc;
        text-align:center;
        border-radius:16px;
    ">

        <h1 style="
            color:#7c3aed;
            margin-bottom:10px;
        ">
            DJ Booking
        </h1>

        <h2 style="
            color:#111827;
        ">
            Verify Your Email
        </h2>

        <p style="
            color:#6b7280;
            font-size:16px;
            line-height:1.7;
        ">
            Thanks for registering.
            Please click the button
            below to verify your
            account.
        </p>

        <a
            href="/fdksfodfkdfjdfjdffe"
            style="
                display:inline-block;
                margin-top:20px;
                background:#7c3aed;
                color:white;
                text-decoration:none;
                padding:14px 30px;
                border-radius:10px;
                font-size:16px;
                font-weight:bold;
            "
        >
            Verify Account
        </a>

        <p style="
            margin-top:30px;
            color:#9ca3af;
            font-size:14px;
        ">
            This verification link
            will expire in 5 minutes.
        </p>

    </div>
    `,
  });

  return res.json({
    success: true,
  });
};
export {
  registerUser,
  userLogin,
  logout,
  getUser,
  sendOtpRegister,
  resetPassword,
  updatePassword,
  check,
};
