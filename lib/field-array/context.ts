import { createContext } from "react";
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
} as FieldArrayInstance;
/* c8 ignore stop */

export const FieldArrayContext = createContext(initialFieldArrayContext);
