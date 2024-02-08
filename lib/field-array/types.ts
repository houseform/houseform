import { FieldInstanceBaseProps } from "../field";

export interface FieldArrayHelpers<T> {
  add: (val: T) => void;
  remove: (index: number) => void;
  insert: (index: number, val: T) => void;
  move: (from: number, to: number) => void;
  replace: (index: number, val: T) => void;
  swap: (indexA: number, indexB: number) => void;
}

export interface FieldArrayInstanceProps<T = any, F = any>
  extends FieldInstanceBaseProps<T, F> {
  initialValue?: T[];
  resetWithValue?: T[];
  memoChild?: any[];
  preserveValue?: boolean;
}

export interface FieldArrayInstance<T = any, F = any>
  extends FieldArrayHelpers<T> {
  _normalizedDotName: string;
  _setIsValidating: (val: boolean) => void;
  props: FieldArrayInstanceProps<T, F>;
  value: T[];
  setValues: (value: T[]) => void;
  setValue: (index: number, value: T) => void;
  setErrors: (errors: string[]) => void;
  errors: string[];
  setHints: (hint: string[]) => void;
  hints: string[];
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
  validate: (
    validationType: "onChangeValidate" | "onBlurValidate" | "onMountValidate"
  ) => void;
  checkHint: (hintType: "onChangeHint" | "onBlurHint" | "onMountHint") => void;
}
