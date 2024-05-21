import express from "express";
import classController from "../../controllers/classController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const classRouter = express.Router();

classRouter.get("/", verifyAccessToken, classController.getClasses);
classRouter.get(
  "/add_student_in_class",
  verifyAccessToken,
  classController.addStudentInClass
);
classRouter.post(
  "/create_new_classes",
  verifyAccessToken,
  classController.createClass
);
classRouter.delete("/:id", classController.deleteClass);
classRouter.get(
  "/:userId/user",
  verifyAccessToken,
  classController.getClassesByUserId
);
classRouter.get(
  "/:classId/students",
  verifyAccessToken,
  classController.getStudentInClass
);
classRouter.get(
  "/student/:classId",
  verifyAccessToken,
  classController.getClassById
);
classRouter.get("/export", verifyAccessToken, classController.exportExcel);
classRouter.get("/:id", verifyAccessToken, classController.getClass);

export default classRouter;
