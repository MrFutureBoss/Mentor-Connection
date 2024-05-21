import express from "express";
import adminstrationController from "../../controllers/adminstrationController/index.js";
import { verifyAccessToken } from "../../utilities/jwt.js";

const adminsRouter = express.Router();

adminsRouter.get("/users", adminstrationController.getUsers);
adminsRouter.post(
  "/insert-list-users",
  adminstrationController.insertListUsers
);
adminsRouter.delete(
  "/:userId/user",
  verifyAccessToken,
  adminstrationController.deleteUserById
);

export default adminsRouter;
