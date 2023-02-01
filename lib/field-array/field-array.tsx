import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import { FieldInstanceBaseProps } from "../field/types";
import { FieldArrayContext } from "./context";
import { FieldArrayInstance } from "./types";
import { stringToPath } from "../utils";

export interface FieldArrayRenderProps<T = any>
  extends FieldInstanceBaseProps<T> {
  children: (props: FieldArrayInstance<T>) => JSX.Element;
  initialValue?: T[];
}

function FieldArrayComp<T>(
  props: FieldArrayRenderProps<T>,
  ref: ForwardedRef<FieldArrayInstance<T>>
) {
  const { name } = props;

  const _normalizedDotName = useMemo(() => {
    return stringToPath(name).join(".");
  }, [name]);

  const [value, setValues] = useState(props.initialValue || ([] as T[]));

  const [errors, setErrors] = useState([]);

  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

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

  const contextValue = useMemo(() => {
    return {
      value,
      add,
      move,
      insert,
      remove,
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
    setValue,
    props,
    _normalizedDotName,
    errors,
    isValid,
    isDirty,
    isTouched,
  ]);

  return (
    <FieldArrayContext.Provider value={contextValue}>
      {props.children(contextValue)}
    </FieldArrayContext.Provider>
  );
}

export const FieldArray = memo(forwardRef(FieldArrayComp)) as <T>(
  props: FieldArrayRenderProps<T> & {
    ref?: ForwardedRef<FieldArrayInstance<T>>;
  }
) => ReturnType<typeof FieldArrayComp>;
