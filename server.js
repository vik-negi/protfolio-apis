// packages
import express, { urlencoded, json } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

// module
import path from "path";
import { config } from "dotenv";
import { connect } from "./util/db.js";
import User from "./resources/user/user_model.js";
import userRouter from "./resources/user/user_router.js";
import settingRouter from "./resources/settings/setting_router.js";
import authRouter from "./resources/auth/auth_routor.js";
import projectRouter from "./resources/projects/project_router.js";
import aboutRouter from "./resources/about/about_router.js";
import experienceRouter from "./resources/experiences/experiences_router.js";
import skillRouter from "./resources/skills/skills_router.js";
import fs from "fs";

config();
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;
export const userModel = (req, res, next) => {
  req.model = User;
  next();
};

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Routes
app.use("/auth", userModel, authRouter);
app.use("/api/settings", settingRouter);
app.use("/api/user", userModel, userRouter);
app.use("/api/user/public-info", userModel, userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/about", aboutRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/skills", skillRouter);

app.get("/", (req, res) => {
  res.json("Server is Running ");
});

const __dirname = path.resolve();

export const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      // if (SECRETS.node_env === "development") {
      //   expressListRoutes(app);
      // }
      console.log(`REST API on http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};
