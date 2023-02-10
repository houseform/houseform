import { expect, test } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { Field, FieldInstance, Form } from "houseform";

import { z } from "zod";
import { useEffect, useRef, useState } from "react";

test("Field should render children", () => {
  const { getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => <Field name={"test"}>{() => <div>Test</div>}</Field>}
    </Form>
  );

  expect(getByText("Test")).toBeInTheDocument();
});

test("Field should render with initial values", async () => {
  const { getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string> name={"email"} initialValue="test@example.com">
          {({ value }) => <p>{value}</p>}
        </Field>
      )}
    </Form>
  );

  expect(getByText("test@example.com")).toBeInTheDocument();
});

test("Field should allow changing value", async () => {
  const { getByPlaceholderText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string> name={"email"} initialValue="">
          {({ value, setValue }) => (
            <input
              placeholder="Email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </Field>
      )}
    </Form>
  );

  const emailInput = getByPlaceholderText("Email");

  expect(emailInput).toHaveValue("");

  await user.type(emailInput, "test@example.com");

  expect(emailInput).toHaveValue("test@example.com");
});

test("Field should show errors with async onChange validator function", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onChangeValidate={() => Promise.reject("This should show up")}
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
      )}
    </Form>
  );

  expect(queryByText("This should show up")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(getByText("This should show up")).toBeInTheDocument();
});

test("Field should not show errors with valid input on an async onChange validator function", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onChangeValidate={() => Promise.resolve(true)}
        >
          {({ value, setValue, errors }) => (
            <div>
              <input
                placeholder="Email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {errors.map((error) => (
                <p key={error}>This is an error</p>
              ))}
            </div>
          )}
        </Field>
      )}
    </Form>
  );

  expect(queryByText("This is an error")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(queryByText("This is an error")).not.toBeInTheDocument();
});

test("Field should show errors with async onChange validator zod usage", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onChangeValidate={z.string().email("You must input a valid email")}
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
      )}
    </Form>
  );

  expect(queryByText("You must input a valid email")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(getByText("You must input a valid email")).toBeInTheDocument();
});

test("Field should show errors with async onBlur validator zod usage", async () => {
  const { getByPlaceholderText, queryByText, findByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onBlurValidate={z.string().email("You must input a valid email")}
        >
          {({ value, setValue, errors, onBlur }) => (
            <div>
              <input
                placeholder="Email"
                value={value}
                onBlur={onBlur}
                onChange={(e) => setValue(e.target.value)}
              />
              {errors.map((error) => (
                <p key={error}>There was an error: {error}</p>
              ))}
            </div>
          )}
        </Field>
      )}
    </Form>
  );

  expect(queryByText(/There was an error/)).not.toBeInTheDocument();

  fireEvent.change(getByPlaceholderText("Email"), {
    target: { value: "test" },
  });

  expect(queryByText(/There was an error/)).not.toBeInTheDocument();

  fireEvent.blur(getByPlaceholderText("Email"));

  expect(await findByText(/There was an error/)).toBeInTheDocument();
});

test("Field should not show errors with async onChange validator zod usage", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onChangeValidate={z.string().email("You must input a valid email")}
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
      )}
    </Form>
  );

  expect(queryByText("You must input a valid email")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test@gmail.com");

  expect(queryByText("You must input a valid email")).not.toBeInTheDocument();
});

test("onSubmitValidate should work", async () => {
  const { getByText, getByPlaceholderText, queryByText } = render(
    <Form onSubmit={() => {}}>
      {({ submit }) => (
        <>
          <Field<string>
            name={"email"}
            onSubmitValidate={() => Promise.reject("Not valid")}
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
          <button onClick={submit}>Submit</button>
        </>
      )}
    </Form>
  );

  expect(queryByText("Not valid")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(queryByText("Not valid")).not.toBeInTheDocument();

  await user.click(getByText("Submit"));

  expect(getByText("Not valid")).toBeInTheDocument();
});

test("Field onChange can clear an error when resolved", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onChangeValidate={(val) =>
            val.startsWith("true")
              ? Promise.resolve(true)
              : Promise.reject("This is an error")
          }
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
      )}
    </Form>
  );

  expect(queryByText("This is an error")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(getByText("This is an error")).toBeInTheDocument();

  await user.clear(getByPlaceholderText("Email"));

  await user.type(getByPlaceholderText("Email"), "true");

  expect(queryByText("This is an error")).not.toBeInTheDocument();
});

