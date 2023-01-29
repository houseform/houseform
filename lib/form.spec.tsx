import {expect, test} from "vitest";
import {useState} from "react";
import {Form} from "./form";
import {Field} from "./fields";
import {render, waitFor} from "@testing-library/react";
import {z} from "zod";

test("Form should render children", () => {
    const {getByText} = render(<Form onSubmit={(_) => {
    }}>
        {() =>
            <div>Test</div>
        }
    </Form>)

    expect(getByText("Test")).toBeInTheDocument();
})

test("Form should submit with values in tact", async () => {
    const SubmitValues = () => {
        const [values, setValues] = useState<string | null>(null);

        if (values) return <p>{values}</p>

        return (
            <Form onSubmit={(values) => setValues(JSON.stringify(values))}>
                {({submit}) => (
                    <>
                        <Field<string> name={"email"} initialValue="test@example.com">
                            {() => <></>}
                        </Field>
                        <button onClick={submit}>Submit</button>
                    </>
                )}
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
                {({submit}) => (<>
                    <Field<string> name={"email"} initialValue="" onChangeValidate={z.string().min(1)}>
                        {() => <></>}
                    </Field>
                    <button onClick={submit}>Submit</button>
                </>)}
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
                {({submit}) => (<>
                    <Field<string> name={"email"} initialValue="" onSubmitValidate={z.string().min(1)}>
                        {() => <></>}
                    </Field>
                    <button onClick={submit}>Submit</button>
                </>)}
            </Form>
        )
    }

    const {getByText} = render(<SubmitValues/>);

    await user.click(getByText("Submit"));

    expect(getByText("Submit")).toBeInTheDocument();
});


test("Form should show isValid proper", async () => {
    const {getByText, getByPlaceholderText} = render(<Form onSubmit={() => {
    }}>
        {({isValid}) => (<>
            <Field<string> name={"email"} onChangeValidate={() => Promise.reject("Not valid")}
                           initialValue="test@example.com">
                {({value, setValue, errors}) => (
                    <div>
                        <input placeholder="Email" value={value} onChange={e => setValue(e.target.value)}/>
                        {errors.map(error => <p key={error}>{error}</p>)}
                    </div>
                )}
            </Field>
            <p>{isValid ? "Is valid" : "Is not valid"}</p>
        </>)}
    </Form>);

    expect(getByText("Is valid")).toBeInTheDocument();

    await user.type(getByPlaceholderText("Email"), "test");

    expect(getByText("Is not valid")).toBeInTheDocument();
});

test("Form should show isSubmitted proper", async () => {
    const {getByText, findByText} = render(<Form onSubmit={() => {
    }}>
        {({isSubmitted, submit}) => (<>
            <button onClick={submit}>Submit</button>
            <p>{isSubmitted ? "Submitted" : "Not submitted"}</p>
        </>)}
    </Form>);

    expect(getByText("Not submitted")).toBeInTheDocument();

    await user.click(getByText("Submit"));

    expect(await findByText("Submitted")).toBeInTheDocument();
});

