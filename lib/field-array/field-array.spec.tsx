import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { FieldArray, FieldArrayItem, Form } from "houseform";

test.todo("should register a field array with the form");
test.todo("field array should track `isDirty` for the array of values");

test("Field array should allow you to set an initial value for the array of values", async () => {
  const { getByText } = render(
    <Form>
      {() => (
        <FieldArray<number> initialValue={[1]} name={"people"}>
          {({ value }) => (
            <>
              {value.map((num) => (
                <p key={num}>Value: {num}</p>
              ))}
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(getByText("Value: 1")).toBeInTheDocument();
});

test("Field array should have a functioning 'add' helper", async () => {
  const { getByText, queryByText } = render(
    <Form>
      {() => (
        <FieldArray<number> name={"people"}>
          {({ add, value }) => (
            <>
              {value.map((num) => (
                <p key={num}>{num}</p>
              ))}
              <button onClick={() => add(1)}>Add</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(queryByText("1")).not.toBeInTheDocument();

  await user.click(getByText("Add"));

  expect(getByText("1")).toBeInTheDocument();
});