test("Field can receive data from other fields", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(values) => {}}>
      {({ submit }) => (
        <>
          <Field<string> name="password" initialValue={"testing123"}>
            {({ value, setValue }) => (
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={"Password"}
              />
            )}
          </Field>
          <Field<string>
            name="confirmpassword"
            onChangeValidate={(val, form) => {
              if (val === form.getFieldValue("password")!.value) {
                return Promise.resolve(true);
              } else {
                return Promise.reject("Passwords must match");
              }
            }}
          >
            {({ value, setValue, errors }) => {
              return (
                <div>
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={"Password Confirmation"}
                  />
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              );
            }}
          </Field>
          <button onClick={submit}>Submit</button>
        </>
      )}
    </Form>
  );

  expect(queryByText("Passwords must match")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Password Confirmation"), "test");
  expect(getByText("Passwords must match")).toBeInTheDocument();
  await user.clear(getByPlaceholderText("Password Confirmation"));
  await user.type(getByPlaceholderText("Password Confirmation"), "testing123");
  expect(queryByText("Passwords must match")).not.toBeInTheDocument();
});

test("Field can check for onChangeValidate errors on submit", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(values) => {}}>
      {({ submit }) => (
        <>
          <Field<string> name="password" initialValue={"testing123"}>
            {({ value, setValue }) => (
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={"Password"}
              />
            )}
          </Field>
          <Field<string>
            name="confirmpassword"
            onChangeValidate={(val, form) => {
              if (val === form.getFieldValue("password")!.value) {
                return Promise.resolve(true);
              } else {
                return Promise.reject("Passwords must match");
              }
            }}
          >
            {({ value, setValue, errors }) => {
              return (
                <div>
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={"Password Confirmation"}
                  />
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              );
            }}
          </Field>
          <button onClick={submit}>Submit</button>
        </>
      )}
    </Form>
  );

  expect(queryByText("Passwords must match")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Password Confirmation"), "test");
  expect(getByText("Passwords must match")).toBeInTheDocument();
  await user.clear(getByPlaceholderText("Password Confirmation"));
  await user.type(getByPlaceholderText("Password Confirmation"), "testing123");
  expect(queryByText("Passwords must match")).not.toBeInTheDocument();
  await user.type(getByPlaceholderText("Password"), "another");
  expect(queryByText("Passwords must match")).not.toBeInTheDocument();
  await user.click(getByText("Submit"));
  expect(getByText("Passwords must match")).toBeInTheDocument();
});

test("Field can check for onBlurValidate errors on submit", async () => {
  const { getByText, queryByText } = render(
    <Form onSubmit={(values) => {}}>
      {({ submit }) => (
        <>
          <Field<string>
            name="test"
            initialValue=""
            onBlurValidate={z.string().min(3)}
          >
            {({ value, setValue, errors }) => (
              // I'm intentionally not using the onBlur function here to test this
              <div>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={"Test"}
                />
                {errors.map((error) => (
                  <p key={error}>There was an error: {error}</p>
                ))}
              </div>
            )}
          </Field>
          <button onClick={submit}>Submit</button>
        </>
      )}
    </Form>
  );

  expect(queryByText(/There was an error/)).not.toBeInTheDocument();
  await user.click(getByText("Submit"));
  expect(getByText(/There was an error/)).toBeInTheDocument();
});

test("Is touched should be set", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(values) => {}}>
      {() => (
        <Field<string> name="email" initialValue="">
          {({ value, setValue, onBlur, isTouched }) => (
            <div>
              <input
                placeholder="Email"
                onBlur={onBlur}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {isTouched && <p>Touched</p>}
            </div>
          )}
        </Field>
      )}
    </Form>
  );

  expect(queryByText("Touched")).not.toBeInTheDocument();

  getByPlaceholderText("Email").focus();
  getByPlaceholderText("Email").blur();

  await waitFor(() => expect(getByText("Touched")).toBeInTheDocument());
});

test("Is dirty should be set", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(values) => {}}>
      {() => (
        <Field<string> name="email" initialValue="">
          {({ value, setValue, isDirty }) => (
            <div>
              <input
                placeholder="Email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {isDirty && <p>Dirty</p>}
            </div>
          )}
        </Field>
      )}
    </Form>
  );

  expect(queryByText("Dirty")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(getByText("Dirty")).toBeInTheDocument();
});

