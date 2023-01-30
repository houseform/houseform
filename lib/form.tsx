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
import { FormContext, initialContext } from "./context";
import { FieldProps } from "./types";
import { getValidationError, validate } from "./utils";

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
  onSubmit: (values: Record<string, T>, form: FormContext<T>) => void;
  children: (props: FormState) => JSX.Element;
}

function FormComp<T>(
  props: FormProps<T>,
  ref: ForwardedRef<FormContext<T>>
) {
  const formFieldsRef = useRef<FieldProps[]>([]);

  const getErrors = useCallback(() => {
    return formFieldsRef.current.reduce((acc, field) => {
      return acc.concat(field.errors);
    }, [] as string[]);
  }, [formFieldsRef]);

  const [errors, setErrors] = useState(getErrors());

  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const getFieldBoolean = useCallback(
    (booleanFieldName: keyof FieldProps) => {
      return formFieldsRef.current.some((field) => {
        return !!field[booleanFieldName];
      });
    },
    [formFieldsRef]
  );

  const [isDirty, setIsDirty] = useState(getFieldBoolean("isDirty"));
  const [isTouched, setIsTouched] = useState(getFieldBoolean("isTouched"));

  const recomputeErrors = useCallback(() => {
    setErrors(getErrors());
  }, [getErrors]);

  const recomputeIsDirty = useCallback(() => {
    setIsDirty(getFieldBoolean("isDirty"));
  }, [getFieldBoolean]);

  const recomputeIsTouched = useCallback(() => {
    setIsTouched(getFieldBoolean("isTouched"));
  }, [getFieldBoolean]);

  const getFieldValue = useCallback(
    (name: string) => {
      return formFieldsRef.current.find((field) => field.props.name === name);
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
        values[formField.props.name] = formField.value;
        return true;
      })
    );

    if (!validArrays.every((isValid) => !!isValid)) return false;

    props.onSubmit(values, baseValue);
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
