import {expect, test} from "vitest";
import {useState} from "react";
import {Form} from "./form";
import {Field, SubmitField} from "./fields";
import {render, waitFor} from "@testing-library/react";

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

test.todo("Form should not submit if there are errors with onChangeValidate");

test.todo("Form should not submit if there are errors with onSubmitValidate");
