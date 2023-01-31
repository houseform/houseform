import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldInstanceBaseProps } from "../field/types";
import { FormContext } from "../form/context";
import { FieldArrayContext } from "./context";
import { getValidationError, stringToPath, validate } from "../utils";
import { FieldArrayInstance } from "./types";
import { useFormlike } from "../form/use-formlike";
import { ZodError } from "zod";

export interface FieldArrayRenderProps<T = any>
  extends FieldInstanceBaseProps<T> {
  children: (props: FieldArrayInstance<T>) => JSX.Element;
  initialValue?: T[];
}

function FieldArrayComp<T>(
  props: FieldArrayRenderProps<T>,
  ref: ForwardedRef<FieldArrayInstance<T>>
) {
  const {
    formFieldsRef,
    errors: fieldErrors,
    isValid: areFieldsValid,
    isDirty: areFieldsDirty,
    isTouched: areFieldsTouched,
    recomputeErrors,
    recomputeIsDirty,
    recomputeIsTouched,
  } = useFormlike<FieldArrayInstance<T>>();

  const formContext = useContext(FormContext);

  const { name } = props;

  const _normalizedDotName = useMemo(() => {
    return stringToPath(name).join(".");
  }, [name]);

  const [fields, _setFields] = useState<T[]>(props.initialValue || []);
  const fieldsRef = useRef(fields);

  fieldsRef.current = fields;
  const [errors, setErrors] = useState<string[]>([]);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const runFieldArrayValidation = useCallback(
    (validationFnName: "onChangeValidate", val: T) => {
      const validationFn = props.onChangeValidate;
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
    [formContext, props.onChangeValidate]
  );

  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);

  const fieldArrayInstance = useMemo(() => {
    return {
      _normalizedDotName,
      props,
      formFieldsRef,
      fieldErrors,
      errors,
      fields,
      areFieldsDirty,
      areFieldsTouched,
      areFieldsValid,
      isValid,
      isDirty,
      isTouched,
      add: () => {},
      remove: () => {},
      move: () => {},
      insert: () => {},
    } as FieldArrayInstance<T>;
  }, [
    _normalizedDotName,
    props,
    formFieldsRef,
    fieldErrors,
    errors,
    fields,
    areFieldsDirty,
    areFieldsTouched,
    areFieldsValid,
    isValid,
    isDirty,
    isTouched,
  ]);

  useImperativeHandle(ref, () => fieldArrayInstance, [fieldArrayInstance]);

  const children = useMemo(() => {
    return props.children(fieldArrayInstance);
  }, [props.children, fieldArrayInstance]);

  const value = useMemo(() => {
    return {
      formFieldsRef,
      recomputeErrors,
      recomputeIsDirty,
      recomputeIsTouched,
      errors,
      onChange: () => {},
    };
  }, [
    formFieldsRef,
    recomputeErrors,
    recomputeIsDirty,
    recomputeIsTouched,
    errors,
  ]);

  return (
    <FieldArrayContext.Provider value={value}>
      {children}
    </FieldArrayContext.Provider>
  );
}

export const FieldArray = memo(forwardRef(FieldArrayComp)) as <T>(
  props: FieldArrayRenderProps<T> & {
    ref?: ForwardedRef<FieldArrayInstance<T>>;
  }
) => ReturnType<typeof FieldArrayComp>;
