import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../helpers/apiError";
import { UserService } from "../service/UserService";

export class UserController {
  private userService = new UserService();
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.validateSchema(req.body);
      const newUser = await this.userService.create(req.body);
      const { password: _, ...userPublic } = newUser;
      return res.status(201).json(userPublic);
    } catch (error: unknown) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user_id;
      await this.userService.validateSchema(req.body, true);
      const user = await this.userService.update(id!, req.body);
      const { password: _, ...userPublic } = user;
      return res.status(200).json(userPublic);
    } catch (error: unknown) {
      next(error);
    }
  };
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
      const result = await this.userService.listAll(page, limit);
      return res.status(200).json(result);
    } catch (error: unknown) {
      next(error);
    }
  };
  listActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
      const result = await this.userService.listActive(page, limit);
      return res.status(200).json(result);
    } catch (error: unknown) {
      next(error);
    }
  };
  listById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new BadRequestError("ID inválido");
      }
      const user = await this.userService.listById(id);
      return res.json(user);
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
      await this.userService.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      next(error);
    }
  };
  toggleActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new BadRequestError("ID inválido");
      }
      const user = await this.userService.toggleActive(id);
      return res.json({
        message: `Usuário ${
          user.isActive ? "ativado" : "desativado"
        } com sucesso.`,
        user,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { role } = req.body;
      if (isNaN(id)) {
        throw new BadRequestError("ID inválido");
      }
      await this.userService.validateSchema({ role }, true);
      const user = await this.userService.updateRole(id, role);
      const { password: _, ...userPublic } = user;
      return res.status(200).json({ message: "Cargo atualizado!", userPublic });
    } catch (error: unknown) {
      next(error);
    }
  };
}
