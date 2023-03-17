import { expect, test, vi } from "vitest";
import { useRef, useState } from "react";
import { Field, FieldArray, Form } from "houseform";
import { cleanup, render, waitFor } from "@testing-library/react";
import { z } from "zod";
import { FormInstance } from "houseform";
import * as React from "react";

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

test("Form should submit with simple array values in tact", async () => {
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
  const { findByText, getByPlaceholderText } = render(
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

  expect(await findByText("Is valid")).toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(await findByText("Is not valid")).toBeInTheDocument();
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

test("Form should handle setIsTouched helper", async () => {
  const { getByText, findByText } = render(
    <Form>
      {({ setIsTouched }) => (
        <>
          <Field name={"test"}>
            {({ isTouched }) => (
              <p>{isTouched ? "Is touched" : "Is not touched"}</p>
            )}
          </Field>
          <button onClick={() => setIsTouched(true)}>Touch</button>
        </>
      )}
    </Form>
  );

  expect(getByText("Is not touched")).toBeInTheDocument();

  await user.click(getByText("Touch"));

  expect(await findByText("Is touched")).toBeInTheDocument();
});

test("Form should handle setIsDirty helper", async () => {
  const { getByText, findByText } = render(
    <Form>
      {({ setIsDirty }) => (
        <>
          <Field name={"test"}>
            {({ isDirty }) => <p>{isDirty ? "Is dirty" : "Is not dirty"}</p>}
          </Field>
          <button onClick={() => setIsDirty(true)}>Dirty</button>
        </>
      )}
    </Form>
  );

  expect(getByText("Is not dirty")).toBeInTheDocument();

  await user.click(getByText("Dirty"));

  expect(await findByText("Is dirty")).toBeInTheDocument();
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
    const formRef = useRef<FormInstance>(undefined!);

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
    const formRef = useRef<FormInstance>(undefined!);

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

test("Form should show all field errors if requested", async () => {
  const SubmitValues = () => {
    return (
      <Form>
        {({ errors }) => (
          <>
            <Field<string>
              name={"email"}
              initialValue=""
              onMountValidate={z
                .string()
                .min(1, "Should have a min length of 1")}
            >
              {() => <></>}
            </Field>
            <Field<string>
              name={"email"}
              initialValue=""
              onMountValidate={z
                .string()
                .min(3, "Should have a min length of 3")}
            >
              {() => <></>}
            </Field>
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </>
        )}
      </Form>
    );
  };

  const { findByText } = render(<SubmitValues />);

  expect(await findByText("Should have a min length of 1")).toBeInTheDocument();
  expect(await findByText("Should have a min length of 3")).toBeInTheDocument();
});

test("Assigning a form to a ref should not break the application", async () => {
  const Comp = () => {
    const [formRef, setFormRef] = React.useState<FormInstance>();

    const setFormRefCB = React.useCallback((r: any) => {
      setFormRef(r);
    }, []);

    return (
      <Form ref={setFormRefCB}>{({ isValid, submit }) => <p>Testing</p>}</Form>
    );
  };

  const { getByText } = render(<Comp />);

  expect(getByText("Testing")).toBeInTheDocument();
});

test("Form should not submit when errors are present", async () => {
  const Comp = () => {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    if (isSubmitted) return <p>Submitted</p>;

    return (
      <Form onSubmit={(values) => setIsSubmitted(true)}>
        {({ submit }) => (
          <>
            <Field<string>
              name={"email"}
              initialValue=""
              onMountValidate={z.string().min(12, "Must have 12 characters")}
            >
              {({ errors }) => (
                <>{errors && errors.length && <p>There are errors</p>}</>
              )}
            </Field>
            <button onClick={submit}>Submit</button>
          </>
        )}
      </Form>
    );
  };

  const { getByText, queryByText } = render(<Comp />);

  await waitFor(() =>
    expect(getByText("There are errors")).toBeInTheDocument()
  );

  await user.click(getByText("Submit"));

  expect(queryByText("Submitted")).not.toBeInTheDocument();
});

test("Form should submit when errors are present and submitWhenInvalid is true", async () => {
  const Comp = () => {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    if (isSubmitted) return <p>Submitted</p>;

    return (
      <Form
        submitWhenInvalid={true}
        onSubmit={(values) => setIsSubmitted(true)}
      >
        {({ submit }) => (
          <>
            <Field<string>
              name={"email"}
              initialValue=""
              onMountValidate={z.string().min(12, "Must have 12 characters")}
            >
              {({ errors }) => (
                <>{errors && errors.length && <p>There are errors</p>}</>
              )}
            </Field>
            <button onClick={submit}>Submit</button>
          </>
        )}
      </Form>
    );
  };

  const { getByText } = render(<Comp />);

  await waitFor(() =>
    expect(getByText("There are errors")).toBeInTheDocument()
  );

  await user.click(getByText("Submit"));

  expect(getByText("Submitted")).toBeInTheDocument();
});

test("Form submission should receive initially empty errors array", async () => {
  const Comp = () => {
    const [formErrors, setFormErrors] = useState<string[] | null>(null);

    if (formErrors !== null) {
      return <p>Form errors: {JSON.stringify(formErrors)}</p>;
    }
    return (
      <Form
        onSubmit={(values, form) => {
          setFormErrors(form.errors);
        }}
      >
        {({ submit }) => <button onClick={submit}>Submit</button>}
      </Form>
    );
  };

  const { getByText, container } = render(<Comp />);

  user.click(getByText("Submit"));

  await waitFor(() => expect(getByText(/Form errors/)).toBeInTheDocument());

  expect(container).toMatchInlineSnapshot(`
    <div>
      <p>
        Form errors: 
        []
      </p>
    </div>
  `);
});

test("Form submission should receive correct errors array when errors are in use in form itself", async () => {
  const Comp = () => {
    const [formErrors, setFormErrors] = useState<string[] | null>(null);

    if (formErrors !== null) {
      return <p>Form errors: {JSON.stringify(formErrors)}</p>;
    }
    return (
      <Form
        submitWhenInvalid={true}
        onSubmit={(values, form) => {
          setFormErrors(form.errors);
        }}
      >
        {({ submit, errors }) => (
          <div>
            <button onClick={submit}>Submit</button>
            <Field
              name={"test"}
              initialValue={""}
              onMountValidate={z
                .string()
                .min(12, "You must have 12 characters")}
            >
              {({ errors }) => (
                <>{errors && errors.length && <p>There are errors</p>}</>
              )}
            </Field>
            <p>{JSON.stringify(errors)}</p>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<Comp />);

  await waitFor(() =>
    expect(getByText(/There are errors/)).toBeInTheDocument()
  );

  user.click(getByText("Submit"));

  await waitFor(() => expect(getByText(/Form errors/)).toBeInTheDocument());

  expect(container).toMatchInlineSnapshot(`
    <div>
      <p>
        Form errors: 
        ["You must have 12 characters"]
      </p>
    </div>
  `);
});

test("Form submission should receive correct errors array when errors are not in use in form itself", async () => {
  const Comp = () => {
    const [formErrors, setFormErrors] = useState<string[] | null>(null);

    if (formErrors !== null) {
      return <p>Form errors: {JSON.stringify(formErrors)}</p>;
    }
    return (
      <Form
        submitWhenInvalid={true}
        onSubmit={(values, form) => {
          setFormErrors(form.errors);
        }}
      >
        {({ submit, errors }) => (
          <div>
            <button onClick={submit}>Submit</button>
            <Field
              name={"test"}
              initialValue={""}
              onMountValidate={z
                .string()
                .min(12, "You must have 12 characters")}
            >
              {({ errors }) => (
                <>{errors && errors.length && <p>There are errors</p>}</>
              )}
            </Field>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<Comp />);

  await waitFor(() =>
    expect(getByText(/There are errors/)).toBeInTheDocument()
  );

  user.click(getByText("Submit"));

  await waitFor(() => expect(getByText(/Form errors/)).toBeInTheDocument());

  expect(container).toMatchInlineSnapshot(`
    <div>
      <p>
        Form errors: 
        ["You must have 12 characters"]
      </p>
    </div>
  `);
});

test("Form submission should receive correct isValid", async () => {
  const Comp = () => {
    const [formIsValid, setFormIsValid] = useState<boolean | null>(null);

    if (formIsValid !== null) {
      return <p>Form is valid: {formIsValid.toString()}</p>;
    }

    return (
      <Form
        submitWhenInvalid={true}
        onSubmit={(values, form) => {
          setFormIsValid(form.isValid);
        }}
      >
        {({ submit, errors }) => (
          <div>
            <button onClick={submit}>Submit</button>
            <Field
              name={"test"}
              initialValue={""}
              onMountValidate={z
                .string()
                .min(12, "You must have 12 characters")}
            >
              {({ errors }) => (
                <>{errors && errors.length && <p>There are errors</p>}</>
              )}
            </Field>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<Comp />);

  await waitFor(() =>
    expect(getByText(/There are errors/)).toBeInTheDocument()
  );

  user.click(getByText("Submit"));

  await waitFor(() => expect(getByText(/Form is valid/)).toBeInTheDocument());

  expect(container).toMatchInlineSnapshot(`
    <div>
      <p>
        Form is valid: 
        false
      </p>
    </div>
  `);
});

test("Form submission should receive correct isTouched", async () => {
  const Comp = () => {
    const [formIsTouched, setFormIsTouched] = useState<boolean | null>(null);

    if (formIsTouched !== null) {
      return <p>Form is touched: {formIsTouched.toString()}</p>;
    }

    return (
      <Form
        submitWhenInvalid={true}
        onSubmit={(values, form) => {
          setFormIsTouched(form.isTouched);
        }}
      >
        {({ submit }) => (
          <div>
            <button onClick={submit}>Submit</button>
            <Field name={"test"} initialValue={""}>
              {({ onBlur }) => <button onClick={onBlur}>Blur me</button>}
            </Field>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<Comp />);

  user.click(getByText("Blur me"));
  user.click(getByText("Submit"));

  await waitFor(() => expect(getByText(/Form is touched/)).toBeInTheDocument());

  expect(container).toMatchInlineSnapshot(`
    <div>
      <p>
        Form is touched: 
        true
      </p>
    </div>
  `);
});

test("Form submission should receive correct isDirty", async () => {
  const Comp = () => {
    const [formIsDirty, setFormIsDirty] = useState<boolean | null>(null);

    if (formIsDirty !== null) {
      return <p>Form is dirty: {formIsDirty.toString()}</p>;
    }

    return (
      <Form
        submitWhenInvalid={true}
        onSubmit={(values, form) => {
          setFormIsDirty(form.isDirty);
        }}
      >
        {({ submit }) => (
          <div>
            <button onClick={submit}>Submit</button>
            <Field name={"test"} initialValue={""}>
              {({ setValue }) => (
                <button onClick={() => setValue("Test")}>Set value</button>
              )}
            </Field>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<Comp />);

  user.click(getByText("Set value"));
  user.click(getByText("Submit"));

  await waitFor(() => expect(getByText(/Form is dirty/)).toBeInTheDocument());

  expect(container).toMatchInlineSnapshot(`
    <div>
      <p>
        Form is dirty: 
        true
      </p>
    </div>
  `);
});

test("Form's memoChild should prevent re-renders", async () => {
  const formNonMemoHasRendered = vi.fn();
  const NonMemoComp = () => {
    const [counter, setCounter] = useState(0);

    return (
      <div>
        <Form submitWhenInvalid={true}>
          {() => {
            formNonMemoHasRendered();
            return <div />;
          }}
        </Form>
        <button onClick={() => setCounter((v) => v + 1)}>Add to counter</button>
        <p>Counter: {counter}</p>
      </div>
    );
  };

  const { getByText: getByTextForNonMemo } = render(<NonMemoComp />);

  expect(getByTextForNonMemo("Counter: 0")).toBeInTheDocument();

  expect(formNonMemoHasRendered).toHaveBeenCalledTimes(1);

  user.click(getByTextForNonMemo("Add to counter"));

  await waitFor(() =>
    expect(getByTextForNonMemo("Counter: 1")).toBeInTheDocument()
  );

  expect(formNonMemoHasRendered).toHaveBeenCalledTimes(2);

  cleanup();

  const formMemoHasRendered = vi.fn();
  const MemoComp = () => {
    const [counter, setCounter] = useState(0);

    return (
      <div>
        <Form memoChild={[]} submitWhenInvalid={true}>
          {() => {
            formMemoHasRendered();
            return <div />;
          }}
        </Form>
        <button onClick={() => setCounter((v) => v + 1)}>Add to counter</button>
        <p>Counter: {counter}</p>
      </div>
    );
  };

  const { getByText: getByTextForMemo } = render(<MemoComp />);

  expect(getByTextForMemo("Counter: 0")).toBeInTheDocument();

  expect(formMemoHasRendered).toHaveBeenCalledTimes(1);

  user.click(getByTextForMemo("Add to counter"));

  await waitFor(() =>
    expect(getByTextForMemo("Counter: 1")).toBeInTheDocument()
  );

  expect(formMemoHasRendered).toHaveBeenCalledTimes(1);
});

test("Form submission should receive FormInstance value", async () => {
  const Comp = () => {
    const [formValue, setFormValue] = useState<Record<string, any> | null>(
      null
    );

    if (formValue !== null) {
      return <p>Form values: {JSON.stringify(formValue)}</p>;
    }

    return (
      <Form
        onSubmit={(values, form) => {
          setFormValue(form.value);
        }}
      >
        {({ submit }) => (
          <div>
            <button onClick={submit}>Submit</button>
            <Field name={"test"} initialValue={"hello-world"}>
              {() => <></>}
            </Field>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, container } = render(<Comp />);

  user.click(getByText("Submit"));

  await waitFor(() => expect(getByText(/Form values/)).toBeInTheDocument());

  expect(container).toMatchInlineSnapshot(`
    <div>
      <p>
        Form values: 
        {"test":"hello-world"}
      </p>
    </div>
  `);
});

test("Form should use value to conditionally hide field based on another's value", async () => {
  const Comp = () => {
    return (
      <Form onSubmit={(values, form) => {}}>
        {({ submit, value }) => (
          <div>
            <button onClick={submit}>Submit</button>
            <Field name={"always"} initialValue={"hi"}>
              {({ setValue }) => (
                <button onClick={() => setValue("bye")}>Set</button>
              )}
            </Field>
            {value.always === "bye" ? null : (
              <Field name={"conditionally"} initialValue={""}>
                {() => <p>I am here</p>}
              </Field>
            )}
          </div>
        )}
      </Form>
    );
  };

  const { getByText, queryByText } = render(<Comp />);

  await waitFor(() => expect(getByText("I am here")).toBeInTheDocument());

  user.click(getByText("Set"));

  await waitFor(() => expect(queryByText("I am here")).toBeInTheDocument());
});
