---
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: HouseForm
  - - meta
    - property: og:url
      content: https://houseform.dev
  - - meta
    - property: og:description
      content: Simple to use React forms, where your validation and UI code live in harmony.
---

# Introduction

HouseForm is a field-first, [Zod](https://github.com/colinhacks/zod)-powered, headless, runtime agnostic form validation library for React.

> Whoa. What does that mean?

Good question, let's break that down:

- **Field first**: Other React form libraries focus on the form itself - forcing you to use a schema object to define all of your fields. This introduces two problems:

  1. Your field validation logic and your field UI rendering are separated. You have to look in more than one place to see the whole picture of your field logic - the field itself and the validation schema defined at the form level.
  2. Defining per-field validation (say, one field validates by submit logic while the other validates `onBlur`, while another validates `onChange`) is challenging or downright impossible.

  By focusing on fields, the items that make up the form, it alleviates many of these concerns.

- **Zod-powered**: This library leans heavily on the work done by [Zod](https://github.com/colinhacks/zod) to do field validation. Zod is super powerful and includes the ability to parse most common operations needed on most data types.

  - Have custom needs? We still support custom `async` functions for when you need something truly unique.

- **Headless**: HouseForm includes absolutely no UI components to it. While it uses components to introduce new behavior to your forms, it does not render any UI elements of any kind. Instead, it's a "BYOM" (that's "Bring Your Own Markup") library, expecting you to pass the expected markup for your UI.
- **Runtime agnostic**: Because HouseForm is headless, you can run HouseForm the same way you would in React for the browser as you would React for SSR, the same as you would React Native without a DOM implementation.

## Video Introduction

[James Perkins](https://www.youtube.com/@james-perkins) recently made an incredible video intro to HouseForm over on his YouTube channel:

<div align="center">
<iframe width="560" style="aspect-ratio: 16/9; max-width: 100%;" src="https://www.youtube-nocookie.com/embed/bQVUGx8rSuQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Installation

::: code-group

```shell [npm]
npm install houseform zod
```

```shell [yarn]
yarn add houseform zod
```

```shell [pnpm]
pnpm add houseform zod
```

:::

> Zod is a peer dependency of this project.

## Example Usage

Let's take a look at what a real-world login form might look like using HouseForm:

```tsx
import { Field, Form } from "houseform";
import { z } from "zod";

export default function App() {
  return (
    <Form
      onSubmit={(values) => {
        alert("Form was submitted with: " + JSON.stringify(values));
      }}
    >
      {({ isValid, submit }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Field
            name="email"
            onBlurValidate={z.string().email("This must be an email")}
            onSubmitValidate={isEmailUnique}
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
          <Field<string>
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
          <Field<string>
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
                  {isTouched &&
                    errors.map((error) => <p key={error}>{error}</p>)}
                </div>
              );
            }}
          </Field>
          <button disabled={!isValid} type="submit">
            Submit
          </button>
        </form>
      )}
    </Form>
  );
}

// This is simulating a check against a database
function isEmailUnique(val: string) {
  return new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      const isUnique = !val.startsWith("crutchcorn");
      if (isUnique) {
        resolve(true);
      } else {
        reject("That email is already taken");
      }
    }, 20);
  });
}
```

> While this example is long, it's a real-world example of what your web login form might look like!

## Interactive Example

<ClickToIFrame title="HouseForm StackBlitz Example" src="https://stackblitz.com/edit/houseform-v1-example?embed=1&file=App.tsx"/>
