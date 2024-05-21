import mongoose from "mongoose";
import Class from "../../models/classModel.js";
import User from "../../models/userModel.js";
import shuffleArray from "../../utilities/shuffleArray.js";
import Matched from "../../models/matchedModel.js";
import TemporaryMatching from "../../models/temporaryMatching.js";

const getClassByTeacherId = async (teacherId) => {
  try {
    const students = await Class.find({ teacherId: teacherId });
    return students;
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};
const getGroupsByTeacherId = async (teacherId, skip) => {
  try {
    const listGroups = await Class.aggregate([
      { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
      {
        $lookup: {
          from: "groups",
          localField: "_id",
          foreignField: "classId",
          as: "group",
        },
      },
      { $unwind: "$group" },
      {
        $lookup: {
          from: "projects",
          localField: "group.projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $lookup: {
          from: "projectcategories",
          localField: "project._id",
          foreignField: "projectId",
          as: "projectcategories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "projectcategories.categoryId",
          foreignField: "_id",
          as: "projectcategories",
        },
      },
      {
        $lookup: {
          from: "temporarymatchings",
          localField: "group._id",
          foreignField: "groupId",
          as: "matching",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "matching.mentorId",
          foreignField: "_id",
          as: "matching",
        },
      },
      {
        $lookup: {
          from: "matcheds",
          localField: "group._id",
          foreignField: "groupId",
          as: "matched",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "matched.mentorId",
          foreignField: "_id",
          as: "matched",
        },
      },
      {
        $lookup: {
          from: "mentorcategories",
          localField: "matching._id",
          foreignField: "userId",
          as: "matchingMentorcategories",
        },
      },
      {
        $lookup: {
          from: "mentorcategories",
          localField: "matched._id",
          foreignField: "userId",
          as: "matchedMentorcategories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "matchingMentorcategories.categoryId",
          foreignField: "_id",
          as: "matchingMentorcategories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "matchedMentorcategories.categoryId",
          foreignField: "_id",
          as: "matchedMentorcategories",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $project: { teacherId: 0 } },
      {
        $unwind: "$teacher",
      },
      {
        $lookup: {
          from: "users",
          localField: "group._id",
          foreignField: "groupId",
          as: "members",
        },
      },
      { $project: { teacherId: 0 } },
      {
        $unwind: "$teacher",
      },
      {
        $sort: { "group.name": 1 },
      },
    ])
      .skip(skip)
      .limit(24);
    const total = await Class.aggregate([
      { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
      {
        $lookup: {
          from: "groups",
          localField: "_id",
          foreignField: "classId",
          as: "group",
        },
      },
      { $unwind: "$group" },
    ]);
    return { data: listGroups, total: total.length };
  } catch (error) {
    throw new Error(error.message);
  }
};
const suggestMatching = async (teacherId) => {
  try {
    await TemporaryMatching.deleteMany({ teacherId: teacherId });
    const listGroups = await Class.aggregate([
      { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
      {
        $lookup: {
          from: "groups",
          localField: "_id",
          foreignField: "classId",
          as: "group",
        },
      },
      { $unwind: "$group" },
      {
        $lookup: {
          from: "projects",
          localField: "group.projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $lookup: {
          from: "projectcategories",
          localField: "project._id",
          foreignField: "projectId",
          as: "projectcategories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "projectcategories.categoryId",
          foreignField: "_id",
          as: "projectcategories",
        },
      },
    ]);
    const listMentors = await User.aggregate([
      { $match: { role: 3 } },
      {
        $lookup: {
          from: "mentorcategories",
          localField: "_id",
          foreignField: "userId",
          as: "mentorcategories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "mentorcategories.categoryId",
          foreignField: "_id",
          as: "mentorcategories",
        },
      },
      {
        $lookup: {
          from: "matcheds",
          localField: "_id",
          foreignField: "mentorId",
          as: "matcheds",
        },
      },
      {
        $addFields: {
          matcheds: { $size: "$matcheds" },
        },
      },
      {
        $match: {
          $expr: { $lt: ["$matcheds", "$menteeCount"] },
        },
      },
    ]);
    shuffleArray(listGroups);
    shuffleArray(listMentors);
    let temporaryMatching = [];
    for (const g of listGroups) {
      const { projectcategories, group, teacherId } = g;

      const groupMatched = await Matched.find({
        groupId: new mongoose.Types.ObjectId(group._id),
      });
      if (groupMatched.length === 0)
        for (const m of listMentors) {
          const { mentorcategories, menteeCount, _id: mid } = m;
          const countMatched = await Matched.countDocuments({
            mentorId: mid,
          });
          if (countMatched === menteeCount) break;
          const matching = projectcategories.filter((p) =>
            mentorcategories.some((m) => m._id.toString() === p._id.toString())
          );
          const count = temporaryMatching.filter(
            (m) => m.mentorId === mid
          ).length;
          if (matching.length > 0 && count < menteeCount - countMatched) {
            temporaryMatching.push({
              mentorId: mid,
              groupId: group._id,
              teacherId: teacherId,
            });
            break;
          }
        }
    }
    const result = await TemporaryMatching.insertMany(temporaryMatching);
    if (result) return "Đã thêm vào ghép tạm thời";
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  getClassByTeacherId,
  suggestMatching,
  getGroupsByTeacherId,
};
