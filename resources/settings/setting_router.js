import { Router } from "express";
import SettingController from "./setting_controller.js";
import AuthServices from "../../util/auth.js";

const router = Router();

router.route("/").get(SettingController.getSetting);
router
  .route("/scrollText")
  .post(AuthServices.userAuthentication, SettingController.addScrollText);
router
  .route("/logo")
  .post(AuthServices.userAuthentication, SettingController.addLogo);
router
  .route("/company-name")
  .post(AuthServices.userAuthentication, SettingController.addCompanyName);
router
  .route("/app-name")
  .post(AuthServices.userAuthentication, SettingController.addApplicationName);
router
  .route("/")
  .delete(AuthServices.userAuthentication, SettingController.deleteSetting);

export default router;
