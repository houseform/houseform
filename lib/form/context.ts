import { createContext } from "react";
import { FormInstance } from "./types";

/* c8 ignore start */
export const initialFormContext = {
  formFieldsRef: { current: [] },
  errors: [],
  submit: async () => {
    return true;
  },
  getFieldValue: (val: string) => {},
  setIsSubmitted: (val) => {},
  onChangeListenerRefs: { current: {} },
  onBlurListenerRefs: { current: {} },
  isValid: false,
  isDirty: false,
  isTouched: false,
  isSubmitted: false,
} as FormInstance;
/* c8 ignore stop */

export const FormContext = createContext(initialFormContext);
