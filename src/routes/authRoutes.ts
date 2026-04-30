import { Router } from "express";

import { AuthController } from "../controller/AuthController";

const router = Router();
const authController = new AuthController();

router.post("/", authController.login);

export const authRoutes = router;
