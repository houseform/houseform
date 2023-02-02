import { ZodTypeAny } from "zod";
import { FormInstance } from "../form/types";

type ValidationFunction<T> =
  | ZodTypeAny
  | ((val: T, form: FormInstance<T>) => Promise<boolean>);

export interface FieldInstanceBaseProps<T = any> {
  name: string;
  onChangeValidate?: ValidationFunction<T>;
  onSubmitValidate?: ValidationFunction<T>;
  listenTo?: string[];
}

export interface FieldInstanceProps<T = any> extends FieldInstanceBaseProps<T> {
  onBlurValidate?: ValidationFunction<T>;
}

export interface FieldInstance<T = any> {
  value: T;
  setValue: (val: T | ((prevState: T) => T)) => void;
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
