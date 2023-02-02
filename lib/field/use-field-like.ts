import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FieldArrayInstance,
  FieldInstance,
  FormContext,
  getValidationError,
  stringToPath,
  validate,
} from "houseform";
import { ZodError } from "zod";

type GetInstanceInferedType<T, TT> = TT extends FieldInstance ? T : T[];

export interface UseFieldLikeProps<
  T,
  TT extends FieldInstance<T> | FieldArrayInstance<T>
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
  TT extends FieldInstance<T> | FieldArrayInstance<T>
>({
  initialValue,
  props,
}: UseFieldLikeProps<T, TT>) => {
  const { name } = props;

  const _normalizedDotName = useMemo(() => {
    return stringToPath(name).join(".");
  }, [name]);

  const formContext = useContext(FormContext);

  const [value, _setValue] = useState(
    (props.initialValue ?? initialValue) as UseFieldLikeProps<
      T,
      TT
    >["initialValue"]
  );
  const valueRef = useRef(value);

  valueRef.current = value;
  const [errors, setErrors] = useState<string[]>([]);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const runFieldValidation = useCallback(
    (
      validationFnName: "onChangeValidate" | "onBlurValidate",
      val: UseFieldLikeProps<T, TT>["initialValue"]
    ) => {
      let validationFn = props.onChangeValidate;
      if (
        validationFnName === "onBlurValidate" &&
        (props as unknown as FieldInstance<T>["props"])?.onBlurValidate
      ) {
        validationFn = (props as unknown as FieldInstance<T>["props"])
          .onBlurValidate;
      }
      if (validationFn) {
        validate(val as T, formContext, validationFn)
          .then(() => {
            setErrors([]);
          })
          .catch((error: string | ZodError) => {
            setErrors(getValidationError(error as ZodError | string));
          });
      }
    },
    [formContext, props]
  );

  const setValue = useCallback(
    <
      J extends UseFieldLikeProps<T, TT>["initialValue"] = UseFieldLikeProps<
        T,
        TT
      >["initialValue"]
    >(
      val: J | ((prevState: J) => J)
    ) => {
      _setValue((prev) => {
        const isPrevAFunction = (
          t: any
        ): t is (prevState: typeof value) => typeof value =>
          typeof t === "function";
        const newVal = isPrevAFunction(val) ? val(prev) : (val as typeof value);
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

        runFieldValidation("onChangeValidate", newVal);
        return newVal;
      });
    },
    [runFieldValidation, formContext, props.name]
  );

  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);

  /**
   * Setup `listenTo` field listeners for this field
   */
  useLayoutEffect(() => {
    if (!props.listenTo || props.listenTo.length === 0) return;

    function onChangeListener() {
      runFieldValidation("onChangeValidate", valueRef.current);
    }

    function onBlurListener() {
      runFieldValidation("onBlurValidate", valueRef.current);
    }

    function addListenerToListenToItem(
      refTypeName: "onChangeListenerRefs" | "onBlurListenerRefs",
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

    const fns = props.listenTo.flatMap((fieldName) => {
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
      return [onChangeFunctions, onBlurFunctions];
    });

    return () => fns.forEach((fn) => fn());
  }, [formContext, props.listenTo, runFieldValidation]);

  return {
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
  };
};
