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
import { FieldInstanceProps, FieldInstance } from "./types";
import { FormContext } from "../form/context";
import { stringToPath } from "../utils";
import { useFieldLike } from "./use-field-like";
import { useFieldLikeSync } from "./use-field-like-sync";

export interface FieldRenderProps<T = any> extends FieldInstanceProps<T> {
  children: (props: FieldInstance<T>) => JSX.Element;
  initialValue?: T;
}

function FieldComp<T>(
  props: FieldRenderProps<T>,
  ref: ForwardedRef<FieldInstance<T>>
) {
  const formContext = useContext(FormContext);

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
  } = useFieldLike<T, FieldInstance<T>>({
    props,
    initialValue: "" as T,
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
  }, []);

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

  useFieldLikeSync<T, FieldInstance<T>>({
    mutableRef,
    props,
    value,
    errors,
    isValid,
    isDirty,
    isTouched,
  });

  useImperativeHandle(ref, () => fieldInstance, [fieldInstance]);

  return props.children(fieldInstance);
}

export const Field = memo(forwardRef(FieldComp)) as <T>(
  props: FieldRenderProps<T> & { ref?: ForwardedRef<FieldInstance<T>> }
) => ReturnType<typeof FieldComp>;
