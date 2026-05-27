// src/swaggerSpec.ts
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { routingControllersOptions } from "./routingConfig";

const storage = getMetadataArgsStorage();

export const swaggerSpec = routingControllersToSpec(
  storage,
  routingControllersOptions,
  {
    components: {
      schemas: {
        LoginDto: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
        PostDto: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
          required: ["title", "content"],
        },
        CreateUserDto: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            phone: { type: "string" },
            role: { type: "string", enum: ["admin", "user"] },
            isActive: { type: "string" },
          },
          required: ["firstName", "lastName", "email", "password"],
        },
        UpdateUserDto: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            password: { type: "string" },
            isActive: { type: "string" },
          },
        },
        UpdateRoleDto: {
          type: "object",
          properties: {
            role: { type: "string", enum: ["ADMIN", "USER"] },
          },
          required: ["role"],
        },
      },
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    info: {
      description: "Documentação interativa da API",
      title: "Blog API",
      version: "1.0.0",
    },
  }
);
