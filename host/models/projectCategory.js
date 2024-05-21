import mongoose, { Schema } from "mongoose";

const projectCategorySchema = new Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const ProjectCategory = mongoose.model(
  "ProjectCategory",
  projectCategorySchema
);
export default ProjectCategory;
