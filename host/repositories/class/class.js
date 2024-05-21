import Class from "../../models/classModel.js";
import User from "../../models/userModel.js";
import shuffleArray from "../../utilities/shuffleArray.js";

const createNewListClass = async ({
  suffName,
  preName,
  quantity,
  limitStudent,
}) => {
  try {
    const listExistWithPreName = await Class.countDocuments({
      preName: preName,
    }).exec();
    const data = [];
    for (let index = 1; index <= quantity; index++) {
      data.push({
        suffName,
        preName,
        code: index + listExistWithPreName,
        limitStudent,
      });
    }
    const result = await Class.create(data);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getClasses = async ({ item, order, limit, skip, search }) => {
  try {
    let query = {};
    if (search && search.length > 0) {
      query["className"] = { $regex: search, $options: "i" };
    }
    const result = await Class.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "classId",
          as: "users",
        },
      },
      {
        $addFields: {
          userCount: { $size: "$users" },
          teacher: "$teacher",
        },
      },
      {
        $project: {
          teacherId: 0,
          users: 0,
        },
      },
      {
        $match: query,
      },
      { $unwind: "$teacher" },
      {
        $lookup: {
          from: "semesterdetails",
          localField: "teacher._id",
          foreignField: "userId",
          as: "semesterdetails",
        },
      },
      {
        $lookup: {
          from: "semesters",
          localField: "semesterdetails.semesterId",
          foreignField: "_id",
          as: "semester",
        },
      },
      {
        $project: {
          semesterdetails: 0,
        },
      },
    ])
      .sort({ [item]: order })
      .skip(skip)
      .limit(limit);
    const total = await Class.countDocuments(query).exec();
    return { data: result, total };
  } catch (error) {
    throw new Error(error.message);
  }
};
const createNewClass = async (data) => {
  try {
    const result = await Class.insertMany(data);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const addStudentInClasses = async (role, status) => {
  try {
    const users = await User.find({
      $or: [{ classId: { $exists: false } }, { classId: { $eq: null } }],
      role: role,
      status: status,
    });
    const classes = await Class.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "classId",
          as: "students",
        },
      },
      {
        $addFields: {
          students: { $size: "$students" },
        },
      },
      {
        $match: {
          $expr: { $lt: ["$students", "$limitStudent"] },
        },
      },
    ]);
    for (const cls of classes) {
      const { _id: classId, limitStudent, students } = cls;
      for (let i = 0; i < limitStudent - students; i++) {
        if (users.length === 0) {
          break;
        }
        const user = users.shift();
        await User.updateOne({ _id: user._id }, { $set: { classId: classId } });
      }

      if (users.length === 0) {
        break;
      }
    }
    return "Thêm thành công";
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteClass = async (id) => {
  try {
    await Class.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};
const getClass = async (id) => {
  try {
    return await Class.find({ _id: id }).populate("teacherId");
  } catch (error) {
    throw new Error(error.message);
  }
};
const getStudentsInClass = async (classId) => {
  try {
    let students = await User.find({ classId: classId })
      .populate({
        path: "groupId",
        model: "Group",
        select: "name",
      })
      .exec();

    students.sort((a, b) => {
      let groupA = a.groupId
        ? parseInt(a.groupId.name.replace("Nhóm ", ""))
        : Infinity;
      let groupB = b.groupId
        ? parseInt(b.groupId.name.replace("Nhóm ", ""))
        : Infinity;
      return groupA - groupB;
    });
    return students.map((student) => ({
      ...student.toObject(),
      groupName: student.groupId ? student.groupId.name : "Chưa có nhóm",
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

const findClassById = async (classId) => {
  try {
    const result = await Class.findOne({ _id: classId });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getClassesByUserId = async (userId) => {
  try {
    return await Class.find({ teacherId: userId });
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateClassStatus = async (teacherId, status) => {
  try {
    return await Class.updateMany(
      { teacherId: { $in: teacherId } },
      { $set: { status } }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  createNewListClass,
  getClasses,
  getStudentsInClass,
  findClassById,
  getClassesByUserId,
  getClass,
  deleteClass,
  addStudentInClasses,
  createNewClass,
  updateClassStatus,
};
