import { pool } from "../../db.js";
import jwt from "jsonwebtoken";
import { configJwt } from "../../config.js";
import { encryptPassword, matchPassword } from "../lib/helpers.js";
import { unCodedUser } from "../middlewares/authJwt.js";

export const SignUp = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const { valid, error } = await validateUser(username, email);
    if (!valid) {
      res.status(400).json({ error: error });
    } else {
      const encryptPass = await encryptPassword(password);
      const newUser = {
        username,
        password: encryptPass,
        email,
      };
      const savedUser = await pool.query("INSERT INTO users SET ?", [newUser]);
      const token = jwt.sign({ id: savedUser.insertId }, configJwt.SECRET, {
        expiresIn: 86400,
      });
      res.status(201).json({ token });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [result] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (!result.length > 0)
      return res.status(400).json({ message: "User not found" });

    const validPassword = await matchPassword(password, result[0].password);

    if (!validPassword)
      return res.status(401).json({ token: null, message: "Invalid password" });

    const token = jwt.sign({ id: result[0].id }, configJwt.SECRET, {
      expiresIn: 86400,
    });

    const [user] = await unCodedUser(token);
    return res.status(200).json({ user, token, message: "OK" });
  } catch (error) {
    console.error(error);
  }
};

const validateUser = async (username, email) => {
  let validation;
  try {
    const [usernameValidation] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (usernameValidation.length > 0)
      validation = { valid: false, error: "Username is alredy taken" };
    else {
      const [emailValidation] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (emailValidation.length > 0)
        validation = { valid: false, error: "Email is alredy taken" };
      else validation = { valid: true };
    }
    return validation;
  } catch (error) {
    console.error(error.message);
  }
};
