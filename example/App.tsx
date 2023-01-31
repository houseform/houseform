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
import { z, ZodAny, ZodType } from "zod";
import { stringToPath } from "houseform";

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
  }) => React.ReactNode;
  name: string;
  onChangeValidate: ZodType;
}) {
  const array = useContext(FormArrayContext);

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
  }

  return <>{children({ setValue })}</>;
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
            onChangeValidate={z.number().min(2, "Must be at least 2")}
          >
            {({ setValue }) => (
              <div>
                {index % 2 === 0 && <p>Even row</p>}
                {/*Make this passed by ArrayItem */}
                <p>{field}</p>
                <button onClick={() => setValue(field + 1)}>Add one</button>
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
