import MentorCategory from "../../models/mentorCategory.js";

const addNewMentorCategory = async ({ userId, categoryId }) => {
  try {
    const listMentorcat = await MentorCategory.find({ userId: userId });
    const check = listMentorcat.find((c) => c.categoryId === categoryId);
    if (check) return;
    return await MentorCategory.create({ userId, categoryId });
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllMentorCategory = async (userId) => {
  try {
    const result = await MentorCategory.find({ userId: userId }).exec();
    return { data: result };
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteMentorCategory = async (id) => {
  try {
    await MentorCategory.deleteOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  addNewMentorCategory,
  getAllMentorCategory,
  deleteMentorCategory,
};
