import { useCallback, useMemo, useRef, useState } from "react";

export interface FormlikeField<T = any> {
  errors: string[];
  isDirty: boolean;
  isTouched: boolean;
}

/**
 * A "formlike" is a form or field that keeps track
 * of other fields. We still want utility methods and props
 * like "isTouched" and such, but don't want to duplicate the code logic
 */
export const useFormlike = <T extends FormlikeField>() => {
  const formFieldsRef = useRef<T[]>([]);

  const getErrors = useCallback(() => {
    return formFieldsRef.current.reduce((acc, field) => {
      return acc.concat(field.errors);
    }, [] as string[]);
  }, [formFieldsRef]);

  const getFieldBoolean = useCallback(
    (booleanFieldName: keyof T) => {
      return formFieldsRef.current.some((field) => {
        return !!field[booleanFieldName];
      });
    },
    [formFieldsRef]
  );

  return {
    formFieldsRef,
    getErrors,
    getFieldBoolean,

    get errors() {
      return getErrors();
    },
    get isValid() {
      return getErrors().length === 0;
    },
    get isDirty() {
      return getFieldBoolean("isDirty");
    },
    get isTouched() {
      return getFieldBoolean("isTouched");
    },
  };
};
