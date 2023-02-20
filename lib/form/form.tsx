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
import type { ZodError } from "zod";
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
  const { onSubmit, children } = props;

  const formLike = useFormlike<
    FieldInstance<any, T> | FieldArrayInstance<any, T>
  >();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const getFieldValue = useCallback(
    (name: string) => {
      const found = formLike.formFieldsRef.current.find(
        (field) => field.props.name === name
      );
      if (found) return found;
      const normalizedName = stringToPath(name).join(".");
      return formLike.formFieldsRef.current.find(
        (field) => field._normalizedDotName === normalizedName
      );
    },
    [formLike.formFieldsRef]
  ) as FormInstance<T>["getFieldValue"];

  const onChangeListenerRefs = useRef({} as Record<string, (() => void)[]>);
  const onBlurListenerRefs = useRef({} as Record<string, (() => void)[]>);
  const onMountListenerRefs = useRef({} as Record<string, (() => void)[]>);

  const baseValue = useMemo(() => {
    return Object.assign(formLike, {
      getFieldValue,
      onChangeListenerRefs,
      onBlurListenerRefs,
      onMountListenerRefs,
      isSubmitted,
      setIsSubmitted,
      submit: () => Promise.resolve(true),
    });
  }, [formLike, getFieldValue, isSubmitted]);

  const submit = useCallback(async () => {
    setIsSubmitted(true);
    const values = {} as T;

    const validArrays = await Promise.all(
      formLike.formFieldsRef.current.map(async (formField) => {
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

    onSubmit?.(values, baseValue);
    return true;
  }, [baseValue, formLike, onSubmit]);

  const value = useMemo(() => {
    return Object.assign(baseValue, { submit });
  }, [baseValue, submit]);

  useImperativeHandle(ref, () => value, [value]);

  return (
    <FormContext.Provider value={value}>{children(value)}</FormContext.Provider>
  );
}

export const Form = memo(forwardRef(FormComp)) as <T = Record<string, any>>(
  props: FormProps<T> & { ref?: ForwardedRef<FormInstance<T>> }
) => ReturnType<typeof FormComp>;
