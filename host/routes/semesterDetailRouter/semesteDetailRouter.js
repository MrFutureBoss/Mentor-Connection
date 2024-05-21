import semesterDetailController from "../../controllers/semesterDetailController/index.js";
import express from "express";
import { verifyAccessToken } from "../../utilities/jwt.js";

const smtDetRouter = express.Router();

smtDetRouter.get(
  "/:smtId/semester",
  verifyAccessToken,
  semesterDetailController.getSmtDetBySmtId
);
smtDetRouter.post(
  "/:smtId/semester",
  verifyAccessToken,
  semesterDetailController.addSmtDet
);
smtDetRouter.get(
  "/:smtId/semester/:role/users",
  verifyAccessToken,
  semesterDetailController.getUserInSemester
);
smtDetRouter.delete(
  "/:id",
  verifyAccessToken,
  semesterDetailController.deleteDmtDetById
);

export default smtDetRouter;
