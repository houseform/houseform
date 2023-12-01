# Nested Field Values

> This section is still being written.

<!-- `<Field name="test.other">` -->

Not all forms have a flat data structure. Some forms might expect you to have data [returned to the server](/guides/html-forms) with a specific format.

Regardless of the reason, you're able to use a `dot.syntax` or a `brackets["syntax"]` in your `Field`s in order to construct nested data:

```tsx
import { Form, Field } from "houseform";
const App = () => (
  <Form
    onSubmit={(values) => {
      alert(JSON.stringify(values));
    }}
  >
    {({ submit }) => (
      <>
        <Field name={"test.other"} initialValue="Test">
          {() => <div></div>}
        </Field>
        <button onClick={submit}>Submit</button>
      </>
    )}
  </Form>
);
```

This form will submit with the following object:

```json
{
  "test": {
    "other": "Test"
  }
}
```

## Interpolate Nested Field Names

You may also interpolate external values into your field names using the `brackets["syntax"]`, like so:

```tsx
import { Form, Field } from "houseform";

const App = () => {
  const someVal = "other";

  return (
    <Form
      onSubmit={(values) => {
        alert(JSON.stringify(values));
      }}
    >
      {({ submit }) => (
        <>
          <Field name={`test[${someVal}]`} initialValue="Test">
            {() => <div></div>}
          </Field>
          <button onClick={submit}>Submit</button>
        </>
      )}
    </Form>
  );
};
```

This will still submit with the value:

```json
{
  "test": {
    "other": "Test"
  }
}
```

> Keep in mind, if you change the name of the field programatically - it will wipe the value and treat it as a new field entirely. Think of it akin to React's `key` property in this regard.
>
> If you're wanting to use a number to index a field value for arrays, [please use the `FieldArray` helper instead](/guides/arrays).

## Access Nested Fields Programatically

If you're wanting to [utilize `listenTo` and `getFieldValue` to create a linked input](/guides/linked-fields) with a nested field, you're able to mix-and-match the `dot.syntax` with the `brackets['syntax'] ` to reference the field, like so:

```tsx
import { Field } from "houseform";

export const App = () => (
  <>
    <Field
      name={`auth["confirmpassword"]`}
      listenTo={["auth.password"]}
      onChangeValidate={(val, form) => {
        // Notice the `auth.password` field's name is using the bracket syntax
        if (val === form.getFieldValue("auth.password")?.value) {
          // OR: if (val === form.getFieldValue(`auth["password"]`)?.value) {
          return Promise.resolve(true);
        } else {
          return Promise.reject("Passwords must match");
        }
      }}
    >
      {/* ... */}
    </Field>
    <Field name={`auth["password"]`}>{/* ... */}</Field>
  </>
);
```
