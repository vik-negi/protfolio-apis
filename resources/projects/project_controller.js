import { cloudinaryConfig } from "../../util/cloudinary.js";
import { withErrorHandling } from "../../util/with_error_handling_calls.js";
import Project from "./project_model.js";

class ProjectController {
  static withoutErrGetProjects = async (req, res) => {
    const username = req.params.username;

    const projectId = req.query.projectId;
    const filter = {
      username: username,
    };
    if (projectId) {
      filter._id = projectId;
    }
    const projects = await Project.find(filter).sort({ order: 1 });
    res.status(200).json({
      data: projects,
    });
  };

  static withoutErrCreateProject = async (req, res) => {
    const id = req.user._id;
    const data = {
      ...req.body,
      user: id,
      username: req.user.username,
    };
    var images = [];

    for (const key in req.files) {
      if (Object.hasOwnProperty.call(req.files, key)) {
        try {
          const result = await cloudinaryConfig(
            req.files[key].tempFilePath,
            "image"
          );
          images.push(result.url);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }

    data.image = images;
    data.tags = data.tags.split(",");
    data.skillsUsed = data.skillsUsed.split(",");

    const project = await Project.create(data);
    res.status(200).json({
      data: project,
    });
  };

  static withoutErrUpdateProject = async (req, res) => {
    const id = req.userId;
    const projectId = req.params.projectId;
    const project = await Project.findOneAndUpdate(
      { _id: projectId, user: id },
      req.body,
      { new: true }
    );
    res.status(200).json({
      data: project,
    });
  };

  static withoutErrDeleteProject = async (req, res) => {
    const projectId = req.params.projectId;
    console.log("projectId", projectId);
    const project = await Project.findOneAndDelete({ _id: projectId });
    res.status(200).json({
      data: project,
    });
  };

  static getProjects = withErrorHandling(
    ProjectController.withoutErrGetProjects,
    [],
    []
  );
  static createProject = withErrorHandling(
    ProjectController.withoutErrCreateProject
  );
  static updateProject = withErrorHandling(
    ProjectController.withoutErrUpdateProject,
    [],
    ["projectId"]
  );
  static deleteProject = withErrorHandling(
    ProjectController.withoutErrDeleteProject,
    [],
    ["projectId"]
  );
}

export default ProjectController;
