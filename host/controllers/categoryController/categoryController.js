import categoryDAO from "../../repositories/catergory/index.js";

const getAllCategories = async (req, res, next) => {
  try {
    const { status, skip, limit, search } = req.query;
    res.send(
      await categoryDAO.getAllCategories(
        status,
        Number.parseInt(skip || 0),
        Number.parseInt(limit || 0),
        search
      )
    );
  } catch (error) {
    next(error);
  }
};

const addNewCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    res.send(await categoryDAO.addNewCategory(name));
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { status, name } = req.body;
    const { id } = req.params;
    res.send(await categoryDAO.updateCategory(id, { status, name }));
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.send(await categoryDAO.deleteCategory(id));
  } catch (error) {
    next(error);
  }
};
export default {
  getAllCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
};
