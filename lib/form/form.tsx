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
import { FieldInstance } from "../field";
import { FieldArrayInstance } from "../field-array";
import { FormInstance } from "./types";
import { FormContext } from "./context";
import { useRerender } from "../utils/use-rerender";

export interface FormProps<T> {
  onSubmit?: (values: T, form: FormInstance<T>) => void;
  children: (props: FormInstance<T>) => JSX.Element;
  memoChildrenArr?: any[];
}

function FormComp<T extends Record<string, any> = Record<string, any>>(
  props: FormProps<T>,
  ref: ForwardedRef<FormInstance<T>>
) {
  const { onSubmit, children, memoChildrenArr } = props;

  const formFieldsRef = useRef<
    Array<FieldInstance<any, T> | FieldArrayInstance<any, T>>
  >([]);

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
  const onMountListenerRefs = useRef({} as Record<string, (() => void)[]>);

  const setIsTouched = useCallback((val: boolean) => {
    formFieldsRef.current.forEach((field) => {
      field.setIsTouched(val);
    });
  }, []);

  const setIsDirty = useCallback((val: boolean) => {
    formFieldsRef.current.forEach((field) => {
      field.setIsDirty(val);
    });
  }, []);

  const [_errors, _setErrors] = useState<string[] | null>(null);
  const [_isValid, _setIsValid] = useState<boolean | null>(null);
  const [_isDirty, _setIsDirty] = useState<boolean | null>(null);
  const [_isTouched, _setIsTouched] = useState<boolean | null>(null);

  const shouldRerenderErrorOnRecompute = useRef(false);

  const shouldRerenderIsValidOnRecompute = useRef(false);

  const shouldRerenderIsDirtyOnRecompute = useRef(false);

  const shouldRerenderIsTouchedOnRecompute = useRef(false);

  const rerender = useRerender();

  const getErrors = useCallback(() => {
    return formFieldsRef.current.reduce((acc, field) => {
      return acc.concat(field.errors);
    }, [] as string[]);
  }, [formFieldsRef]);

  const getValidBoolean = useCallback(() => {
    if (formFieldsRef.current.length === 0) return true;
    return formFieldsRef.current.some((field) => {
      return !field.errors.length;
    });
  }, [formFieldsRef]);

  const getFieldBoolean = useCallback(
    (
      booleanFieldName: keyof (
        | FieldInstance<any, T>
        | FieldArrayInstance<any, T>
      )
    ) => {
      return formFieldsRef.current.some((field) => {
        return !!field[booleanFieldName];
      });
    },
    [formFieldsRef]
  );

  const recomputeErrors = useCallback(() => {
    if (shouldRerenderErrorOnRecompute.current) {
      const val = getErrors();
      _setErrors(val);
    }
    if (shouldRerenderIsValidOnRecompute.current) {
      const val = getValidBoolean();
      _setIsValid(val);
    }
  }, [getErrors, getValidBoolean]);

  const recomputeIsDirty = useCallback(() => {
    if (shouldRerenderIsDirtyOnRecompute.current) {
      const val = getFieldBoolean("isDirty");
      _setIsDirty(val);
    }
  }, [getFieldBoolean]);

  const recomputeIsTouched = useCallback(() => {
    if (shouldRerenderIsTouchedOnRecompute.current) {
      const val = getFieldBoolean("isTouched");
      _setIsTouched(val);
    }
  }, [getFieldBoolean]);

  const baseValue = useMemo(() => {
    return {
      getFieldValue,
      onChangeListenerRefs,
      onBlurListenerRefs,
      onMountListenerRefs,
      isSubmitted,
      setIsSubmitted,
      formFieldsRef,
      setIsTouched,
      setIsDirty,
      recomputeErrors,
      recomputeIsDirty,
      recomputeIsTouched,
      submit: () => Promise.resolve(true),
    };
  }, [
    getFieldValue,
    isSubmitted,
    recomputeErrors,
    recomputeIsDirty,
    recomputeIsTouched,
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
              baseValue as any,
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

    // TODO: Add tests to see if it gets cached version of `isDirty`, `isTouched`, `isValid`, and `errors`
    onSubmit?.(values, baseValue as any);
    return true;
  }, [baseValue, onSubmit]);

  const value = useMemo(() => {
    return {
      ...baseValue,
      submit,
      _errors,
      _isValid,
      _isDirty,
      _isTouched,
      get errors() {
        shouldRerenderErrorOnRecompute.current = true;
        if (_errors === null) {
          const val = getErrors();
          _setErrors(val);
          return val;
        }
        return _errors;
      },
      get isValid() {
        shouldRerenderIsValidOnRecompute.current = true;
        if (_isValid === null) {
          const val = getValidBoolean();
          _setIsValid(val);
          return val;
        }
        return _isValid;
      },
      get isDirty() {
        if (_isDirty === null) {
          shouldRerenderIsDirtyOnRecompute.current = true;
          const val = getFieldBoolean("isDirty");
          _setIsDirty(val);
          return val;
        }
        return _isDirty;
      },
      get isTouched() {
        if (_isTouched === null) {
          shouldRerenderIsTouchedOnRecompute.current = true;
          const val = getFieldBoolean("isTouched");
          _setIsTouched(val);
          return val;
        }
        return _isTouched;
      },
    };
  }, [
    _errors,
    _isDirty,
    _isTouched,
    _isValid,
    baseValue,
    getErrors,
    getFieldBoolean,
    getValidBoolean,
    submit,
  ]);

  useImperativeHandle(ref, () => value, [value]);

  const memoizedChildren = useMemo(
    () => {
      return children(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    memoChildrenArr ? memoChildrenArr.concat(value) : [children, value]
  );

  return (
    <FormContext.Provider value={value}>
      {memoizedChildren}
    </FormContext.Provider>
  );
}

export const Form = memo(forwardRef(FormComp)) as <T = Record<string, any>>(
  props: FormProps<T> & { ref?: ForwardedRef<FormInstance<T>> }
) => ReturnType<typeof FormComp>;
