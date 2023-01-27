import {ZodError} from "zod";
import {useContext, useLayoutEffect, useRef, useState} from "react";
import {FieldBase, FieldProps} from "./types";
import {FormContext} from "./context";
import {getValidationError, validate} from "./utils";

interface FieldRenderProps<T = any> extends FieldBase<T> {
    // TODO: Pass `isTouched`, pass `isDirty`
    children: (props: {
        value: T;
        onChange: (val: T) => void;
        errors: string[];
        isValid: boolean;
    }) => JSX.Element;
    initialValue?: T;
}

export function Field<T>(props: FieldRenderProps<T>) {
    const formContext = useContext(FormContext);

    const {formFieldsRef, recomputeErrors} = formContext;

    const [value, setValue] = useState<T>(props.initialValue ?? "" as T);
    const [errors, setErrors] = useState<string[]>([]);

    const onChange = (val: T) => {
        setValue(val);
        if (props.onChangeValidate) {
            validate(val, formContext, props.onChangeValidate)
                .then(() => {
                    setErrors([])
                })
                .catch((error: string | ZodError) => {
                    setErrors(getValidationError(error as ZodError | string));
                });
        }
    }

    const mutableRef = useRef<FieldProps<T>>({value, props, setErrors, errors});

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
        recomputeErrors();
    }, [errors, recomputeErrors]);

    return props.children({value, onChange, errors, isValid: errors.length === 0})
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
