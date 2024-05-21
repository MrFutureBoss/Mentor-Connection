import Group from "../../models/groupModel.js";
import TemporaryMatching from "../../models/temporaryMatching.js";
import mongoose from "mongoose";
import User from "../../models/userModel.js";
import shuffleArray from "../../utilities/shuffleArray.js";
import Matched from "../../models/matchedModel.js";

const getAllTempMatchingByGId = async (gId, { search, skip, limit }) => {
  try {
    let pipeline = [
      {
        $match: { groupId: new mongoose.Types.ObjectId(gId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "mentorId",
          foreignField: "_id",
          as: "mentorId",
        },
      },
    ];
    if (search && search.length > 0)
      pipeline.push({
        $match: { "mentorId.email": { $regex: search, $options: "i" } },
      });
    const result = await TemporaryMatching.aggregate(pipeline)
      .skip(skip)
      .limit(limit);
    const count = await TemporaryMatching.countDocuments({ groupId: gId });
    return { data: result, total: count };
  } catch (error) {
    throw new Error(error.message);
  }
};

const addTempMatchingByGid = async (gid) => {
  try {
    await TemporaryMatching.deleteMany({ groupId: gid });
    const groupMatchings = await Group.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(gid) } },
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "class",
        },
      },
      {
        $unwind: "$class",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
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
          as: "projectCategories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "projectCategories.categoryId",
          foreignField: "_id",
          as: "projectCategories",
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
    shuffleArray(listMentors);
    let temporaryMatching = [];
    const { projectCategories, class: classGr } = groupMatchings[0];

    const groupMatched = await Matched.find({
      groupId: new mongoose.Types.ObjectId(gid),
    });
    if (groupMatched.length === 0)
      for (const m of listMentors) {
        const { mentorcategories, menteeCount, _id: mid } = m;
        const countMatched = await Matched.countDocuments({
          mentorId: mid,
        });
        if (countMatched === menteeCount) break;
        const matching = projectCategories.filter((p) =>
          mentorcategories.some((m) => m._id.toString() === p._id.toString())
        );
        const count = temporaryMatching.filter(
          (m) => m.mentorId === mid
        ).length;
        if (matching.length > 0 && count < menteeCount - countMatched) {
          temporaryMatching.push({
            mentorId: mid,
            groupId: gid,
            teacherId: classGr?.teacherId,
          });
        }
      }
    return await TemporaryMatching.insertMany(temporaryMatching);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  getAllTempMatchingByGId,
  addTempMatchingByGid,
};
