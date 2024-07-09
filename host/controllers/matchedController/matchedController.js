import matched from "../../repositories/matched/index.js";

const addMatched = async (req, res, next) => {
  try {
    const { groupId, mentorId, status } = req.body;
    res.status(200).json(await matched.addMatched(groupId, mentorId, status));
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
    const { groupId } = req.params;
    const result = await matched.deleteMatchedByGroupId(groupId);

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No matched records found with that Group ID" });
    }

    res.status(200).json({ message: "Matched group(s) deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the matched records: " + error.message,
    });
  }
};
const updateMatchedGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const updateData = req.body;
    const result = await matched.updateMatchedByGroupId(groupId, updateData);

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "No matched records found with that Group ID" });
    }

    res.status(200).json({ message: "Matched group(s) updated successfully"});
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the matched records: " + error.message,
    });
  }
};


export default {
  addMatched,
  addAllMatching,
  getMatchedGroups,
  deleteMatchedGroup,
  updateMatchedGroup,
};
