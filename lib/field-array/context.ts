import { createContext, MutableRefObject } from "react";
import { FieldArrayInstance } from "./types";

export interface FieldArrayContext<T = any> {
  formFieldsRef: MutableRefObject<FieldArrayInstance<T>[]>;
  recomputeErrors: () => void;
  recomputeIsDirty: () => void;
  recomputeIsTouched: () => void;
  errors: string[];
  onChange: () => void;
}

/* c8 ignore start */
export const initialContext = {
  formFieldsRef: { current: [] },
  recomputeErrors: () => {
    return undefined;
  },
  recomputeIsDirty: () => {
    return undefined;
  },
  recomputeIsTouched: () => {
    return undefined;
  },
  errors: [],
  onChange: () => {
    return undefined;
  },
} as FieldArrayContext;
/* c8 ignore stop */

export const FormArrayContext = createContext(initialContext);
