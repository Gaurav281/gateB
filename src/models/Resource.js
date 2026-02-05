import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    previewImage: {
      type: String,
      default: "https://via.placeholder.com/400x250",
    },

    driveFileId: { type: String, required: true },

    type: {
      type: String,
      enum: ["pdf", "test-series"],
      default: "pdf",
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* 🔥 Virtual final price */
resourceSchema.virtual("finalPrice").get(function () {
  const discount = (this.price * this.discountPercent) / 100;
  return Math.round(this.price - discount);
});

resourceSchema.set("toJSON", { virtuals: true });
resourceSchema.set("toObject", { virtuals: true });

export default mongoose.model("Resource", resourceSchema);
