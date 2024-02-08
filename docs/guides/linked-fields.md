# Link Two Form Fields Together

There are times where you'll want to link two fields together; when one is validated another is as well. A prime example of this is when establishing `password` and `confirmpassword` fields, where you want to update the form's errors when `password` is edited.

The first step to do this is to figure out how to cross-reference one field's value in another field's validation.

This can be done using the second argument of any `Validate` function and utilizing the`getFieldValue` function:

```tsx
import { Field } from "houseform";

const App = () => (
  <Field
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
    {/* ... */}
  </Field>
);
```

While this works, it introduces some edgecase bugs. Imagine the following userflow:

- User updates confirm password field.
- User updates the non-confirm password field.

In this example, the form will still have errors present, as the confirm password field validation has not been re-ran to mark as accepted.

To solve this, we need to make sure that the confirm password validation is re-ran when the password field is updated. To do this, you just need to add a `listenTo` field to one of the two form fields.

```tsx
import { Field } from "houseform";

const App = () => (
  <>
    <Field
      name="password"
      onChangeValidate={z.string().min(8, "Must be at least 8 characters long")}
    >
      {({ value, setValue, onBlur, errors }) => {
        return (
          <div>
            <input
              value={value}
              onBlur={onBlur}
              onChange={(e) => setValue(e.target.value)}
              placeholder={"Password"}
              type="password"
            />
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        );
      }}
    </Field>
    <Field
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
      {({ value, setValue, onBlur, errors, isTouched }) => {
        return (
          <div>
            <input
              value={value}
              onBlur={onBlur}
              onChange={(e) => setValue(e.target.value)}
              placeholder={"Password Confirmation"}
              type="password"
            />
            {isTouched && errors.map((error) => <p key={error}>{error}</p>)}
          </div>
        );
      }}
    </Field>
  </>
);
```

This `listenTo` field expects the name of another field to be passed to it as an array. When the listened to field has events ran on it (say, `onBlur`), it will run the respective validation for the field doing the listening as well.

## Conditional Fields

Similarly, you may have instances where you want to show or hide a field based on the value of another field. This can be done using a form's `value` property:

```tsx
import { Form, Field } from "houseform";

function App() {
  return (
    <Form
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
            {!isGmail && (
              <Field
                name="password"
                onChangeValidate={z
                  .string()
                  .min(8, "Must be at least 8 characters long")}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <div>
                      <input
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={"Password"}
                        type="password"
                      />
                      {errors.map((error) => (
                        <p key={error}>{error}</p>
                      ))}
                    </div>
                  );
                }}
              </Field>
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
```
