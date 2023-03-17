import { MutableRefObject } from "react";
import type { FieldInstance } from "../field/types";
import type { FieldArrayInstance } from "../field-array/types";
import type { AutoPath } from "ts-toolbelt/out/Function/AutoPath";
import type { Path } from "ts-toolbelt/out/Object/Path";
import type { Split } from "ts-toolbelt/out/String/Split";

export interface FormInstance<T = any> {
  formFieldsRef: MutableRefObject<
    Array<FieldInstance<any, T> | FieldArrayInstance<any, T>>
  >;
  recomputeErrors: () => void;
  recomputeIsDirty: () => void;
  recomputeIsTouched: () => void;
  recomputeFormValue: () => void;
  errors: string[];
  submit: () => Promise<boolean>;
  value: T;
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  isTouched: boolean;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
  isSubmitted: boolean;
  setIsSubmitted: (val: boolean) => void;
  getFieldValue(
    val: string
  ): FieldInstance<any, T> | FieldArrayInstance<any, T> | undefined;
  getFieldValue<T, P extends string>(
    val: AutoPath<T, P>
  ): Path<T, Split<P, ".">> extends infer R
    ? FieldInstance<R, T> | FieldArrayInstance<R, T> | undefined
    : never;
  onChangeListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
  onBlurListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
  onMountListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
}
