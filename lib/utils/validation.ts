import type { ZodError, ZodTypeAny } from "zod";
import { FormInstance } from "../form/types";

export function validate<T, F>(
  val: T,
  form: FormInstance<F>,
  validator: ZodTypeAny | ((val: T, form: FormInstance<F>) => Promise<boolean>)
) {
  const isZodValidator = (validator: any): validator is ZodTypeAny => {
    return validator instanceof Object && validator.parseAsync;
  };
  if (isZodValidator(validator)) {
    return validator.parseAsync(val);
  }
  return validator(val, form);
}

export function getValidationError(error: ZodError | string) {
  const isZodError = (error: any): error is ZodError => {
    return error instanceof Object && error.errors;
  };
  if (isZodError(error)) {
    return error.errors.map((error) => error.message);
  } else {
    return [error];
  }
}
