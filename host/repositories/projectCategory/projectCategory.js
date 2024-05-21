// Trong file projectCategoryRepository.js

import ProjectCategory from "../../models/projectCategory.js";

const createProjectCategory = async (values) => {
  try {
    const projectCategory = await ProjectCategory.create(values);
    return projectCategory;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProjectCategorybyId = async (id) => {
  try {
    return await ProjectCategory.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllProjectCategorybyId = async (projectId) => {
  try {
    return await ProjectCategory.find({ projectId: projectId });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProjectCategories = async (projectId, categoryIds) => {
  try {
    await deleteByProjectId(projectId);
    const projectCategories = await Promise.all(
      categoryIds.map((categoryId) => create({ categoryId, projectId }))
    );
    return projectCategories;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createProjectCategory,
  deleteProjectCategorybyId,
  updateProjectCategories,
  getAllProjectCategorybyId,
};
