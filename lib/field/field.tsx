import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { FieldInstance, FieldInstanceProps } from "./types";
import { useFieldLike, useListenToListenToArray } from "./use-field-like";
import { useFieldLikeSync } from "./use-field-like-sync";
import { FormContext, useFormContext } from "../form";

export interface FieldRenderProps<T = any, F = any>
  extends FieldInstanceProps<T, F> {
  children: (props: FieldInstance<T, F>) => JSX.Element;
}

function FieldComp<T = any, F = any>(
  props: FieldRenderProps<T, F>,
  ref: ForwardedRef<FieldInstance<T, F>>
) {
  const formContext = useFormContext<F>();
  const { children, memoChild } = props;

  const {
    value,
    setErrors,
    errors,
    setIsDirty,
    setIsTouched,
    setValue,
    isTouched,
    isDirty,
    isValid,
    isValidating,
    runFieldValidation,
    valueRef,
    _normalizedDotName,
    _setIsValidating,
    validate,
  } = useFieldLike<T, F, FieldInstance<T, F>>({
    props,
    initialValue: "" as T,
  });

  useListenToListenToArray({
    listenTo: props.listenTo,
    runFieldValidation,
    valueRef,
  });

  const onBlur = useCallback(() => {
    setIsTouched(true);

    /**
     * Call `listenTo` field subscribers for other fields.
     *
     * Placed into a `setTimeout` so that the `setValue` call can finish before the `onChangeListenerRefs` are called.
     */
    setTimeout(() => {
      formContext.onBlurListenerRefs.current[props.name]?.forEach((fn) => fn());
    }, 0);

    runFieldValidation("onBlurValidate", valueRef.current);
  }, [
    formContext.onBlurListenerRefs,
    props.name,
    runFieldValidation,
    setIsTouched,
    valueRef,
  ]);

  const fieldInstance = useMemo(() => {
    return {
      value,
      props,
      setErrors,
      errors,
      setIsDirty,
      setIsTouched,
      setValue,
      isTouched,
      isDirty,
      isValid,
      isValidating,
      onBlur,
      _normalizedDotName,
      _setIsValidating,
      validate,
    };
  }, [
    props,
    value,
    setErrors,
    errors,
    setIsDirty,
    setIsTouched,
    setValue,
    isTouched,
    isDirty,
    isValid,
    isValidating,
    onBlur,
    _normalizedDotName,
    _setIsValidating,
    validate,
  ]);

  const mutableRef = useRef<FieldInstance<T>>(fieldInstance);

  useFieldLikeSync<T, F, FieldInstance<T, F>>({
    mutableRef,
    props,
    value,
    errors,
    isValid,
    isDirty,
    isTouched,
    isValidating,
  });

  useImperativeHandle(ref, () => fieldInstance, [fieldInstance]);

  const memoizedChildren = useMemo(
    () => {
      return children(fieldInstance);
    },
    memoChild ? memoChild.concat(fieldInstance) : [children, fieldInstance]
  );

  return memoizedChildren;
}

export const Field = memo(forwardRef(FieldComp)) as <T = any, F = any>(
  props: FieldRenderProps<T, F> & { ref?: ForwardedRef<FieldInstance<T, F>> }
) => ReturnType<typeof FieldComp>;
