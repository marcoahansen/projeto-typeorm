import type { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../helpers/apiError";
import { PostService } from "../service/PostService";

export class PostController {
  private postService = new PostService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postService.listAll();
      return res.json(posts);
    } catch (error: unknown) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content } = req.body;
      const userId = req.user_id;
      if (userId && isNaN(userId)) {
        throw new BadRequestError("Id do usuário inválido");
      }
      await this.postService.validateSchema(req.body);
      const newPost = await this.postService.create(title, content, userId!);
      return res.status(201).json(newPost);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = Number(req.params.id);
      const userId = req.user_id;
      if (isNaN(postId)) {
        throw new BadRequestError("Id do post inválido");
      }
      await this.postService.validateSchema(req.body, true);
      const post = await this.postService.update(postId, userId!, req.body);
      return res.status(200).json(post);
    } catch (error: unknown) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user_id;
      const userRole = req.user_role;
      if (isNaN(id)) {
        throw new BadRequestError("ID inválido");
      }
      await this.postService.delete(id, userId!, userRole!);
      return res.status(204).send();
    } catch (error: unknown) {
      next(error);
    }
  };
}
