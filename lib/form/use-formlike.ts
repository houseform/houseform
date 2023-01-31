import { useCallback, useMemo, useRef, useState } from "react";
import { FieldInstance } from "houseform";

/**
 * A "formlike" is a form or field that keeps track
 * of other fields. We still want utility methods and props
 * like "isTouched" and such, but don't want to duplicate the code logic
 */
export const useFormlike = () => {
  const formFieldsRef = useRef<FieldInstance[]>([]);

  const getErrors = useCallback(() => {
    return formFieldsRef.current.reduce((acc, field) => {
      return acc.concat(field.errors);
    }, [] as string[]);
  }, [formFieldsRef]);

  const [errors, setErrors] = useState(getErrors());

  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);

  const getFieldBoolean = useCallback(
    (booleanFieldName: keyof FieldInstance) => {
      return formFieldsRef.current.some((field) => {
        return !!field[booleanFieldName];
      });
    },
    [formFieldsRef]
  );

  const [isDirty, setIsDirty] = useState(getFieldBoolean("isDirty"));
  const [isTouched, setIsTouched] = useState(getFieldBoolean("isTouched"));

  const recomputeErrors = useCallback(() => {
    setErrors(getErrors());
  }, [getErrors]);

  const recomputeIsDirty = useCallback(() => {
    setIsDirty(getFieldBoolean("isDirty"));
  }, [getFieldBoolean]);

  const recomputeIsTouched = useCallback(() => {
    setIsTouched(getFieldBoolean("isTouched"));
  }, [getFieldBoolean]);

  return {
    formFieldsRef,
    getErrors,
    errors,
    setErrors,
    isValid,
    getFieldBoolean,
    isDirty,
    isTouched,
    recomputeErrors,
    recomputeIsDirty,
    recomputeIsTouched,
  };
};
