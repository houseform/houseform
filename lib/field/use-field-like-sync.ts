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

  const {
    formFieldsRef,
    recomputeErrors,
    recomputeIsTouched,
    recomputeIsDirty,
  } = formContext;

  /**
   * Add mutable ref to formFieldsRef
   */
  useLayoutEffect(() => {
    mutableRef.current.props = props;
    const newMutable = mutableRef.current;
    formFieldsRef.current.push(newMutable);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      formFieldsRef.current.slice(formFieldsRef.current.indexOf(newMutable), 1);
    };
  }, [formFieldsRef, mutableRef, props]);

  /**
   * Sync the values with the mutable ref
   */
  useLayoutEffect(() => {
    mutableRef.current.value = value;
  }, [mutableRef, value]);

  useLayoutEffect(() => {
    mutableRef.current.errors = errors;
  }, [errors, mutableRef]);

  useLayoutEffect(() => {
    mutableRef.current.isDirty = isDirty;
  }, [isDirty, mutableRef]);

  useLayoutEffect(() => {
    mutableRef.current.isValid = isValid;
  }, [isValid, mutableRef]);

  useLayoutEffect(() => {
    mutableRef.current.isTouched = isTouched;
  }, [isTouched, mutableRef]);

  /**
   * Recompute form errors when field errors change
   */
  useLayoutEffect(() => {
    recomputeErrors();
  }, [errors, recomputeErrors]);

  useLayoutEffect(() => {
    recomputeIsTouched();
  }, [isTouched, recomputeIsTouched]);

  useLayoutEffect(() => {
    recomputeIsDirty();
  }, [isDirty, recomputeIsDirty]);
};
