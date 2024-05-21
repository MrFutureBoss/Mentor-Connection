import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, require: true },
    description: { type: String },
    status: { type: String },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    matchedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matched",
    },
  },
  {
    timestamps: true,
  }
);
const Group = mongoose.model("Group", groupSchema);
export default Group;
