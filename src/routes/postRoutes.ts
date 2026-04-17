import { Router } from "express";
import { PostController } from "../controller/PostController";

const router = Router();
const postController = new PostController();

router.get("/", (req, res) => postController.list(req, res));
router.post("/", (req, res) => postController.create(req, res));

export const postRoutes = router;
