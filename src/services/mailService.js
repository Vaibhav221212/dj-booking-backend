    import nodemailer from "nodemailer";
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vaibhavpingale51@gmail.com",
        pass: "aviduxcarggkrkuc", // app pasword very credential
      },
    });

    export default transporter