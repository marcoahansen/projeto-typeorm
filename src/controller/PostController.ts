import { AppDataSource } from "../data-source";
import type { NextFunction, Request, Response } from "express";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { BadRequestError, NotFoundError } from "../helpers/apiError";
import { validate } from "class-validator";
import { IValidationError } from "../types/IValidationError";
import { formatErrors } from "../helpers/formatErrors";

export class PostController {
  private postRepository = AppDataSource.getRepository(Post);
  private userRepository = AppDataSource.getRepository(User);

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postRepository.find({ relations: ["user"] });
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
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundError("Usuário não encontrado.");
      }
      const newPost = this.postRepository.create({ title, content, user });
      const errors = await validate(newPost);
      if (errors.length > 0) {
        const formattedErrors = formatErrors(errors);
        throw new BadRequestError("Falha de validação", formattedErrors);
      }
      await this.postRepository.save(newPost);
      return res.status(201).json(newPost);
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = Number(req.params.id);
      const { title, content } = req.body;
      const userId = req.user_id;
      if (isNaN(postId)) {
        throw new BadRequestError("Id do post inválido");
      }
      const post = await this.postRepository.findOneBy({
        id: postId,
      });
      if (!post) {
        throw new NotFoundError("Post não encontrado");
      }
      if (userId) {
        if (isNaN(userId)) {
          throw new BadRequestError("Id do usuário inválido");
        }
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
          throw new NotFoundError("Usuário não encontrado.");
        }
        post.user = user ?? post.user;
      }
      post.title = title ?? post.title;
      post.content = content ?? post.content;
      const errors = await validate(post);
      if (errors.length > 0) {
        const formattedErrors = formatErrors(errors);
        throw new BadRequestError("Falha de validação", formattedErrors);
      }
      await this.postRepository.save(post);
      return res.status(200).json(post);
    } catch (error: unknown) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new BadRequestError("ID inválido");
      }
      const result = await this.postRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundError("Post não encontrado");
      }
      return res.status(204).send();
    } catch (error: unknown) {
      next(error);
    }
  };
}
