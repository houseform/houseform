import {createContext, PropsWithChildren, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState} from "react";
import {ZodTypeAny} from "zod/lib/types";

const FormContext = createContext({
    formFieldsRef: {current: [] as any[]},
    onSubmit: () => {
        return undefined as void;
    }
});

interface FormProps<T> {
    onSubmit: (values: T) => void;
}

export function Form<T>(props: PropsWithChildren<FormProps<T>>) {
    const formFieldsRef = useRef([]);

    const onSubmit = useCallback(() => {
        // TODO: Add `onSubmitValidate` support
        formFieldsRef.current.forEach(() => {

        })
    }, [formFieldsRef, props.onSubmit]);

    const value = useMemo(() => {
        return {formFieldsRef, onSubmit};
    }, [formFieldsRef, onSubmit]);

    return <FormContext.Provider value={value}>{props.children}</FormContext.Provider>
}

interface FieldProps<T = any> {
    name: string;
    onChangeValidate?: ZodTypeAny | ((val: T) => Promise<boolean>);
    onSubmitValidate?: ZodTypeAny | ((val: T) => Promise<boolean>);
}

interface FieldRenderProps<T = any> extends FieldProps<T> {
    children: (props: {
        value: T,
        onChange: (val: T) => void,
        error: any
    }) => JSX.Element;
    initialValue?: T;
}

export function Field<T>(props: FieldRenderProps<T>) {
    const {formFieldsRef} = useContext(FormContext);

    const [value, setValue] = useState<T>(props.initialValue ?? "" as T);
    // TODO: Add error validation

    // TODO: Add `onChangeValidate` support
    const onChange = (val: T) => {
        setValue(val);
    }

    useLayoutEffect(() => {
        formFieldsRef.current.push(props);

        return () => {
            formFieldsRef.current.slice(formFieldsRef.current.indexOf(props), 1);
        }
    }, [props]);

    // TODO: Add value and error to formFieldsRef.current

    return props.children({value, onChange, error: null})
}

interface SubmitButtonProps {
    children: (props: {
        onSubmit: () => void
    }) => JSX.Element;
}

export function SubmitButton(props: SubmitButtonProps) {
    const {onSubmit} = useContext(FormContext);

    return props.children({onSubmit});
}