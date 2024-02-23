import React, {
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
import { FieldInstance, InternalValue } from "../field";
import { FieldArrayInstance } from "../field-array";
import { ErrorsMap, FormInstance } from "./types";
import { FormContext } from "./context";

export interface FormProps<T> {
  onSubmit?: (values: T, form: FormInstance<T>) => void;
  children: (props: FormInstance<T>) => JSX.Element;
  memoChild?: any[];
  submitWhenInvalid?: boolean;
}

function FormComp<T extends Record<string, any> = Record<string, any>>(
  props: FormProps<T>,
  ref: ForwardedRef<FormInstance<T>>
) {
  const { onSubmit, children, memoChild, submitWhenInvalid = false } = props;

  const formFieldsRef = useRef<
    Array<FieldInstance<any, T> | FieldArrayInstance<any, T>>
  >([]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const getFieldValue = useCallback(
    (name: string) => {
      const formFields = formFieldsRef.current;
      const normalizedName = stringToPath(name).join(".");
      return formFields.find(
        (field) => field._normalizedDotName === normalizedName
      );
    },
    [formFieldsRef]
  ) as FormInstance<T>["getFieldValue"];

  const deleteField = useCallback(
    (name: string) => {
      const formFields = formFieldsRef.current;
      const normalizedName = stringToPath(name).join(".");
      const fieldInstance = formFields.find(
        (field) => field._normalizedDotName === normalizedName
      );
      if (fieldInstance) {
        formFields.splice(formFields.indexOf(fieldInstance), 1);
      }
    },
    [formFieldsRef]
  ) as FormInstance<T>["deleteField"];

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
  const [_errorsMap, _setErrorsMap] = useState<ErrorsMap | null>(null);
  const [_isValid, _setIsValid] = useState<boolean | null>(null);
  const [_isDirty, _setIsDirty] = useState<boolean | null>(null);
  const [_isTouched, _setIsTouched] = useState<boolean | null>(null);
  const [_value, _setValue] = useState<T | null>(null);
  const [_isValidating, _setIsValidating] = useState<boolean | null>(null);

  const shouldRerenderErrorOnRecompute = useRef(false);
  const shouldRerenderIsValidOnRecompute = useRef(false);
  const shouldRerenderIsDirtyOnRecompute = useRef(false);
  const shouldRerenderIsTouchedOnRecompute = useRef(false);
  const shouldRerenderValueOnRecompute = useRef(false);
  const shouldRerenderIsValidatingOnRecompute = useRef(false);

  const getErrors = useCallback(() => {
    return formFieldsRef.current.reduce((acc, field) => {
      return acc.concat(field.errors);
    }, [] as string[]);
  }, [formFieldsRef]);

  const getErrorsMap = useCallback(() => {
    const errorsMap: ErrorsMap = {};
    formFieldsRef.current.forEach((field) => {
      const name = field.props.name;
      errorsMap[name] = field.errors;
    });
    return errorsMap;
  }, [formFieldsRef]);

  const getValidBoolean = useCallback(() => {
    if (formFieldsRef.current.length === 0) return true;
    return formFieldsRef.current.every((field) => {
      return field.errors.length === 0;
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

  const getFormValue = useCallback(() => {
    return formFieldsRef.current.reduce((prev, field) => {
      fillPath(prev, field.props.name, field.value);
      return prev;
    }, {} as T);
  }, [formFieldsRef]);

  const recomputeErrors = useCallback(() => {
    if (shouldRerenderErrorOnRecompute.current) {
      const errors = getErrors();
      const errorsMap = getErrorsMap();
      _setErrors(errors);
      _setErrorsMap(errorsMap);
    }
    if (shouldRerenderIsValidOnRecompute.current) {
      const val = getValidBoolean();
      _setIsValid(val);
    }
  }, [getErrors, getErrorsMap, getValidBoolean]);

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

  const recomputeFormValue = useCallback(() => {
    if (shouldRerenderValueOnRecompute.current) {
      const val = getFormValue();
      _setValue(val);
    }
  }, [getFormValue]);

  const recomputeIsValidating = useCallback(() => {
    if (shouldRerenderIsValidatingOnRecompute.current) {
      const val = getFieldBoolean("isValidating");
      _setIsValidating(val);
    }
  }, [getFieldBoolean]);

  const errorGetter = useCallback(() => {
    shouldRerenderErrorOnRecompute.current = true;
    if (_errors === null) {
      const val = getErrors();
      _setErrors(val);
      return val;
    }
    return _errors;
  }, [_errors, getErrors]);

  const errorMapGetter = useCallback((): ErrorsMap<T> => {
    shouldRerenderErrorOnRecompute.current = true;
    if (_errorsMap === null) {
      const val = getErrorsMap();
      _setErrorsMap(val);
      return val as never;
    }
    return _errorsMap as never;
  }, [_errorsMap, getErrorsMap]);

  const isValidGetter = useCallback(() => {
    shouldRerenderIsValidOnRecompute.current = true;
    if (_isValid === null) {
      const val = getValidBoolean();
      _setIsValid(val);
      return val;
    }
    return _isValid;
  }, [_isValid, getValidBoolean]);

  const isDirtyGetter = useCallback(() => {
    if (_isDirty === null) {
      shouldRerenderIsDirtyOnRecompute.current = true;
      const val = getFieldBoolean("isDirty");
      _setIsDirty(val);
      return val;
    }
    return _isDirty;
  }, [_isDirty, getFieldBoolean]);

  const isTouchedGetter = useCallback(() => {
    if (_isTouched === null) {
      shouldRerenderIsTouchedOnRecompute.current = true;
      const val = getFieldBoolean("isTouched");
      _setIsTouched(val);
      return val;
    }
    return _isTouched;
  }, [_isTouched, getFieldBoolean]);

  const valueGetter = useCallback(() => {
    if (_value === null) {
      shouldRerenderValueOnRecompute.current = true;
      const val = getFormValue();
      _setValue(val);
      return val;
    }
    return _value;
  }, [_value, getFormValue]);

  const reset = useCallback(() => {
    formFieldsRef.current
      // Sort by depth so that we reset the deepest fields first
      .sort((a, b) => {
        return (
          stringToPath(b.props.name).length - stringToPath(a.props.name).length
        );
      })
      .forEach((field) => {
        const value = field.props.resetWithValue ?? field.props.initialValue;

        const isFieldArray = (v: typeof field): v is FieldArrayInstance => {
          return !!(v as FieldArrayInstance).setValues;
        };

        const isField = (v: typeof field): v is FieldInstance => {
          return !(v as FieldArrayInstance).setValues;
        };

        field.setErrors([]);
        field.setIsTouched(false);
        field.setIsDirty(false);
        if (isFieldArray(field)) {
          field.setValues({
            __value: value || [],
            __isResetting: true,
          } as InternalValue<T> as unknown as T[]);
        } else if (isField(field)) {
          field.setValue({
            __value: value || "",
            __isResetting: true,
          } as InternalValue<T> as unknown as T);
        }
      });
    _setErrors([]);
    _setIsValid(false);
    _setIsDirty(false);
    _setIsTouched(false);
  }, [_setIsTouched, _setIsDirty, _setErrors]);

  const isValidatingGetter = useCallback(() => {
    if (_isValidating === null) {
      shouldRerenderIsValidatingOnRecompute.current = true;
      const val = getFieldBoolean("isValidating");
      _setIsValidating(val);
      return val;
    }
    return _isValidating;
  }, [_isValidating, getFieldBoolean]);

  const baseValue = useMemo(() => {
    return {
      getFieldValue,
      deleteField,
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
      recomputeFormValue,
      recomputeIsValidating,
      reset,
      get errors() {
        return errorGetter();
      },
      get errorsMap() {
        return errorMapGetter();
      },
      get isValid() {
        return isValidGetter();
      },
      get isDirty() {
        return isDirtyGetter();
      },
      get isTouched() {
        return isTouchedGetter();
      },
      get value() {
        return valueGetter();
      },
      get isValidating() {
        return isValidatingGetter();
      },
      submit: () => Promise.resolve(true),
    };
  }, [
    getFieldValue,
    deleteField,
    isSubmitted,
    setIsTouched,
    setIsDirty,
    recomputeErrors,
    recomputeIsDirty,
    recomputeIsTouched,
    recomputeFormValue,
    recomputeIsValidating,
    errorGetter,
    errorMapGetter,
    isValidGetter,
    isDirtyGetter,
    isTouchedGetter,
    valueGetter,
    isValidatingGetter,
    reset,
  ]);

  const submit = useCallback(async () => {
    setIsSubmitted(true);
    const values = {} as T;

    const validArrays = await Promise.all(
      formFieldsRef.current.map(async (formField) => {
        const runValidationType = async (
          type:
            | "onMountValidate"
            | "onChangeValidate"
            | "onSubmitValidate"
            | "onBlurValidate"
        ) => {
          const validator = formField.props[type as "onChangeValidate"];
          if (!validator) return true;
          try {
            if (type === "onSubmitValidate") formField._setIsValidating(true);
            await validate(formField.value, baseValue, validator);
            return true;
          } catch (error) {
            formField.setErrors(getValidationError(error as ZodError | string));
            return false;
          } finally {
            if (type === "onSubmitValidate") formField._setIsValidating(false);
          }
        };

        const runHintType = async (
          type: "onMountHint" | "onChangeHint" | "onSubmitHint" | "onBlurHint"
        ) => {
          const validator = formField.props[type as "onChangeHint"];
          if (!validator) return true;
          try {
            await validate(formField.value, baseValue, validator);
            return true;
          } catch (error) {
            formField.setHints(getValidationError(error as ZodError | string));
            return false;
          }
        };

        formField.setHints([]);
        await runHintType("onMountHint");
        await runHintType("onChangeHint");
        await runHintType("onBlurHint");
        await runHintType("onSubmitHint");
        formField.setErrors([]);
        const onMountRes = await runValidationType("onMountValidate");
        if (!onMountRes) return false;
        const onChangeRes = await runValidationType("onChangeValidate");
        if (!onChangeRes) return false;
        const onBlurRes = await runValidationType("onBlurValidate");
        if (!onBlurRes) return false;
        const onSubmitRes = await runValidationType("onSubmitValidate");
        if (!onSubmitRes) return false;

        const runTransform = async () => {
          const transform = formField.props.onSubmitTransform;
          if (!transform) {
            return formField.value;
          }
          try {
            return await validate(formField.value, baseValue, transform);
          } catch (error) {
            formField.setErrors(getValidationError(error as ZodError | string));
          }
        };
        const value = await runTransform();

        if (formField.errors.length > 0) return false;
        fillPath(values, formField.props.name, value);
        return true;
      })
    );

    if (!submitWhenInvalid) {
      if (!validArrays.every((isValid) => !!isValid)) {
        return false;
      }
    }

    // TODO: Add tests to see if it gets cached version of `isDirty`, `isTouched`, `isValid`, and `errors`
    onSubmit?.(values, baseValue);
    return true;
  }, [baseValue, onSubmit, submitWhenInvalid]);

  const value = useMemo(() => {
    const omittedKeysToPick = [
      "errors",
      "errorsMap",
      "isValid",
      "isDirty",
      "isTouched",
      "isValidating",
      "submit",
      "value",
      "reset",
    ] as const;
    const val = {
      reset,
      submit,
      get errors() {
        return errorGetter();
      },
      get errorsMap() {
        return errorMapGetter();
      },
      get isValid() {
        return isValidGetter();
      },
      get isDirty() {
        return isDirtyGetter();
      },
      get isTouched() {
        return isTouchedGetter();
      },
      get value() {
        return valueGetter();
      },
      get isValidating() {
        return isValidatingGetter();
      },
    } as any as typeof baseValue;

    // We cannot pick any of the `omittedKeysToPick` keys. This is because they're
    // also getters, which means that we ruin the "only use when needed" logic
    for (const key of Object.keys(baseValue)) {
      if (omittedKeysToPick.includes(key as "errors")) continue;
      const _key = key as Exclude<
        keyof typeof baseValue,
        (typeof omittedKeysToPick)[number]
      >;
      val[_key] = baseValue[_key] as never;
    }

    return val;
  }, [
    reset,
    baseValue,
    errorGetter,
    errorMapGetter,
    isDirtyGetter,
    isTouchedGetter,
    isValidGetter,
    valueGetter,
    isValidatingGetter,
    submit,
  ]);

  useImperativeHandle(ref, () => value, [value]);

  const memoizedChildren = useMemo(
    () => {
      return children(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    memoChild ? memoChild.concat(value) : [children, value]
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
