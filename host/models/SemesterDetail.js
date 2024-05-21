import mongoose, { Schema } from "mongoose";

const semesterDetailSchema = new Schema(
  {
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);
const SemesterDetail = mongoose.model("SemesterDetail", semesterDetailSchema);
export default SemesterDetail;
