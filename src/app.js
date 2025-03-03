import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import cors from 'cors';

const app = express();
app.use(cors(
    {
        origin: 'http://localhost:5173',
    }
));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes); //las rutas siempre van a comenzar con /api
app.use("/api", tasksRoutes);

export default app;
