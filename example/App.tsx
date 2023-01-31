import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { z, ZodError, ZodType } from "zod";
import {
  fillPath,
  getPath,
  getValidationError,
  stringToPath,
  validate,
} from "houseform";

interface FormArrayContext<T = any> {
  values: T[];
  setValue: (index: number, value: T) => void;
  name: string;
  add: (value: T) => void;
}

const FormArrayContext = createContext({
  values: [],
  setValue: () => {},
  name: "",
  add: (value) => {},
} as FormArrayContext);

interface DemoData {
  person: {
    age: number;
  };
}

function ArrayItem({
  children,
  name,
  onChangeValidate,
}: {
  children: ({
    setValue,
  }: {
    setValue: (v: number) => void;
    errors: string[];
    value: number;
  }) => React.ReactNode;
  name: string;
  onChangeValidate: ZodType;
}) {
  const array = useContext(FormArrayContext) as FormArrayContext<DemoData>;

  const [errors, setErrors] = useState<string[]>([]);

  const fullAccessorPath = useMemo(() => {
    const arrayNamePathArr = stringToPath(array.name);
    const fieldItemPathArr = stringToPath(name);
    for (const i of arrayNamePathArr) {
      if (i !== fieldItemPathArr.shift()) {
        throw new Error("Invalid name");
      }
    }
    return fieldItemPathArr;
  }, [array.name, name]);

  const itemIndex = useMemo(() => {
    return parseInt(fullAccessorPath[0]);
  }, [fullAccessorPath]);

  const accessorPath = useMemo(() => {
    return fullAccessorPath.slice(1);
  }, [fullAccessorPath]);

  const value = useMemo(() => {
    return getPath(array.values[itemIndex], accessorPath.join("."));
  }, [array.values, itemIndex]);

  function setValue(v: number) {
    const vv = { ...array.values[itemIndex] };
    fillPath(vv, accessorPath.join("."), v);
    array.setValue(itemIndex, vv);
    if (onChangeValidate) {
      validate(v, null as any, onChangeValidate)
        .then(() => {
          setErrors([]);
        })
        .catch((error: string | ZodError) => {
          setErrors(getValidationError(error as ZodError | string));
        });
    }
  }

  return <>{children({ setValue, errors, value })}</>;
}

function AppBase() {
  const array = useContext(FormArrayContext) as FormArrayContext<DemoData>;

  return (
    <>
      {array.values.map((field, index) => {
        return (
          <ArrayItem
            key={index}
            name={`people.${index}.person.age`}
            onChangeValidate={z.number().max(18, "Must be more than 18")}
          >
            {({ setValue, errors, value }) => (
              <div>
                {index % 2 === 0 && <p>Even row</p>}
                {/*Make this passed by ArrayItem */}
                <p>{field.person.age}</p>
                <button onClick={() => setValue(value + 1)}>Add one</button>
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
          </ArrayItem>
        );
      })}
      <button onClick={() => array.add({ person: { age: 0 } })}>
        Add another number
      </button>
    </>
  );
}

export default function App() {
  const [values, setValues] = useState([] as DemoData[]);

  function add(val: DemoData) {
    setValues((v) => [...v, val]);
  }

  function setValue(index: number, value: DemoData) {
    setValues((v) => {
      const newValues = [...v];
      newValues[index] = value;
      return newValues;
    });
  }

  return (
    <FormArrayContext.Provider
      value={{ values, add, setValue, name: "people" }}
    >
      <AppBase />
    </FormArrayContext.Provider>
  );
}
