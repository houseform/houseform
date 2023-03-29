# Custom Validators

What's more, while HouseForm predominantly recommends usage of Zod for field validation, it's not the only option; you can even use HouseForm entirely without Zod.

Let's take a look at how to validate a field using:

- Zod and a custom function
- A non-Zod async function

> While we'll be using `onChangeValidate` for these docs, they apply to all validation methods.

## Zod Custom Validators

If using Zod, you can use a custom validator using one of three methods:

- [`z.custom`](https://github.com/colinhacks/zod#custom-schemas)
- [`z.refine`](https://github.com/colinhacks/zod#refine)
- [`z.superRefine`](https://github.com/colinhacks/zod#superrefine)

While `custom` and `superRefine` have more functionality, let's leave the explaination of those two methods to the Zod documentation. Instead, let's take a look at how we can pass a custom function to Zod using `refine`:

```tsx
import { Field, Form } from "houseform";
import { z } from "zod";

export default function App() {
  return (
    <Form>
      {() => (
        <>
          <Field
            name="name"
            onChangeValidate={z.string().refine((val) => val !== "John", {
              message:
                "John, you know you're not allowed to use our app anymore",
            })}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <input
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={"First Name"}
                  />
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              );
            }}
          </Field>
        </>
      )}
    </Form>
  );
}
```

> Because HouseForm uses Zod's `parseAsync` method under-the-hood, we even support [passing an asyncronous function to Zod's `refine` method](https://github.com/colinhacks/zod#asynchronous-refinements).

<ClickToIFrame title="HouseForm Zod Refine StackBlitz Example" src="https://stackblitz.com/edit/houseform-v1-example-zod-refine?file=App.tsx"/>

## Async Function Custom Validators

While Zod usage is powerful, you may want to:

- Avoid using Zod to reduce your bundle size
- Reuse async functions without passing it to Zod's `refine` method

Luckily, HouseForm supports functions that return a promise to be used for validation, allowing you to bypass Zod usage entirely.

```tsx
import { Field, Form } from "houseform";

export default function App() {
  return (
    <Form>
      {() => (
        <>
          <Field
            name="email"
            onChangeValidate={(val) =>
              val.length < 3
                ? Promise.reject("Email must have three characters")
                : Promise.resolve(true)
            }
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
        </>
      )}
    </Form>
  );
}
```

Because `async` functions return a promise behind-the-scenes, you may also choose to use an async function that `throw`s an error message to display:

```tsx
import { Field } from "houseform";

const App = () => (
  <Field
    name="email"
    onChangeValidate={async (val) => {
      if (val.length < 3) {
        throw "Email must have three characters";
      }
      // Validation has passed
      return true;
    }}
  />
);
```

### Form Metadata Access in Async Field Validator

There may be times where you want to access the form's metadata or the metadata of another field in your custom validator. This is possible by using the second argument of the `onChangeValidate` function, which is a [FormInstance](https://houseform.dev/reference/form.html#interface-forminstance):

```tsx
import { Field } from "houseform";

const App = (
  <Field
    listenTo={["password"]}
    name="confirmpassword"
    onChangeValidate={async (val, form) => {
      if (form.getFieldValue("password")?.value !== val) {
        throw "Passwords must match";
      }
      return true;
    }}
  />
);
```

 <ClickToIFrame title="HouseForm Async Validator StackBlitz Example" src="https://stackblitz.com/edit/houseform-v1-example-async-validator?file=App.tsx"/>
