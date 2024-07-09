import userDAO from "../../repositories/user/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotnv from "dotenv";
dotnv.config();

const addNewUser = async (req, res, next) => {
  try {
    const { username, password, email, role } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await userDAO.createNewUser({
      username,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userDAO.loginUser({ email, password });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const userProfile = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");
  const tokenString = token.split(" ")[1];
  try {
    const decoded = jwt.verify(tokenString, process.env.SECRETKEY);
    req.user = decoded;
    const result = await userDAO.findUserById(decoded._id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProfileById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userDAO.findUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userUpdateProfile = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");
  const tokenString = token.split(" ")[1];
  try {
    const user = req.body;
    const decoded = jwt.verify(tokenString, process.env.SECRETKEY);
    req.user = decoded;
    const { _id } = decoded;
    const result = await userDAO.userUpdateProfile(_id, user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserWithoutSmt = async (req, res, next) => {
  try {
    const { skip, role } = req.query;
    res.send(
      await userDAO.getUserWithoutSmt(
        Number.parseInt(skip),
        Number.parseInt(role)
      )
    );
  } catch (error) {
    next(error);
  }
};
// Thống kê người dùng theo năm
const pmtUser = async (req, res, next) => {
  try {
    res.send(await userDAO.pmtUser());
  } catch (error) {
    next(error);
  }
};
const getUserBySmtId = async (req, res, next) => {
  try {
    const { role } = req.query;
    const { smtId } = req.params;
    res.send(await userDAO.getUserBySmtId(smtId, Number(role)));
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res) => {
  const userId = req.payload._id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await userDAO.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await userDAO.comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ sai" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be longer than 6 characters" });
    }

    await userDAO.updateUserPassword(userId, newPassword);
    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateLeaderByTeacher = async (req, res) => {
  const { _id, isLeader } = req.body;
  try {
    const updatedUser = await userDAO.updateUserLeaderStatus(_id, isLeader);
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default {
  addNewUser,
  getUserLogin,
  userProfile,
  userUpdateProfile,
  getUserWithoutSmt,
  pmtUser,
  getUserBySmtId,
  changePassword,
  getUserProfileById,
  updateLeaderByTeacher,
};
