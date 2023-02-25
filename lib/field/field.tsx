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
import { FormContext } from "../form";

export interface FieldRenderProps<T = any, F = any>
  extends FieldInstanceProps<T, F> {
  children: (props: FieldInstance<T, F>) => JSX.Element;
  initialValue?: T;
  memoChild?: any[];
}

function FieldComp<T = any, F = any>(
  props: FieldRenderProps<T, F>,
  ref: ForwardedRef<FieldInstance<T, F>>
) {
  const formContext = useContext(FormContext);
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
    runFieldValidation,
    valueRef,
    _normalizedDotName,
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
      onBlur,
      _normalizedDotName,
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
    onBlur,
    _normalizedDotName,
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
