import { withErrorHandling } from "../../util/with_error_handling_calls.js";
import Experience from "./experiences_model.js";

class ExcersiceController {
  static withErrGetExperience = async (req, res) => {
    const username = req.params.username;
    const experiences = await Experience.find({ username: username });

    experiences.sort((a, b) => {
      return new Date(b.from) - new Date(a.from);
    });

    res.status(200).json({
      data: experiences,
    });
  };

  static withErrCreateExperience = async (req, res) => {
    const id = req.user._id;
    var inputdata = req.body;
    if (typeof inputdata === "string") {
      inputdata = JSON.parse(data);
    }
    const data = {
      ...inputdata,
      user: id,
      username: req.user.username,
    };

    try {
      const about = await Experience.create(data);
      return res.status(200).json({
        data: about,
      });
    } catch (err) {
      console.log("error : ", err);
      return res.status(400).json({
        message: "Failed to create experience",
      });
    }
  };

  static withErrUpdateExperience = async (req, res) => {
    const id = req.userId;
    const experienceId = req.params.experienceId;
    const experience = await Experience.findOneAndUpdate(
      experienceId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      data: experience,
    });
  };

  static withErrDeleteExperience = async (req, res) => {
    const id = req.userId;
    const experienceId = req.params.experienceId;
    const experience = await Experience.findOneAndDelete(experienceId);
    res.status(200).json({
      message: "Experience deleted successfully",
    });
  };

  static getExperience = withErrorHandling(
    ExcersiceController.withErrGetExperience,
    [],
    ["username"]
  );
  static createExperience = withErrorHandling(
    ExcersiceController.withErrCreateExperience
  );

  static updateExperience = withErrorHandling(
    ExcersiceController.withErrUpdateExperience,
    ["experience"],
    ["experienceId"]
  );

  static deleteExperience = withErrorHandling(
    ExcersiceController.withErrDeleteExperience,
    [],
    ["experienceId"]
  );
}

export default ExcersiceController;
