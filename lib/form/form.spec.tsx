import { expect, test } from "vitest";
import { useRef, useState } from "react";
import { Field, FieldArray, Form } from "houseform";
import { render, waitFor } from "@testing-library/react";
import { z } from "zod";
import { FormContext } from "./context";

test("Form should render children", () => {
  const { getByText } = render(
    <Form onSubmit={(_) => {}}>{() => <div>Test</div>}</Form>
  );

  expect(getByText("Test")).toBeInTheDocument();
});

test("Form should submit with basic values in tact", async () => {
  const SubmitValues = () => {
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <>
            <Field<string> name={"email"} initialValue="test@example.com">
              {() => <></>}
            </Field>
            <button onClick={submit}>Submit</button>
          </>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<SubmitValues />);

  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {"email":"test@example.com"}
        </p>
      </div>
    `)
  );
});

test("Form should submit with array values in tact", async () => {
  const SubmitValues = () => {
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <>
            <FieldArray<string>
              name={"email"}
              initialValue={["test@example.com"]}
            >
              {() => <></>}
            </FieldArray>
            <button onClick={submit}>Submit</button>
          </>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<SubmitValues />);

  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {"email":["test@example.com"]}
        </p>
      </div>
    `)
  );
});

test("Form should not submit if there are errors with onChangeValidate", async () => {
  const SubmitValues = () => {
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <>
            <Field<string>
              name={"email"}
              initialValue=""
              onChangeValidate={z.string().min(1)}
            >
              {() => <></>}
            </Field>
            <button onClick={submit}>Submit</button>
          </>
        )}
      </Form>
    );
  };

  const { getByText } = render(<SubmitValues />);

  await user.click(getByText("Submit"));

  expect(getByText("Submit")).toBeInTheDocument();
});

test("Form should not submit if there are errors with onSubmitValidate", async () => {
  const SubmitValues = () => {
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <>
            <Field<string>
              name={"email"}
              initialValue=""
              onSubmitValidate={z.string().min(1)}
            >
              {() => <></>}
            </Field>
            <button onClick={submit}>Submit</button>
          </>
        )}
      </Form>
    );
  };

  const { getByText } = render(<SubmitValues />);

  await user.click(getByText("Submit"));

  expect(getByText("Submit")).toBeInTheDocument();
});

test("Form should show isValid proper", async () => {
  const { getByText, getByPlaceholderText } = render(
    <Form onSubmit={() => {}}>
      {({ isValid }) => (
        <>
          <Field<string>
            name={"email"}
            onChangeValidate={() => Promise.reject("Not valid")}
            initialValue="test@example.com"
          >
            {({ value, setValue, errors }) => (
              <div>
                <input
                  placeholder="Email"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
          </Field>
          <p>{isValid ? "Is valid" : "Is not valid"}</p>
        </>
      )}
    </Form>
  );

  expect(getByText("Is valid")).toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(getByText("Is not valid")).toBeInTheDocument();
});

test("Form should show isSubmitted proper", async () => {
  const { getByText, findByText } = render(
    <Form onSubmit={() => {}}>
      {({ isSubmitted, submit }) => (
        <>
          <button onClick={submit}>Submit</button>
          <p>{isSubmitted ? "Submitted" : "Not submitted"}</p>
        </>
      )}
    </Form>
  );

  expect(getByText("Not submitted")).toBeInTheDocument();

  await user.click(getByText("Submit"));

  expect(await findByText("Submitted")).toBeInTheDocument();
});

test("Form should show isTouched proper", async () => {
  const { getByText, findByText } = render(
    <Form onSubmit={() => {}}>
      {({ isTouched, submit }) => (
        <>
          <Field name={"test"}>
            {({ onBlur }) => (
              <button onClick={() => onBlur()}>Touch a field</button>
            )}
          </Field>
          <button onClick={submit}>Submit</button>
          <p>{isTouched ? "Form is touched" : "Form is not touched"}</p>
        </>
      )}
    </Form>
  );

  expect(getByText("Form is not touched")).toBeInTheDocument();

  await user.click(getByText("Touch a field"));

  expect(await findByText("Form is touched")).toBeInTheDocument();
});

test("Form should reset isTouched when all touched fields are not touched anymore", async () => {
  const { getByText, findByText } = render(
    <Form onSubmit={() => {}}>
      {({ isTouched, submit }) => (
        <>
          <Field name={"test"}>
            {({ onBlur, setIsTouched }) => (
              <div>
                <button onClick={() => onBlur()}>Touch a field</button>
                <button onClick={() => setIsTouched(false)}>
                  Untouch a field
                </button>
              </div>
            )}
          </Field>
          <button onClick={submit}>Submit</button>
          <p>{isTouched ? "Form is touched" : "Form is not touched"}</p>
        </>
      )}
    </Form>
  );

  await user.click(getByText("Touch a field"));
  expect(await findByText("Form is touched")).toBeInTheDocument();
  await user.click(getByText("Untouch a field"));
  expect(getByText("Form is not touched")).toBeInTheDocument();
});

test("Form should show isDirty proper", async () => {
  const { getByText, findByText } = render(
    <Form onSubmit={() => {}}>
      {({ isDirty, submit }) => (
        <>
          <Field name={"test"}>
            {({ setValue }) => (
              <button onClick={() => setValue("Test")}>Dirty a field</button>
            )}
          </Field>
          <button onClick={submit}>Submit</button>
          <p>{isDirty ? "Form is dirty" : "Form is not dirty"}</p>
        </>
      )}
    </Form>
  );

  expect(getByText("Form is not dirty")).toBeInTheDocument();

  await user.click(getByText("Dirty a field"));

  expect(await findByText("Form is dirty")).toBeInTheDocument();
});

test("Form should reset isDirty when all touched fields are not touched anymore", async () => {
  const { getByText, findByText } = render(
    <Form onSubmit={() => {}}>
      {({ isDirty, submit }) => (
        <>
          <Field name={"test"}>
            {({ setValue, setIsDirty }) => (
              <div>
                <button onClick={() => setValue("Test")}>Dirty a field</button>
                <button onClick={() => setIsDirty(false)}>
                  Undirty a field
                </button>
              </div>
            )}
          </Field>
          <button onClick={submit}>Submit</button>
          <p>{isDirty ? "Form is dirty" : "Form is not dirty"}</p>
        </>
      )}
    </Form>
  );

  await user.click(getByText("Dirty a field"));
  expect(await findByText("Form is dirty")).toBeInTheDocument();
  await user.click(getByText("Undirty a field"));
  expect(getByText("Form is not dirty")).toBeInTheDocument();
});

test("Form should have context passed to ref", async () => {
  const Comp = () => {
    const formRef = useRef<FormContext>(undefined!);

    const [val, setVal] = useState("");

    if (val) return <p>{val}</p>;

    return (
      <div>
        <Form onSubmit={() => {}} ref={formRef}>
          {() => (
            <Field name={"test"} initialValue="Test">
              {() => <div></div>}
            </Field>
          )}
        </Form>
        <button
          onClick={() => setVal(formRef.current.getFieldValue("test")?.value)}
        >
          Submit
        </button>
      </div>
    );
  };
  const { getByText, queryByText, findByText } = render(<Comp />);

  expect(queryByText("Test")).not.toBeInTheDocument();
  await user.click(getByText("Submit"));
  expect(await findByText("Test")).toBeInTheDocument();
});

test("Form submit should return `true` if valid", async () => {
  const Comp = () => {
    const [val, setVal] = useState<boolean | null>(null);

    if (val !== null) return <p>{val ? "True" : "False"}</p>;

    return (
      <div>
        <Form onSubmit={() => {}}>
          {({ submit }) => (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const isValid = await submit();
                setVal(isValid);
              }}
            >
              <Field name={"test"} initialValue="">
                {() => <div></div>}
              </Field>
              <button type="submit">Submit</button>
            </form>
          )}
        </Form>
      </div>
    );
  };
  const { getByText, queryByText, findByText } = render(<Comp />);

  expect(queryByText("True")).not.toBeInTheDocument();
  await user.click(getByText("Submit"));
  expect(await findByText("True")).toBeInTheDocument();
});

