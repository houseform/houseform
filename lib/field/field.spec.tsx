import { expect, test, vi } from "vitest";
import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Field, FieldInstance, Form, FormInstance } from "houseform";

import { z } from "zod";
import React, { useEffect, useRef, useState } from "react";

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
              if (val === form.getFieldValue("password")?.value) {
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
              if (val === form.getFieldValue("password")?.value) {
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

test("Is dirty should be false if value is the initially provided", async () => {
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

  await user.clear(getByPlaceholderText("Email"));

  expect(queryByText("Dirty")).not.toBeInTheDocument();
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
              if (val === form.getFieldValue("password")?.value) {
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
              if (val === form.getFieldValue("password")?.value) {
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

test("Field should only run listeners when value changes", async () => {
  const arr = Array.from({ length: 5 }, (_, i) => i);
  const { getByTestId, getAllByText, queryAllByText } = render(
    <Form>
      {() => (
        <>
          {arr.map((num, i) => {
            return (
              <Field
                listenTo={i === 0 ? ["num[1]"] : undefined}
                key={i}
                name={`num[${i}]`}
                initialValue={num}
                onChangeValidate={z.number().min(3, "Must be at least three")}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <div>
                      <input
                        data-listento={i === 0 ? "num[1]" : undefined}
                        data-testid={`value${i}`}
                        type="number"
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => setValue(e.target.valueAsNumber)}
                        placeholder={`Number ${i}`}
                      />
                      {errors.map((error) => (
                        <p key={error}>{error}</p>
                      ))}
                    </div>
                  );
                }}
              </Field>
            );
          })}
        </>
      )}
    </Form>
  );

  if (queryAllByText("Must be at least three")?.length) {
    throw "Should not be present yet";
  }

  fireEvent.change(getByTestId("value1"), { target: { value: 0 } });

  await waitFor(() =>
    expect(getAllByText("Must be at least three")).toHaveLength(2)
  );
});

test("Field should manually validate", async () => {
  const Comp = () => {
    const formRef = useRef<FormInstance>(null);

    const runValidate = () => {
      formRef.current?.getFieldValue("test")?.validate("onChangeValidate");
    };

    return (
      <div>
        <Form ref={formRef}>
          {() => (
            <Field
              name={"test"}
              initialValue={"Te"}
              onChangeValidate={z.string().min(3, "Must be at least three")}
            >
              {({ errors, value }) => {
                return (
                  <div>
                    <p>Value: {value}</p>
                    {errors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                );
              }}
            </Field>
          )}
        </Form>
        <button onClick={runValidate}>Validate</button>
      </div>
    );
  };

  const { getByText, queryByText, findByText } = render(<Comp />);

  expect(getByText("Value: Te")).toBeInTheDocument();
  expect(queryByText("Must be at least three")).not.toBeInTheDocument();
  await user.click(getByText("Validate"));
  expect(await findByText("Must be at least three")).toBeInTheDocument();
});

test("Field should not throw error if manually validate against non-used validation type", async () => {
  const Comp = () => {
    const formRef = useRef<FormInstance>(null);

    const runValidate = () => {
      formRef.current?.getFieldValue("test")?.validate("onBlurValidate");
    };

    return (
      <div>
        <Form ref={formRef}>
          {() => (
            <Field
              name={"test"}
              initialValue={"Te"}
              onChangeValidate={z.string().min(3, "Must be at least three")}
            >
              {({ errors, value }) => {
                return (
                  <div>
                    <p>Value: {value}</p>
                    {errors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                );
              }}
            </Field>
          )}
        </Form>
        <button onClick={runValidate}>Validate</button>
      </div>
    );
  };

  const { getByText, queryByText, findByText } = render(<Comp />);

  expect(getByText("Value: Te")).toBeInTheDocument();
  expect(queryByText("Must be at least three")).not.toBeInTheDocument();
  await user.click(getByText("Validate"));
  expect(queryByText("Must be at least three")).not.toBeInTheDocument();
});

test("isTouched should only change onBlur", async () => {
  let touchedValue;
  const { getByPlaceholderText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string> name="email" initialValue="">
          {({ value, setValue, onBlur, isTouched }) => {
            touchedValue = isTouched;
            return (
              <input
                placeholder="Email"
                onBlur={onBlur}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            );
          }}
        </Field>
      )}
    </Form>
  );

  const emailInput = getByPlaceholderText("Email");

  // Initially, isTouched should be false
  expect(touchedValue).toBeFalsy();

  // After changing the input value, isTouched should still be false
  await fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  expect(touchedValue).toBeFalsy();

  // After triggering the onBlur event, isTouched should be true
  await fireEvent.blur(emailInput);
  expect(touchedValue).toBeTruthy();
});

test("Field should set isValidating with async onMount validator function", async () => {
  function isEmailUnique() {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 50);
    });
  }
  const { queryByText, getByText } = render(
    <Form>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onMountValidate={isEmailUnique}
        >
          {({ value, setValue, isValidating }) => (
            <div>
              <input
                placeholder="Email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {isValidating && <p>Validating</p>}
            </div>
          )}
        </Field>
      )}
    </Form>
  );

  await waitFor(() => expect(getByText("Validating")).toBeInTheDocument());
  await waitForElementToBeRemoved(() => queryByText("Validating"));
});

