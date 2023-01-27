import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {ZodError, ZodTypeAny} from "zod";

function validate<T>(val: T, validator: ZodTypeAny | ((val: T) => Promise<boolean>)) {
    if (validator instanceof Function) {
        return validator(val);
    } else {
        return validator.parseAsync(val);
    }
}

function getValidationError(error: ZodError | string) {
    if (error instanceof ZodError) {
        return error.errors.map(error => error.message);
    } else {
        return [error];
    }
}

const FormContext = createContext({
    formFieldsRef: {current: [] as FieldProps[]},
    recomputeErrors: () => {
        return undefined as void;
    },
    errors: [] as string[],
    onSubmit: async () => {
        return undefined as void;
    }
});

interface FormProps<T> {
    onSubmit: (values: Record<string, T>) => void;
}

export function Form<T>(props: PropsWithChildren<FormProps<T>>) {
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

    const onSubmit = useCallback(async () => {
        let values = {} as Record<string, T>;

        const validArrays = await Promise.all(formFieldsRef.current.map(async formField => {
            if (formField.props.onSubmitValidate) {
                try {
                    await validate(formField.value, formField.props.onSubmitValidate);
                } catch (error) {
                    formField.setErrors(getValidationError(error as ZodError | string));
                    recomputeErrors();
                    return false;
                }
            }
            if (formField.errors.length > 0) return false;
            values[formField.props.name] = formField.value;
            return true;
        }));

        if (!validArrays.every(isValid => !!isValid)) return;

        props.onSubmit(values);
    }, [formFieldsRef, props.onSubmit, recomputeErrors]);

    const value = useMemo(() => {
        return {formFieldsRef, onSubmit, errors, recomputeErrors}
    }, [formFieldsRef, onSubmit, errors, recomputeErrors])

    return (
        <FormContext.Provider
            value={value}
        >
            {props.children}
        </FormContext.Provider>
    )
}

interface FieldBase<T = any> {
    name: string;
    onChangeValidate?: ZodTypeAny | ((val: T) => Promise<boolean>);
    onSubmitValidate?: ZodTypeAny | ((val: T) => Promise<boolean>);
}

interface FieldProps<T = any> {
    value: T;
    props: FieldBase<T>;
    setErrors: (error: string[]) => void;
    errors: string[];
}

interface FieldRenderProps<T = any> extends FieldBase<T> {
    // TODO: Pass `isTouched`, pass `isDirty`
    children: (props: {
        value: T,
        onChange: (val: T) => void,
        errors: string[]
        isValid: boolean
    }) => JSX.Element;
    initialValue?: T;
}

export function Field<T>(props: FieldRenderProps<T>) {
    const {formFieldsRef, recomputeErrors} = useContext(FormContext);

    const [value, setValue] = useState<T>(props.initialValue ?? "" as T);
    const [errors, setErrors] = useState<string[]>([]);

    const onChange = (val: T) => {
        setValue(val);
        if (props.onChangeValidate) {
            validate(val, props.onChangeValidate)
                .then(() => {
                    setErrors([])
                    recomputeErrors();
                })
                .catch((error: string | ZodError) => {
                    setErrors(getValidationError(error as ZodError | string));
                    recomputeErrors();
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
