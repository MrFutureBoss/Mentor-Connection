import express from "express";
import projectCategoryController from "../../controllers/projectCategoryController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const projectCategoryRouter = express.Router();

projectCategoryRouter.get(
  "/:pid",
  verifyAccessToken,
  projectCategoryController.getAllProjectCategorybyId
);
projectCategoryRouter.post(
  "/add_new",
  verifyAccessToken,
  projectCategoryController.createProjectCategory
);
projectCategoryRouter.delete(
  "/:id",
  verifyAccessToken,
  projectCategoryController.deleteProjectCategorybyId
);

export default projectCategoryRouter;
