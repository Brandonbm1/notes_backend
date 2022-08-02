import { Router } from "express";
import { SignUp, SignIn } from "../controller/auth.controllers.js";

const router = Router();

const baseUrl = "/auth";

router.post(`${baseUrl}/signup`, SignUp);
router.post(`${baseUrl}/signin`, SignIn);

export default router;
