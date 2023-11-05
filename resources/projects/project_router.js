import { Router } from "express";
import ProjectController from "./project_controller.js";
import AuthServices from "../../util/auth.js";

const router = Router();

router.route("/:username").get(ProjectController.getProjects);
router
  .route("/")
  .post(AuthServices.userAuthentication, ProjectController.createProject);
router
  .route("/:projectId")
  .put(AuthServices.userAuthentication, ProjectController.updateProject);
router
  .route("/:projectId")
  .delete(AuthServices.userAuthentication, ProjectController.deleteProject);

export default router;
