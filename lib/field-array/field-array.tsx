import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { FieldInstanceBaseProps } from "../field/types";
import { FieldArrayContext } from "./context";
import { FieldArrayInstance } from "./types";
import {
  useFieldLike,
  useListenToListenToArray,
} from "../field/use-field-like";
import { useFieldLikeSync } from "../field/use-field-like-sync";

export interface FieldArrayRenderProps<T = any, F = any>
  extends FieldInstanceBaseProps<T, F> {
  children: (props: FieldArrayInstance<T, F>) => JSX.Element;
  initialValue?: T[];
  memoChild?: any[];
}

function FieldArrayComp<T = any, F = any>(
  props: FieldArrayRenderProps<T, F>,
  ref: ForwardedRef<FieldArrayInstance<T, F>>
) {
  const { children, memoChild } = props;

  const {
    value,
    errors,
    setErrors,
    setValue: setValues,
    isTouched,
    isDirty,
    isValid,
    _normalizedDotName,
    runFieldValidation,
    valueRef,
    setIsDirty,
    setIsTouched,
  } = useFieldLike<T, F, FieldArrayInstance<T, F>>({
    props,
    initialValue: [] as T[],
  });

  useListenToListenToArray({
    listenTo: props.listenTo,
    runFieldValidation,
    valueRef,
  });

  const setValue = useCallback(
    (index: number, value: T) => {
      setValues((v) => {
        const newValues = [...v];
        newValues[index] = value;
        return newValues;
      });
    },
    [setValues]
  );

  /* Helpers */
  const add = useCallback(
    (val: T) => {
      setValues((v) => [...v, val]);
    },
    [setValues]
  );

  const remove = useCallback(
    (index: number) => {
      setValues((v) => {
        const newValue = [...v];
        newValue.splice(index, 1);
        return newValue;
      });
    },
    [setValues]
  );

  const insert = useCallback(
    (index: number, val: T) => {
      setValues((v) => {
        const newValue = [...v];
        newValue.splice(index, 0, val);
        return newValue;
      });
    },
    [setValues]
  );

  const move = useCallback(
    (from: number, to: number) => {
      setValues((v) => {
        const newValue = [...v];
        const value = newValue[from];
        newValue.splice(from, 1);
        newValue.splice(to, 0, value);
        return newValue;
      });
    },
    [setValues]
  );

  const replace = useCallback(
    (index: number, val: T) => {
      setValues((v) => {
        const newValue = [...v];
        newValue[index] = val;
        return newValue;
      });
    },
    [setValues]
  );

  const swap = useCallback(
    (indexA: number, indexB: number) => {
      setValues((v) => {
        const newValue = [...v];
        const a = newValue[indexA];
        newValue[indexA] = newValue[indexB];
        newValue[indexB] = a;
        return newValue;
      });
    },
    [setValues]
  );

  const fieldArrayInstance = useMemo(() => {
    return {
      value,
      add,
      move,
      insert,
      remove,
      swap,
      replace,
      setValue,
      props,
      _normalizedDotName,
      errors,
      setErrors,
      isValid,
      setIsDirty,
      isDirty,
      setIsTouched,
      isTouched,
    };
  }, [
    value,
    add,
    move,
    insert,
    remove,
    swap,
    replace,
    setValue,
    props,
    _normalizedDotName,
    errors,
    setErrors,
    isValid,
    setIsDirty,
    isDirty,
    setIsTouched,
    isTouched,
  ]);

  const mutableRef = useRef<FieldArrayInstance<T, F>>(fieldArrayInstance);

  useFieldLikeSync<T, F, FieldArrayInstance<T, F>>({
    value,
    mutableRef,
    isValid,
    isDirty,
    isTouched,
    props,
    errors,
  });

  useImperativeHandle(ref, () => fieldArrayInstance, [fieldArrayInstance]);

  const memoizedChildren = useMemo(
    () => {
      return children(fieldArrayInstance);
    },
    memoChild
      ? memoChild.concat(fieldArrayInstance)
      : [children, fieldArrayInstance]
  );

  return (
    <FieldArrayContext.Provider value={fieldArrayInstance}>
      {memoizedChildren}
    </FieldArrayContext.Provider>
  );
}

export const FieldArray = memo(forwardRef(FieldArrayComp)) as <
  T = any,
  F = any
>(
  props: FieldArrayRenderProps<T, F> & {
    ref?: ForwardedRef<FieldArrayInstance<T, F>>;
  }
) => ReturnType<typeof FieldArrayComp>;
