import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    questionText: {
      type: String,
      required: true,
    },

    options: {
      A: String,
      B: String,
      C: String,
      D: String,
    },

    correctOption: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    marks: {
      type: Number,
      default: 1,
    },

    negativeMarks: {
      type: Number,
      default: 0.33,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);