import { createContext, MutableRefObject } from "react";
import type { FieldInstance } from "../field/types";
import { FieldArrayInstance } from "../field-array";

export interface FormContext<T = any> {
  formFieldsRef: MutableRefObject<
    Array<FieldInstance<T> | FieldArrayInstance<T>>
  >;
  recomputeErrors: () => void;
  recomputeIsDirty: () => void;
  recomputeIsTouched: () => void;
  errors: string[];
  submit: () => Promise<boolean>;
  getFieldValue: (val: string) => FieldInstance<T> | undefined;
  onChangeListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
  onBlurListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
}

/* c8 ignore start */
export const initialFormContext = {
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
  submit: async () => {
    return true;
  },
  getFieldValue: (val) => {
    return undefined;
  },
  onChangeListenerRefs: { current: {} },
  onBlurListenerRefs: { current: {} },
} as FormContext;
/* c8 ignore stop */

export const FormContext = createContext(initialFormContext);
