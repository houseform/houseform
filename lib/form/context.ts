import { createContext } from "react";
import { FormInstance } from "./types";

/* c8 ignore start */
export const initialFormContext = {
  formFieldsRef: { current: [] },
  recomputeErrors: () => {},
  recomputeIsDirty: () => {},
  recomputeIsTouched: () => {},
  errors: [],
  submit: async () => {
    return true;
  },
  getFieldValue: (val: string) => {},
  setIsSubmitted: (val) => {},
  onChangeListenerRefs: { current: {} },
  onBlurListenerRefs: { current: {} },
  onMountListenerRefs: { current: {} },
  setIsTouched: () => {},
  setIsDirty: () => {},
  isValid: false,
  isDirty: false,
  isTouched: false,
  isSubmitted: false,
  value: {},
  recomputeFormValue: () => {},
} as FormInstance;
/* c8 ignore stop */

export const FormContext = createContext(initialFormContext);
