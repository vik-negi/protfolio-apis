import { Router } from "express";

import UserController from "./user_controllers.js";
import AuthController from "../auth/auth_controller.js";
import AuthServices from "../../util/auth.js";
import PublicInfo from "./public_info_model.js";

const router = Router();

router.route("/").get(UserController.dashboard);
router.route("/public-info/:username").get(UserController.fetchPublicInfo);
router
  .route("/public-info")
  .post(AuthServices.userAuthentication, UserController.createPublicInfo);
router
  .route("/update-password")
  .post(AuthServices.userAuthentication, AuthController.updatePassword);
router.route("/forgot-password").post(AuthController.forgotPassOtp);
router.route("/verify-otp").post(AuthController.verifyOtp);
router.route("/reset-password").post(AuthController.changePasswordOtp);
router
  .route("/")
  .post(AuthServices.userAuthentication, UserController.fetchUser);
router
  .route("/role/:userId")
  .put(AuthServices.userAuthentication, UserController.updateUser);

export default router;
