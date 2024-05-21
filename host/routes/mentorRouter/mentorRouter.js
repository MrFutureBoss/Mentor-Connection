import express from "express";
import mentorController from "../../controllers/mentorController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const mentorRouter = express.Router();

mentorRouter.get(
  "/mentor_groups",
  verifyAccessToken,
  mentorController.getMentorGroups
);

export default mentorRouter;
