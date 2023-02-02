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

test("Field array should have a functioning 'remove' helper", async () => {
  const { getByText, queryByText } = render(
    <Form>
      {() => (
        <FieldArray<number> initialValue={[1]} name={"people"}>
          {({ remove, value }) => (
            <>
              {value.map((num) => (
                <p key={num}>{num}</p>
              ))}
              <button onClick={() => remove(0)}>Remove</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(getByText("1")).toBeInTheDocument();

  await user.click(getByText("Remove"));

  expect(queryByText("1")).not.toBeInTheDocument();
});

test("Field array should have a functioning 'insert' helper", async () => {
  const { getByText, queryByText } = render(
    <Form>
      {() => (
        <FieldArray<number> initialValue={[1, 3]} name={"people"}>
          {({ insert, value }) => (
            <>
              {value.map((num) => (
                <p key={num}>{num}</p>
              ))}
              <button onClick={() => insert(1, 2)}>Insert</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(queryByText("2")).not.toBeInTheDocument();

  await user.click(getByText("Insert"));

  expect(getByText("2")).toBeInTheDocument();
});

test("Field array should have a functioning 'move' helper", async () => {
  const { getByText } = render(
    <Form>
      {() => (
        <FieldArray<number> initialValue={[1, 2, 3]} name={"people"}>
          {({ move, value }) => (
            <>
              <p>Values: {value.join(", ")}</p>
              <button onClick={() => move(2, 0)}>Move</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(getByText("Values: 1, 2, 3")).toBeInTheDocument();

  await user.click(getByText("Move"));

  expect(getByText("Values: 3, 1, 2")).toBeInTheDocument();
});

test("Field array should have a functioning 'swap' helper", async () => {
  const { getByText } = render(
    <Form>
      {() => (
        <FieldArray<number> initialValue={[1, 2, 3]} name={"people"}>
          {({ swap, value }) => (
            <>
              <p>Values: {value.join(", ")}</p>
              <button onClick={() => swap(2, 0)}>Swap</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(getByText("Values: 1, 2, 3")).toBeInTheDocument();

  await user.click(getByText("Swap"));

  expect(getByText("Values: 3, 2, 1")).toBeInTheDocument();
});

test("Field array should have a functioning 'replace' helper", async () => {
  const { getByText } = render(
    <Form>
      {() => (
        <FieldArray<number> initialValue={[1, 2, 3]} name={"people"}>
          {({ replace, value }) => (
            <>
              <p>Values: {value.join(", ")}</p>
              <button onClick={() => replace(1, 0)}>Replace</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(getByText("Values: 1, 2, 3")).toBeInTheDocument();

  await user.click(getByText("Replace"));

  expect(getByText("Values: 1, 0, 3")).toBeInTheDocument();
});
