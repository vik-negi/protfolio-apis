import { withErrorHandling } from "../../util/with_error_handling_calls.js";
import AllSkill from "./skills_db_model.js";
import Skill from "./skills_model.js";

class SkillController {
  static withErrAddSkills = async (req, res) => {
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

  static withoutErrAddSkill = async (req, res) => {
    const id = req.user._id;
    const data = {
      ...req.body,
      user: id,
      username: req.user.username,
    };

    const skill = await Skill.create(data);
    res.status(200).json({
      data: skill,
    });
  };

  static addMultipleSkills = withErrorHandling(
    SkillController.withErrAddSkills,
    [],
    []
  );

  static getAllSkills = withErrorHandling(
    SkillController.withErrGetAllSkills,
    [],
    []
  );
  static addSkill = withErrorHandling(SkillController.withoutErrAddSkill);
}

export default SkillController;
