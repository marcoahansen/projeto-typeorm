import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { formatErrors } from "../helpers/formatErrors";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/apiError";

export class PostService {
  private postRepository = AppDataSource.getRepository(Post);
  private userRepository = AppDataSource.getRepository(User);
  validateSchema = async (data: Partial<Post>, partial = false) => {
    const temp = this.postRepository.create(data);
    const errors = await validate(temp, { skipMissingProperties: partial });
    if (errors.length > 0) {
      const formattedErrors = formatErrors(errors);
      throw new BadRequestError("Falha de validação", formattedErrors);
    }
  };
  listAll = async () => {
    return await this.postRepository.find({ relations: ["user"] });
  };
  create = async (title: string, content: string, userId: number) => {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }
    return await this.postRepository.save({ title, content, user });
  };
  update = async (postId: number, userId: number, data: Partial<Post>) => {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["user"],
    });
    if (!post) {
      throw new NotFoundError("Post não encontrado");
    }
    if (post.user.id !== userId) {
      throw new UnauthorizedError(
        "Você não tem permissão para atualizar esse post!"
      );
    }
    this.postRepository.merge(post, data);
    return await this.postRepository.save(post);
  };

  delete = async (postId: number, userId: number) => {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["user"],
    });
    if (!post) {
      throw new NotFoundError("Post não encontrado");
    }
    if (post.user.id !== userId) {
      throw new UnauthorizedError(
        "Você não tem permissão para atualizar esse post!"
      );
    }
    return await this.postRepository.delete(postId);
  };
}