test("Field can listen for changes in other fields to validate on multiple field changes - onChange", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(values) => {}}>
      {({ submit }) => (
        <>
          <Field<string> name="password" initialValue={"testing123"}>
            {({ value, setValue }) => (
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={"Password"}
              />
            )}
          </Field>
          <Field<string>
            name="confirmpassword"
            listenTo={["password"]}
            onChangeValidate={(val, form) => {
              if (val === form.getFieldValue("password")!.value) {
                return Promise.resolve(true);
              } else {
                return Promise.reject("Passwords must match");
              }
            }}
          >
            {({ value, setValue, errors }) => {
              return (
                <div>
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={"Password Confirmation"}
                  />
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              );
            }}
          </Field>
          <button onClick={submit}>Submit</button>
        </>
      )}
    </Form>
  );

  expect(queryByText("Passwords must match")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Password Confirmation"), "testing123");
  expect(queryByText("Passwords must match")).not.toBeInTheDocument();
  await user.clear(getByPlaceholderText("Password"));
  await user.type(getByPlaceholderText("Password"), "other");
  expect(getByText("Passwords must match")).toBeInTheDocument();
});

test("Field can listen for changes in other fields to validate on multiple field changes - onBlur", async () => {
  const { getByPlaceholderText, queryByText, findByText } = render(
    <Form onSubmit={(values) => {}}>
      {({ submit }) => (
        <>
          <Field<string> name="password" initialValue={"testing123"}>
            {({ value, setValue, onBlur }) => (
              <input
                value={value}
                onBlur={onBlur}
                onChange={(e) => setValue(e.target.value)}
                placeholder={"Password"}
              />
            )}
          </Field>
          <Field<string>
            name="confirmpassword"
            listenTo={["password"]}
            onBlurValidate={(val, form) => {
              if (val === form.getFieldValue("password")!.value) {
                return Promise.resolve(true);
              } else {
                return Promise.reject("Passwords must match");
              }
            }}
          >
            {({ value, setValue, errors, onBlur }) => {
              return (
                <div>
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={"Password Confirmation"}
                    onBlur={onBlur}
                  />
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              );
            }}
          </Field>
          <button onClick={submit}>Submit</button>
        </>
      )}
    </Form>
  );

  expect(queryByText("Passwords must match")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Password Confirmation"), "testing123");
  fireEvent.blur(getByPlaceholderText("Password Confirmation"));
  expect(queryByText("Passwords must match")).not.toBeInTheDocument();
  await user.clear(getByPlaceholderText("Password"));
  await user.type(getByPlaceholderText("Password"), "other");
  fireEvent.blur(getByPlaceholderText("Password"));
  expect(await findByText("Passwords must match")).toBeInTheDocument();
});

test("Field should have render props passed to ref", async () => {
  const Comp = () => {
    const fieldRef = useRef<FieldInstance>(undefined!);

    const [val, setVal] = useState("");

    if (val) return <p>{val}</p>;

    return (
      <div>
        <Form onSubmit={() => {}}>
          {() => (
            <Field name={"test"} initialValue="Test" ref={fieldRef}>
              {() => <div></div>}
            </Field>
          )}
        </Form>
        <button onClick={() => setVal(fieldRef.current?.value)}>Submit</button>
      </div>
    );
  };
  const { getByText, queryByText, findByText } = render(<Comp />);

  expect(queryByText("Test")).not.toBeInTheDocument();
  await user.click(getByText("Submit"));
  expect(await findByText("Test")).toBeInTheDocument();
});

test("Field should show errors with invalid onMount validator zod usage", async () => {
  const { getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string>
          name={"email"}
          initialValue="testing"
          onMountValidate={z.string().email("You must input a valid email")}
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
      )}
    </Form>
  );

  await waitFor(() =>
    expect(getByText("You must input a valid email")).toBeInTheDocument()
  );
});

test("Field should show not errors with valid onMount validator zod usage", async () => {
  const Comp = () => {
    const [didRun, setDidRun] = useState(false);

    useEffect(() => {
      if (!didRun) {
        setTimeout(() => {
          setDidRun(true);
        }, 0);
      }
    }, [didRun, setDidRun]);

    return (
      <>
        {didRun && <p>Did run useEffect</p>}
        <Form onSubmit={(_) => {}}>
          {() => (
            <Field<string>
              name={"email"}
              initialValue="testing@gmail.com"
              onMountValidate={z.string().email("You must input a valid email")}
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
          )}
        </Form>
      </>
    );
  };
  const { queryByText, getByText } = render(<Comp />);

  await waitFor(() =>
    expect(getByText("Did run useEffect")).toBeInTheDocument()
  );

  expect(queryByText("You must input a valid email")).not.toBeInTheDocument();
});
