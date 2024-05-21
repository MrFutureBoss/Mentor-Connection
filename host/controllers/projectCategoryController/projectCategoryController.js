import projectCategoryDAO from "../../repositories/projectCategory/index.js";

const createProjectCategory = async (req, res) => {
  try {
    const { projectId, categoryId } = req.body;
    res.status(200).json(
      await projectCategoryDAO.createProjectCategory({
        projectId,
        categoryId,
      })
    );
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllProjectCategorybyId = async (req, res) => {
  try {
    const { pid } = req.params;
    res
      .status(200)
      .json(await projectCategoryDAO.getAllProjectCategorybyId(pid));
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteProjectCategorybyId = async (req, res) => {
  try {
    const { id } = req.params;
    res
      .status(200)
      .json(await projectCategoryDAO.deleteProjectCategorybyId(id));
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export default {
  createProjectCategory,
  getAllProjectCategorybyId,
  deleteProjectCategorybyId,
};
