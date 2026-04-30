import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../helpers/apiError";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) throw new UnauthorizedError("Token não fornecido");

  const token = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_PASS ?? "secret") as {
      id: number;
    };

    req.user_id = payload.id;
    next();
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
};
