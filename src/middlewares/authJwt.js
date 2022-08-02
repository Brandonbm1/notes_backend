import jwt from "jsonwebtoken";
import { configJwt } from "../../config.js";
import { pool } from "../../db.js";

export const unCodedUser = async (token) => {
  try {
    if (!token) return { message: "No token provider" };

    const decoded = jwt.verify(token, configJwt.SECRET);
    const userId = decoded.id;
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (!user.length > 0) return { message: "No user found" };
    user[0].password = 0;
    return user;
  } catch (error) {
    return { message: "Unauthorized" };
  }
};
