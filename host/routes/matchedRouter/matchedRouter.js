import express from "express";
import matchedController from "../../controllers/matchedController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const matchedRouter = express.Router();

matchedRouter.post("/", verifyAccessToken, matchedController.addMatched);
matchedRouter.get(
  "/:teacherId/teacher",
  verifyAccessToken,
  matchedController.addAllMatching
);
matchedRouter.get(
  "/groups_matched",
  verifyAccessToken,
  matchedController.getMatchedGroups
);
matchedRouter.delete(
  "/:groupId",
  verifyAccessToken,
  matchedController.deleteMatchedGroup
);
matchedRouter.patch(
  "/:groupId",
  verifyAccessToken,
  matchedController.updateMatchedGroup
);
matchedRouter.post("/:id", matchedController.addTimeById);
matchedRouter.delete("/:id/:eventId", matchedController.deleteTimeById);
matchedRouter.get(
  "/:id",
  matchedController.getMatchedById
);
matchedRouter.get("/mentor/:mentorId", matchedController.getAllTimeByMentorIdController)


export default matchedRouter;
