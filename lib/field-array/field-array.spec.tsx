import { expect, test } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Field, FieldArray, FieldArrayItem, Form } from "houseform";
import { z } from "zod";

test("field array should track `isDirty` for the array of values", async () => {
  const { getByText, queryByText } = render(
    <Form>
      {() => (
        <FieldArray<number> name={"people"} initialValue={[1]}>
          {({ isDirty, setValue }) => (
            <>
              {isDirty && <p>Array is dirty</p>}
              <button onClick={() => setValue(1, 2)}>Set value</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(queryByText("Array is dirty")).not.toBeInTheDocument();

  await user.click(getByText("Set value"));

  expect(getByText("Array is dirty")).toBeInTheDocument();
});

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

test("field array should run onChange validation", async () => {
  const { getByText, queryByText } = render(
    <Form>
      {() => (
        <FieldArray<number>
          name={"people"}
          initialValue={[1]}
          onChangeValidate={z
            .array(z.any())
            .min(3, "Should have at least three items")}
        >
          {({ add, errors }) => (
            <>
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
              <button onClick={() => add(2)}>Add</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(
    queryByText("Should have at least three items")
  ).not.toBeInTheDocument();

  await user.click(getByText("Add"));

  expect(getByText("Should have at least three items")).toBeInTheDocument();

  await user.click(getByText("Add"));

  expect(
    queryByText("Should have at least three items")
  ).not.toBeInTheDocument();
});

test("field array should run onSubmit validation", async () => {
  const { getByText, queryByText } = render(
    <Form>
      {({ submit }) => (
        <FieldArray<number>
          name={"people"}
          initialValue={[1]}
          onSubmitValidate={z
            .array(z.any())
            .min(3, "Should have at least three items")}
        >
          {({ errors }) => (
            <>
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
              <button onClick={() => submit()}>Submit</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(
    queryByText("Should have at least three items")
  ).not.toBeInTheDocument();

  await user.click(getByText("Submit"));

  expect(getByText("Should have at least three items")).toBeInTheDocument();
});

test("field array setValues should set the field array values", async () => {
  const { getByText, queryByText } = render(
    <Form>
      {() => (
        <FieldArray<number> name={"people"} initialValue={[1]}>
          {({ value, setValues }) => (
            <>
              {value.map((num) => (
                <p key={num}>Num {num}</p>
              ))}
              <button onClick={() => setValues([1, 2, 3])}>Set value</button>
            </>
          )}
        </FieldArray>
      )}
    </Form>
  );

  expect(getByText("Num 1")).toBeInTheDocument();
  expect(queryByText("Num 2")).not.toBeInTheDocument();
  expect(queryByText("Num 3")).not.toBeInTheDocument();

  fireEvent.click(getByText("Set value"));

  expect(getByText("Num 1")).toBeInTheDocument();
  expect(getByText("Num 2")).toBeInTheDocument();
  expect(getByText("Num 3")).toBeInTheDocument();
});

test("field array should work with listenTo as the subject", async () => {
  const { queryByText, getByText } = render(
    <Form>
      {() => (
        <div>
          <Field<string>
            name={"test"}
            listenTo={[`people`]}
            onChangeValidate={z.string().min(3, "Must be at least 3")}
            initialValue={"T"}
          >
            {({ errors }) => (
              <div>
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
          </Field>
          <FieldArray<{ thing: number }>
            initialValue={[{ thing: 1 }]}
            name={"people"}
          >
            {({ add }) => (
              <button onClick={() => add({ thing: 2 })}>Add</button>
            )}
          </FieldArray>
        </div>
      )}
    </Form>
  );

  expect(queryByText("Must be at least 3")).not.toBeInTheDocument();

  await user.click(getByText("Add"));

  expect(getByText("Must be at least 3")).toBeInTheDocument();
});

test("field array should work with listenTo as the listener", async () => {
  const { queryByText, getByText } = render(
    <Form>
      {() => (
        <div>
          <Field<string> name={"test"} initialValue={"T"}>
            {({ setValue }) => (
              <button onClick={() => setValue("Tes")}>Set value</button>
            )}
          </Field>
          <FieldArray<{ thing: number }>
            initialValue={[{ thing: 1 }]}
            onChangeValidate={z.array(z.any()).min(3, "Must be at least 3")}
            listenTo={[`test`]}
            name={"people"}
          >
            {({ errors }) => (
              <div>
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
          </FieldArray>
        </div>
      )}
    </Form>
  );

  expect(queryByText("Must be at least 3")).not.toBeInTheDocument();

  await user.click(getByText("Set value"));

  expect(getByText("Must be at least 3")).toBeInTheDocument();
});

test.todo("Should work with listenTo");

test.todo("Should expose meta fields to ref");

test.todo("Should track all subfield errors");

test.todo("Should track all subfield isTouched");

test.todo("Should track all subfield isDirty");
