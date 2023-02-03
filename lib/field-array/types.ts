import { FieldInstanceBaseProps } from "../field";

export interface FieldArrayHelpers<T> {
  add: (val: T) => void;
  remove: (index: number) => void;
  insert: (index: number, val: T) => void;
  move: (from: number, to: number) => void;
  replace: (index: number, val: T) => void;
  swap: (indexA: number, indexB: number) => void;
}

export interface FieldArrayInstance<T = any, F = any>
  extends FieldArrayHelpers<T> {
  _normalizedDotName: string;
  props: FieldInstanceBaseProps<T, F>;
  value: T[];
  setValue: (index: number, value: T) => void;
  setErrors: (errors: string[]) => void;
  errors: string[];
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
  isTouched: boolean;
}
