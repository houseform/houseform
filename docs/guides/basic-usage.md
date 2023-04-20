---
head:
  - - meta
    - property: og:title
      content: Basic HouseForm Usage
  - - meta
    - property: og:description
      content: Learn how to use HouseForm; a React form library that colocates your forms' validation logic and UI into one place.
---

# Basic Usage

Every form in HouseForm starts with a `<Form>` component:

```tsx
import { Form } from "houseform";

const App = () => (
  <Form onSubmit={() => {}}>
    {({ submit }) => <button onClick={submit}>Submit</button>}
  </Form>
);
```

Within `Form`, there's a required `onSubmit` prop. This property should be a function that you want ran when the `submit` function is ran.

The child of a `Form` should be a function that returns a JSX element. This can be anything - a `div`, `Fragment`, or anything in between.

## Basic `<Field>` usage

Once you have a `<Form>` established, you'll want to add a `<Field>` component.

```tsx
import { Form, Field } from "houseform";

const App = () => (
  <Form onSubmit={() => {}}>
    {({ submit }) => (
      <div>
        <Field name="username" initialValue={""}>
          {({ value, setValue, onBlur }) => (
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={onBlur}
            />
          )}
        </Field>
        <button onClick={submit}>Submit</button>
      </div>
    )}
  </Form>
);
```

This is the most basic a form field can get within HouseForm. This field has:

- `name` - A string that can be used to lookup the field and handle the result value during form submission.
- `intialValue`.
- A child function.

Much like the parent `<Form>` component, the function of `Field` will render the contained `input` element without adding any UI elements. It is your responsibility to pass the appropriate fields to a given `input`. In this case, we're passing the three required fields to make a text input work:

- `value` - The current value of the field.
- `setValue` - A function used to update the current field value.
- `onBlur` - A function used to track internal logic pertaining to user input.

## Getting a form's value on submission

Now that we have a field, we can update our `<Form>`'s `onSubmit` function to show an `alert` when the form is submitted:

```tsx {2}
import { Form, Field } from "houseform";

const App = () => (
  <Form onSubmit={(values) => alert(values)}>
    {({ submit }) => (
      <div>
        <Field name="username" initialValue={""}>
          {({ value, setValue, onBlur }) => (
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={onBlur}
            />
          )}
        </Field>
        <button onClick={submit}>Submit</button>
      </div>
    )}
  </Form>
);
```

This `values` object will represent the fields within the form. For example, when submitting this form, you'll see:

```json
{
  "username": "User input here"
}
```

If you had a second `<Field>` component rendered with `name="email"` you would see:

```json
{
  "username": "User input here",
  "email": "User input here"
}
```

## Adding field validation

Now that we have a field, a form, and can receive values from the form's submission - let's add some validation!

Validation in HouseForm is done on a per-field basis:

```tsx
import { Field } from "houseform";
import { z } from "zod";

// ...

const App = () => (
  <Field
    name="username"
    initialValue={""}
    onChangeValidate={z
      .string()
      .min(3, "Your username must have at least three characters")}
  >
    {({ value, setValue, onBlur, errors }) => (
      <>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
        {errors.map((error) => (
          <p key={error}>{error}</p>
        ))}
      </>
    )}
  </Field>
);
```

This field, for example, will validate the user's input whenever they type a value. If said input is less than three characters, [Zod](https://github.com/colinhacks/zod) will run its validation and present the error to the user via the `errors.map` logic.

## Alternative forms of validation

Validation as the user is typing is not always the most ideal form of validation, however. Luckily, HouseForm supports two other methods of validation:

1. On blur via `onBlurValidate`

```jsx
<Field name="username" initialValue={""} onBlurValidate={z.string().min(3, "Your username must have at least three characters")}>
    {({value, setValue, onBlur, errors}) => (
	    <input value={value} onChange={e => setValue(e.target.value)} onBlur={onBlur}/>
        {errors.map(error => <p key={error}>{error}</p>)}
    )}
</Field>
```

> This will only run validation when the user has blurred the field.

2. On submit via `onSubmitValidate`

```jsx
<Field name="username" initialValue={""} onSubmitValidate={z.string().min(3, "Your username must have at least three characters")}>
    {({value, setValue, onBlur, errors}) => (
	    <input value={value} onChange={e => setValue(e.target.value)} onBlur={onBlur}/>
        {errors.map(error => <p key={error}>{error}</p>)}
    )}
</Field>
```

> This will only run validation when the user submits the form.

### Validate only once touched

While HouseForm does not provide an explicit method to validate only once touched, you may reproduce this behavior using the `isTouched` property passed to each field's child function:

```jsx
<Field name="username" initialValue={""} onChangeValidate={z.string().min(3, "Your username must have at least three characters")}>
    {({value, setValue, onBlur, errors, isTouched}) => (
	    <input value={value} onChange={e => setValue(e.target.value)} onBlur={onBlur}/>
        {isTouched && errors.map(error => <p key={error}>{error}</p>)}
    )}
</Field>
```

### Async function validation

While it's recommended to use Zod to do input validation in HouseForm, sometimes applications have more custom requirements. This is why we provide a method of using an asynchronous function to validate a field. To do this, pass a function to any of the `onXYZValidate` `<Field>` properties:

```jsx
<Field name="email" initialValue={""} onChangeValidate={async value => {return await isEmailUnique(value)}}>
    {({value, setValue, onBlur, errors, isTouched}) => (
	    <input value={value} onChange={e => setValue(e.target.value)} onBlur={onBlur}/>
        {isTouched && errors.map(error => <p key={error}>{error}</p>)}
    )}
</Field>
```

Here, we expect the async function to do one of two things:

1. Resolve `true`
2. Reject with a string explaining why it was rejected

```typescript
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

If resolved, it will validate; Otherwise it will pass the rejection explanation to the `errors` property of the `<Field>`.
