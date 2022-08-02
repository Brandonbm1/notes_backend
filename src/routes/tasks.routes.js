import { Router } from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controller/tasks.controller.js";
import { unCodedUser } from "../middlewares/authJwt.js";

const router = Router();

const baseUrl = "/api/tasks";

router.get(baseUrl, getTasks);

router.get(`${baseUrl}/:id`, getTask);

router.post(baseUrl, createTask);

router.put(`${baseUrl}/:id`, updateTask);

router.delete(`${baseUrl}/:id`, deleteTask);

export default router;
