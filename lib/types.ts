import { ZodTypeAny } from "zod";
import { FormContext } from "./context";

type ValidationFunction<T> =
  | ZodTypeAny
  | ((val: T, form: FormContext<T>) => Promise<boolean>);

export interface FieldInstanceProps<T = any> {
  name: string;
  onChangeValidate?: ValidationFunction<T>;
  onBlurValidate?: ValidationFunction<T>;
  onSubmitValidate?: ValidationFunction<T>;
}

export interface FieldInstance<T = any> {
  value: T;
  setValue: (val: T) => void;
  onBlur: () => void;
  props: FieldInstanceProps<T>;
  _normalizedDotName: string;
  setErrors: (error: string[]) => void;
  errors: string[];
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  isTouched: boolean;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
}
