import Category from "../../models/categoryModel.js";

const getAllCategories = async (status, skip, limit, search) => {
  try {
    let query = {};
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };
    const result = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await Category.countDocuments({});
    return { data: result, total };
  } catch (error) {
    throw new Error(error);
  }
};

const updateCategory = async (id, values) => {
  try {
    return await Category.findByIdAndUpdate(id, values).exec();
  } catch (error) {
    throw new Error(error);
  }
};
const addNewCategory = async (name) => {
  try {
    return await Category.create({ name });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCategory = async (id) => {
  try {
    return await Category.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};
export default {
  getAllCategories,
  updateCategory,
  addNewCategory,
  deleteCategory,
};
