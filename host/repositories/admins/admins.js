import Category from "../../models/categoryModel.js";
import Class from "../../models/classModel.js";
import Group from "../../models/groupModel.js";
import User from "../../models/userModel.js";
// import UserType from "../../models/userTypeModel.js";

const getUsers = async ({ item, order, skip, limit, role, search }) => {
  try {
    let query = {};
    if (search && search.length > 0) {
      query.email = { $regex: new RegExp(search, "i") };
    }
    if (role && role > 0) {
      query.role = role;
    }
    const listUsers = await User.find(query, "-password")
      .sort({ [item]: order })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await User.countDocuments(query).exec();
    return { data: listUsers, total, skip, limit };
  } catch (e) {
    throw new Error(e.message.toString());
  }
};
const createListUsers = async (listData) => {
  try {
    const user = await User.insertMany(listData);
    return user._doc;
  } catch (e) {
    throw new Error(e.message.toString());
  }
};
const deleteUserById = async (userId) => {
  try {
    const result = await User.findByIdAndDelete(userId);
    if (result) return "Xóa thành công";
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  getUsers,
  createListUsers,
  deleteUserById,
};
