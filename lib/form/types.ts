import { MutableRefObject } from "react";
import type { FieldInstance } from "../field/types";
import type { FieldArrayInstance } from "../field-array/types";
import type { AutoPath } from "ts-toolbelt/out/Function/AutoPath";
import type { Path } from "ts-toolbelt/out/Object/Path";
import type { Split } from "ts-toolbelt/out/String/Split";

declare function getFieldValue<T, P extends string>(
  val: AutoPath<T, P>
): Path<T, Split<P, ".">> extends infer R
  ? FieldInstance<R> | FieldArrayInstance<R> | undefined
  : never;

declare function getFieldValue(
  val: string
): FieldInstance | FieldArrayInstance | undefined;

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
  getFieldValue: typeof getFieldValue;
  onChangeListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
  onBlurListenerRefs: MutableRefObject<Record<string, (() => void)[]>>;
}
