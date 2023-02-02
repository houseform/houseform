import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { FieldInstanceBaseProps } from "../field/types";
import { FieldArrayContext } from "./context";
import { FieldArrayInstance } from "./types";
import { FormContext } from "../form";
import { useFieldLike } from "../field/use-field-like";

export interface FieldArrayRenderProps<T = any>
  extends FieldInstanceBaseProps<T> {
  children: (props: FieldArrayInstance<T>) => JSX.Element;
  initialValue?: T[];
}

function FieldArrayComp<T>(
  props: FieldArrayRenderProps<T>,
  ref: ForwardedRef<FieldArrayInstance<T>>
) {
  const {
    value,
    setErrors,
    errors,
    setIsDirty,
    setIsTouched,
    setValue: setValues,
    isTouched,
    isDirty,
    isValid,
    runFieldValidation,
    valueRef,
    _normalizedDotName,
  } = useFieldLike<T[], FieldArrayInstance<T>>({
    props,
    initialValue: [] as T,
  });

  const setValue = useCallback((index: number, value: T) => {
    setValues((v) => {
      const newValues = [...v];
      newValues[index] = value;
      return newValues;
    });
  }, []);

  /* Helpers */
  const add = useCallback((val: T) => {
    setValues((v) => [...v, val]);
  }, []);

  const remove = useCallback((index: number) => {
    setValues((v) => {
      const newValue = [...v];
      newValue.splice(index, 1);
      return newValue;
    });
  }, []);

  const insert = useCallback((index: number, val: T) => {
    setValues((v) => {
      const newValue = [...v];
      newValue.splice(index, 0, val);
      return newValue;
    });
  }, []);

  const move = useCallback((from: number, to: number) => {
    setValues((v) => {
      const newValue = [...v];
      const value = newValue[from];
      newValue.splice(from, 1);
      newValue.splice(to, 0, value);
      return newValue;
    });
  }, []);

  const replace = useCallback((index: number, val: T) => {
    setValues((v) => {
      const newValue = [...v];
      newValue[index] = val;
      return newValue;
    });
  }, []);

  const swap = useCallback((indexA: number, indexB: number) => {
    setValues((v) => {
      const newValue = [...v];
      const a = newValue[indexA];
      newValue[indexA] = newValue[indexB];
      newValue[indexB] = a;
      return newValue;
    });
  }, []);

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
      isValid,
      isDirty,
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
    isValid,
    isDirty,
    isTouched,
  ]);

  const mutableRef = useRef<FieldArrayInstance<T>>(fieldArrayInstance);

  const formContext = useContext(FormContext);

  const { formFieldsRef } = formContext;

  /**
   * Add mutable ref to formFieldsRef
   */
  useLayoutEffect(() => {
    mutableRef.current.props = props;
    const newMutable = mutableRef.current;
    formFieldsRef.current.push(newMutable);

    return () => {
      formFieldsRef.current.slice(formFieldsRef.current.indexOf(newMutable), 1);
    };
  }, [props]);

  useImperativeHandle(ref, () => fieldArrayInstance, [fieldArrayInstance]);

  return (
    <FieldArrayContext.Provider value={fieldArrayInstance}>
      {props.children(fieldArrayInstance)}
    </FieldArrayContext.Provider>
  );
}

export const FieldArray = memo(forwardRef(FieldArrayComp)) as <T>(
  props: FieldArrayRenderProps<T> & {
    ref?: ForwardedRef<FieldArrayInstance<T>>;
  }
) => ReturnType<typeof FieldArrayComp>;
