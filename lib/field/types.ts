import type { ZodTypeAny } from "zod";
import { FormInstance } from "../form/types";

type ValidationFunction<T, F> =
  | ZodTypeAny
  | ((val: T, form: FormInstance<F>) => Promise<boolean>);

export interface FieldInstanceBaseProps<T = any, F = any> {
  name: string;
  onChangeValidate?: ValidationFunction<T, F>;
  onSubmitValidate?: ValidationFunction<T, F>;
  listenTo?: string[];
}

export interface FieldInstanceProps<T = any, F = any>
  extends FieldInstanceBaseProps<T, F> {
  onBlurValidate?: ValidationFunction<T, F>;
  onMountValidate?: ValidationFunction<T, F>;
}

export interface FieldInstance<T = any, F = any> {
  value: T;
  setValue: (val: T | ((prevState: T) => T)) => void;
  onBlur: () => void;
  props: FieldInstanceProps<T, F>;
  _normalizedDotName: string;
  setErrors: (error: string[]) => void;
  errors: string[];
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  isTouched: boolean;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
}
