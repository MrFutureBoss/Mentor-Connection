import mongoose from "mongoose";
import Matched from "../../models/matchedModel.js";

const getMentorGroups = async (mentorId) => {
  try {
    const result = await Matched.aggregate([
      { $match: { mentorId: new mongoose.Types.ObjectId(mentorId) } },
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDetails",
        },
      },
      { $unwind: "$groupDetails" },
      {
        $lookup: {
          from: "projects",
          localField: "groupDetails.projectId",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
      { $unwind: "$projectDetails" },
      {
        $lookup: {
          from: "projectcategories",
          localField: "projectDetails._id",
          foreignField: "projectId",
          as: "projectCategories",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "projectCategories.categoryId",
          foreignField: "_id",
          pipeline: [{ $project: { name: 1 } }],
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $lookup: {
          from: "users",
          localField: "groupDetails._id",
          foreignField: "groupId",
          as: "groupMembers",
        },
      },
      { $unwind: { path: "$groupMembers", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$groupDetails._id",
          groupName: { $first: "$groupDetails.name" },
          projectName: { $first: "$projectDetails.name" },
          projectCategories: { $addToSet: "$categoryDetails.name" },
          membersCount: { $push: "$groupMembers.name" },
          members: {
            $addToSet: {
              name: "$groupMembers.username",
              email: "$groupMembers.email",
              avatar: "$groupMembers.image",
              isLeader: "$groupMembers.isLeader",
              rollNumber: "$groupMembers.rollNumber",
            },
          },
          matchedId: { $first: "$_id" },
          status: { $first: "$status" },
          time: { $push: "$time" }, // Add the 'time' field here
        },
      },
      {
        $project: {
          groupName: 1,
          projectName: 1,
          projectCategories: 1,
          members: 1,
          memberCount: { $size: "$members" },
          status: 1,
          matchedId: 1,
          time: 1, // Include 'time' in the project stage to output it
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Error fetching mentor groups with aggregation:", error);
    throw error;
  }
};

export default { getMentorGroups };
