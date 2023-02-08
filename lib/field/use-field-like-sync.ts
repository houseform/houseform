import { MutableRefObject, useContext } from "react";
import { FieldInstance } from "./types";
import { FieldArrayInstance } from "../field-array";
import { FormContext } from "../form";
import useIsomorphicLayoutEffect from "../utils/use-isomorphic-layout-effect";

export interface UseFieldLikeSyncProps<
  T,
  F,
  TT extends FieldInstance<T, F> | FieldArrayInstance<T, F>
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
  F,
  TT extends FieldInstance<T, F> | FieldArrayInstance<T, F>
>({
  mutableRef,
  props,
  value,
  errors,
  isDirty,
  isValid,
  isTouched,
}: UseFieldLikeSyncProps<T, F, TT>) => {
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
  useIsomorphicLayoutEffect(() => {
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
  useIsomorphicLayoutEffect(() => {
    mutableRef.current.value = value;
  }, [mutableRef, value]);

  useIsomorphicLayoutEffect(() => {
    mutableRef.current.errors = errors;
  }, [errors, mutableRef]);

  useIsomorphicLayoutEffect(() => {
    mutableRef.current.isDirty = isDirty;
  }, [isDirty, mutableRef]);

  useIsomorphicLayoutEffect(() => {
    mutableRef.current.isValid = isValid;
  }, [isValid, mutableRef]);

  useIsomorphicLayoutEffect(() => {
    mutableRef.current.isTouched = isTouched;
  }, [isTouched, mutableRef]);

  /**
   * Recompute form errors when field errors change
   */
  useIsomorphicLayoutEffect(() => {
    recomputeErrors();
  }, [errors, recomputeErrors]);

  useIsomorphicLayoutEffect(() => {
    recomputeIsTouched();
  }, [isTouched, recomputeIsTouched]);

  useIsomorphicLayoutEffect(() => {
    recomputeIsDirty();
  }, [isDirty, recomputeIsDirty]);
};
