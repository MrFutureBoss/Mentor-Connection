import matched from "../../repositories/matched/index.js";

const addMatched = async (req, res, next) => {
  try {
    const { groupId, mentorId } = req.body;
    res.status(200).json(await matched.addMatched(groupId, mentorId));
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const addAllMatching = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    res.status(200).json(await matched.addAllMatching(teacherId));
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getMatchedGroups = async (req, res) => {
  try {
    const matchedGroups = await matched.getMatchedGroupsWithDetails();
    res.status(200).json(matchedGroups);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Server error occurred while fetching matched groups.");
  }
};
const deleteMatchedGroup = async (req, res) => {
  try {
    const { matchedId } = req.params;
    const matcheds = await matched.deleteMatchedById(matchedId);

    if (!matcheds) {
      return res
        .status(404)
        .json({ message: "No matched record found with that ID" });
    }

    res.status(200).json({ message: "Matched group deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the matched record: " + error.message,
    });
  }
};
export default {
  addMatched,
  addAllMatching,
  getMatchedGroups,
  deleteMatchedGroup,
};
