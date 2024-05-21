import express from "express";
import teacherController from "../../controllers/teacherController/teacherController.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const teacherRouter = express.Router();

teacherRouter.get(
  "/:teacherId/suggest",
  verifyAccessToken,
  teacherController.suggestMatching
);
teacherRouter.get(
  "/inactive",
  verifyAccessToken,
  teacherController.getTeachers
);
teacherRouter.get(
  "/classes",
  verifyAccessToken,
  teacherController.getClassListByTeacher
);
teacherRouter.get(
  "/:teacherId/groups",
  verifyAccessToken,
  teacherController.getGroupsByTeacherId
);

export default teacherRouter;
