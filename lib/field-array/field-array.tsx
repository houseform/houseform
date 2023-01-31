import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useState,
} from "react";
import { FieldInstanceBaseProps } from "../field/types";
import { FieldArrayContext } from "./context";
import { FieldArrayInstance } from "./types";

export interface FieldArrayRenderProps<T = any>
  extends FieldInstanceBaseProps<T> {
  children: (props: FieldArrayContext<T>) => JSX.Element;
  initialValue?: T[];
}

function FieldArrayComp<T>(
  props: FieldArrayRenderProps<T>,
  ref: ForwardedRef<FieldArrayInstance<T>>
) {
  const [value, setValues] = useState([] as T[]);

  function add(val: T) {
    setValues((v) => [...v, val]);
  }

  function setValue(index: number, value: T) {
    setValues((v) => {
      const newValues = [...v];
      newValues[index] = value;
      return newValues;
    });
  }

  return (
    <FieldArrayContext.Provider
      value={{ value, add, setValue, name: props.name }}
    >
      {props.children({ value, add, setValue, name: props.name })}
    </FieldArrayContext.Provider>
  );
}

export const FieldArray = memo(forwardRef(FieldArrayComp)) as <T>(
  props: FieldArrayRenderProps<T> & {
    ref?: ForwardedRef<FieldArrayInstance<T>>;
  }
) => ReturnType<typeof FieldArrayComp>;
