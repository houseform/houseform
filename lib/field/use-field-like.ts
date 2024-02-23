import {
  MutableRefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ZodError } from "zod";
import { FormContext, useFormContext } from "../form";
import { FieldInstance } from "./types";
import { FieldArrayInstance } from "../field-array";
import { getValidationError, stringToPath, validate } from "../utils";
import useIsomorphicLayoutEffect from "../utils/use-isomorphic-layout-effect";

export type InternalValue<T> = {
  __value: T;
  __isResetting: boolean;
};

export const isInternal = <T>(value: any): value is InternalValue<T> => {
  return (
    !Array.isArray(value) &&
    value !== null &&
    typeof value === "object" &&
    "__isResetting" in value
  );
};

interface UseListenToListenToArrayProps<T> {
  listenTo: string[] | undefined;
  runFieldValidation: (
    l: "onChangeValidate" | "onBlurValidate" | "onMountValidate",
    v: T
  ) => void;
  valueRef: MutableRefObject<T>;
}
export function useListenToListenToArray<T>({
  listenTo,
  runFieldValidation,
  valueRef,
}: UseListenToListenToArrayProps<T>) {
  const formContext = useFormContext<T>();

  useIsomorphicLayoutEffect(() => {
    if (!listenTo || listenTo.length === 0) return;

    function onChangeListener() {
      runFieldValidation("onChangeValidate", valueRef.current);
    }

    function onBlurListener() {
      runFieldValidation("onBlurValidate", valueRef.current);
    }

    function onMountListener() {
      runFieldValidation("onMountValidate", valueRef.current);
    }

    function addListenerToListenToItem(
      refTypeName:
        | "onChangeListenerRefs"
        | "onBlurListenerRefs"
        | "onMountListenerRefs",
      fieldName: string,
      listener: () => void
    ) {
      // Make sure there's an array for the field
      formContext[refTypeName].current[fieldName] =
        formContext[refTypeName].current[fieldName] ?? [];
      // Add the listener
      formContext[refTypeName].current[fieldName].push(listener);
      // Remove the listener
      return () => {
        formContext[refTypeName].current[fieldName].splice(
          formContext[refTypeName].current[fieldName].indexOf(listener),
          1
        );
      };
    }

    const fns = listenTo.flatMap((fieldName) => {
      const onChangeFunctions = addListenerToListenToItem(
        "onChangeListenerRefs",
        fieldName,
        onChangeListener
      );
      const onBlurFunctions = addListenerToListenToItem(
        "onBlurListenerRefs",
        fieldName,
        onBlurListener
      );
      const onMountFunctions = addListenerToListenToItem(
        "onMountListenerRefs",
        fieldName,
        onMountListener
      );
      return [onChangeFunctions, onBlurFunctions, onMountFunctions];
    });

    return () => fns.forEach((fn) => fn());
  }, [formContext, listenTo, runFieldValidation, valueRef]);
}

type GetInstanceInferedType<T, TT> = TT extends FieldInstance ? T : T[];

export interface UseFieldLikeProps<
  T,
  F,
  TT extends FieldInstance<T, F> | FieldArrayInstance<T, F>
> {
  props: TT["props"] & {
    initialValue?: GetInstanceInferedType<T, TT>;
  };
  initialValue: GetInstanceInferedType<T, TT>;
}

/**
 * A "field-like" is anything that contains a value,
 * errors, and needs to be set to the closest form
 */
export const useFieldLike = <
  T,
  F,
  TT extends FieldInstance<T, F> | FieldArrayInstance<T, F>
