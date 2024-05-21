import mentorDAO from "../../repositories/mentor/index.js";

const getMentorGroups = async (req, res) => {
  try {
    const userId = req.payload._id;
    const groups = await mentorDAO.getMentorGroups(userId);
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getMentorGroups,
};
