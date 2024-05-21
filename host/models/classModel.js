import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: { type: String },
    limitStudent: { type: Number, required: true },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: [
        "Active",
        "InActive",
        "Pending",
        "Completed",
        "Cancelled",
        "Suspended",
        "Scheduled",
      ],
      default: "InActive",
    },
  },
  { timestamps: true }
);

const Class = mongoose.model("Class", classSchema);

export default Class;
