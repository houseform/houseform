# Form Arrays

Because HouseForm supports [nested field values](/guides/nested-field-values), you might want to try to build an array out like this:

```tsx
import { Field, Form } from "houseform";

export const Example = () => (
  <Form
    onSubmit={(values) => {
      alert("Form was submitted with: " + JSON.stringify(values));
    }}
  >
    {() => (
      <Field<Array<{ name: string }>>
        name="people"
        initialValue={[{ name: "Corbin" }]}
      >
        {({ value, setValue }) => (
          <>
            {value.map((person, i) => (
              <Field<string> name={`people[${i}].name`} key={`person-${i}`}>
                {({ value, setValue }) => (
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                )}
              </Field>
            ))}
          </>
        )}
      </Field>
    )}
  </Form>
);
```

This works and tracks an array on submission, but has a few problems:

- No easy utility to add, move, insert, or do other helper functions on arrays
- [A `ref` on the `Field<Array>`](/guides/access-data-externally) does not track the current value of the array
- Memory usage is bloated due to duplicated values between array values
- Changing the array values do not persist the field values

For these reasons, we introduce a specific APIs for arrays of fields: `FieldArray` and `FieldArrayItem`.

```tsx
import { FieldArray, FieldArrayItem, Form } from "houseform";

export const Example = () => (
  <Form
    onSubmit={(values) => {
      alert("Form was submitted with: " + JSON.stringify(values));
    }}
  >
    {() => (
      <>
        <FieldArray<{ name: string }>
          ref={test}
          name="people"
          initialValue={[{ name: "Corbin" }]}
        >
          {({ value, add }) => (
            <>
              {value.map((person, i) => (
                <FieldArrayItem<string>
                  name={`people[${i}].name`}
                  key={`person-${i}`}
                >
                  {({ value, setValue }) => {
                    return (
                      <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    );
                  }}
                </FieldArrayItem>
              ))}
              <button onClick={() => add({ name: "Other" })}>Add</button>
            </>
          )}
        </FieldArray>
        <button onClick={test1}>Submit</button>
      </>
    )}
  </Form>
);
```

Here, we replace the top-level array tracking `Field` with `FieldArray` and the sub-fields with `Field`.

> Please note that, unlike `field`, `FieldArrayItem` does not store its own `value`. Instead, it uses a context provided by `FieldArray` to track the value inside of `FieldArray`.
>
> As a result, you may want to wrap the components inside of the `FieldArrayItem` within [a `React.memo` to avoid re-renders](https://beta.reactjs.org/reference/react/memo).
