import {
  JsonController,
  Get,
  Post,
  Patch,
  Delete,
  QueryParam,
  Body,
  Param,
  UseBefore,
  Req,
  HttpCode,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { IsString, IsNotEmpty } from "class-validator";
import type { Request } from "express";

import { PostService } from "../service/PostService";
import { BadRequestError } from "../helpers/apiError";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserRole } from "../entity/User";

export class PostDto {
  title!: string;
  content!: string;
}

@JsonController("/api/posts")
export class PostController {
  private postService = new PostService();

  @Get("/")
  async list(
    @QueryParam("page") page: number = 1,
    @QueryParam("limit") limit: number = 10
  ) {
    const validPage = Math.max(1, Number(page) || 1);
    const validLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    return this.postService.listAll(validPage, validLimit);
  }

  @Post("/")
  @HttpCode(201)
  @UseBefore(authMiddleware)
  @OpenAPI({ security: [{ jwt: [] }] })
  async create(@Body() body: PostDto, @Req() req: Request) {
    const userId = req.user_id;
    if (userId && isNaN(userId))
      throw new BadRequestError("Id do usuário inválido");

    await this.postService.validateSchema(body as any);
    return this.postService.create(body.title, body.content, userId!);
  }

  @Patch("/:id")
  @UseBefore(authMiddleware)
  @OpenAPI({ security: [{ jwt: [] }] })
  async update(
    @Param("id") id: number,
    @Body() body: PostDto,
    @Req() req: Request
  ) {
    const userId = req.user_id;
    if (isNaN(id)) throw new BadRequestError("Id do post inválido");

    await this.postService.validateSchema(body as any, true);
    return this.postService.update(id, userId!, body);
  }

  @Delete("/:id")
  @HttpCode(204)
  @UseBefore(authMiddleware)
  @OpenAPI({ security: [{ jwt: [] }] })
  async delete(@Param("id") id: number, @Req() req: Request) {
    const userId = req.user_id;
    const userRole = req.user_role as UserRole;
    if (isNaN(id)) throw new BadRequestError("Id do post inválido");
    return this.postService.delete(id, userId!, userRole);
  }
}
