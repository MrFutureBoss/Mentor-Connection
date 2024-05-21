import mongoose from "mongoose";
import SemesterDetail from "../../models/SemesterDetail.js";

const getSmtDetailsBySmtId = async (smtId) => {
  try {
    return await SemesterDetail.find({ semesterId: smtId }).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};

const addSmtDetails = async (listSmtDet) => {
  try {
    return await SemesterDetail.insertMany(listSmtDet);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserInSemester = async (smtId, role, skip) => {
  try {
    const pipline = [
      { $match: { semesterId: new mongoose.Types.ObjectId(smtId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "userId._id",
          foreignField: "teacherId",
          as: "classes",
        },
      },
      {
        $addFields: {
          user: "$userId",
        },
      },
      {
        $addFields: {
          ["user.classCount"]: { $size: "$classes" },
        },
      },
      { $project: { userId: 0, classes: 0 } },
      { $unwind: "$user" },
      { $match: { "user.role": role } },
      {
        $lookup: {
          from: "mentorcategories",
          localField: "user._id",
          foreignField: "userId",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories.categoryId",
          foreignField: "_id",
          as: "user.categories",
        },
      },
      { $project: { userId: 0, categories: 0 } },
    ];
    const result = await SemesterDetail.aggregate(pipline).skip(skip).limit(10);
    const total = await SemesterDetail.aggregate(pipline);
    return { data: result, total: total.length };
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteDmtDetById = async (id) => {
  try {
    const result = await SemesterDetail.findByIdAndDelete({ _id: id });
    if (result) return "Xóa thành công";
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  getSmtDetailsBySmtId,
  addSmtDetails,
  getUserInSemester,
  deleteDmtDetById,
};
