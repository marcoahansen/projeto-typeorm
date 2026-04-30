import { Router } from "express";
import { PostController } from "../controller/PostController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const postController = new PostController();

router.get("/", postController.list);
router.post("/", authMiddleware, postController.create);
router.patch("/:id", authMiddleware, postController.update);
router.delete("/:id", authMiddleware, postController.delete);

export const postRoutes = router;
