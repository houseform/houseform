import { FieldInstanceBaseProps } from "houseform";

export interface FieldArrayHelpers<T> {
  add: (val: T) => void;
  remove: (index: number) => void;
  insert: (index: number, val: T) => void;
  move: (props: { from: number; to: number }) => void;
}

export interface FieldArrayInstance<T> extends FieldArrayHelpers<T> {
  _normalizedDotName: string;
  props: FieldInstanceBaseProps<T>;
  fields: T[];
  errors: string[];
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
}
