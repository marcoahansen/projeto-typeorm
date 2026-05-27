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
import type { Request } from "express";

import { PostService } from "../service/PostService";
import { BadRequestError } from "../helpers/apiError";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserRole } from "../entity/User"; // Importação necessária para tipar o userRole

@JsonController("/api/posts")
export class PostController {
  private postService = new PostService();

  @Get("/")
  async list(
    @QueryParam("page") page: number = 1,
    @QueryParam("limit") limit: number = 10,
  ) {
    const validPage = Math.max(1, Number(page) || 1);
    const validLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    return this.postService.listAll(validPage, validLimit);
  }

  @Post("/")
  @HttpCode(201)
  @UseBefore(authMiddleware)
  @OpenAPI({ security: [{ jwt: [] }] })
  async create(@Body() body: any, @Req() req: Request) {
    const userId = req.user_id;
    if (userId && isNaN(userId))
      throw new BadRequestError("Id do utilizador inválido");

    await this.postService.validateSchema(body);
    return this.postService.create(body.title, body.content, userId!);
  }

  @Patch("/:id")
  @UseBefore(authMiddleware)
  @OpenAPI({ security: [{ jwt: [] }] })
  async update(
    @Param("id") id: number,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const userId = req.user_id;
    if (isNaN(id)) throw new BadRequestError("Id do post inválido");

    await this.postService.validateSchema(body, true);
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
