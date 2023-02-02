import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { ZodError } from "zod";
import {
  FieldArrayInstance,
  FieldInstance,
  FieldInstanceProps,
  fillPath,
  FormContext,
  getPath,
  getValidationError,
  stringToPath,
  validate,
} from "houseform";
import { FieldArrayContext } from "../field-array/context";

export interface FieldArrayItemRenderProps<T = any>
  extends FieldInstanceProps<T> {
  children: (props: FieldInstance<T>) => JSX.Element;
}

export function FieldArrayItemComp<T>(
  props: FieldArrayItemRenderProps<T>,
  ref: ForwardedRef<FieldInstance<T>>
) {
  const { name } = props;

  const _normalizedDotName = useMemo(() => {
    return stringToPath(name).join(".");
  }, [name]);

  const array = useContext(FieldArrayContext) as FieldArrayInstance<T>;
  const formContext = useContext(FormContext);

  const [errors, setErrors] = useState<string[]>([]);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

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
  }, [array.value, itemIndex]);

  const setValue = useCallback(
    (v: T | ((prevState: T) => T)) => {
      const isPrevAFunction = (t: any): t is (prevState: T) => T =>
        typeof t === "function";

      const newVal = isPrevAFunction(v) ? v(array.value[itemIndex]) : v;

      const newArrayObject = { ...array.value[itemIndex] } as object;
      fillPath(newArrayObject, accessorPath.join("."), newVal);
      array.setValue(itemIndex, newArrayObject as T);

      setIsDirty(true);
      setIsTouched(true);

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

      if (props.onChangeValidate) {
        validate(newVal, null as any, props.onChangeValidate)
          .then(() => {
            setErrors([]);
          })
          .catch((error: string | ZodError) => {
            setErrors(getValidationError(error as ZodError | string));
          });
      }
    },
    [props.name, props.onChangeValidate]
  );

  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);

  const fieldArrayInstance = useMemo(() => {
    return {
      setValue,
      errors,
      value,
      _normalizedDotName,
      onBlur: () => {},
      props,
      isTouched,
      isValid,
      isDirty,
      setIsDirty,
      setErrors,
      setIsTouched,
    };
  }, [
    setValue,
    errors,
    value,
    _normalizedDotName,
    props,
    isTouched,
    isValid,
    isDirty,
    setIsDirty,
    setErrors,
    setIsTouched,
  ]);

  useImperativeHandle(ref, () => fieldArrayInstance, [fieldArrayInstance]);

  return props.children(fieldArrayInstance);
}

export const FieldArrayItem = memo(forwardRef(FieldArrayItemComp)) as <T>(
  props: FieldArrayItemRenderProps<T> & { ref?: ForwardedRef<FieldInstance<T>> }
) => ReturnType<typeof FieldArrayItemComp>;
