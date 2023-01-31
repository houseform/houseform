import { createContext } from "react";

export interface FieldArrayContext<T = any> {
  value: T[];
  setValue: (index: number, value: T) => void;
  name: string;
  add: (value: T) => void;
}

/* c8 ignore start */
export const initialContext = {
  value: [],
  setValue: () => {},
  name: "",
  add: (value) => {},
} as FieldArrayContext;
/* c8 ignore stop */

export const FieldArrayContext = createContext(initialContext);
