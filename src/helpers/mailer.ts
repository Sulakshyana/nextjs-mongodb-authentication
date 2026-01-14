import nodemailer from "nodemailer";
import User from "@/models/userModels";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailTypes, userId }: any) => {
  try {
    //create hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailTypes === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailTypes === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }
    const host = process.env.MAILTRAP_SMTP_HOST;
    const port = process.env.MAILTRAP_SMTP_PORT;

    if (!host || !port) {
      throw new Error("Missing SMTP env vars");
    }

    var transport = nodemailer.createTransport({
      host: host,
      port: Number(port),
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });
    const mailOptions = {
      from: "mail.taskManager@example.com",
      to: email,
      subject:
        emailTypes === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `<p>click <a href="${
        process.env.domain
      }/verify-email?token=${hashedToken}">here</a> to ${
        emailTypes === "VERIFY" ? "verify your email" : "reset your password"
      } or copy paste the link below in your browser. <br/> ${
        process.env.DOMAIN
      }/verify-email?token=${hashedToken}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error(
      "Email service failed. Make sure you have provided your mailTrap credentials on .env files"
    );
    console.error("Error:", error);
  }
};
