import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ZodError } from "zod";
import { fillPath, getValidationError, stringToPath, validate } from "../utils";
import { useFormlike } from "./use-formlike";
import { FieldInstance } from "../field";
import { FieldArrayInstance } from "../field-array";
import { FormInstance } from "./types";
import { FormContext } from "./context";

export interface FormProps<T> {
  onSubmit?: (values: T, form: FormInstance<T>) => void;
  children: (props: FormInstance<T>) => JSX.Element;
}

function FormComp<T extends Record<string, any> = Record<string, any>>(
  props: FormProps<T>,
  ref: ForwardedRef<FormInstance<T>>
) {
  const {
    formFieldsRef,
    errors,
    isValid,
    isDirty,
    setErrors,
    setIsDirty,
    setIsTouched,
    isTouched,
    recomputeErrors,
    recomputeIsDirty,
    recomputeIsTouched,
  } = useFormlike<FieldInstance<any, T> | FieldArrayInstance<any, T>>();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const getFieldValue = useCallback(
    (name: string) => {
      const found = formFieldsRef.current.find(
        (field) => field.props.name === name
      );
      if (found) return found;
      const normalizedName = stringToPath(name).join(".");
      return formFieldsRef.current.find(
        (field) => field._normalizedDotName === normalizedName
      );
    },
    [formFieldsRef]
  ) as FormInstance<T>["getFieldValue"];

  const onChangeListenerRefs = useRef({} as Record<string, (() => void)[]>);
  const onBlurListenerRefs = useRef({} as Record<string, (() => void)[]>);

  const baseValue = useMemo(() => {
    return {
      formFieldsRef,
      errors,
      recomputeErrors,
      getFieldValue,
      onChangeListenerRefs,
      onBlurListenerRefs,
      recomputeIsDirty,
      recomputeIsTouched,
      isTouched,
      isDirty,
      isSubmitted,
      isValid,
      setIsSubmitted,
      setErrors,
      setIsDirty,
      setIsTouched,
      submit: () => Promise.resolve(true),
    };
  }, [
    formFieldsRef,
    errors,
    recomputeErrors,
    getFieldValue,
    recomputeIsDirty,
    recomputeIsTouched,
    isTouched,
    isDirty,
    isSubmitted,
    isValid,
    setErrors,
    setIsDirty,
    setIsTouched,
  ]);

  const submit = useCallback(async () => {
    setIsSubmitted(true);
    const values = {} as T;

    const validArrays = await Promise.all(
      formFieldsRef.current.map(async (formField) => {
        const runValidationType = async (
          type: "onChangeValidate" | "onSubmitValidate" | "onBlurValidate"
        ) => {
          if (!formField.props[type as "onChangeValidate"]) return true;
          try {
            await validate(
              formField.value,
              baseValue,
              formField.props[type as "onChangeValidate"]!
            );
            return true;
          } catch (error) {
            formField.setErrors(getValidationError(error as ZodError | string));
            return false;
          }
        };
        const onChangeRes = await runValidationType("onChangeValidate");
        if (!onChangeRes) return false;
        const onBlurRes = await runValidationType("onBlurValidate");
        if (!onBlurRes) return false;
        const onSubmitRes = await runValidationType("onSubmitValidate");
        if (!onSubmitRes) return false;
        if (formField.errors.length > 0) return false;
        fillPath(values, formField.props.name, formField.value);
        return true;
      })
    );

    if (!validArrays.every((isValid) => !!isValid)) return false;

    props.onSubmit?.(values, baseValue);
    return true;
  }, [baseValue, formFieldsRef, props]);

  const value = useMemo(() => {
    return { ...baseValue, submit };
  }, [baseValue, submit]);

  useImperativeHandle(ref, () => value, [value]);

  const children = useMemo(() => props.children(value), [value]);

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export const Form = memo(forwardRef(FormComp)) as <T = Record<string, any>>(
  props: FormProps<T> & { ref?: ForwardedRef<FormInstance<T>> }
) => ReturnType<typeof FormComp>;
