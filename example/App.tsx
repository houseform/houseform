import { z } from "zod";
import { FieldArray, FieldArrayItem } from "houseform";

interface DemoData {
  person: {
    age: number;
  };
}

export default function App() {
  return (
    <FieldArray<DemoData> name={"people"}>
      {({ value, add }) => (
        <>
          {value.map((_, index) => {
            return (
              <FieldArrayItem<number>
                key={index}
                name={`people.${index}.person.age`}
                onChangeValidate={z.number().max(18, "Must be more than 18")}
              >
                {({ setValue, errors, value }) => (
                  <div>
                    {index % 2 === 0 && <p>Even row</p>}
                    <p>{value}</p>
                    <button onClick={() => setValue(value + 1)}>Add one</button>
                    {errors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                )}
              </FieldArrayItem>
            );
          })}
          <button onClick={() => add({ person: { age: 0 } })}>
            Add another number
          </button>
        </>
      )}
    </FieldArray>
  );
}
