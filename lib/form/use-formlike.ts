import { useCallback, useMemo, useRef, useState } from "react";
import { useRerender } from "../utils/use-rerender";

export interface FormlikeField<T = any> {
  errors: string[];
  isDirty: boolean;
  setIsDirty: (val: boolean) => void;
  isTouched: boolean;
  setIsTouched: (val: boolean) => void;
}

/**
 * A "formlike" is a form or field that keeps track
 * of other fields. We still want utility methods and props
 * like "isTouched" and such, but don't want to duplicate the code logic
 */
export const useFormlike = <T extends FormlikeField>() => {
  const formFieldsRef = useRef<T[]>([]);

  const setIsTouched = useCallback((val: boolean) => {
    formFieldsRef.current.forEach((field) => {
      field.setIsTouched(val);
    });
  }, []);

  const setIsDirty = useCallback((val: boolean) => {
    formFieldsRef.current.forEach((field) => {
      field.setIsDirty(val);
    });
  }, []);

  const rerender = useRerender();

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

  const shouldRerenderErrorOnRecompute = useRef(false);
  const shouldRerenderIsValidOnRecompute = useRef(false);
  const shouldRerenderIsDirtyOnRecompute = useRef(false);
  const shouldRerenderIsTouchedOnRecompute = useRef(false);

  const recomputeErrors = useCallback(() => {
    if (shouldRerenderErrorOnRecompute.current) {
      rerender();
    }
    if (shouldRerenderIsValidOnRecompute.current) {
      rerender();
    }
  }, [rerender]);

  const recomputeIsDirty = useCallback(() => {
    if (shouldRerenderIsDirtyOnRecompute.current) {
      rerender();
    }
  }, [rerender]);

  const recomputeIsTouched = useCallback(() => {
    if (shouldRerenderIsTouchedOnRecompute.current) {
      rerender();
    }
  }, [rerender]);

  return {
    formFieldsRef,
    getErrors,
    getFieldBoolean,
    recomputeErrors,
    recomputeIsDirty,
    recomputeIsTouched,
    setIsTouched,
    setIsDirty,
    get errors() {
      shouldRerenderErrorOnRecompute.current = true;
      return getErrors();
    },
    get isValid() {
      shouldRerenderIsValidOnRecompute.current = true;
      return getErrors().length === 0;
    },
    get isDirty() {
      shouldRerenderIsDirtyOnRecompute.current = true;
      return getFieldBoolean("isDirty");
    },
    get isTouched() {
      shouldRerenderIsTouchedOnRecompute.current = true;
      return getFieldBoolean("isTouched");
    },
  };
};
