import Group from "../../models/groupModel.js";
import Matched from "../../models/matchedModel.js";
import TemporaryMatching from "../../models/temporaryMatching.js";

const addMatched = async (groupId, mentorId, status, time) => {
  try {
    await TemporaryMatching.deleteOne({ groupId: groupId });
    return await Matched.create({ groupId: groupId, mentorId: mentorId, status: status, time: time });
  } catch (error) {
    throw new Error(error.message);
  }
};
const addAllMatching = async (teacherId) => {
  try {
    const listMatched = await TemporaryMatching.find({ teacherId: teacherId });
    await TemporaryMatching.deleteMany({ teacherId: teacherId });
    return await Matched.insertMany(listMatched);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMatchedGroupsWithDetails = async () => {
  return await Group.aggregate([
    {
      $lookup: {
        from: "matcheds",
        localField: "_id",
        foreignField: "groupId",
        as: "matched",
      },
    },
    {
      $match: { matched: { $ne: [] } },
    },
    {
      $lookup: {
        from: "classes",
        localField: "classId",
        foreignField: "_id",
        as: "classInfo",
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "projectInfo",
      },
    },
    {
      $lookup: {
        from: "projectcategories",
        localField: "projectId",
        foreignField: "projectId",
        as: "projectCategories",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "projectCategories.categoryId",
        foreignField: "_id",
        as: "projectCategoryInfo",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "matched.mentorId",
        foreignField: "_id",
        as: "mentorInfo",
      },
    },
    {
      $lookup: {
        from: "mentorcategories",
        localField: "matched.mentorId",
        foreignField: "userId",
        as: "mentorCategories",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "mentorCategories.categoryId",
        foreignField: "_id",
        as: "mentorCategoryInfo",
      },
    },
    { $unwind: "$classInfo" },
    { $unwind: "$projectInfo" },
    { $unwind: "$matched" },
    {
      $group: {
        _id: "$_id",
        matchedId: { $first: "$matched._id" },
        groupId: { $first: "$_id" },
        groupName: { $first: "$name" },
        className: { $first: "$classInfo.className" },
        projectName: { $first: "$projectInfo.name" },
        projectCategories: { $addToSet: "$projectCategoryInfo.name" },
        mentorId: { $first: "$mentorInfo._id" },
        mentorName: { $first: "$mentorInfo.username" },
        mentorEmail: { $first: "$mentorInfo.email" },
        mentorPhone: { $first: "$mentorInfo.phoneNumber" },
        mentorCategories: { $addToSet: "$mentorCategoryInfo.name" },
      },
    },
    {
      $project: {
        _id: 0,
        matchedId: 1,
        groupId: 1,
        groupName: 1,
        className: 1,
        projectName: 1,
        projectCategories: 1,
        mentorId: 1,
        mentorName: 1,
        mentorEmail: 1,
        mentorPhone: 1,
        mentorCategories: 1,
      },
    },
  ]);
};

const deleteMatchedByGroupId = async (groupId) => {
  try {
    const result = await Matched.deleteMany({ groupId: groupId });
    return result;
  } catch (error) {
    throw error;
  }
};

const updateMatchedByGroupId = async (groupId, updateData) => {
  try {
    const result = await Matched.updateMany({ groupId: groupId }, updateData, { new: true });
    return result;
  } catch (error) {
    throw error;
  }
};


const addTimeById = async (_id, newTime) => {
  try {
    const result = await Matched.updateOne(
      { _id: _id },
      { $push: { time: newTime } }
    ).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTimeById = async (_id, eventId) => {
  try {
    const result = await Matched.updateOne(
      { _id: _id },
      { $pull: { time: { _id: eventId } } }
    ).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getMatchedById = async (id) => {
  try {
    const result = await Matched.find({ _id: id }).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};



export default {
  addMatched,
  addAllMatching,
  deleteMatchedByGroupId,
  getMatchedGroupsWithDetails,
  updateMatchedByGroupId,
  addTimeById,
  deleteTimeById,
  getMatchedById,
};
