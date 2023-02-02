import { FieldInstanceBaseProps } from "houseform";

export interface FieldArrayHelpers<T> {
  add: (val: T) => void;
  remove: (index: number) => void;
  insert: (index: number, val: T) => void;
  move: (from: number, to: number) => void;
  replace: (index: number, val: T) => void;
  swap: (indexA: number, indexB: number) => void;
}

export interface FieldArrayInstance<T = any> extends FieldArrayHelpers<T> {
  _normalizedDotName: string;
  props: FieldInstanceBaseProps<T>;
  value: T[];
  setValue: (index: number, value: T) => void;
  errors: string[];
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
}
