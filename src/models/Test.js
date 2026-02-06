import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    pack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSeriesPack", // test-series-pack
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    durationMinutes: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
