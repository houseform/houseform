import { createContext } from "react";
import type { FieldProps } from "./types";

export const initialContext = {
  formFieldsRef: { current: [] as FieldProps[] },
  recomputeErrors: () => {
    return undefined as void;
  },
  recomputeIsDirty: () => {
    return undefined as void;
  },
  recomputeIsTouched: () => {
    return undefined as void;
  },
  errors: [] as string[],
  submit: async () => {
    return undefined as void;
  },
  getFieldValue: (val: string) => {
    return undefined as FieldProps | undefined;
  },
  onChangeListenerRefs: { current: {} as Record<string, (() => void)[]> },
};

export const FormContext = createContext(initialContext);
