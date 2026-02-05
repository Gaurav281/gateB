import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { firebaseAuth } from "../config/firebase.js";
import { env } from "../config/env.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: "7d",
  });
};

export const googleAuth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const firebaseToken = authHeader.split(" ")[1];

    const decodedToken = await firebaseAuth.verifyIdToken(firebaseToken);

    const { uid, email, name } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: uid,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        purchasedResources: user.purchasedResources,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const getMe = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    purchasedResources: user.purchasedResources,
  });
};
