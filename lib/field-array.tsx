import { ForwardedRef, forwardRef, memo, useContext, useMemo } from "react";
import { FieldInstanceProps } from "./types";
import { FormContext } from "./form-context";
import { stringToPath } from "./utils";

export interface FieldArrayHelpers<T> {
  add: (val: T) => void;
  remove: (index: number) => void;
  insert: (index: number, val: T) => void;
  move: (props: { from: number; to: number }) => void;
}

export interface FieldArrayInstance<T> extends FieldArrayHelpers<T> {
  _normalizedDotName: string;
  props: FieldInstanceProps<T>;
  errors: string[];
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
}

export interface FieldArrayRenderProps<T = any> extends FieldInstanceProps<T> {
  children: (props: FieldArrayInstance<T>) => JSX.Element;
  initialValue?: T[];
}

function FieldArrayComp<T>(
  props: FieldArrayRenderProps<T>,
  ref: ForwardedRef<FieldArrayInstance<T>>
) {
  const formContext = useContext(FormContext);

  const { formFieldsRef } = formContext;

  const { name } = props;

  const _normalizedDotName = useMemo(() => {
    return stringToPath(name).join(".");
  }, [name]);

  return undefined as any;
}

export const FieldArray = memo(forwardRef(FieldArrayComp)) as <T>(
  props: FieldArrayRenderProps<T> & {
    ref?: ForwardedRef<FieldArrayInstance<T>>;
  }
) => ReturnType<typeof FieldArrayComp>;
