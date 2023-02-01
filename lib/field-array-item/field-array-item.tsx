import React, { useContext, useMemo, useState } from "react";
import { ZodError, ZodType } from "zod";
import {
  fillPath,
  getPath,
  getValidationError,
  stringToPath,
  validate,
} from "houseform";
import { FieldArrayContext } from "../field-array/context";

export function FieldArrayItem<T>({
  children,
  name,
  onChangeValidate,
}: {
  children: ({
    setValue,
  }: {
    setValue: (v: T) => void;
    errors: string[];
    value: T;
  }) => React.ReactNode;
  name: string;
  onChangeValidate?: ZodType;
}) {
  const array = useContext(FieldArrayContext) as FieldArrayContext<T>;

  const [errors, setErrors] = useState<string[]>([]);

  const fullAccessorPath = useMemo(() => {
    const arrayNamePathArr = stringToPath(array.name);
    const fieldItemPathArr = stringToPath(name);
    for (const i of arrayNamePathArr) {
      if (i !== fieldItemPathArr.shift()) {
        throw new Error("Invalid name");
      }
    }
    return fieldItemPathArr;
  }, [array.name, name]);

  const itemIndex = useMemo(() => {
    return parseInt(fullAccessorPath[0]);
  }, [fullAccessorPath]);

  const accessorPath = useMemo(() => {
    return fullAccessorPath.slice(1);
  }, [fullAccessorPath]);

  const value = useMemo(() => {
    return getPath(array.value[itemIndex] as object, accessorPath.join("."));
  }, [array.value, itemIndex]);

  function setValue(v: T) {
    const vv = { ...array.value[itemIndex] } as object;
    fillPath(vv, accessorPath.join("."), v);
    array.setValue(itemIndex, vv as T);
    if (onChangeValidate) {
      validate(v, null as any, onChangeValidate)
        .then(() => {
          setErrors([]);
        })
        .catch((error: string | ZodError) => {
          setErrors(getValidationError(error as ZodError | string));
        });
    }
  }

  return <>{children({ setValue, errors, value })}</>;
}
