import matched from "../../repositories/matched/index.js";

const addMatched = async (req, res, next) => {
  try {
    const { groupId, mentorId, status, time } = req.body;
    res.status(200).json(await matched.addMatched(groupId, mentorId, status, time));
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

    res.status(200).json({ message: "Matched group(s) updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the matched records: " + error.message,
    });
  }
};
const addTimeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newTime = req.body; // Assuming the new time data is sent in the request body
    const result = await matched.addTimeById(id, newTime);

    if (result) {
      res.status(200).json({ message: `New time added successfully for id ${id}.` });
    } else {
      res.status(404).json({ message: `Failed to add new time for id ${id}.` });
    }
  } catch (error) {
    next(error);
  }
};

const deleteTimeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const eventId = req.params.eventId; // Assuming eventId is passed in the URL params
    const result = await matched.deleteTimeById(id, eventId);

    if (result) {
      res.status(200).json({ message: `Event with ID ${eventId} deleted successfully.` });
    } else {
      res.status(404).json({ message: `Event with ID ${eventId} not found or already deleted.` });
    }
  } catch (error) {
    next(error);
  }
};

const getMatchedById = async (req, res, next) => {
  try {
    const matchedId = req.params.id;
    const result = await matched.getMatchedById(matchedId);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const getAllTimeByMentorIdController = async (req, res, next) => {
  try {
    const mentorId = req.params.mentorId;
    const result = await matched.getAllTimeByMentorId(mentorId);
    res.send(result);
  } catch (error) {
    next(error);
  }
};


export default {
  addMatched,
  addAllMatching,
  getMatchedGroups,
  deleteMatchedGroup,
  updateMatchedGroup,
  addTimeById,
  deleteTimeById,
  getMatchedById,
  getAllTimeByMentorIdController,
};
