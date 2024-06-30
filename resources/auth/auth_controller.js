import { newToken } from "../../util/jwt.js";
import OTP from "../otp/otp_model.js";
import { sendOTPEmail } from "../../util/sendBlue.js";
import Utils from "../../util/utils_functions.js";
import bcrypt from "bcrypt";
import User from "../user/user_model.js";
import md5 from "md5";
import { withErrorHandling } from "../../util/with_error_handling_calls.js";
import PublicInfo from "../user/public_info_model.js";

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
class AuthController {
  static forgotPassOtpWithHandler = async (req, res) => {
    const Model = req.model;
    const user = await Model.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(200)
        .send({ status: "failed", message: "User not found" });
    else {
      const otp = generateOTP();
      const email = req.body.email;
      const isSent = await sendOTPEmail(email, { otp: otp }, true);
      if (!isSent) {
        return res.status(404).send({
          status: "failed",
          message: "Error sending OTP email",
        });
      }
      var otpData = await OTP.findOne({ email: email });

      if (otpData) {
        await OTP.findOneAndUpdate(
          { email: email },
          { otp: otp, verified: false },
          { new: true }
        );
      } else {
        otpData = await OTP.create({
          email,
          otp,
        });
      }

      return res
        .status(201)
        .send({ status: "ok", message: "OTP sent successfully" });
    }
  };
  static updatePasswordWithErrorHandling = async (req, res) => {
    const Modal = req.model;

    const hash = await bcrypt.hash(newPassword, 8);
    await Modal.findOneAndUpdate(
      req.user._id,
      { password: hash },
      { new: true }
    );

    res.status(200).send({
      status: "ok",
      message: "New password generated successfully",
    });
  };
  static signupWithErrorHandling = async (req, res) => {
    const Model = req.model;
    const user = await Model.findOne({ email: req.body.email });
    if (user)
      return res
        .status(401)
        .send({ status: "failed", message: "Email is already in use" });
    else {
      var userData = req.body;
      if (req.body.userType === "admin") {
        userData.rights = {
          read: true,
          create: true,
          update: true,
          delete: true,
        };
      }
      userData["username"] = Utils.generateUniqueUserName(
        userData.firstName.toLowerCase(),
        userData.lastName.toLowerCase()
      );

      const hash = await bcrypt.hash(userData.password, 8);
      userData.password = hash;
      const user = await Model.create(userData);

      const publicInfo = {
        user: user._id,
        username: user.username,
      };

      await PublicInfo.create(publicInfo);

      // const emailTemplate=await Email.findOne({"title":"When a new user registers"})
      // EmailService(user,emailTemplate.content,emailTemplate.subject)
      // send_email("Pop_Welcome", user);

      return res.status(201).json({ data: user });
    }
  };
  static signinWithErrorHandling = async (req, res) => {
    const Model = req.model;

    const user = await Model.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(401).send({
        status: "failed",
        message: "Email not registered with this previlage",
      });
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid Email or Password" });
    }

    const token = newToken(user);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(201).send({ token: token, data: userWithoutPassword });
  };
  static verifyOtpWithErrorHandling = async (req, res) => {
    const otpData = await OTP.findOne({ email: email });
    if (!otpData) {
      return res.status(404).send({
        status: "failed",
        message: "OTP not found",
      });
    }
    if (otpData.otp !== otp) {
      return res.status(404).send({
        status: "failed",
        message: "Invalid OTP",
      });
    }
    otpData.verified = true;
    otpData.save();
    return res.status(200).send({
      status: "ok",
      message: "OTP verified successfully",
    });
  };
  static changePasswordOtpWithErrorHandling = async (req, res) => {
    const otpData = await OTP.findOne({ email });
    if (!otpData) {
      return res.status(404).send({
        status: "failed",
        message: "OTP not found",
      });
    }
    if (!otpData.verified) {
      return res.status(404).send({
        status: "failed",
        message: "OTP not verified",
      });
    }
    const hash = await bcrypt.hash(newPassword, 8);

    var user = await User.findOneAndUpdate({ email }, { password: hash });
    if (!user) {
      return res.status(404).send({
        status: "failed",
        message: "User not found",
      });
    }
    await OTP.findOneAndDelete({ email });
    return res.status(200).send({
      status: "ok",
      message: "Password changed successfully",
    });
  };
  static forgotPassOtp = withErrorHandling(AuthController.forgotPassOtp, [
    "email",
  ]);
  static verifyOtp = withErrorHandling(
    AuthController.verifyOtpWithErrorHandling,
    ["email", "otp"]
  );
  static changePasswordOtp = withErrorHandling(
    AuthController.changePasswordOtpWithErrorHandling,
    ["email", "newPassword"]
  );
  static signup = withErrorHandling(AuthController.signupWithErrorHandling, [
    "email",
    "password",
    "firstName",
    "lastName",
  ]);
  static signin = withErrorHandling(AuthController.signinWithErrorHandling, [
    "email",
    "password",
  ]);
  static updatePassword = withErrorHandling(
    AuthController.updatePasswordWithErrorHandling,
    ["newPassword"]
  );
}
export default AuthController;
