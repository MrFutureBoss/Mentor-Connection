import Group from "../../models/groupModel.js";
import Project from "../../models/projectModel.js";
import mongoose from "mongoose";

const createProject = async (projectData) => {
  try {
    const project = await Project.create(projectData);
    return project;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateProject = async (id, project) => {
  try {
    const result = await Project.findByIdAndUpdate(id, project);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getProjectById = async (id) => {
  try {
    const project = await Project.findOne({ _id: id }).exec();
    return project;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getPlanningProjectsForTeacher = async (teacherId) => {
  return await Group.aggregate([
    {
      $lookup: {
        from: "classes",
        localField: "classId",
        foreignField: "_id",
        as: "classInfo",
      },
    },
    {
      $unwind: "$classInfo",
    },
    {
      $match: {
        "classInfo.teacherId": new mongoose.Types.ObjectId(teacherId),
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
      $unwind: "$projectInfo",
    },
    {
      $match: {
        "projectInfo.status": "Planning",
      },
    },
    {
      $lookup: {
        from: "projectcategories",
        localField: "projectInfo._id",
        foreignField: "projectId",
        as: "projectCategories",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "projectCategories.categoryId",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $project: {
        _id: 0,
        groupId: "$_id",
        groupName: "$name",
        projectId: "$projectInfo._id",
        projectName: "$projectInfo.name",
        categories: "$categoryInfo.name",
      },
    },
  ]);
};

const getChangingProjectsForTeacher = async (teacherId) => {
  return await Group.aggregate([
    {
      $lookup: {
        from: "classes",
        localField: "classId",
        foreignField: "_id",
        as: "classInfo",
      },
    },
    {
      $unwind: "$classInfo",
    },
    {
      $match: {
        "classInfo.teacherId": new mongoose.Types.ObjectId(teacherId),
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
      $unwind: "$projectInfo",
    },
    {
      $match: {
        "projectInfo.status": "Changing",
      },
    },
    {
      $lookup: {
        from: "projectcategories",
        localField: "projectInfo._id",
        foreignField: "projectId",
        as: "projectCategories",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "projectCategories.categoryId",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $project: {
        _id: 0,
        groupId: "$_id",
        groupName: "$name",
        projectId: "$projectInfo._id",
        projectName: "$projectInfo.name",
        categories: "$categoryInfo.name",
      },
    },
  ]);
};
const updateProjectStatusPlanning = async (projectId, newStatus) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(projectId),
        status: "Planning",
      },
      { $set: { status: newStatus } },
      { new: true }
    );
    return updatedProject;
  } catch (error) {
    console.error("Error in updateProjectStatus:", error);
    throw new Error("Error updating project status");
  }
};

const updateProjectStatusChanging = async (projectId, newStatus) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(projectId),
        status: "Changing",
      },
      { $set: { status: newStatus } },
      { new: true }
    );
    return updatedProject;
  } catch (error) {
    console.error("Error in updateProjectStatus:", error);
    throw new Error("Error updating project status");
  }
};
const updateProjectDeclineMessage = async (projectId, declineMessage) => {
  return Project.findByIdAndUpdate(
    projectId,
    { declineMessage },
    { new: true }
  );
};

export default {
  createProject,
  getProjectById,
  updateProject,
  getPlanningProjectsForTeacher,
  updateProjectStatusPlanning,
  getChangingProjectsForTeacher,
  updateProjectStatusChanging,
  updateProjectDeclineMessage,
};
