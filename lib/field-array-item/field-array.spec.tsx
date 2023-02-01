import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { FieldArray, FieldArrayItem, Form } from "houseform";

test.todo("should register a field array with the form");
test.todo(
  "field array should allow you to set an initial value for the array of values"
);
test.todo("field array should track `isDirty` for the array of values");

test("Field array item be able to set a value", async () => {
  const { getByText } = render(
    <Form>
      {() => (
        <FieldArray<{ thing: number }>
          initialValue={[{ thing: 1 }]}
          name={"people"}
        >
          {({ value }) => (
            <>
              {value.map((person, i) => (
                <FieldArrayItem<number>
                  key={person.thing}
                  name={`people[${i}].thing`}
                >
                  {({ value, setValue }) => (
                    <div>
                      <p>Value: {value}</p>
                      <button onClick={() => setValue(2)}>Set value</button>
                    </div>
                  )}
                </FieldArrayItem>
              ))}
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(getByText("Value: 1")).toBeInTheDocument();

  await user.click(getByText("Set value"));

  expect(getByText("Value: 2")).toBeInTheDocument();
});
