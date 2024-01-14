import { withErrorHandling } from "../../util/with_error_handling_calls.js";
import About from "./about_model.js";
import Mongoose from "mongoose";

class AboutController {
  static withErrGetAbout = async (req, res) => {
    const username = req.params.username;
    const about = await About.findOne({ username: username });
    res.status(200).json({
      data: about,
    });
  };

  static withErrCreateAbout = async (req, res) => {
    const id = req.user._id;
    const data = {
      ...req.body,
      user: id,
      username: req.user.username,
    };
    console.log("about data : ", data);
    const about = await About.create(data);
    res.status(200).json({
      data: about,
    });
  };

  static withErrUpdateAbout = async (req, res) => {
    const id = req.userId;
    const aboutId = req.params.aboutId;
    console.log("dtat : ", aboutId, req.body);
    const about = await About.findOneAndUpdate(
      new Mongoose.Types.ObjectId(aboutId),
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      data: about,
    });
  };

  static withErrDeleteAbout = async (req, res) => {
    const id = req.userId;
    const aboutId = req.params.aboutId;
    const about = await About.findOneAndDelete(aboutId);
    res.status(200).json({
      message: "About deleted successfully",
    });
  };

  static getAbout = withErrorHandling(
    AboutController.withErrGetAbout,
    [],
    ["username"]
  );
  static createAbout = withErrorHandling(AboutController.withErrCreateAbout);
  static updateAbout = withErrorHandling(
    AboutController.withErrUpdateAbout,
    [],
    ["aboutId"]
  );
  static deleteAbout = withErrorHandling(
    AboutController.withErrDeleteAbout,
    [],
    ["aboutId"]
  );
}

export default AboutController;
