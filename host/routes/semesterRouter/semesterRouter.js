import express from "express";
import semesterController from "../../controllers/semesterController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const semesterRouter = express.Router();

semesterRouter.get("/", verifyAccessToken, semesterController.getAllSemesters);
semesterRouter.get(
  "/upcoming",
  verifyAccessToken,
  semesterController.getSemestersUpcoming
);
semesterRouter.post(
  "/",
  verifyAccessToken,
  semesterController.createNewSemester
);
semesterRouter.patch(
  "/:id",
  verifyAccessToken,
  semesterController.updateSemester
);
semesterRouter.delete(
  "/:id",
  verifyAccessToken,
  semesterController.deleteSemester
);

export default semesterRouter;
