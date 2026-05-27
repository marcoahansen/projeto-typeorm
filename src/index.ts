import "reflect-metadata";
import express, { type Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { useExpressServer } from "routing-controllers";
import { AppDataSource } from "./data-source";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { routingControllersOptions } from "./routingConfig";
import { swaggerSpec } from "./swaggerSpec";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

useExpressServer(app, routingControllersOptions);
app.use(errorMiddleware);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado!");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor a correr em http://localhost:${process.env.PORT}`);
      console.log(
        `Swagger Docs disponível em http://localhost:${process.env.PORT}/api/docs`
      );
    });
  })
  .catch((error) => console.log("Erro ao conectar no banco: ", error));
