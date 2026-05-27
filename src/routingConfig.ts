import { AuthController } from "./controller/AuthController";
import { PostController } from "./controller/PostController";
import { UserController } from "./controller/UserController";
import { errorMiddleware } from "./middlewares/errorMiddleware";

export const routingControllersOptions = {
  cors: false,
  controllers: [AuthController, UserController, PostController],
  middlewares: [errorMiddleware],
  defaultErrorHandler: false,
};
