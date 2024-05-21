import mongoose, { Schema } from "mongoose";

const semesterSchema = new Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["Ongoing", "Upcoming", "Finished", "Closed", "Cancelled"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);
const Semester = mongoose.model("Semester", semesterSchema);
export default Semester;
