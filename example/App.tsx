import React from "react";
import { Field, Form } from "houseform";
import { z } from "zod";

interface FormValue {
  email: string;
}

export default function App() {
  return (
    <Form<FormValue>
      onSubmit={(values) => {
        alert("Form was submitted with: " + JSON.stringify(values));
      }}
    >
      {({ isValid, submit, value: formValue }) => {
        // On first render, `value` is an empty object, since the `email` field is not yet initialized.
        const isGmail = formValue.email?.endsWith("@gmail.com");
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Field
              name="email"
              initialValue={"test@gmail.com"}
              onBlurValidate={z.string().email("This must be an email")}
            >
              {({ value, setValue, onBlur, errors }) => {
                return (
                  <div>
                    <input
                      value={value}
                      onBlur={onBlur}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={"Email"}
                    />
                    {errors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                );
              }}
            </Field>
            {isGmail && (
              <p style={{ color: "red" }}>
                We don&apos;t currently support gmail as an email host
              </p>
            )}
            <button disabled={!isValid || isGmail} type="submit">
              Submit
            </button>
          </form>
        );
      }}
    </Form>
  );
}
