import { MutableRefObject } from "react";
import { FieldInstance } from "./types";
import { FieldArrayInstance } from "../field-array";
import { useFormContext } from "../form";
import useIsomorphicLayoutEffect from "../utils/use-isomorphic-layout-effect";

export interface UseFieldLikeSyncProps<
  T,
  F,
  TT extends FieldInstance<T, F> | FieldArrayInstance<T, F>
> {
  fieldInstanceRef: MutableRefObject<TT>;
  props: TT["props"];
  value: TT["value"];
  errors: TT["errors"];
  isDirty: TT["isDirty"];
  isValid: TT["isValid"];
  isTouched: TT["isTouched"];
  isValidating: TT["isValidating"];
  preserveValue?: boolean;
}

export const useFieldLikeSync = <
  T,
  F,
  TT extends FieldInstance<T, F> | FieldArrayInstance<T, F>
>({
  fieldInstanceRef,
  props,
  value,
  errors,
  isDirty,
  isValid,
  isTouched,
  isValidating,
  preserveValue,
}: UseFieldLikeSyncProps<T, F, TT>) => {
  const formContext = useFormContext<F>();

  /**
   * Add mutable ref to formFieldsRef
   */
  useIsomorphicLayoutEffect(() => {
    fieldInstanceRef.current.props = props;
    const fieldInstance = fieldInstanceRef.current;
    const formFields = formContext.formFieldsRef.current;
    formContext.deleteField(props.name);
    formFields.push(fieldInstance);

    if (!preserveValue) {
      return () => {
        formContext.deleteField(props.name);
      };
    }
  }, [
    formContext.deleteField,
    formContext.formFieldsRef,
    fieldInstanceRef,
    props,
    preserveValue,
  ]);

  /**
   * Sync the values with the mutable ref
   */
  useIsomorphicLayoutEffect(() => {
    fieldInstanceRef.current.value = value;
  }, [fieldInstanceRef, value]);

  useIsomorphicLayoutEffect(() => {
    fieldInstanceRef.current.errors = errors;
  }, [errors, fieldInstanceRef]);

  useIsomorphicLayoutEffect(() => {
    fieldInstanceRef.current.isDirty = isDirty;
  }, [isDirty, fieldInstanceRef]);

  useIsomorphicLayoutEffect(() => {
    fieldInstanceRef.current.isValid = isValid;
  }, [isValid, fieldInstanceRef]);

  useIsomorphicLayoutEffect(() => {
    fieldInstanceRef.current.isTouched = isTouched;
  }, [isTouched, fieldInstanceRef]);

  useIsomorphicLayoutEffect(() => {
    fieldInstanceRef.current.isValidating = isValidating;
  }, [isValidating, fieldInstanceRef]);

  /**
   * Recompute form errors when field errors change
   */
  useIsomorphicLayoutEffect(() => {
    formContext.recomputeErrors();
    return () => {
      formContext.recomputeErrors();
    };
  }, [errors, formContext.recomputeErrors]);

  useIsomorphicLayoutEffect(() => {
    formContext.recomputeIsTouched();
    return () => {
      formContext.recomputeIsTouched();
    };
  }, [isTouched, formContext.recomputeIsTouched]);

  useIsomorphicLayoutEffect(() => {
    formContext.recomputeIsDirty();
    return () => {
      formContext.recomputeIsDirty();
    };
  }, [isDirty, formContext.recomputeIsDirty]);

  useIsomorphicLayoutEffect(() => {
    formContext.recomputeIsValidating();
    return () => {
      formContext.recomputeIsValidating();
    };
  }, [isValidating, formContext.recomputeIsValidating]);

  useIsomorphicLayoutEffect(() => {
    formContext.recomputeFormValue();
    return () => {
      formContext.recomputeFormValue();
    };
  }, [value, formContext.recomputeFormValue]);
};
