import mentorCategory from "../../repositories/metorCategory/index.js";

const addNewMentorCategory = async (req, res, next) => {
  try {
    const { userId, categoryId } = req.body;
    res.send(await mentorCategory.addNewMentorCategory({ userId, categoryId }));
  } catch (error) {
    next(error);
  }
};
const getAllMentorCategory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    res.send(await mentorCategory.getAllMentorCategory(userId));
  } catch (error) {
    next(error);
  }
};
const deleteMentorCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.send(await mentorCategory.deleteMentorCategory(id));
  } catch (error) {
    next(error);
  }
};

export default {
  addNewMentorCategory,
  getAllMentorCategory,
  deleteMentorCategory,
};
