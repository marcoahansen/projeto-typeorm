import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { User, UserRole } from "../entity/User";
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
  listAll = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [posts, totalItems] = await this.postRepository.findAndCount({
      take: limit,
      skip: skip,
      order: { id: "DESC" },
      relations: ["user"],
    });
    // const query = `SELECT * FROM Post ORDER BY id LIMIT ${limit} OFFSET ${skip}`;
    // const posts = await this.postRepository.query(query);
    // console.log(posts); Mas precisaria também do total.
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: posts,
      meta: {
        totalItems,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
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

  delete = async (postId: number, userId: number, userRole: UserRole) => {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ["user"],
    });
    if (!post) {
      throw new NotFoundError("Post não encontrado");
    }
    if (userRole !== UserRole.ADMIN && post.user.id !== userId) {
      throw new UnauthorizedError(
        "Você não tem permissão para deletar esse post!"
      );
    }
    return await this.postRepository.delete(postId);
  };
}
