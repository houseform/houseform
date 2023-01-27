// @vitest-environment jsdom
import {afterEach, expect, test} from "vitest";
import {render, cleanup} from "@testing-library/react";
import {Field, Form, SubmitField} from "./index";

import matchers from "@testing-library/jest-dom/matchers";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import {useState} from "react";

expect.extend(matchers);

const user = userEvent.setup()

afterEach(() => {
    cleanup();
})

test("Form should render children", () => {
    const {getByText} = render(<Form onSubmit={(_) => {
    }}>
        <div>Test</div>
    </Form>)

    expect(getByText("Test")).toBeInTheDocument();
})

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
    const {getByText} = render(<Form onSubmit={(_) => {}}>
        <Field<string> name={"email"} initialValue="test@example.com">
            {({value}) => (
                <p>{value}</p>
            )}
        </Field>
    </Form>);

    expect(getByText("test@example.com")).toBeInTheDocument();
});


test("Field should allow changing value", async () => {
    const {getByPlaceholderText} = render(<Form onSubmit={(_) => {}}>
        <Field<string> name={"email"} initialValue="">
            {({value, onChange}) => (
                <input placeholder="Email" value={value} onChange={e => onChange(e.target.value)}/>
            )}
        </Field>
    </Form>);

    const emailInput = getByPlaceholderText("Email");

    expect(emailInput).toHaveValue("");

    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
});

test("Field should show errors with async onChange validator function", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(_) => {}}>
        <Field<string> name={"email"} initialValue="" onChangeValidate={() => Promise.reject("This should show up")}>
            {({value, onChange, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => onChange(e.target.value)}/>
                    {errors.map(error => <p key={error}>{error}</p>)}
                </div>
            )}
        </Field>
    </Form>);

    expect(queryByText("This should show up")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(getByText("This should show up")).toBeInTheDocument();
});

test("Field should show errors with async onChange validator function", async () => {
    const {getByPlaceholderText, queryByText, getByText} = render(<Form onSubmit={(_) => {}}>
        <Field<string> name={"email"} initialValue="" onChangeValidate={z.string().email("You must input a valid email")}>
            {({value, onChange, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => onChange(e.target.value)}/>
                    {errors.map(error => <p key={error}>{error}</p>)}
                </div>
            )}
        </Field>
    </Form>);

    expect(queryByText("You must input a valid email")).not.toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(getByText("You must input a valid email")).toBeInTheDocument();
});

test("Form should submit with values in tact", async () => {
    const SubmitValues = () => {
        const [values, setValues] = useState<string | null>(null);

        if (values) return <p>{values}</p>

        return (
            <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
                <Field<string> name={"email"} initialValue="test@example.com">
                    {() => <></>}
                </Field>
                <SubmitField>
                    {({onSubmit}) => <button onClick={onSubmit}>Submit</button>}
                </SubmitField>
            </Form>
        )
    }

    const {getByText, container} = render(<SubmitValues/>);

    await user.click(getByText("Submit"));

    expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {"email":"test@example.com"}
        </p>
      </div>
    `);
});

test("SubmitField should show isValid proper", async () => {
    const {getByText, getByPlaceholderText} = render(<Form onSubmit={() => {}}>
        <Field<string> name={"email"} onChangeValidate={() => Promise.reject("Not valid")} initialValue="test@example.com">
            {({value, onChange, errors}) => (
                <div>
                    <input placeholder="Email" value={value} onChange={e => onChange(e.target.value)}/>
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

test.todo("onSubmitValidate should work")