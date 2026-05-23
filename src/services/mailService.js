import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: "vaibhavpingale51@gmail.com",
    pass: "aviduxcarggkrkuc",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP failed:", error);
  } else {
    console.log("SMTP connected:", success);
  }
});
export default transporter;
