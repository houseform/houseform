import type { ZodTypeAny } from "zod";
import { FormInstance } from "../form/types";

type HintFunction<T, F> =
  | ZodTypeAny
  | ((val: T, form: FormInstance<F>) => Promise<boolean>);

type ValidationFunction<T, F> =
  | ZodTypeAny
  | ((val: T, form: FormInstance<F>) => Promise<boolean>);

type TransformFunction<T, F> =
  | ZodTypeAny
  | ((val: T, form: FormInstance<F>) => any);

export interface FieldInstanceBaseProps<T = any, F = any> {
  name: string;
  onChangeValidate?: ValidationFunction<T, F>;
  onSubmitValidate?: ValidationFunction<T, F>;
  onSubmitTransform?: TransformFunction<T, F>;
  onChangeHint?: HintFunction<T, F>;
  onSubmitHint?: HintFunction<T, F>;
  listenTo?: string[];
}

export interface FieldInstanceProps<T = any, F = any>
  extends FieldInstanceBaseProps<T, F> {
  onBlurValidate?: ValidationFunction<T, F>;
  onBlurHint?: HintFunction<T, F>;
  onMountValidate?: ValidationFunction<T, F>;
  onMountHint?: HintFunction<T, F>;
  initialValue?: T;
  resetWithValue?: T;
  memoChild?: any[];
  preserveValue?: boolean;
}

export interface FieldInstance<T = any, F = any> {
  value: T;
  setValue: (val: T | ((prevState: T) => T)) => void;
  onBlur: () => void;
  props: FieldInstanceProps<T, F>;
  _normalizedDotName: string;
  _setIsValidating: (val: boolean) => void;
  setErrors: (error: string[]) => void;
  errors: string[];
  setHints: (hint: string[]) => void;
  hints: string[];
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  isTouched: boolean;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
  isValidating: boolean;
  isSubmitted: boolean;
  validate: (
    validationType: "onChangeValidate" | "onBlurValidate" | "onMountValidate"
  ) => void;
  checkHint: (hintType: "onChangeHint" | "onBlurHint" | "onMountHint") => void;
}
