import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    googleId: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    purchasedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
