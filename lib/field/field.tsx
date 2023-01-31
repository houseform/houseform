import { ZodError } from "zod";
import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldInstanceProps, FieldInstance } from "./types";
import { FormContext } from "../form/context";
import { getValidationError, stringToPath, validate } from "../utils";

export interface FieldRenderProps<T = any> extends FieldInstanceProps<T> {
  children: (props: FieldInstance<T>) => JSX.Element;
  initialValue?: T;
  listenTo?: string[];
}

function FieldComp<T>(
  props: FieldRenderProps<T>,
  ref: ForwardedRef<FieldInstance<T>>
) {
  const formContext = useContext(FormContext);

  const {
    formFieldsRef,
    recomputeErrors,
    recomputeIsTouched,
    recomputeIsDirty,
  } = formContext;

  const { name } = props;

  const _normalizedDotName = useMemo(() => {
    return stringToPath(name).join(".");
  }, [name]);

  const [value, _setValue] = useState<T>(props.initialValue ?? ("" as T));
  const valueRef = useRef(value);

  valueRef.current = value;
  const [errors, setErrors] = useState<string[]>([]);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const runFieldValidation = useCallback(
    (validationFnName: "onChangeValidate" | "onBlurValidate", val: T) => {
      let validationFn = props.onChangeValidate;
      if (validationFnName === "onBlurValidate") {
        validationFn = props.onBlurValidate;
      }
      if (validationFn) {
        validate(val, formContext, validationFn)
          .then(() => {
            setErrors([]);
          })
          .catch((error: string | ZodError) => {
            setErrors(getValidationError(error as ZodError | string));
          });
      }
    },
    [formContext, props.onChangeValidate, props.onBlurValidate]
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
  }, []);

  const setValue = useCallback(
    (val: T) => {
      setIsDirty(true);
      setIsTouched(true);
      _setValue(val);

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

      runFieldValidation("onChangeValidate", val);
    },
    [runFieldValidation, formContext, props.name]
  );

  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);

  const fieldInstance = useMemo(() => {
    return {
      value,
      props,
      setErrors,
      errors,
      setIsDirty,
      setIsTouched,
      setValue,
      isTouched,
      isDirty,
      isValid,
      onBlur,
      _normalizedDotName,
    };
  }, [
    value,
    props,
    setErrors,
    errors,
    setIsDirty,
    setIsTouched,
    setValue,
    isTouched,
    isDirty,
    isValid,
    onBlur,
    _normalizedDotName,
  ]);

  const mutableRef = useRef<FieldInstance<T>>(fieldInstance);

  /**
   * Add mutable ref to formFieldsRef
   */
  useLayoutEffect(() => {
    mutableRef.current.props = props;
    const newMutable = mutableRef.current;
    formFieldsRef.current.push(newMutable);

    return () => {
      formFieldsRef.current.slice(formFieldsRef.current.indexOf(newMutable), 1);
    };
  }, [props]);

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

  /**
   * Sync the values with the mutable ref
   */
  useLayoutEffect(() => {
    mutableRef.current.value = value;
  }, [value]);

  useLayoutEffect(() => {
    mutableRef.current.errors = errors;
  }, [errors]);

  useLayoutEffect(() => {
    mutableRef.current.isDirty = isDirty;
  }, [isDirty]);

  useLayoutEffect(() => {
    mutableRef.current.isValid = isValid;
  }, [isValid]);

  useLayoutEffect(() => {
    mutableRef.current.isTouched = isTouched;
  }, [isTouched]);

  /**
   * Recompute form errors when field errors change
   */
  useLayoutEffect(() => {
    recomputeErrors();
  }, [errors, recomputeErrors]);

  useLayoutEffect(() => {
    recomputeIsTouched();
  }, [isTouched, recomputeErrors]);

  useLayoutEffect(() => {
    recomputeIsDirty();
  }, [isDirty, recomputeErrors]);

  useImperativeHandle(ref, () => fieldInstance, [fieldInstance]);

  return props.children(fieldInstance);
}

export const Field = memo(forwardRef(FieldComp)) as <T>(
  props: FieldRenderProps<T> & { ref?: ForwardedRef<FieldInstance<T>> }
) => ReturnType<typeof FieldComp>;
