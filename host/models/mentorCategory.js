import mongoose, { Schema } from "mongoose";

const mentorCatergorySchema = new Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Category",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);
const MentorCategory = mongoose.model("MentorCategory", mentorCatergorySchema);
export default MentorCategory;
