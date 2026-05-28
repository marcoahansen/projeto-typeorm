import "reflect-metadata";
import express, { type Application } from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { AppDataSource } from "./data-source";
import { userRoutes } from "./routes/userRoutes";
import { postRoutes } from "./routes/postRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { authRoutes } from "./routes/authRoutes";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));

const app: Application = express();
app.use(
  cors({
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/api/login", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use(errorMiddleware);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado!");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
      console.log(
        `Swagger UI disponível em http://localhost:${process.env.PORT}/api/docs`
      );
    });
  })
  .catch((error) => console.log("Erro ao conectar no banco: ", error));
