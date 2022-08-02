import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import tasksRoutes from "./src/routes/tasks.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use(tasksRoutes);
app.use(authRoutes);
app.listen(PORT);
console.log(`Server listen on port ${PORT} `);
