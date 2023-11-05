import { Router } from "express";
import ExcersiceController from "./experience_controller.js";
import AuthServices from "../../util/auth.js";

const router = Router();

router.route("/:username").get(ExcersiceController.getExperience);
router
  .route("/")
  .post(AuthServices.userAuthentication, ExcersiceController.createExperience);
router
  .route("/:experienceId")
  .put(AuthServices.userAuthentication, ExcersiceController.updateExperience);
router
  .route("/:experienceId")
  .delete(
    AuthServices.userAuthentication,
    ExcersiceController.deleteExperience
  );

export default router;
