import express from "express";
import userController from "../../controllers/userController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const user = express.Router();

user.get("/profile", verifyAccessToken, userController.userProfile);
user.get("/:userId/profile", userController.getUserProfileById);

user.get(
  "/without_semester",
  verifyAccessToken,
  userController.getUserWithoutSmt
);
user.get("/:smtId/semester", verifyAccessToken, userController.getUserBySmtId);
user.get("/parameter", verifyAccessToken, userController.pmtUser);
user.patch(
  "/profile/update",
  verifyAccessToken,
  userController.userUpdateProfile
);
user.post("/login", userController.getUserLogin);
user.post("/register", userController.addNewUser);
user.post("/change_password", verifyAccessToken, userController.changePassword);

export default user;
