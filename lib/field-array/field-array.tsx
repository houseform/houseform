import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { FieldArrayContext } from "./context";
import { FieldArrayInstance, FieldArrayInstanceProps } from "./types";
import {
  InternalValue,
  isInternal,
  useFieldLike,
  useListenToListenToArray,
} from "../field/use-field-like";
import { useFieldLikeSync } from "../field/use-field-like-sync";

export interface FieldArrayRenderProps<T = any, F = any>
  extends FieldArrayInstanceProps<T, F> {
  children: (props: FieldArrayInstance<T, F>) => JSX.Element;
}

function FieldArrayComp<T = any, F = any>(
  props: FieldArrayRenderProps<T, F>,
  ref: ForwardedRef<FieldArrayInstance<T, F>>
) {
  const { children, memoChild, preserveValue } = props;

  const {
    value,
    errors,
    setErrors,
    setValue: setValues,
    hints,
    setHints,
    isTouched,
    isDirty,
    isValid,
    isValidating,
    _normalizedDotName,
    _setIsValidating,
    runFieldValidation,
    valueRef,
    setIsDirty,
    setIsTouched,
    validate,
    checkHint,
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
      /**
       * Because `FieldArrayItem` utilizes `FieldArray.setValue`, we need to add
       * This edge-guard here, otherwise we run into strange issues with `reset`
       */
      const isResetting = isInternal(value) && value.__isResetting;
      const newValue = isInternal<T>(value) ? value.__value : value;

      const updateFn = (v: T[]) => {
        const newValues = [...v];
        newValues[index] = newValue;
        return newValues;
      };

      if (isResetting) {
        setValues({
          __value: updateFn,
          __isResetting: true,
        } as InternalValue<(prevState: T[]) => T[]> as unknown as (prevState: T[]) => T[]);
        return;
      }

      setValues(updateFn);
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
      _setIsValidating,
      errors,
      setErrors,
      hints,
      setHints,
      isValid,
      isValidating,
      setIsDirty,
      isDirty,
      setIsTouched,
      isTouched,
      setValues,
      validate,
      checkHint,
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
    _setIsValidating,
    errors,
    setErrors,
    hints,
    setHints,
    isValid,
    isValidating,
    setIsDirty,
    isDirty,
    setIsTouched,
    isTouched,
    setValues,
    validate,
    checkHint,
  ]);

  const fieldInstanceRef = useRef<FieldArrayInstance<T, F>>(fieldArrayInstance);

  useFieldLikeSync<T, F, FieldArrayInstance<T, F>>({
    value,
    fieldInstanceRef,
    isValid,
    isValidating,
    isDirty,
    isTouched,
    props,
    errors,
    preserveValue,
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
