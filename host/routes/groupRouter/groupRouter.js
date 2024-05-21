import express from "express";
import groupController from "../../controllers/groupController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const groupRouter = express.Router();
groupRouter.get("/:id", verifyAccessToken, groupController.getGroupById);
groupRouter.get(
  "/:classId/groups",
  verifyAccessToken,
  groupController.getGroupsByClass
);
groupRouter.get(
  "/:teacherId/teacher",
  verifyAccessToken,
  groupController.countGroupGetMatched
);
groupRouter.post(
  "/createRandom",
  verifyAccessToken,
  groupController.createRandomGroups
);
groupRouter.post(
  "/:id/class/create_groups_from_file",
  verifyAccessToken,
  groupController.createGroupsFromExcel
);
groupRouter.get(
  "/checkGroupsExist/:classId",
  verifyAccessToken,
  groupController.checkGroupsExistController
);
groupRouter.post(
  "/:id/teacher",
  verifyAccessToken,
  groupController.createGroupsFromExcel
);
groupRouter.get(
  "/:gid/group",
  verifyAccessToken,
  groupController.getAllTemMatching
);
export default groupRouter;
