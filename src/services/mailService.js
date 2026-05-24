import "dotenv/config";
import nodemailer from "nodemailer";

console.log("inside transporter");
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export default transporter;