test("Field should set isValidating with async onChange validator function", async () => {
  function isEmailUnique() {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 50);
    });
  }
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onChangeValidate={isEmailUnique}
        >
          {({ value, setValue, isValidating }) => (
            <div>
              <input
                placeholder="Email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {isValidating && <p>Validating</p>}
            </div>
          )}
        </Field>
      )}
    </Form>
  );

  expect(queryByText("Validating")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(getByText("Validating")).toBeInTheDocument();

  await waitForElementToBeRemoved(() => queryByText("Validating"));
});

test("Field should set isValidating with async onBlur validator function", async () => {
  function isEmailUnique() {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 50);
    });
  }
  const { getByPlaceholderText, queryByText, findByText } = render(
    <Form>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onBlurValidate={isEmailUnique}
        >
          {({ value, setValue, isValidating, onBlur }) => (
            <div>
              <input
                placeholder="Email"
                value={value}
                onBlur={onBlur}
                onChange={(e) => setValue(e.target.value)}
              />
              {isValidating && <p>Validating</p>}
            </div>
          )}
        </Field>
      )}
    </Form>
  );

  expect(queryByText("Validating")).not.toBeInTheDocument();

  fireEvent.change(getByPlaceholderText("Email"), {
    target: { value: "test" },
  });

  expect(queryByText("Validating")).not.toBeInTheDocument();

  fireEvent.blur(getByPlaceholderText("Email"));

  expect(await findByText("Validating")).toBeInTheDocument();

  await waitForElementToBeRemoved(() => queryByText("Validating"));
});

test("Field should set isValidating with async onSubmit validator function", async () => {
  function isEmailUnique() {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 50);
    });
  }
  const { getByText, queryByText } = render(
    <Form>
      {({ submit }) => (
        <>
          <Field<string>
            name={"email"}
            initialValue=""
            onSubmitValidate={isEmailUnique}
          >
            {({ value, setValue, isValidating }) => (
              <div>
                <input
                  placeholder="Email"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                {isValidating && <p>Validating</p>}
              </div>
            )}
          </Field>
          <button onClick={submit}>submit</button>
        </>
      )}
    </Form>
  );

  expect(queryByText("Validating")).not.toBeInTheDocument();

  await user.click(getByText("submit"));

  expect(getByText("Validating")).toBeInTheDocument();

  await waitForElementToBeRemoved(() => queryByText("Validating"));
});

