import adminsDAO from "../../repositories/admins/index.js";
import bcrypt from "bcrypt";

const getUsers = async (req, res) => {
  try {
    const { item, order, skip, limit, role, search } = req.query;
    const result = await adminsDAO.getUsers({
      item,
      order: Number(order),
      skip: Number(skip),
      limit,
      role: Number(role),
      search,
    });
    res.send(result);
  } catch (error) {
    next(error);
  }
};
const deleteUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    res.send(await adminsDAO.deleteUserById(userId));
  } catch (error) {
    next(error);
  }
};
const insertListUsers = async (req, res, next) => {
  try {
    const saltRounds = 12;
    const { file } = req.body;
    const password = "Aa@123";
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newData = await Promise.all(
      file.map(async (user) => {
        return { ...user, password: hashedPassword };
      })
    );
    const result = await adminsDAO.createListUsers(newData);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  insertListUsers,
  deleteUserById,
};
