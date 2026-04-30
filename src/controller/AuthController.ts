import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BadRequestError } from "../helpers/apiError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.findOne({
        where: { email },
        select: ["id", "password"],
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new BadRequestError("E-mail ou senha inválidos");
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_PASS ?? "secret",
        { expiresIn: "8h" }
      );
      return res.json({ token });
    } catch (error) {
      next(error);
    }
  };
}
