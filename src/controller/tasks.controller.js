import { pool } from "../../db.js";
export const getTasks = async (req, res) => {
  try {
    const user_id = req.headers.user_id;
    const [result] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY createdAt DESC",
      [user_id]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTask = async (req, res) => {
  try {
    const task_id = req.params.id;
    const user_id = req.headers.user_id;
    const [result] = await pool.query(
      `SELECT * FROM tasks WHERE user_id = ? AND id = ?`,
      [user_id, task_id]
    );
    if (result.length === 0)
      return res.status(404).json({ message: "Task not found" });
    return res.json(result);
  } catch (error) {}
};
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user_id = req.headers.user_id;
    const [result] = await pool.query(
      `INSERT INTO tasks(title, description, user_id) VALUES (?, ?, ?)`,
      [title, description, user_id]
    );
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      done: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateTask = async (req, res) => {
  try {
    const task_id = req.params.id;
    const user_id = req.headers.user_id;
    const [result] = await pool.query(
      `UPDATE tasks 
        SET ?
        WHERE user_id = ? AND id=?`,
      [req.body, user_id, task_id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });
    if (result.changedRows === 0) return res.sendStatus(304);
    return res.json({ message: "Task updating succesfully" });
  } catch (error) {
    console.error(error);
  }
};
export const deleteTask = async (req, res) => {
  try {
    const task_id = req.params.id;
    const user_id = req.headers.user_id;
    const [result] = await pool.query(
      `DELETE FROM tasks WHERE user_id = ? AND id = ?`,
      [user_id, task_id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
