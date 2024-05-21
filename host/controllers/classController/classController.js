import classDAO from "../../repositories/class/index.js";
import userDAO from "../../repositories/user/index.js";

const createNewListClass = async (req, res) => {
  try {
    const { suffName, preName, quantity, limitStudent } = req.body;
    const result = await classDAO.createNewListClass({
      suffName: suffName.toUpperCase(),
      preName: preName.toUpperCase(),
      quantity,
      limitStudent,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createClass = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await classDAO.createNewClass(data);
    res.send(result);
  } catch (error) {
    next(error);
  }
};
const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    await classDAO.deleteClass(id);
    res.send("Delete class successfully");
  } catch (error) {
    next(error);
  }
};
const getClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await classDAO.getClass(id);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const getClasses = async (req, res, next) => {
  try {
    const { item, order, skip, search } = req.query;
    const result = await classDAO.getClasses({
      item,
      order: Number(order || 1),
      limit: Number(10),
      skip: Number(skip || 0),
      search: search,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addStudentInClass = async (req, res, next) => {
  try {
    const result = await classDAO.addStudentInClasses(4, "InActive");
    res.send(result);
  } catch (error) {
    next(error);
  }
};
const getStudentInClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const students = await classDAO.getStudentsInClass(classId);
    res.send(students);
  } catch (error) {
    next(error);
  }
};
const getClassById = async (req, res) => {
  const { classId } = req.params;
  try {
    const result = await classDAO.findClassById(classId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const getClassesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let user;
    let result = await classDAO.getClassesByUserId(userId);
    if (result.length === 0) {
      user = await userDAO.findUserById(userId);
      result = user?.classId;
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};
const exportExcel = async (req, res, next) => {};
export default {
  createNewListClass,
  getClasses,
  getStudentInClass,
  getClassById,
  getClassesByUserId,
  addStudentInClass,
  createClass,
  getClass,
  deleteClass,
  exportExcel,
};
