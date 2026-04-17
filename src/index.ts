import express, { type Application } from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { userRoutes } from "./routes/userRoutes";
import { postRoutes } from "./routes/postRoutes";

const app: Application = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado!");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => console.log("Erro ao conectar no banco: ", error));
