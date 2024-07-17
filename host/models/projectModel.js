import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: ["Planning", "InProgress", "Decline", "Changing"],
      default: "Planning",
    },
    declineMessage: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
const Project = mongoose.model("Project", projectSchema);
export default Project;