test("Form submit should return `false` if not valid", async () => {
  const Comp = () => {
    const [val, setVal] = useState<boolean | null>(null);

    if (val !== null) return <p>{val ? "True" : "False"}</p>;

    return (
      <div>
        <Form onSubmit={() => {}}>
          {({ submit }) => (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const isValid = await submit();
                setVal(isValid);
              }}
            >
              <Field
                name={"test"}
                initialValue=""
                onChangeValidate={z.string().min(9)}
              >
                {() => <div></div>}
              </Field>
              <button type="submit">Submit</button>
            </form>
          )}
        </Form>
      </div>
    );
  };
  const { getByText, queryByText, findByText } = render(<Comp />);

  expect(queryByText("False")).not.toBeInTheDocument();
  await user.click(getByText("Submit"));
  expect(await findByText("False")).toBeInTheDocument();
});

test("Field with dot notation should submit with deep object value", async () => {
  const SubmitValues = () => {
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <>
            <Field<string>
              name={"test.other.email"}
              initialValue="test@example.com"
            >
              {() => <></>}
            </Field>
            <button onClick={submit}>Submit</button>
          </>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<SubmitValues />);

  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
        <div>
          <p>
            {"test":{"other":{"email":"test@example.com"}}}
          </p>
        </div>
      `)
  );
});

test("Field with bracket notation should submit with deep object value", async () => {
  const SubmitValues = () => {
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <>
            <Field<string>
              name={"test['other']['email']"}
              initialValue="test@example.com"
            >
              {() => <></>}
            </Field>
            <button onClick={submit}>Submit</button>
          </>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<SubmitValues />);

  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
        <div>
          <p>
            {"test":{"other":{"email":"test@example.com"}}}
          </p>
        </div>
      `)
  );
});

// <Field name={`test[other]`}> should be gotten with `getFieldValue('test.other')`
test("Form's `getFieldValue` should show dot notation for incorrect syntax", async () => {
  const Comp = () => {
    const formRef = useRef<FormContext>(undefined!);

    const [val, setVal] = useState("");

    if (val) return <p>{val}</p>;

    return (
      <div>
        <Form onSubmit={() => {}} ref={formRef}>
          {() => (
            <Field name={"test.other"} initialValue="Test">
              {() => <div></div>}
            </Field>
          )}
        </Form>
        <button
          onClick={() =>
            setVal(formRef.current.getFieldValue('test["other"]')?.value)
          }
        >
          Submit
        </button>
      </div>
    );
  };
  const { getByText, queryByText, findByText } = render(<Comp />);

  expect(queryByText("Test")).not.toBeInTheDocument();
  await user.click(getByText("Submit"));
  expect(await findByText("Test")).toBeInTheDocument();
});
