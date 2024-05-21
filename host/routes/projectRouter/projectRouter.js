import express from "express";
import projectController from "../../controllers/projectController/projectController.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const projectRouter = express.Router();

projectRouter.get("/:id", verifyAccessToken, projectController.getProjectById);
projectRouter.patch(
  "/:id/update_project",
  verifyAccessToken,
  projectController.updateProject
);
export default projectRouter;
