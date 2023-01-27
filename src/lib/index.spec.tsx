// @vitest-environment jsdom
import {afterEach, expect, test} from "vitest";
import {render, cleanup} from "@testing-library/react";
import {Field, Form} from "./index";

import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

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