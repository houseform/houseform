import {ZodError, ZodTypeAny} from "zod";
import {initialContext} from "./context";

export function validate<T>(val: T, form: typeof initialContext, validator: ZodTypeAny | ((val: T, form: typeof initialContext) => Promise<boolean>)) {
    if (validator instanceof Function) {
        return validator(val, form);
    } else {
        return validator.parseAsync(val);
    }
}

export function getValidationError(error: ZodError | string) {
    if (error instanceof ZodError) {
        return error.errors.map(error => error.message);
    } else {
        return [error];
    }
}
