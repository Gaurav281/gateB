import TestSeriesPack from "../models/TestSeriesPack.js";


/* CREATE PACK */
export const createTestSeriesPack = async (req, res) => {
  try {
    const { title, description, price, discountPercent, previewImage } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({
        message: "Title, description and price are required",
      });
    }

    const pack = await TestSeriesPack.create({
      title,
      description,
      price,
      discountPercent: discountPercent || 0,
      previewImage,
    });

    res.status(201).json(pack);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL PACKS */
export const getAllTestSeriesPacks = async (req, res) => {
  const packs = await TestSeriesPack.find().sort({ createdAt: -1 });
  res.status(200).json(packs);
};

