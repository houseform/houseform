import { createContext, useContext } from "react";
import { FormInstance } from "./types";

/* c8 ignore start */
export const initialFormContext = {
  formFieldsRef: { current: [] },
  recomputeErrors: () => {},
  recomputeIsDirty: () => {},
  recomputeIsTouched: () => {},
  recomputeIsValidating: () => {},
  errors: [],
  errorsMap: {},
  submit: async () => {
    return true;
  },
  getFieldValue: () => {},
  deleteField: () => {},
  setIsSubmitted: () => {},
  reset: () => {},
  onChangeListenerRefs: { current: {} },
  onBlurListenerRefs: { current: {} },
  onMountListenerRefs: { current: {} },
  setIsTouched: () => {},
  setIsDirty: () => {},
  isValid: false,
  isDirty: false,
  isTouched: false,
  isValidating: false,
  isSubmitted: false,
  value: {},
  recomputeFormValue: () => {},
} as FormInstance as unknown;
/* c8 ignore stop */

export const FormContext = createContext(initialFormContext);

export const useFormContext = <F>() => {
  return useContext(FormContext) as FormInstance<F>;
};
