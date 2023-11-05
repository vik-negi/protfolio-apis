import { Router } from "express";
import AuthController from "./auth_controller.js";

const router = Router();

router.route("/signin").post(AuthController.signin);
router.route("/signup").post(AuthController.signup);

router.route("/verifyOtp").post(AuthController.verifyOtp);
router.route("/changePassword").post(AuthController.changePasswordOtp);
router.route("/forgotPassword").post(AuthController.forgotPassOtp);
router.route("/updatePassword").post(AuthController.updatePassword);
export default router;
