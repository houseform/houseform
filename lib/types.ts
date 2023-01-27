import {ZodTypeAny} from "zod";
import type {initialContext} from "./context";

export interface FieldBase<T = any> {
    name: string;
    onChangeValidate?: ZodTypeAny | ((val: T, form: typeof initialContext) => Promise<boolean>);
    onSubmitValidate?: ZodTypeAny | ((val: T, form: typeof initialContext) => Promise<boolean>);
}

export interface FieldProps<T = any> {
    value: T;
    props: FieldBase<T>;
    setErrors: (error: string[]) => void;
    errors: string[];
}
