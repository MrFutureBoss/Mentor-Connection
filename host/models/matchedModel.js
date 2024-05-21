import mongoose, { Schema } from "mongoose";

const MatchedSchema = new Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);
const Matched = mongoose.model("Matched", MatchedSchema);
export default Matched;
