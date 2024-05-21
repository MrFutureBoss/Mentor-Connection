import Semester from "../../models/semesterModel.js";

const createNewSemester = async (name) => {
  try {
    return await Semester.create({ name });
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteSemester = async (id) => {
  try {
    return await Semester.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllSemesters = async () => {
  try {
    const result = await Semester.find({}).sort({ createdAt: -1 }).exec();
    return { data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getSemestersUpcoming = async () => {
  try {
    const result = await Semester.find({ status: "Upcoming" })
      .sort({ createdAt: -1 })
      .exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateSemester = async (id, values) => {
  try {
    return await Semester.findByIdAndUpdate(id, values).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};
const getSemesterById = async (id) => {
  try {
    return await Semester.find({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createNewSemester,
  deleteSemester,
  getAllSemesters,
  updateSemester,
  getSemesterById,
  getSemestersUpcoming,
};
