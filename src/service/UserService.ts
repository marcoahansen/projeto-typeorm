import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entity/User";
import { BadRequestError, NotFoundError } from "../helpers/apiError";
import bcrypt from "bcryptjs";
import { formatErrors } from "../helpers/formatErrors";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  validateSchema = async (data: Partial<User>, partial = false) => {
    const temp = this.userRepository.create(data);
    const errors = await validate(temp, { skipMissingProperties: partial });
    if (errors.length > 0) {
      const formattedErrors = formatErrors(errors);
      throw new BadRequestError("Falha de validação", formattedErrors);
    }
  };
  create = async (userData: Partial<User>) => {
    const exists = await this.userRepository.findOneBy({
      email: userData.email,
    });
    if (exists) {
      throw new BadRequestError("Email fornecido já está em uso!");
    }
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    return await this.userRepository.save({
      ...userData,
      password: hashedPassword,
    });
  };
  update = async (id: number, userData: Partial<User>) => {
    const { email } = userData;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundError("Usuário não encontrado");
    if (email && email !== user.email) {
      const exists = await this.userRepository.findOneBy({ email });
      if (exists) throw new BadRequestError("Este e-mail já está em uso!");
    }
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    this.userRepository.merge(user, userData);
    return await this.userRepository.save(user);
  };
  listAll = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [users, totalItems] = await this.userRepository.findAndCount({
      take: limit,
      skip: skip,
      order: { id: "DESC" },
    });
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: users,
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
  listActive = async (page: number, limit: number, active = true) => {
    const skip = (page - 1) * limit;
    const [users, totalItems] = await this.userRepository.findAndCount({
      take: limit,
      skip: skip,
      where: { isActive: active },
      order: { id: "DESC" },
    });
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: users,
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
  listById = async (id: number) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    return user;
  };
  delete = async (id: number) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    return await this.userRepository.delete(id);
  };
  toggleActive = async (id: number) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return user;
  };
  updateRole = async (id: number, newRole: UserRole) => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    user.role = newRole;
    return await this.userRepository.save(user);
  };
}
