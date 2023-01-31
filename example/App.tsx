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
import { z, ZodAny, ZodError, ZodType } from "zod";
import { getValidationError, stringToPath, validate } from "houseform";

const FormArrayContext = createContext({
  values: [] as number[],
  setValue: (index: number, value: number) => {},
  name: "",
  add: (value: number) => {},
});

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
  }) => React.ReactNode;
  name: string;
  onChangeValidate: ZodType;
}) {
  const array = useContext(FormArrayContext);

  const [errors, setErrors] = useState<string[]>([]);

  const itemIndex = useMemo(() => {
    const arrayNamePathArr = stringToPath(array.name);
    const fieldItemPathArr = stringToPath(name);
    for (const i of arrayNamePathArr) {
      if (i !== fieldItemPathArr.shift()) {
        throw new Error("Invalid name");
      }
    }
    return Number(fieldItemPathArr[0]);
  }, [array.name, name]);

  function setValue(v: number) {
    array.setValue(itemIndex, v);
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

  return <>{children({ setValue, errors })}</>;
}

function AppBase() {
  const array = useContext(FormArrayContext);

  return (
    <>
      {array.values.map((field, index) => {
        return (
          <ArrayItem
            key={index}
            name={`numbers.${index}.number`}
            onChangeValidate={z.number().max(8, "Must be less than 8")}
          >
            {({ setValue, errors }) => (
              <div>
                {index % 2 === 0 && <p>Even row</p>}
                {/*Make this passed by ArrayItem */}
                <p>{field}</p>
                <button onClick={() => setValue(field + 1)}>Add one</button>
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
          </ArrayItem>
        );
      })}
      <button onClick={() => array.add(0)}>Add another number</button>
    </>
  );
}

export default function App() {
  const [values, setValues] = useState([] as number[]);

  function add(val: number) {
    setValues((v) => [...v, val]);
  }

  function setValue(index: number, value: number) {
    setValues((v) => {
      const newValues = [...v];
      newValues[index] = value;
      return newValues;
    });
  }

  return (
    <FormArrayContext.Provider
      value={{ values, add, setValue, name: "numbers" }}
    >
      <AppBase />
    </FormArrayContext.Provider>
  );
}
