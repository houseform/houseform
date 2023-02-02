import { MutableRefObject, useContext, useLayoutEffect } from "react";
import { FieldArrayInstance, FieldInstance, FormContext } from "houseform";

export interface UseFieldLikeSyncProps<
  T,
  TT extends FieldInstance<T> | FieldArrayInstance<T>
> {
  mutableRef: MutableRefObject<TT>;
  props: TT["props"];
  value: TT["value"];
  errors: TT["errors"];
  isDirty: TT["isDirty"];
  isValid: TT["isValid"];
  isTouched: TT["isTouched"];
}

export const useFieldLikeSync = <
  T,
  TT extends FieldInstance<T> | FieldArrayInstance<T>
>({
  mutableRef,
  props,
  value,
  errors,
  isDirty,
  isValid,
  isTouched,
}: UseFieldLikeSyncProps<T, TT>) => {
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

  /**
   * Sync the values with the mutable ref
   */
  useLayoutEffect(() => {
    mutableRef.current.value = value;
  }, [value]);

  useLayoutEffect(() => {
    mutableRef.current.errors = errors;
  }, [errors]);

  useLayoutEffect(() => {
    mutableRef.current.isDirty = isDirty;
  }, [isDirty]);

  useLayoutEffect(() => {
    mutableRef.current.isValid = isValid;
  }, [isValid]);

  useLayoutEffect(() => {
    mutableRef.current.isTouched = isTouched;
  }, [isTouched]);
};
