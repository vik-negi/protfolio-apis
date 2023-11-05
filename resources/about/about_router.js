import { Router } from "express";
import AboutController from "./about_controller.js";
import AuthServices from "../../util/auth.js";

const router = Router();

router.route("/:username").get(AboutController.getAbout);
router
  .route("/")
  .post(AuthServices.userAuthentication, AboutController.createAbout);
router
  .route("/:aboutId")
  .put(AuthServices.userAuthentication, AboutController.updateAbout);
router
  .route("/:aboutId")
  .delete(AuthServices.userAuthentication, AboutController.deleteAbout);

export default router;
