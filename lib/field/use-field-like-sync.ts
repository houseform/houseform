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
  isValidating: TT["isValidating"];
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
  isValidating,
}: UseFieldLikeSyncProps<T, F, TT>) => {
  const formContext = useContext(FormContext);

  /**
   * Add mutable ref to formFieldsRef
   */
  useIsomorphicLayoutEffect(() => {
    mutableRef.current.props = props;
    const newMutable = mutableRef.current;
    formContext.formFieldsRef.current.push(newMutable);

    return () => {
      formContext.formFieldsRef.current.splice(
        formContext.formFieldsRef.current.indexOf(newMutable),
        1
      );
    };
  }, [formContext.formFieldsRef, mutableRef, props]);

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

  useIsomorphicLayoutEffect(() => {
    mutableRef.current.isValidating = isValidating;
  }, [isValidating, mutableRef]);

  /**
   * Recompute form errors when field errors change
   */
  useIsomorphicLayoutEffect(() => {
    formContext.recomputeErrors();
  }, [errors, formContext.recomputeErrors]);

  useIsomorphicLayoutEffect(() => {
    formContext.recomputeIsTouched();
  }, [isTouched, formContext.recomputeIsTouched]);

  useIsomorphicLayoutEffect(() => {
    formContext.recomputeIsDirty();
  }, [isDirty, formContext.recomputeIsDirty]);
};
