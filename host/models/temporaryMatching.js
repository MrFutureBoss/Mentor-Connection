import mongoose, { Schema } from "mongoose";

const temporaryMatchingSchema = new Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Group",
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Class",
    },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);
const TemporaryMatching = mongoose.model(
  "TemporaryMatching",
  temporaryMatchingSchema
);
export default TemporaryMatching;
