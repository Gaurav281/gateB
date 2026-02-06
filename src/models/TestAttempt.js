import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOption: String,
      },
    ],

    score: Number,
    totalMarks: Number,
    percentage: Number,

    startedAt: Date,
    submittedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("TestAttempt", testAttemptSchema);
