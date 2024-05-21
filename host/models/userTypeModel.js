import mongoose, { Schema } from "mongoose";

const userType = new Schema(
  {
    name: { type: String, required: [true, "Class name không được để trống"] },
    role: { type: Number, required: true },
    status: {type: String},
  },
  {
    timestamps: true,
  }
);
const UserType = mongoose.model("UserType", userType);
export default UserType;
