import {expect, test} from "vitest";
import {useState} from "react";
import {Form} from "./form";
import {Field, SubmitField} from "./fields";
import {render, waitFor} from "@testing-library/react";
import { z } from "zod";

test("Form should render children", () => {
    const {getByText} = render(<Form onSubmit={(_) => {
    }}>
        <div>Test</div>
    </Form>)

    expect(getByText("Test")).toBeInTheDocument();
})

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

    await waitFor(() => expect(container).toMatchInlineSnapshot(`
      <div>
        <p>
          {"email":"test@example.com"}
        </p>
      </div>
    `));
});

test("Form should not submit if there are errors with onChangeValidate", async () => {
    const SubmitValues = () => {
        const [values, setValues] = useState<string | null>(null);

        if (values) return <p>{values}</p>

        return (
            <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
                <Field<string> name={"email"} initialValue="" onChangeValidate={z.string().min(1)}>
                    {() => <></>}
                </Field>
                <SubmitField>
                    {({onSubmit}) => <button onClick={onSubmit}>Submit</button>}
                </SubmitField>
            </Form>
        )
    }

    const {getByText} = render(<SubmitValues/>);

    await user.click(getByText("Submit"));

    expect(getByText("Submit")).toBeInTheDocument();
});

test("Form should not submit if there are errors with onSubmitValidate", async () => {
    const SubmitValues = () => {
        const [values, setValues] = useState<string | null>(null);

        if (values) return <p>{values}</p>

        return (
            <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
                <Field<string> name={"email"} initialValue="" onSubmitValidate={z.string().min(1)}>
                    {() => <></>}
                </Field>
                <SubmitField>
                    {({onSubmit}) => <button onClick={onSubmit}>Submit</button>}
                </SubmitField>
            </Form>
        )
    }

    const {getByText} = render(<SubmitValues/>);

    await user.click(getByText("Submit"));

    expect(getByText("Submit")).toBeInTheDocument();
});
