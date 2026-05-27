import { JsonController, Post, Body, HttpCode } from "routing-controllers";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BadRequestError } from "../helpers/apiError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@JsonController("/api/login")
export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  @Post("/")
  @HttpCode(200)
  async login(@Body() body: any) {
    const { email, password } = body;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "firstName", "password", "role"],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_PASS ?? "secret",
      { expiresIn: "8h" },
    );

    return {
      user: {
        name: user.firstName,
        role: user.role,
        id: user.id,
      },
      token,
    };
  }
}
