---
head:
  - - meta
    - property: og:title
      content: HouseForm TypeScript Usage
  - - meta
    - property: og:description
      content: Learn how to use HouseForm with TypeScript.
---

# TypeScript Usage

HouseForm is built with TypeScript and takes type safety very seriously. However, because of our API design ([which has massive benefits with colocated code](/index)), we're often not able to infer the type of various items. Because of this, it's expected that you pass many of the types you need into the related components.

To work around this, when using a `<Field>` component, you should pass the type of the `Field` into the component like so:
```tsx
<Field<string>
  name="password"
  onChangeValidate={z
    .string()
    .min(8, "Must be at least 8 characters long")}
>
  {({ value, setValue, onBlur, errors }) => {
    // ...
  }}
</Field>
```

This will type the `value`, `setValue`, and other properties correctly.

## Usage with Arrays

The same typing properties apply to [`FieldArray` and `FieldArrayItems`](/guides/arrays) as well. However, because a `FieldArray` is able to store multiple items inside of it, you should pass the object you expect the array to have:

```tsx
<FieldArray<{ name: string; email: string }> name={"users"}>
  {({ value }) => (
    <>
      {value.map((user, index) => (
        <>
          <FieldArrayItem<string> name={`users[${index}].name`}>
            {({ value, error, onChange }) => (
              // ...
              <></>
            )}
          </FieldArrayItem>
          <FieldArrayItem<string> name={`users[${index}].email`}>
            {({ value, error, onChange }) => (
              // ...
              <></>
            )}
          </FieldArrayItem>
        </>
      ))}
    </>
  )}
</FieldArray> 
```

## Ref TypeScript Support

When [using a `ref` to track form and field internal data outside of a render function](/guides/access-data-externally), you can use TypeScript generics to set the value to remain type strict.

```tsx
import { useRef } from "react";
import {
  Field,
  FieldArray,
  FieldArrayInstance,
  FieldInstance,
  Form,
  FormInstance,
} from "houseform";

export default function App() {
  const fieldRef = useRef<FieldInstance<string>>(null);
  const formRef = useRef<FormInstance>(null);
  const fieldArrayRef = useRef<FieldArrayInstance>(null);

  return (
    <>
      <Form ref={formRef}>
        {() => (
          <>
            <Field<string> name="email" ref={fieldRef}>
              {() => <></>}
            </Field>
            <FieldArray name={"people"} ref={fieldArrayRef}>
              {() => <></>}
            </FieldArray>
          </>
        )}
      </Form>
    </>
  );
}
```

