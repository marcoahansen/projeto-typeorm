import "reflect-metadata";
import express, { type Application } from "express";
import { AppDataSource } from "./data-source";
import { userRoutes } from "./routes/userRoutes";
import { postRoutes } from "./routes/postRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { authRoutes } from "./routes/authRoutes";

const app: Application = express();
app.use(express.json());
app.use("/api/login", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use(errorMiddleware);

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado!");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => console.log("Erro ao conectar no banco: ", error));
