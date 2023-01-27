import {expect, test} from "vitest";
import {render} from "@testing-library/react";
import {Field, Form, SubmitField} from "./index";

import {z} from "zod";

test("Field should render children", () => {
    const {getByText} = render(<Form onSubmit={(_) => {
    }}>
        <Field name={"test"}>
            {() => (
                <div>Test</div>
            )}
        </Field>
    </Form>)

    expect(getByText("Test")).toBeInTheDocument();
})

test("Field should render with initial values", async () => {
    const {getByText} = render(<Form onSubmit={(_) => {
    }}>
        <Field<string> name={"email"} initialValue="test@example.com">
            {({value}) => (
                <p>{value}</p>
            )}
        </Field>
    </Form>);

    expect(getByText("test@example.com")).toBeInTheDocument();
});

test("Field should allow changing value", async () => {
    const {getByPlaceholderText} = render(<Form onSubmit={(_) => {
    }}>
        <Field<string> name={"email"} initialValue="">
            {({value, setValue}) => (
                <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
            )}
        </Field>
    </Form>);

    const emailInput = getByPlaceholderText("Email");

    expect(emailInput).toHaveValue("");

    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
});

test("Field should show errors with async onChange validator function", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(_) => {
    }}>
        <Field<string> name={"email"} initialValue="" onChangeValidate={() => Promise.reject("This should show up")}>
            {({value, setValue, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
                    {errors.map(error => <p key={error}>{error}</p>)}
                </div>
            )}
        </Field>
    </Form>);

    expect(queryByText("This should show up")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(getByText("This should show up")).toBeInTheDocument();
});

test("Field should not show errors with valid input on an async onChange validator function", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(_) => {
    }}>
        <Field<string> name={"email"} initialValue="" onChangeValidate={() => Promise.resolve(true)}>
            {({value, setValue, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
                    {errors.map(error => <p key={error}>This is an error</p>)}
                </div>
            )}
        </Field>
    </Form>);

    expect(queryByText("This is an error")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(queryByText("This is an error")).not.toBeInTheDocument();
});

test("Field should show errors with async onChange validator zod usage", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(_) => {
    }}>
        <Field<string> name={"email"} initialValue=""
                       onChangeValidate={z.string().email("You must input a valid email")}>
            {({value, setValue, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
                    {errors.map(error => <p key={error}>{error}</p>)}
                </div>
            )}
        </Field>
    </Form>);

    expect(queryByText("You must input a valid email")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(getByText("You must input a valid email")).toBeInTheDocument();
});

test("Field should not show errors with async onChange validator zod usage", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(_) => {
    }}>
        <Field<string> name={"email"} initialValue=""
                       onChangeValidate={z.string().email("You must input a valid email")}>
            {({value, setValue, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
                    {errors.map(error => <p key={error}>{error}</p>)}
                </div>
            )}
        </Field>
    </Form>);

    expect(queryByText("You must input a valid email")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test@gmail.com");

    expect(queryByText("You must input a valid email")).not.toBeInTheDocument();
});

