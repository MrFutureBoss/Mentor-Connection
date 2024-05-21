import express from "express";
import categoryController from "../../controllers/categoryController/index.js";

const catergoryRouter = express.Router();

catergoryRouter.get("/", categoryController.getAllCategories);
catergoryRouter.post("/", categoryController.addNewCategory);
catergoryRouter.patch("/:id", categoryController.updateCategory);
catergoryRouter.delete("/:id", categoryController.deleteCategory);
export default catergoryRouter;