test("Field should remove its value when unrendered", async () => {
  const Comp = () => {
    const [show, setShow] = useState(true);
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <div>
            <button onClick={() => setShow(false)}>Unmount</button>
            <button onClick={submit}>Submit</button>
            {show && (
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
            <Field<string> name={"password"} initialValue="">
              {({ value, setValue }) => (
                <input
                  placeholder="Password"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              )}
            </Field>
          </div>
        )}
      </Form>
    );
  };

  const { getByPlaceholderText, getByText, container } = render(<Comp />);

  await user.type(getByPlaceholderText("Email"), "emailHere");
  await user.type(getByPlaceholderText("Password"), "passwordHere");

  await user.click(getByText("Unmount"));
  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {"password":"passwordHere"}
        </p>
      </div>
    `)
  );
});

test("Field should not remove its value if preserveValue", async () => {
  const Comp = () => {
    const [show, setShow] = useState(true);
    const [values, setValues] = useState<string | null>(null);

    if (values) return <p>{values}</p>;

    return (
      <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
        {({ submit }) => (
          <div>
            <button onClick={() => setShow(false)}>Unmount</button>
            <button onClick={submit}>Submit</button>
            {show && (
              <Field<string> name={"email"} initialValue="" preserveValue>
                {({ value, setValue }) => (
                  <input
                    placeholder="Email"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                )}
              </Field>
            )}
            <Field<string> name={"password"} initialValue="">
              {({ value, setValue }) => (
                <input
                  placeholder="Password"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              )}
            </Field>
          </div>
        )}
      </Form>
    );
  };

  const { getByPlaceholderText, getByText, container } = render(<Comp />);

  await user.type(getByPlaceholderText("Email"), "emailHere");
  await user.type(getByPlaceholderText("Password"), "passwordHere");

  await user.click(getByText("Unmount"));
  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {"email":"emailHere","password":"passwordHere"}
        </p>
      </div>
    `)
  );
});

test("Field should persist values when remounts if preserveValue", async () => {
  const Comp = () => {
    const [show, setShow] = useState(true);

    return (
      <Form>
        {() => (
          <div>
            <button onClick={() => setShow(!show)}>Toggle mount</button>
            {show && (
              <Field<string> name={"email"} initialValue="" preserveValue>
                {({ value, setValue }) => (
                  <>
                    <input
                      placeholder="Email"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <p>{value}</p>
                  </>
                )}
              </Field>
            )}
          </div>
        )}
      </Form>
    );
  };

  const { getByPlaceholderText, getByText, queryByText } = render(<Comp />);

  expect(queryByText("emailHere")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "emailHere");

  await user.click(getByText("Toggle mount"));
  await user.click(getByText("Toggle mount"));

  expect(getByText("emailHere")).toBeInTheDocument();
});

test("Field should not have duplication when remounts if preserveValue", async () => {
  const Comp = () => {
    const [show, setShow] = useState(true);

    return (
      <Form>
        {({ formFieldsRef }) => (
          <div>
            <button onClick={() => setShow(!show)}>Toggle mount</button>
            {show && (
              <Field<string> name={"email"} initialValue="" preserveValue>
                {({ value, setValue }) => (
                  <>
                    <input
                      placeholder="Email"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <p>{value}</p>
                  </>
                )}
              </Field>
            )}
            <p>Total fields: {formFieldsRef.current.length}</p>
          </div>
        )}
      </Form>
    );
  };

  const { getByText, queryByText, rerender } = render(<Comp />);

  expect(queryByText("emailHere")).not.toBeInTheDocument();

  await user.click(getByText("Toggle mount"));
  await user.click(getByText("Toggle mount"));

  rerender(<Comp />);
  expect(getByText("Total fields: 1")).toBeInTheDocument();
});

test("Field should not be dirty if form is reset", async () => {
  const { getByPlaceholderText, queryByText, getByText, findByText } = render(
    <Form onSubmit={(values) => {}}>
      {({ reset }) => (
        <div>
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
          <button onClick={() => reset()}>Reset</button>
        </div>
      )}
    </Form>
  );

  expect(queryByText("Dirty")).not.toBeInTheDocument();

  await user.type(getByPlaceholderText("Email"), "test");

  expect(getByText("Dirty")).toBeInTheDocument();

  await user.click(getByText("Reset"));

  expect(queryByText("Dirty")).not.toBeInTheDocument();
});

