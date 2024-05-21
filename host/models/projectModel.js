import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: false },
    description: { type: String, required: false },
    status: {
      type: String,
      status: {
        type: String,
        enum: ["Planning", "InProgress", "Finish", "Closed"],
        default: "Planning",
      },
    },
  },
  {
    timestamps: true,
  }
);
const Project = mongoose.model("Project", projectSchema);
export default Project;
