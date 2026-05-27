import "reflect-metadata";
import express, { type Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { getMetadataArgsStorage, useExpressServer } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";

import { AppDataSource } from "./data-source";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import { AuthController } from "./controller/AuthController";
import { UserController } from "./controller/UserController";
import { PostController } from "./controller/PostController";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// 1. Configuração simples do Routing Controllers
const routingControllersOptions = {
  cors: false,
  controllers: [AuthController, UserController, PostController],
  middlewares: [errorMiddleware],
  defaultErrorHandler: false, // Mantém o errorMiddleware atual como responsável
};

useExpressServer(app, routingControllersOptions);
app.use(errorMiddleware); // Regista o middleware de erros no fim

const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    securitySchemes: {
      jwt: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  info: {
    description: "Documentação interativa da API",
    title: "Minha API",
    version: "1.0.0",
  },
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado!");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor a correr em http://localhost:${process.env.PORT}`);
      console.log(
        `Swagger Docs disponível em http://localhost:${process.env.PORT}/docs`,
      );
    });
  })
  .catch((error) => console.log("Erro ao conectar no banco: ", error));