test("Field should have the `isSubmitted` value", async () => {
  const submitMock = vi.fn();

  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={submitMock}>
      {({ submit }) => (
        <div>
          <Field<string>
            name="email"
            initialValue=""
            onChangeValidate={z.string().email("You must input a valid email")}
          >
            {({ value, setValue, isSubmitted }) => (
              <div>
                <input
                  placeholder="Email"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                {isSubmitted && <p>isSubmitted</p>}
              </div>
            )}
          </Field>
          <button onClick={() => submit()}>Submit</button>
        </div>
      )}
    </Form>
  );

  const email = getByPlaceholderText("Email");

  expect(queryByText("isSubmitted")).not.toBeInTheDocument();

  await user.click(getByText("Submit"));

  expect(getByText("isSubmitted")).toBeInTheDocument();

  expect(submitMock).not.toHaveBeenCalled();

  await user.type(email, "test@example.com");

  await user.click(getByText("Submit"));

  expect(getByText("isSubmitted")).toBeInTheDocument();
  expect(submitMock).toHaveBeenCalled();
});

test("Field should recompute form context when unmounted", async () => {
  const Comp = () => {
    const [formProps, setFormProps] = useState<string | null>(null);

    if (formProps) return <p>{formProps}</p>;

    return (
      <Form>
        {({ isValid, submit, value, ...form }) => (
          <div>
            <button
              onClick={() => {
                setFormProps(
                  JSON.stringify(
                    {
                      isDirty: form.isDirty,
                      isTouched: form.isTouched,
                      isValid,
                      isValidating: form.isValidating,
                      value,
                    },
                    null,
                    2
                  )
                );
                submit();
              }}
            >
              Submit
            </button>
            <Field<boolean> name="isVisible">
              {({ value, setValue, onBlur }) => {
                return (
                  <input
                    type="checkbox"
                    value={value ? "on" : undefined}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.checked)}
                  />
                );
              }}
            </Field>
            {value.isVisible && (
              <Field<string>
                name="conditional"
                initialValue=""
                onChangeValidate={z
                  .string()
                  .min(8, "Must be at least 8 characters long")}
              >
                {({ value, setValue, onBlur }) => (
                  <input
                    placeholder="Conditional"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                  />
                )}
              </Field>
            )}
          </div>
        )}
      </Form>
    );
  };

  const { getByPlaceholderText, getByRole, getByText, container } = render(
    <Comp />
  );

  await user.click(getByRole("checkbox"));
  await user.type(getByPlaceholderText("Conditional"), "toofew");
  await user.click(getByRole("checkbox"));
  await user.click(getByText("Submit"));

  await waitFor(() =>
    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {
        "isDirty": true,
        "isTouched": true,
        "isValid": true,
        "isValidating": false,
        "value": {
          "isVisible": false
        }
      }
        </p>
      </div>
    `)
  );
});

test("Field should show hints with async onChange hint function", async () => {
  const { getByPlaceholderText, queryByText, getByText } = render(
    <Form onSubmit={(_) => {}}>
      {() => (
        <Field<string>
          name={"email"}
          initialValue=""
          onChangeHint={() => Promise.reject("This should show up")}
        >
          {({ value, setValue, hints }) => (
            <div>
              <input
                placeholder="Email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {hints.map((hint) => (
                <p key={hint}>{hint}</p>
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

test("Field hints should not prevent an error", async () => {
  const fn = vi.fn();
  const { findByText, getByText } = render(
    <Form onSubmit={fn}>
      {({ submit }) => (
        <Field<string>
          name={"email"}
          initialValue=""
          onMountHint={() => Promise.reject("This should show up")}
        >
          {({ value, setValue, hints }) => (
            <div>
              <input
                placeholder="Email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {hints.map((hint) => (
                <p key={hint}>{hint}</p>
              ))}
              <button onClick={submit}>Submit</button>
            </div>
          )}
        </Field>
      )}
    </Form>
  );

  expect(await findByText("This should show up")).toBeInTheDocument();
  await user.click(getByText("Submit"));
  await waitFor(() => expect(fn).toHaveBeenCalled());
});
