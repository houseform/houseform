import {memo, PropsWithChildren, useCallback, useMemo, useRef, useState} from "react";
import {ZodError} from "zod";
import {FormContext, initialContext} from "./context";
import {FieldProps} from "./types";
import {getValidationError, validate} from "./utils";

interface FormProps<T> {
    onSubmit: (values: Record<string, T>, form: typeof initialContext) => void;
}

function FormComp<T>(props: PropsWithChildren<FormProps<T>>) {
    const formFieldsRef = useRef<FieldProps[]>([]);

    const getErrors = useCallback(() => {
        return formFieldsRef.current.reduce((acc, field) => {
            return acc.concat(field.errors);
        }, [] as string[]);
    }, [formFieldsRef]);

    const [errors, setErrors] = useState(getErrors());

    const recomputeErrors = useCallback(() => {
        setErrors(getErrors());
    }, [getErrors]);

    const getFieldValue = useCallback((name: string) => {
        return formFieldsRef.current.find(field => field.props.name === name);
    }, [formFieldsRef]);

    const onChangeListenerRefs = useRef(
        {} as Record<string, (() => void)[]>
    )

    const baseValue = useMemo(() => {
        return {formFieldsRef, onSubmit: () => Promise.resolve(), errors, recomputeErrors, getFieldValue, onChangeListenerRefs }
    }, [formFieldsRef, errors, recomputeErrors, getFieldValue, onChangeListenerRefs])

    const onSubmit = useCallback(async () => {
        let values = {} as Record<string, T>;

        const validArrays = await Promise.all(formFieldsRef.current.map(async formField => {
            const runValidationType = async (type: "onChangeValidate" | "onSubmitValidate") => {
                if (!formField.props[type]) return true;
                try {
                    await validate(formField.value, baseValue, formField.props[type]!);
                    return true;
                } catch (error) {
                    formField.setErrors(getValidationError(error as ZodError | string));
                    return false;
                }
            };
            const onChangeRes = await runValidationType("onChangeValidate");
            const onSubmitRes = await runValidationType("onSubmitValidate");
            if (!onChangeRes || !onSubmitRes) return false;
            if (formField.errors.length > 0) return false;
            values[formField.props.name] = formField.value;
            return true;
        }));

        if (!validArrays.every(isValid => !!isValid)) return;

        props.onSubmit(values, baseValue);
    }, [formFieldsRef, props.onSubmit]);

    const value = useMemo(() => {
        return {...baseValue, onSubmit }
    }, [baseValue, onSubmit])

    return (
        <FormContext.Provider
            value={value}
        >
            {props.children}
        </FormContext.Provider>
    )
}

export const Form = memo(FormComp) as typeof FormComp;