>({
  initialValue,
  props,
}: UseFieldLikeProps<T, F, TT>) => {
  const { name } = props;

  const _normalizedDotName = useMemo(() => {
    return stringToPath(name).join(".");
  }, [name]);

  const formContext = useFormContext<F>();
  const fieldInstance = formContext.formFieldsRef.current.find(
    (field) => field._normalizedDotName === _normalizedDotName
  );

  const [errors, setErrors] = useState<string[]>(fieldInstance?.errors ?? []);
  const [hints, setHints] = useState<string[]>(fieldInstance?.hints ?? []);
  const [isTouched, setIsTouched] = useState<boolean>(
    fieldInstance?.isTouched ?? false
  );
  const [isDirty, setIsDirty] = useState<boolean>(
    fieldInstance?.isDirty ?? false
  );
  const [isValidating, setIsValidating] = useState<boolean>(
    fieldInstance?.isValidating ?? false
  );
  const isSubmitted = formContext.isSubmitted;

  const runFieldValidation = useCallback(
    (
      validationFnName:
        | "onChangeValidate"
        | "onBlurValidate"
        | "onMountValidate",
      val: UseFieldLikeProps<T, F, TT>["initialValue"]
    ) => {
      let validationFn = props.onChangeValidate;
      if (validationFnName === "onBlurValidate") {
        validationFn = (props as unknown as FieldInstance<T, F>["props"])
          ?.onBlurValidate;
      }
      if (validationFnName === "onMountValidate") {
        validationFn = (props as unknown as FieldInstance<T, F>["props"])
          ?.onMountValidate;
      }
      if (validationFn) {
        setIsValidating(true);
        validate(val as T, formContext, validationFn)
          .then(() => {
            setErrors([]);
          })
          .catch((error: string | ZodError) => {
            setErrors(getValidationError(error as ZodError | string));
          })
          .finally(() => {
            setIsValidating(false);
          });
      }
    },
    [formContext, props]
  );

  const runFieldHintCheck = useCallback(
    (
      validationFnName: "onChangeHint" | "onBlurHint" | "onMountHint",
      val: UseFieldLikeProps<T, F, TT>["initialValue"]
    ) => {
      let validationFn = props.onChangeHint;
      if (validationFnName === "onBlurHint") {
        validationFn = (props as unknown as FieldInstance<T, F>["props"])
          ?.onBlurHint;
      }
      if (validationFnName === "onMountHint") {
        validationFn = (props as unknown as FieldInstance<T, F>["props"])
          ?.onMountHint;
      }
      if (validationFn) {
        setIsValidating(true);
        validate(val as T, formContext, validationFn)
          .then(() => {
            setHints([]);
          })
          .catch((error: string | ZodError) => {
            setHints(getValidationError(error as ZodError | string));
          })
          .finally(() => {
            setIsValidating(false);
          });
      }
    },
    [formContext, props]
  );

  const initVal = (props.initialValue ?? initialValue) as UseFieldLikeProps<
    T,
    F,
    TT
  >["initialValue"];

  const hasRanMountHook = useRef(false);
  const [value, _setValue] = useState<
    UseFieldLikeProps<T, F, TT>["initialValue"]
  >(fieldInstance?.value ?? initVal);

  useIsomorphicLayoutEffect(() => {
    if (hasRanMountHook.current) return;
    hasRanMountHook.current = true;
    runFieldHintCheck("onMountHint", initVal);
    runFieldValidation("onMountValidate", initVal);
  });

  const valueRef = useRef(value);

  valueRef.current = value;

  const setValue = useCallback(
    <
      J extends UseFieldLikeProps<T, F, TT>["initialValue"] = UseFieldLikeProps<
        T,
        F,
        TT
      >["initialValue"]
    >(
      val: J | ((prevState: J) => J)
    ) => {
      _setValue((prev) => {
        const isResetting = isInternal(val) && val.__isResetting;
        const newValue = isInternal<J>(val) ? val.__value : val;

        const isPrevAFunction = (
          t: any
        ): t is (prevState: typeof value) => typeof value =>
          typeof t === "function";

        const newVal = isPrevAFunction(newValue)
          ? newValue(prev)
          : (newValue as typeof value);

        if (isResetting) {
          return newVal;
        }

        setIsDirty(newVal !== initVal);

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

        runFieldHintCheck("onChangeHint", newVal);
        runFieldValidation("onChangeValidate", newVal);

        return newVal;
      });
    },
    [
      initVal,
      runFieldValidation,
      runFieldHintCheck,
      formContext.onChangeListenerRefs,
      props.name,
    ]
  );

  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);

  const exportedValidate = useCallback(
    (validationFnName: Parameters<typeof runFieldValidation>[0]) => {
      runFieldValidation(validationFnName, valueRef.current);
    },
    [runFieldValidation, valueRef]
  );

  const exportedHintCheck = useCallback(
    (validationFnName: Parameters<typeof runFieldHintCheck>[0]) => {
      runFieldHintCheck(validationFnName, valueRef.current);
    },
    [runFieldHintCheck, valueRef]
  );

  return {
    value,
    setErrors,
    errors,
    hints,
    setHints,
    setIsDirty,
    setIsTouched,
    setValue,
    isTouched,
    isDirty,
    isValid,
    isValidating,
    isSubmitted,
    runFieldValidation,
    runFieldHintCheck,
    valueRef,
    validate: exportedValidate,
    checkHint: exportedHintCheck,
    _normalizedDotName,
    _setIsValidating: setIsValidating,
  };
};
