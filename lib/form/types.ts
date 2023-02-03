import { MutableRefObject } from "react";
import type { FieldInstance } from "../field/types";
import type { FieldArrayInstance } from "../field-array/types";
import type { AutoPath } from "ts-toolbelt/out/Function/AutoPath";
import type { Path } from "ts-toolbelt/out/Object/Path";
import type { Split } from "ts-toolbelt/out/String/Split";

export interface FormInstance<T = any> {
  formFieldsRef: MutableRefObject<Array<FieldInstance | FieldArrayInstance>>;
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
  getFieldValue: <P extends string>(
    val: AutoPath<T, P> | string
  ) => AutoPath<T, P> extends never
    ? FieldInstance | FieldArrayInstance | undefined
    : Path<T, Split<P, ".">> extends infer R
    ? FieldInstance<R> | FieldArrayInstance<R> | undefined
    : never;
  onChangeListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
  onBlurListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
}
