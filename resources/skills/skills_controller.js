import { withErrorHandling } from "../../util/with_error_handling_calls.js";
import AllSkill from "./skills_db_model.js";
import Skill from "./skills_model.js";

class SkillController {
  static withErrAddMultipleSkills = async (req, res) => {
    const skillss = [];
    for (const skillData of req.body) {
      const existingSkill = await AllSkill.findOne({ name: skillData.name });
      if (!existingSkill) {
        skillss.push(skillData);
      }
    }
    const skills = await AllSkill.insertMany(skillss, { ordered: false });
    res.status(200).json({
      data: skills,
    });
  };

  static withErrGetAllSkills = async (req, res) => {
    const skills = await AllSkill.find();
    res.status(200).json({
      data: skills,
    });
  };
  static withErrGetUserSkills = async (req, res) => {
    const { username } = req.params;
    const skills = await Skill.aggregate([
      {
        $match: { username },
      },
      {
        $lookup: {
          from: "allskills",
          localField: "skill",
          foreignField: "_id",
          as: "skill",
        },
      },
      {
        $unwind: "$skill", // Unwind the array to get a single document for each skill
      },
      {
        $group: {
          _id: "$skillCategory", // Group by skillCategory
          skills: { $push: "$$ROOT" }, // Collect all skill documents in the group
        },
      },
      {
        $project: {
          category: "$_id",
          skills: 1,
        },
      },
    ]);
    res.status(200).json({
      skills,
    });
  };

  static withoutErrAddUserSkill = async (req, res) => {
    const id = req.user._id;
    var reqdata = req.body;
    if (!reqdata.skill) {
      const skill = await AllSkill.create({
        name: reqdata.name,
      });
      reqdata.skill = skill._id;
    }
    if (
      !["Beginner", "Intermediate", "Advanced", "Expert"].includes(
        reqdata.level
      )
    ) {
      reqdata.level = "Intermediate";
    }

    const skill = await Skill.findOneAndUpdate(
      {
        user: id,
        skill: reqdata.skill,
      },
      {
        $set: {
          level: reqdata.level,
          username: req.user.username,
          skillCategory: reqdata.skillCategory,
        },
        $setOnInsert: { user: id },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      data: skill,
    });
  };

  static addMultipleSkills = withErrorHandling(
    SkillController.withErrAddMultipleSkills,
    [],
    []
  );

  static getAllSkills = withErrorHandling(
    SkillController.withErrGetAllSkills,
    [],
    []
  );
  static addSkill = withErrorHandling(SkillController.withoutErrAddUserSkill);
  static userSkills = withErrorHandling(SkillController.withErrGetUserSkills);
}

export default SkillController;
