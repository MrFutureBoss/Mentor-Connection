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
projectRouter.get(
  "/planning-projects/:teacherId",
  verifyAccessToken,
  projectController.getPlanningProjectsForTeacher
);
projectRouter.put(
  "/approve/:projectId",
  verifyAccessToken,
  projectController.approveProject
);
projectRouter.put(
  "/decline/:projectId",
  verifyAccessToken,
  projectController.declineProject
);

export default projectRouter;
