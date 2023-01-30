import { ZodTypeAny } from "zod";
import type { initialContext } from "./context";
import {FormContext} from "./context";

export interface FieldBase<T = any> {
  name: string;
  onChangeValidate?:
    | ZodTypeAny
    | ((val: T, form: FormContext<T>) => Promise<boolean>);
  onBlurValidate?:
    | ZodTypeAny
    | ((val: T, form: FormContext<T>) => Promise<boolean>);
  onSubmitValidate?:
    | ZodTypeAny
    | ((val: T, form: FormContext<T>) => Promise<boolean>);
}

export interface FieldProps<T = any> {
  value: T;
  setValue: (val: T) => void;
  onBlur: () => void;
  props: FieldBase<T>;
  _normalizedDotName: string;
  setErrors: (error: string[]) => void;
  errors: string[];
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  isTouched: boolean;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
}
