import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { FieldInstance, FieldInstanceProps } from "./types";
import { useFieldLike, useListenToListenToArray } from "./use-field-like";
import { useFieldLikeSync } from "./use-field-like-sync";
import { useFormContext } from "../form";

export interface FieldRenderProps<T = any, F = any>
  extends FieldInstanceProps<T, F> {
  children: (props: FieldInstance<T, F>) => JSX.Element;
}

function FieldComp<T = any, F = any>(
  props: FieldRenderProps<T, F>,
  ref: ForwardedRef<FieldInstance<T, F>>
) {
  const formContext = useFormContext<F>();
  const { children, memoChild, preserveValue } = props;

  const {
    value,
    setErrors,
    errors,
    hints,
    setHints,
    setIsDirty,
    setIsTouched,
    setValue,
    isTouched,
    isDirty,
    isValid,
    isValidating,
    isSubmitted,
    runFieldValidation,
    runFieldHintCheck,
    valueRef,
    _normalizedDotName,
    _setIsValidating,
    validate,
    checkHint,
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

    runFieldHintCheck("onBlurHint", valueRef.current);
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
      isSubmitted,
      onBlur,
      _normalizedDotName,
      _setIsValidating,
      validate,
      hints,
      setHints,
      checkHint,
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
    isSubmitted,
    onBlur,
    _normalizedDotName,
    _setIsValidating,
    validate,
    hints,
    setHints,
    checkHint,
  ]);

  const fieldInstanceRef = useRef<FieldInstance<T>>(fieldInstance);

  useFieldLikeSync<T, F, FieldInstance<T, F>>({
    fieldInstanceRef,
    props,
    value,
    errors,
    isValid,
    isDirty,
    isTouched,
    isValidating,
    preserveValue,
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
