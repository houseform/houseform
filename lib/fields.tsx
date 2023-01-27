import {ZodError} from "zod";
import {useCallback, useContext, useLayoutEffect, useMemo, useRef, useState} from "react";
import {FieldBase, FieldProps} from "./types";
import {FormContext} from "./context";
import {getValidationError, validate} from "./utils";

interface FieldRenderProps<T = any> extends FieldBase<T> {
    children: (props: FieldProps<T>) => JSX.Element;
    initialValue?: T;
    listenTo?: string[];
}

export function Field<T>(props: FieldRenderProps<T>) {
    const formContext = useContext(FormContext);

    const {formFieldsRef, recomputeErrors} = formContext;

    const [value, _setValue] = useState<T>(props.initialValue ?? "" as T);
    const valueRef = useRef(value);

    valueRef.current = value;
    const [errors, setErrors] = useState<string[]>([]);
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const onBlur = useCallback(() => {
        setIsTouched(true);
    }, []);

    const runFieldValidation = useCallback((val: T) => {
        if (props.onChangeValidate) {
            validate(val, formContext, props.onChangeValidate)
                .then(() => {
                    setErrors([])
                })
                .catch((error: string | ZodError) => {
                    setErrors(getValidationError(error as ZodError | string));
                });
        }
    }, [formContext, props.onChangeValidate])

    const setValue = useCallback((val: T) => {
        setIsDirty(true);
        setIsTouched(true);
        _setValue(val);

        /**
         * Call `listenTo` field subscribers for other fields.
         *
         * Placed into a `setTimeout` so that the `setValue` call can finish before the `onChangeListenerRefs` are called.
         */
        setTimeout(() => {
            formContext.onChangeListenerRefs.current[props.name]?.forEach(fn => fn());
        }, 0);

        runFieldValidation(val);
    }, [runFieldValidation, formContext, props.name]);

    const isValid = useMemo(() => {
        return errors.length === 0;
    }, [errors]);

    const mutableRef = useRef<FieldProps<T>>({
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
        onBlur
    });

    /**
     * Add mutable ref to formFieldsRef
     */
    useLayoutEffect(() => {
        mutableRef.current.props = props;
        const newMutable = mutableRef.current;
        formFieldsRef.current.push(newMutable);

        return () => {
            formFieldsRef.current.slice(formFieldsRef.current.indexOf(newMutable), 1);
        }
    }, [props]);

    /**
     * Setup `listenTo` field listeners for this field
     */
    useLayoutEffect(() => {
       if (!props.listenTo || props.listenTo.length === 0) return;

       function listener() {
           runFieldValidation(valueRef.current);
       }

       function addListenerToListenToItem(fieldName: string) {
           // Make sure there's an array for the field
           formContext.onChangeListenerRefs.current[fieldName] = formContext.onChangeListenerRefs.current[fieldName] ?? [];
           // Add the listener
           formContext.onChangeListenerRefs.current[fieldName].push(listener);
           // Remove the listener
           return () => {
               formContext.onChangeListenerRefs.current[fieldName].splice(formContext.onChangeListenerRefs.current[fieldName].indexOf(listener), 1);
           }
       }

       const fns = props.listenTo.map(addListenerToListenToItem);

       return () => fns.forEach(fn => fn());
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

    return props.children({
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
        onBlur
    })
}

interface SubmitFieldProps {
    children: (props: {
        onSubmit: () => void;
        isValid: boolean;
    }) => JSX.Element;
}

export function SubmitField(props: SubmitFieldProps) {
    const {onSubmit, errors} = useContext(FormContext);

    // TODO: Pass `isTouched`, pass `isDirty`

    return props.children({onSubmit, isValid: errors.length === 0});
}
