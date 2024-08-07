import { withErrorHandling } from "../../util/with_error_handling_calls.js";
import Experience from "./experiences_model.js";

class ExcersiceController {
  static withErrGetExperience = async (req, res) => {
    const username = req.params.username;
    const experience = await Experience.findOne({ username: username });

    experience?.experiences.sort((a, b) => {
      return new Date(b.from) - new Date(a.from);
    });

    res.status(200).json({
      data: experience,
    });
  };

  static withErrCreateExperience = async (req, res) => {
    const id = req.user._id;
    console.log("experience : ", req.body.experiences);
    const data = {
      experiences: req.body.experiences,
      user: id,
      username: req.user.username,
    };
    console.log("experience data : ", data);
    const exp = Experience.findOne({ username: req.user.username });
    if (exp) {
      const experience = await Experience.findOneAndUpdate(
        { username: req.user.username },
        { $push: { experiences: req.body.experiences } },
        {
          new: true,
        }
      );
      return res.status(200).json({
        data: experience,
      });
    }
    const about = await Experience.create(data);
    return res.status(200).json({
      data: about,
    });
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
