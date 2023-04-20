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
import { Field } from "houseform";

const App = () => (
  <Field<string>
    name="password"
    onChangeValidate={z.string().min(8, "Must be at least 8 characters long")}
  >
    {({ value, setValue, onBlur, errors }) => {
      // ...
    }}
  </Field>
);
```

This will type the `value`, `setValue`, and other properties correctly.

## Usage with Arrays

The same typing properties apply to [`FieldArray` and `FieldArrayItems`](/guides/arrays) as well. However, because a `FieldArray` is able to store multiple items inside of it, you should pass the object you expect the array to have:

```tsx
import { FieldArray, FieldArrayItem } from "houseform";

export const App = () => (
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
);
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

## Form Typings

While field-level typings are nice, it's also encouraged to type the `Form` component so that your `values` property on `onSubmit` are strictly typed as well:

```tsx
import { Form } from "houseform";

interface FormType {
  username: string;
  score: number;
  emailSignup: boolean;
}

// ...

const App = () => (
  <Form<FormType>
    onSubmit={(values) => {
      // `values` is type `FormType`
    }}
  >
    {/*...*/}
  </Form>
);
```

You can then pass the fields' typings to the `Field` components:

```tsx
import { Field } from "houseform";

const App = () => (
  <Field<FormType["username"]> name="username">
    {({ value, setValue, onBlur, errors }) => {
      // ...
    }}
  </Field>
);
```

### Error Typing

Not only does typing a `Form` ensure that your `values` are typed, but it also ensures other `Form`-specific fields are typed as well.

One such example is [the `errorsMap` property on `Form`](/guides/displaying-errors), which will throw errors on nested field access if `Form` is left untyped:

```tsx
import { Form, Field } from "houseform";

const App = () => (
  <Form onSubmit={() => {}}>
    {({ submit, errorsMap }) => (
      <div>
        <Field name="name.first"></Field>
        <button onClick={submit}>Submit</button>
        <div>
          <p>Name specific errors</p>
          {/* `errorsMap` is Record<string, string[]> by default, */}
          {/*   so this will throw a compiler error */}
          {errorsMap["name"]?.["first"]?.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      </div>
    )}
  </Form>
);
```

To solve this, we need to pass a value to `Form` so that our TypeScript typings can map over each key and replace them with `string[]`:

```tsx
import { Form, Field } from "houseform";

interface FormType {
  name: {
    first: string;
  };
}

// ...

const App = () => (
  <Form<FormType> onSubmit={() => {}}>
    {({ submit, errorsMap }) => (
      <div>
        <Field name="name.first"></Field>
        <button onClick={submit}>Submit</button>
        <div>
          <p>Name specific errors</p>
          {/* `errorsMap` is Record<string, string[]> by default, */}
          {/*   so this will throw a compiler error */}
          {errorsMap["name"]?.["first"]?.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      </div>
    )}
  </Form>
);
```

> This may seem like a frustrating limitation, but without explicit typings, `errorsMap` would have to be typed as `Record<string, NestedRecord | string[]>`.
>
> This typing in particular is frustrating since you have to type case `errorsMap`'s individual properties every time you want to use them. This was our best attempt at balancing both generic and specific needs.
