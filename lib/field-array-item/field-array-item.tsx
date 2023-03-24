import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useFieldArrayContext } from "../field-array/context";
import {
  FieldInstance,
  FieldInstanceProps,
  useFieldLike,
  useFieldLikeSync,
  useListenToListenToArray,
} from "../field";
import { fillPath, getPath, stringToPath } from "../utils";
import { useFormContext } from "../form";

export interface FieldArrayItemRenderProps<T = any, F = any>
  extends FieldInstanceProps<T, F> {
  children: (props: FieldInstance<T, F>) => JSX.Element;
  memoChild?: any[];
}

export function FieldArrayItemComp<T = any, F = any>(
  props: FieldArrayItemRenderProps<T, F>,
  ref: ForwardedRef<FieldInstance<T, F>>
) {
  const { children, memoChild, preserveValue } = props;

  const {
    _normalizedDotName,
    _setIsValidating,
    errors,
    setErrors,
    runFieldValidation,
    isValid,
    isValidating,
    isTouched,
    setIsTouched,
    isDirty,
    setIsDirty,
    validate,
  } = useFieldLike<T, F, FieldInstance<T, F>>({
    props,
    initialValue: "" as T,
  });

  const array = useFieldArrayContext<T>();
  const formContext = useFormContext<F>();

  const fullAccessorPath = useMemo(() => {
    const arrayNamePathArr = stringToPath(array.props.name);
    const fieldItemPathArr = stringToPath(props.name);
    for (const i of arrayNamePathArr) {
      if (i !== fieldItemPathArr.shift()) {
        throw new Error(
          "You must prepend the FieldArrayItem name with the name of the parent FieldArray"
        );
      }
    }
    return fieldItemPathArr;
  }, [array.props.name, props.name]);

  const itemIndex = useMemo(() => {
    return parseInt(fullAccessorPath[0]);
  }, [fullAccessorPath]);

  const accessorPath = useMemo(() => {
    return fullAccessorPath.slice(1);
  }, [fullAccessorPath]);

  const value = useMemo(() => {
    return getPath(array.value[itemIndex] as object, accessorPath.join("."));
  }, [accessorPath, array.value, itemIndex]);

  const valueRef = useRef(value);

  valueRef.current = value;

  useListenToListenToArray({
    listenTo: props.listenTo,
    runFieldValidation,
    valueRef,
  });

  const setValue = useCallback(
    (v: T | ((prevState: T) => T)) => {
      const isPrevAFunction = (t: any): t is (prevState: T) => T =>
        typeof t === "function";

      const newVal = isPrevAFunction(v) ? v(array.value[itemIndex]) : v;

      const newArrayObject = { ...array.value[itemIndex] } as object;
      fillPath(newArrayObject, accessorPath.join("."), newVal);
      array.setValue(itemIndex, newArrayObject as T);

      setIsDirty(true);

      /**
       * Call `listenTo` field subscribers for other fields.
       *
       * Placed into a `setTimeout` so that the `setValue` call can finish before the `onChangeListenerRefs` are called.
       */
      setTimeout(() => {
        formContext.onChangeListenerRefs.current[props.name]?.forEach((fn) =>
          fn()
        );
      }, 0);

      runFieldValidation("onChangeValidate", newVal);
    },
    [
      accessorPath,
      array,
      formContext.onChangeListenerRefs,
      itemIndex,
      props.name,
      runFieldValidation,
      setIsDirty,
    ]
  );

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

  const fieldArrayInstance = useMemo(() => {
    return {
      setValue,
      errors,
      value,
      _normalizedDotName,
      _setIsValidating,
      onBlur,
      props,
      isTouched,
      isValid,
      isDirty,
      isValidating,
      setIsDirty,
      setErrors,
      setIsTouched,
      validate,
    };
  }, [
    setValue,
    errors,
    value,
    _normalizedDotName,
    _setIsValidating,
    onBlur,
    props,
    isTouched,
    isValid,
    isDirty,
    isValidating,
    setIsDirty,
    setErrors,
    setIsTouched,
    validate,
  ]);

  const fieldInstanceRef = useRef<FieldInstance<T>>(fieldArrayInstance);

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

  useImperativeHandle(ref, () => fieldArrayInstance, [fieldArrayInstance]);

  const memoizedChildren = useMemo(
    () => {
      return children(fieldArrayInstance);
    },
    memoChild
      ? memoChild.concat(fieldArrayInstance)
      : [children, fieldArrayInstance]
  );

  return memoizedChildren;
}

export const FieldArrayItem = memo(forwardRef(FieldArrayItemComp)) as <
  T = any,
  F = any
>(
  props: FieldArrayItemRenderProps<T, F> & {
    ref?: ForwardedRef<FieldInstance<T, F>>;
  }
) => ReturnType<typeof FieldArrayItemComp>;
