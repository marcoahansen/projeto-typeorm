import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entity/User";
import { UnauthorizedError } from "../helpers/apiError";

export const roleMiddleware =
  (allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user_role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new UnauthorizedError("Acesso negado: cargo insuficiente.");
    }
    next();
  };
