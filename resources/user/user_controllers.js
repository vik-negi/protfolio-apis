import User from "./user_model.js";
import Utils from "../../util/utils_functions.js";
import { sendOTPEmail } from "../../util/sendBlue.js";
import bcrypt from "bcrypt";
import { withErrorHandling } from "../../util/with_error_handling_calls.js";
import PublicInfo from "./public_info_model.js";

class UserController {
  // update user
  static async withoutErrupdateUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      await user.save();
      return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "failed",
        message: "Server Error",
      });
    }
  }

  static async withoutErrfetchUser(req, res) {
    try {
      const { userId, email } = req.body;
      const user = await User.findOne({
        $or: [{ _id: userId }, { email: email }],
      });
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "User found",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "failed",
        message: "Server Error",
        error: err.message,
      });
    }
  }

  static withoutErrcreateUserByAdmin = async (req, res) => {
    try {
      var userData = req.body;
      if (!userData.email) {
        return res.status(401).send({
          message: "Required fields missing",
        });
      }

      const checkUser = await User.findOne({ email: userData.email });
      if (checkUser)
        return res
          .status(401)
          .send({ status: "failed", message: "Email is already in use" });

      userData["username"] = Utils.generateUniqueUserName(
        userData.firstName.toLowerCase(),
        userData.lastName.toLowerCase()
      );
      var password_gen = Utils.randomPasswordGenerator();

      const hash = await bcrypt.hash(password_gen, 8);
      userData.password = hash;

      const user = await User.create(userData);
      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "User not created",
        });
      }

      let mailData = `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Gold Gym - ${user.firstName}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #444;
      }
      h1 {
        color: #007bff;
      }
      h2 {
        color: #007bff;
      }
      h3 {
        color: #007bff;
      }
      p {
        margin-bottom: 10px;
      }
      .highlight {
        background-color: #ffe5b4;
        padding: 5px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to Gold Gym</h1>
    <p>Dear ${user.firstName} ${user.lastName},</p>
    <p>Welcome to Gold Gym! We are excited to have you as a new member of our fitness community. Below are your account details:</p>
    <p><strong>Password:</strong> ${password_gen}</p>
    <p class="highlight">IMPORTANT: For your security, we highly recommend that you change your password after your first login.</p>
    <p>Please keep your account details safe and secure. You can use them to log in to our website and access exclusive gym features.</p>
    <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:${process.env.SENDER_EMAIL}">support@goldgym.com</a>.</p>
    <p>Thank you for choosing Gold Gym! We look forward to seeing you achieve your fitness goals with us.</p>
    <p>Best regards,</p>
    <p>The Gold Gym Team</p>
  </body>
</html>
`;

      const isSent = await sendOTPEmail(userData.email, mailData, false);
      if (!isSent) {
        return res.status(404).send({
          status: "failed",
          message: "Error sending credentials to email although branch created",
        });
      }

      return res.status(200).json({
        message: "User added successfully",
        status: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };

  static withoutErrDashoboard = async (req, res) => {
    const user = await User.find();
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      data: user,
    });
  };

  static withoutErrfetchPublicInfo = async (req, res) => {
    const { username } = req.params;
    const publicData = await PublicInfo.findOne({
      username: username,
    }).populate("user");

    if (!publicData) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      data: publicData,
    });
  };

  static withoutErrCreatePublicInfo = async (req, res) => {
    const id = req.user._id;
    const data = {
      ...req.body,
      user: id,
      username: req.user.username,
    };
    const publicData = await PublicInfo.create(data);
    return res.status(200).json({
      data: publicData,
    });
  };

  static dashboard = withErrorHandling(UserController.withoutErrDashoboard);
  static createUser = withErrorHandling(
    UserController.withoutErrcreateUserByAdmin
  );
  static updateUser = withErrorHandling(UserController.withoutErrupdateUser);
  static fetchUser = withErrorHandling(UserController.withoutErrfetchUser);
  static fetchPublicInfo = withErrorHandling(
    UserController.withoutErrfetchPublicInfo
  );
  static createPublicInfo = withErrorHandling(
    UserController.withoutErrCreatePublicInfo
  );
}

export default UserController;
