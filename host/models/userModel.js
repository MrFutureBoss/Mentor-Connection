import mongoose, { Schema } from "mongoose";
import Classes from "./classModel.js";
import Group from "./groupModel.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Tên người dùng không được để trống"],
    },
    email: {
      type: String,
      required: [true, "Email không được để trống"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu không được để trống"],
      min: [6, "Mật khẩu phải dài hơn 6 chữ số"],
    },
    role: {
      type: Number,
      required: [true, "Role không được để trống"],
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Classes,
    },
    Dob: { type: Date },
    gender: { type: Boolean },
    phoneNumber: { type: String },
    image: { type: String },
    degree: { type: String },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Group,
    },
    menteeCount: { type: Number },
    isLeader: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Active", "InActive", "Disabled"],
      default: "InActive",
    },
    rollNumber: { type: String },
    memberCode: { type: String },
    slotType: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
