import User from "../../models/userModel.js";
import groupDAO from "../../repositories/group/index.js";
import projectDAO from "../../repositories/project/project.js";
import userDAO from "../../repositories/user/index.js";

const getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.send(await groupDAO.getGroupById(id));
  } catch (error) {
    next(error);
  }
};

const getGroupsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const groups = await groupDAO.getGroupsByClassId(classId);
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkGroupsExistController = async (req, res) => {
  const classId = req.params.classId;
  try {
    const groupsExist = await groupDAO.checkGroupsExist(classId);
    res.status(200).json({ exists: groupsExist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createRandomGroups = async (req, res) => {
  const { classId, numberOfGroups } = req.body;
  try {
    let users = await User.find({ classId }).exec();

    if (numberOfGroups > users.length) {
      return res
        .status(400)
        .json({ error: "Số nhóm không được lớn hơn số học sinh trong lớp" });
    }

    users = users.sort(() => 0.5 - Math.random());
    const baseGroupSize = Math.floor(users.length / numberOfGroups);
    const numLargerGroups = users.length % numberOfGroups;
    const groups = [];

    for (let i = 0, userIndex = 0; i < numberOfGroups; i++) {
      const project = await groupDAO.createEmptyProject(i + 1);
      const groupSize = i < numLargerGroups ? baseGroupSize + 1 : baseGroupSize;
      const group = await groupDAO.createGroup({
        name: `Nhóm ${i + 1}`,
        classId,
        projectId: project._id,
      });

      const members = users.slice(userIndex, userIndex + groupSize);
      userIndex += groupSize;

      for (let j = 0; j < members.length; j++) {
        const member = members[j];
        const isLeader = j === 0;
        await groupDAO.addUserToGroup(member._id, group._id, isLeader);
      }

      groups.push(group);
    }

    res.status(201).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createGroupsFromExcel = async (req, res, next) => {
  try {
    const { id: classId } = req.params;
    const { listStudent } = req.body;
    const groupsExist = await groupDAO.getGroupsByClassId(classId);
    if (groupsExist.length > 0) return;
    listStudent?.sort((a, b) => a.GroupNo - b.GroupNo);
    const groupedStudents = {};
    let project;
    let group;
    listStudent.forEach((student) => {
      const { GroupNo } = student;
      if (!groupedStudents[GroupNo]) {
        groupedStudents[GroupNo] = [];
      }
      groupedStudents[GroupNo].push(student);
    });
    for (const groupNo in groupedStudents) {
      if (Object.hasOwn(groupedStudents, groupNo)) {
        const element = groupedStudents[groupNo];
        const user = await userDAO.findUser({
          status: "Active",
          email: element[0]?.Email,
        });
        if (!user) break;
        group = await groupDAO.createGroup({
          classId: classId,
          name: "Nhóm " + groupNo,
        });
        if (group && element.length > 0) {
          project = await projectDAO.createProject({
            name: element[0].ProjectName,
          });
          if (project) {
            groupDAO.updateGroup(group?._id, { projectId: project?._id });
            for (const user of element) {
              await userDAO.updateUser(
                {
                  status: "Active",
                  email: user?.Email,
                },
                {
                  groupId: group?._id,
                  isLeader: user?.Leader === 1,
                }
              );
            }
          }
        }
      }
    }
    res.send("success");
  } catch (error) {
    next(error);
  }
};
const countGroupGetMatched = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const result = await groupDAO.countGroupGetMatched(teacherId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
const getAllTemMatching = async (req, res, next) => {
  try {
    const { gid } = req.params;
    const { search, skip, limit } = req.query;
    res.send(
      await groupDAO.getAllTempMatchingByGId(gid, {
        search,
        skip: Number.parseInt(skip) || 0,
        limit: Number.parseInt(limit) || 10,
      })
    );
  } catch (error) {
    next(error);
  }
};
export default {
  getGroupById,
  getGroupsByClass,
  createRandomGroups,
  createGroupsFromExcel,
  checkGroupsExistController,
  countGroupGetMatched,
  getAllTemMatching,
};
