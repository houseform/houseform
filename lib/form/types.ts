import { MutableRefObject } from "react";
import type { FieldInstance } from "../field/types";
import type { FieldArrayInstance } from "../field-array/types";
export interface FormInstance<T = any> {
  formFieldsRef: MutableRefObject<
    Array<FieldInstance<T> | FieldArrayInstance<T>>
  >;
  recomputeErrors: () => void;
  recomputeIsDirty: () => void;
  recomputeIsTouched: () => void;
  errors: string[];
  submit: () => Promise<boolean>;
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  isTouched: boolean;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
  isSubmitted: boolean;
  setIsSubmitted: (val: boolean) => void;
  getFieldValue: (
    val: string
  ) => FieldInstance<T> | FieldArrayInstance<T> | undefined;
  onChangeListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
  onBlurListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
}
