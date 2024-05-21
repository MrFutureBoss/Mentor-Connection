import express from "express";
import mentorCategoryController from "../../controllers/mentorCategoryController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const mentorCategoriesRouter = express.Router();

mentorCategoriesRouter.post(
  "/add_new",
  verifyAccessToken,
  mentorCategoryController.addNewMentorCategory
);
mentorCategoriesRouter.get(
  "/:userId",
  verifyAccessToken,
  mentorCategoryController.getAllMentorCategory
);
mentorCategoriesRouter.delete(
  "/delete/:id",
  verifyAccessToken,
  mentorCategoryController.deleteMentorCategory
);

export default mentorCategoriesRouter;
