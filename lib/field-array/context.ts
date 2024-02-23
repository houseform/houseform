import { createContext, useContext } from "react";
import { FieldArrayInstance } from "./types";

/* c8 ignore start */
export const initialFieldArrayContext = {
  value: [],
  setValue: () => {},
  setValues: () => {},
  props: {
    name: "",
  },
  errors: [],
  setErrors: () => {},
  setIsDirty: () => {},
  isValid: false,
  isValidating: false,
  setIsTouched: () => {},
  isDirty: false,
  isTouched: false,
  _normalizedDotName: "",
  add: () => {},
  remove: () => {},
  insert: () => {},
  move: () => {},
  swap: () => {},
  replace: () => {},
  validate: () => {},
  _setIsValidating: () => {},
  hints: [],
  setHints: () => {},
  checkHint: () => {},
} as FieldArrayInstance as unknown;
/* c8 ignore stop */

export const FieldArrayContext = createContext(initialFieldArrayContext);

export const useFieldArrayContext = <T>() => {
  return useContext(FieldArrayContext) as FieldArrayInstance<T>;
};
