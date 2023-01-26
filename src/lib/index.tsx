import {createContext, PropsWithChildren, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState} from "react";
import {ZodTypeAny} from "zod/lib/types";

const FormContext = createContext({
    formFieldsRef: {current: [] as FieldProps[]},
    onSubmit: () => {
        return undefined as void;
    }
});

interface FormProps<T> {
    onSubmit: (values: Record<string, T>) => void;
}

export function Form<T>(props: PropsWithChildren<FormProps<T>>) {
    const formFieldsRef = useRef<FieldProps[]>([]);

    const onSubmit = useCallback(() => {
        const values = formFieldsRef.current.reduce((prev, curr) => {
            prev[curr.props.name] = curr.value;
            return prev;
        }, {} as Record<string, T>)

        props.onSubmit(values);
    }, [formFieldsRef, props.onSubmit]);

    const value = useMemo(() => {
        return {formFieldsRef, onSubmit};
    }, [formFieldsRef, onSubmit]);

    return <FormContext.Provider value={value}>{props.children}</FormContext.Provider>
}

interface FieldBase<T = any> {
    name: string;
    onChangeValidate?: ZodTypeAny | ((val: T) => Promise<boolean>);
    onSubmitValidate?: ZodTypeAny | ((val: T) => Promise<boolean>);
}

interface FieldProps<T = any> {
    value: T;
    props: FieldBase<T>;
}

interface FieldRenderProps<T = any> extends FieldBase<T> {
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

    const mutableRef = useRef<FieldProps<T>>({value, props});

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

    return props.children({value, onChange, error: null})
}

interface SubmitFieldProps {
    children: (props: {
        onSubmit: () => void
    }) => JSX.Element;
}

export function SubmitField(props: SubmitFieldProps) {
    const {onSubmit} = useContext(FormContext);

    return props.children({onSubmit});
}