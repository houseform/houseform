import { expect, test } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { FieldArray, FieldArrayItem, Form } from "houseform";
import { useState } from "react";

test("Field array item should submit with values in tact", async () => {
  const SubmitValues = () => {
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <div>
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
            <button onClick={submit}>Submit</button>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<SubmitValues />);

  expect(getByText("Value: 1")).toBeInTheDocument();

  await user.click(getByText("Set value"));

  expect(getByText("Value: 2")).toBeInTheDocument();

  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {"people":[{"thing":2}]}
        </p>
      </div>
    `)
  );
});

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

test.todo("field array item should track `isDirty`");

test.todo("field array item should track `isTouched`");

test.todo("field array item should validate onChange");

test.todo("field array item should validate onBlur");

test.todo("field array item should validate onSubmit");

test.todo("Should work with listenTo");
