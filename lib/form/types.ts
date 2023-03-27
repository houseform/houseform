import { MutableRefObject } from "react";
import type { FieldInstance } from "../field/types";
import type { FieldArrayInstance } from "../field-array/types";
import type { AutoPath } from "ts-toolbelt/out/Function/AutoPath";
import type { Path } from "ts-toolbelt/out/Object/Path";
import type { Split } from "ts-toolbelt/out/String/Split";
import { MapDeep } from "./advanced-types";

export type ErrorsMap<T = Record<string, any>> = Record<string, any> extends T
  ? Record<string, string[]>
  : MapDeep<T, string[]>;

export interface FormInstance<T = Record<string, any>> {
  formFieldsRef: MutableRefObject<
    Array<FieldInstance<any, T> | FieldArrayInstance<any, T>>
  >;
  recomputeErrors: () => void;
  recomputeIsDirty: () => void;
  recomputeIsTouched: () => void;
  recomputeFormValue: () => void;
  recomputeIsValidating: () => void;
  errors: string[];
  errorsMap: ErrorsMap<T>;
  submit: () => Promise<boolean>;
  value: Partial<T>;
  reset: () => void;
  isValid: boolean;
  setIsTouched: (val: boolean) => void;
  isTouched: boolean;
  setIsDirty: (val: boolean) => void;
  isDirty: boolean;
  isValidating: boolean;
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
  deleteField: (name: string) => void;
  onChangeListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
  onBlurListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
  onMountListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
}
