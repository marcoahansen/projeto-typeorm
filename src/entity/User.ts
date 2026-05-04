import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from "class-validator";
import { IsBrPhoneConstraint } from "../decorators/isBrPhone";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  @IsNotEmpty({ message: "Primeiro nome é obrigatório!" })
  @IsString({ message: "Primeiro nome precisa ser um texto" })
  firstName!: string;

  @Column("varchar")
  @IsNotEmpty({ message: "Sobrenome é obrigatório!" })
  @IsString({ message: "Sobrenome precisa ser um texto" })
  lastName!: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  @IsNotEmpty({ message: "O e-mail é obrigatório" })
  @IsEmail({}, { message: "o email não é válido" })
  email!: string;

  @Column({ type: "varchar", select: false })
  @IsNotEmpty({ message: "A senha é obrigatória" })
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password!: string;

  @Column({ type: "varchar", length: 15, nullable: false })
  @IsNotEmpty({ message: "O celular é obrigatório" })
  @Validate(IsBrPhoneConstraint)
  phone!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
  // Um usuário pode ter muitos posts
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
