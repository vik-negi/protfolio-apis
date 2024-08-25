import { Router } from "express";
import AuthServices from "../../util/auth.js";
import SkillController from "./skills_controller.js";

const router = Router();

// router.route("/:username").get(SkillController.);

router.route("/").get(SkillController.getAllSkills);
router.route("/:username").get(SkillController.userSkills);
router
  .route("/")
  .post(AuthServices.userAuthentication, SkillController.addSkill);
router
  .route("/many")
  .post(AuthServices.userAuthentication, SkillController.addMultipleSkills);

export default router;
