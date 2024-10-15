import express from "express";
import morgan from "morgan";
import cors from "cors";

//Routes
import usuarioRoutes from "./routes/usuario.routes";
import loginRoutes from "./routes/login.routes"

const app = express();

//Settings
app.set("port", 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:4200",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type"]
}));


//Routes
app.use("/api",usuarioRoutes);
app.use("/api",loginRoutes);

export default app;