test("SubmitField should show isValid proper", async () => {
    const {getByText, getByPlaceholderText} = render(<Form onSubmit={() => {
    }}>
        <Field<string> name={"email"} onChangeValidate={() => Promise.reject("Not valid")}
                       initialValue="test@example.com">
            {({value, setValue, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
                    {errors.map(error => <p key={error}>{error}</p>)}
                </div>
            )}
        </Field>
        <SubmitField>
            {({isValid}) => <p>{isValid ? "Is valid" : "Is not valid"}</p>}
        </SubmitField>
    </Form>);

    expect(getByText("Is valid")).toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(getByText("Is not valid")).toBeInTheDocument();
});

test("onSubmitValidate should work", async () => {
    const {getByText, getByPlaceholderText, queryByText} = render(<Form onSubmit={() => {
    }}>
        <Field<string> name={"email"} onSubmitValidate={() => Promise.reject("Not valid")}>
            {({value, setValue, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
                    {errors.map(error => <p key={error}>{error}</p>)}
                </div>
            )}
        </Field>
        <SubmitField>
            {({onSubmit}) => <button onClick={onSubmit}>Submit</button>}
        </SubmitField>
    </Form>);

    expect(queryByText("Not valid")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(queryByText("Not valid")).not.toBeInTheDocument();

    await user.click(getByText("Submit"));

    expect(getByText("Not valid")).toBeInTheDocument();
})

test("Field onChange can clear an error when resolved", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(_) => {
    }}>
        <Field<string> name={"email"} initialValue=""
                       onChangeValidate={(val) => val.startsWith("true") ? Promise.resolve(true) : Promise.reject("This is an error")}>
            {({value, setValue, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
                    {errors.map(error => <p key={error}>{error}</p>)}
                </div>
            )}
        </Field>
    </Form>);

    expect(queryByText("This is an error")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(getByText("This is an error")).toBeInTheDocument();

    await user.clear(getByPlaceholderText("Email"));

    await user.type(getByPlaceholderText("Email"), "true");

    expect(queryByText("This is an error")).not.toBeInTheDocument();
});

test("Field can receive data from other fields", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(values) => {
        }}>
            <Field<string> name="password" initialValue={"testing123"}>
                {({value, setValue}) => (
                    <input value={value} onChange={e => setValue(e.target.value)} placeholder={"Password"}/>
                )}
            </Field>
            <Field<string> name="confirmpassword"
                           onChangeValidate={(val, form) => {
                               if (val === form.getFieldValue("password")!.value) {
                                   return Promise.resolve(true);
                               } else {
                                   return Promise.reject("Passwords must match");
                               }
                           }}
            >
                {({value, setValue, errors}) => {
                    return <div>
                        <input value={value} onChange={e => setValue(e.target.value)}
                               placeholder={"Password Confirmation"}/>
                        {errors.map(error => <p key={error}>{error}</p>)}
                    </div>
                }}
            </Field>
            <SubmitField>
                {({onSubmit}) => <button onClick={onSubmit}>Submit</button>}
            </SubmitField>
        </Form>
    );

    expect(queryByText("Passwords must match")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Password Confirmation"), "test")
    expect(getByText("Passwords must match")).toBeInTheDocument();
    await user.clear(getByPlaceholderText("Password Confirmation"))
    await user.type(getByPlaceholderText("Password Confirmation"), "testing123")
    expect(queryByText("Passwords must match")).not.toBeInTheDocument();
});

test("Field can check for onChangeValidate errors on submit", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(values) => {
        }}>
            <Field<string> name="password" initialValue={"testing123"}>
                {({value, setValue}) => (
                    <input value={value} onChange={e => setValue(e.target.value)} placeholder={"Password"}/>
                )}
            </Field>
            <Field<string> name="confirmpassword"
                           onChangeValidate={(val, form) => {
                               if (val === form.getFieldValue("password")!.value) {
                                   return Promise.resolve(true);
                               } else {
                                   return Promise.reject("Passwords must match");
                               }
                           }}
            >
                {({value, setValue, errors}) => {
                    return <div>
                        <input value={value} onChange={e => setValue(e.target.value)}
                               placeholder={"Password Confirmation"}/>
                        {errors.map(error => <p key={error}>{error}</p>)}
                    </div>
                }}
            </Field>
            <SubmitField>
                {({onSubmit}) => <button onClick={onSubmit}>Submit</button>}
            </SubmitField>
        </Form>
    );

    expect(queryByText("Passwords must match")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Password Confirmation"), "test")
    expect(getByText("Passwords must match")).toBeInTheDocument();
    await user.clear(getByPlaceholderText("Password Confirmation"))
    await user.type(getByPlaceholderText("Password Confirmation"), "testing123")
    expect(queryByText("Passwords must match")).not.toBeInTheDocument();
    await user.type(getByPlaceholderText("Password"), "another")
    expect(queryByText("Passwords must match")).not.toBeInTheDocument();
    await user.click(getByText("Submit"))
    expect(getByText("Passwords must match")).toBeInTheDocument();
});

test.todo("Is touched should be set");

test.todo("Is dirty should be set");

test.todo("If a derived field is modified, then the original field is changed, it should revalidate the derived field");