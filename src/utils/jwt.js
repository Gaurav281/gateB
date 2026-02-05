import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/* Generate JWT */
export const generateJWT = (payload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "7d",
  });
};

/* Verify JWT */
export const verifyJWT = (token) => {
  return jwt.verify(token, env.jwtSecret);
};
