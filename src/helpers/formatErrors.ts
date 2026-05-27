import { ValidationError } from "class-validator";
import { IValidationError } from "../types/IValidationError";

export const formatErrors = (errors: ValidationError[]) => {
  console.log("Validation errors:", errors);
  const formattedErrors: IValidationError[] = errors.map((error) => ({
    field: error.property,
    messages: Object.values(error.constraints ?? {}),
  }));
  return formattedErrors;
};
