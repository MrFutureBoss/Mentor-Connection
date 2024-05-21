import semesterDAO from "../../repositories/semester/index.js";
import userDAO from "../../repositories/user/index.js";
import semesterDetails from "../../repositories/semesterDetails/semesterDetails.js";
import classDAO from "../../repositories/class/index.js";

const getAllSemesters = async (req, res, next) => {
  try {
    res.status(200).json(await semesterDAO.getAllSemesters());
  } catch (error) {
    next(error);
  }
};
const getSemestersUpcoming = async (req, res, next) => {
  try {
    res.status(200).json(await semesterDAO.getSemestersUpcoming());
  } catch (error) {
    next(error);
  }
};
const createNewSemester = async (req, res) => {
  try {
    const { name } = req.body;
    res.status(200).json(await semesterDAO.createNewSemester(name));
  } catch (error) {
    next(error);
  }
};

const updateSemester = async (req, res, next) => {
  try {
    const { status, name } = req.body;
    const { id } = req.params;
    let listUsersId = [];
    let user;
    const listSmtDet = await semesterDetails.getSmtDetailsBySmtId(id);
    for (const smtDet of listSmtDet) {
      listUsersId.push(smtDet.userId);
      user = await userDAO.findUserById(smtDet?.userId);
      if (user?.role === 2)
        if (status === "Ongoing")
          await classDAO.updateClassStatus(user?._id, "Active");
        else await classDAO.updateClassStatus(user?._id, "InActive");
    }
    if (status === "Ongoing") {
      await userDAO.updateUsers(listUsersId, "Active");
    } else if (status === "Upcoming") {
      await userDAO.updateUsers(listUsersId, "InActive");
    } else {
      await userDAO.updateUsers(listUsersId, "Disabled");
    }
    res.send(await semesterDAO.updateSemester(id, { status, name }));
  } catch (error) {
    next(error);
  }
};
const deleteSemester = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json(await semesterDAO.deleteSemester(id));
  } catch (error) {
    next(error);
  }
};

export default {
  deleteSemester,
  updateSemester,
  createNewSemester,
  getAllSemesters,
  getSemestersUpcoming,
};
