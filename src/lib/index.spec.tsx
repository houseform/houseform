// @vitest-environment jsdom
import {afterEach, expect, test} from "vitest";
import {render, cleanup} from "@testing-library/react";
import {Field, Form} from "./index";

import matchers from "@testing-library/jest-dom/matchers";
import userEvent from "@testing-library/user-event";
import { z } from "zod";

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