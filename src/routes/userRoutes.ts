import { Router } from "express";
import { UserController } from "../controller/UserController";

const router = Router();
const userControler = new UserController();

router.post("/", (req, res) => userControler.create(req, res));
router.patch("/:id/toggle", (req, res) => userControler.toggleActive(req, res));
router.patch("/:id", (req, res) => userControler.update(req, res));
router.get("/", (req, res) => userControler.list(req, res));
router.get("/active", (req, res) => userControler.listActive(req, res));
router.get("/:id", (req, res) => userControler.listById(req, res));
router.delete("/:id", (req, res) => userControler.delete(req, res));

export const userRoutes = router;
