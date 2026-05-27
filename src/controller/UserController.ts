import {
  JsonController,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  QueryParam,
  UseBefore,
  Req,
  HttpCode,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import type { Request } from "express";

import { UserService } from "../service/UserService";
import { BadRequestError } from "../helpers/apiError";
import { UserRole } from "../entity/User";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

@JsonController("/api/users")
export class UserController {
  private userService = new UserService();

  @Get("/")
  async list(
    @QueryParam("page") page: number = 1,
    @QueryParam("limit") limit: number = 10,
  ) {
    const validPage = Math.max(1, Number(page) || 1);
    const validLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    return this.userService.listAll(validPage, validLimit);
  }

  @Get("/active")
  async listActive(
    @QueryParam("page") page: number = 1,
    @QueryParam("limit") limit: number = 10,
  ) {
    const validPage = Math.max(1, Number(page) || 1);
    const validLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    return this.userService.listActive(validPage, validLimit);
  }

  @Get("/:id")
  async listById(@Param("id") id: number) {
    if (isNaN(id)) throw new BadRequestError("ID inválido");
    return this.userService.listById(id);
  }

  @Post("/")
  @HttpCode(201)
  async create(@Body() body: any) {
    await this.userService.validateSchema(body);
    const newUser = await this.userService.create(body);
    const { password: _, ...userPublic } = newUser;
    return userPublic;
  }

  @Patch("/")
  @UseBefore(authMiddleware)
  @OpenAPI({ security: [{ jwt: [] }] })
  async update(@Req() req: Request, @Body() body: any) {
    const userId = req.user_id;
    await this.userService.validateSchema(body, true);
    const user = await this.userService.update(userId!, body);
    const { password: _, ...userPublic } = user;
    return userPublic;
  }

  @Patch("/:id/toggle")
  @UseBefore(authMiddleware)
  @OpenAPI({ security: [{ jwt: [] }] })
  async toggleActive(@Param("id") id: number) {
    if (isNaN(id)) throw new BadRequestError("ID inválido");
    const user = await this.userService.toggleActive(id);
    return {
      message: `Utilizador ${user.isActive ? "ativado" : "desativado"} com sucesso.`,
      user,
    };
  }

  @Delete("/:id")
  @HttpCode(204)
  @UseBefore(authMiddleware)
  @OpenAPI({ security: [{ jwt: [] }] })
  async delete(@Param("id") id: number) {
    if (isNaN(id)) throw new BadRequestError("ID inválido");
    await this.userService.delete(id);
    return;
  }

  @Patch("/role/:id")
  @UseBefore(authMiddleware, roleMiddleware([UserRole.ADMIN]))
  @OpenAPI({ security: [{ jwt: [] }] })
  async updateRole(@Param("id") id: number, @Body() body: { role: UserRole }) {
    if (isNaN(id)) throw new BadRequestError("ID inválido");
    return this.userService.updateRole(id, body.role);
  }
}
