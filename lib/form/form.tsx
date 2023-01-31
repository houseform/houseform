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
import { FormContext } from "./context";
import { fillPath, getValidationError, stringToPath, validate } from "../utils";
import { useFormlike } from "./use-formlike";

export interface FormState {
  submit: () => Promise<boolean>;
  errors: string[];
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isSubmitted: boolean;
  setIsSubmitted: (val: boolean) => void;
}

export interface FormProps<T> {
  onSubmit?: (values: Record<string, T>, form: FormContext<T>) => void;
  children: (props: FormState) => JSX.Element;
}

function FormComp<T>(props: FormProps<T>, ref: ForwardedRef<FormContext<T>>) {
  const {
    formFieldsRef,
    errors,
    isValid,
    isDirty,
    isTouched,
    recomputeErrors,
    recomputeIsDirty,
    recomputeIsTouched,
  } = useFormlike();

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
  );

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
      submit: () => Promise.resolve(true),
    };
  }, [
    formFieldsRef,
    errors,
    recomputeErrors,
    getFieldValue,
    onChangeListenerRefs,
    onBlurListenerRefs,
    recomputeIsDirty,
    recomputeIsTouched,
  ]);

  const submit = useCallback(async () => {
    setIsSubmitted(true);
    const values = {} as Record<string, T>;

    const validArrays = await Promise.all(
      formFieldsRef.current.map(async (formField) => {
        const runValidationType = async (
          type: "onChangeValidate" | "onSubmitValidate" | "onBlurValidate"
        ) => {
          if (!formField.props[type]) return true;
          try {
            await validate(formField.value, baseValue, formField.props[type]!);
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
  }, [formFieldsRef, props.onSubmit]);

  const value = useMemo(() => {
    return { ...baseValue, submit };
  }, [baseValue, submit]);

  useImperativeHandle(ref, () => value, [value]);

  const children = useMemo(() => {
    return props.children({
      submit,
      errors,
      isSubmitted,
      setIsSubmitted,
      isValid,
      isDirty,
      isTouched,
    });
  }, [
    props.children,
    submit,
    errors,
    isSubmitted,
    isValid,
    isDirty,
    isTouched,
  ]);

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export const Form = memo(forwardRef(FormComp)) as <T>(
  props: FormProps<T> & { ref?: ForwardedRef<FormContext<T>> }
) => ReturnType<typeof FormComp>;
