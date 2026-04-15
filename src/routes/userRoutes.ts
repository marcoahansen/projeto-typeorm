import { Router } from "express";
import { UserController } from "../controller/UserController";

const router = Router();
const userControler = new UserController();

router.post("/", (req, res) => userControler.create(req, res));
router.get("/", (req, res) => userControler.list(req, res));

export const userRoutes = router;
