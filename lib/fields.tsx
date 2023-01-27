import {ZodError} from "zod";
import {useCallback, useContext, useLayoutEffect, useMemo, useRef, useState} from "react";
import {FieldBase, FieldProps} from "./types";
import {FormContext} from "./context";
import {getValidationError, validate} from "./utils";

interface FieldRenderProps<T = any> extends FieldBase<T> {
    children: (props: FieldProps<T>) => JSX.Element;
    initialValue?: T;
}

export function Field<T>(props: FieldRenderProps<T>) {
    const formContext = useContext(FormContext);

    const {formFieldsRef, recomputeErrors} = formContext;

    const [value, _setValue] = useState<T>(props.initialValue ?? "" as T);
    const [errors, setErrors] = useState<string[]>([]);
    const [isTouched, setIsTouched] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const onBlur = useCallback(() => {
        setIsTouched(true);
    }, []);

    const setValue = useCallback((val: T) => {
        setIsDirty(true);
        setIsTouched(true);
        _setValue(val);
        if (props.onChangeValidate) {
            validate(val, formContext, props.onChangeValidate)
                .then(() => {
                    setErrors([])
                })
                .catch((error: string | ZodError) => {
                    setErrors(getValidationError(error as ZodError | string));
                });
        }
    }, [formContext, props.onChangeValidate]);

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

    useLayoutEffect(() => {
        mutableRef.current.props = props;
        const newMutable = mutableRef.current;
        formFieldsRef.current.push(newMutable);

        return () => {
            formFieldsRef.current.slice(formFieldsRef.current.indexOf(newMutable), 1);
        }
    }, [props]);

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
