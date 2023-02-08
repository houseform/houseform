---
head:
  - - meta
    - property: og:title
      content: HouseForm HTML Form Usage
  - - meta
    - property: og:description
      content: HTML forms have a lot of built-in functionality that you can combine with HouseForm's powerful API to create a great user experience.
---

# Usage with HTML forms

One commonly raised issue with other headless form libraries is that they lose the capabilities of HTML forms.

Namely, default HTML forms provide the following capabilities:

- Listening for `enter` key while within the form, regardless of form completion state.
- The ability to call the server without `fetch` or similar JavaScript calls.
  - Data being passed to a server during the `POST`

Luckily, with HouseForm, these capabilities are preserved!

Let's start with a basic HouseForm form:

```jsx
import {Form, Field} from 'houseform';
import { z } from "zod";

const App = () => (
    <Form onSubmit={values => alert(JSON.stringify(values))}>
      {({ isValid, submit }) => (
    		<div>
    		    <Field name="email" onChangeValidate={z.string().email("Must be an email")}>
                    {({ value, setValue, onBlur, errors }) => (
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
                      )}
                </Field>
                <button disabled={!isValid} type="submit">
                    Submit
                </button>
            </div>
    	)}
    </Form>
)
```

Because of the usage of `div`s present in this example, this form will not have the default HTML `<form>` behavior allowing the user to submit the form using the enter key.

To solve this, we need to add a `<form> `element and use its `onSubmit` to call the HouseForm `submit` function:

```jsx
import {Form, Field} from 'houseform';
import { z } from "zod";

const App = () => (
    <Form onSubmit={values => alert(JSON.striingify(values))}>
      {({ isValid, submit }) => (
    		<form onSubmit={e => {
          		e.preventDefault();
          		submit();
        	}}>
    		    <Field name="email" onChangeValidate={z.string().email("Must be an email")}>
                    {({ value, setValue, onBlur, errors }) => (
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
                      )}
                </Field>
                <button disabled={!isValid} type="submit">
                    Submit
                </button>
            </form	>
    	)}
    </Form>
)
```

Now, when we hit enter anywhere within the `<form>`, it will run the `onSubmit` on the HouseForm `<Form>` component.

## Forms with Network Requests via `action` Attribute

If your form uses the [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-action) property to submit the form to a remote server, you can use a custom `onSubmit` function, a `useRef`, and a `<form>` ref's [`submit()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit) function to check validation and run a form's `action` logic conditionally: 

```jsx
import {Form, Field} from 'houseform';
import * as z from 'zod';
import { useRef } from 'react';

export default function App() {
  const formRef = useRef();

  return (
    <Form>
      {({ isValid, submit }) => (
        <form
          action="https://example.com/url"
          method="post"
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            submit().then((isValid) => {
              // Is `true` if valid, `false` if not.
              if (!isValid) return;
              formRef.current.submit();
            });
          }}
        >
          <Field
            name="email"
            onBlurValidate={z.string().email("This must be an email")}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <input
                    name="email"
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
          <button disabled={!isValid} type="submit">
            Submit
          </button>
        </form>
      )}
    </Form>
  );
}
```

With this code, your page will not refresh and execute the `action` logic until the form is validated by HouseForm and marked as valid. 

> Make sure your HTML `<input>` elements also have a `name` associated with them - otherwise, their values will not be submitted to the `action` server via [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) properly.
