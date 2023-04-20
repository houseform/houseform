---
head:
  - - meta
    - property: og:title
      content: Use HouseForm with UI Libraries & CSS Frameworks
  - - meta
    - property: og:description
      content: HouseForm supports your favorite UI libraries and CSS frameworks. Here's how you can use them together seemlessly.
---

# External UI Library Support

Because HouseForm is headless, you can combine it with any number of UI libraries or CSS frameworks.

While anything ranging from [TailwindCSS](https://tailwindcss.com/) to [MUI](https://mui.com/) work just fine, here's an example of using HouseForm with [React Bootstrap](https://react-bootstrap.github.io/):

```tsx
import * as React from "react";
import { Field as HouseField, Form as HouseForm } from "houseform";
import { z } from "zod";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <div className="m-3">
      <HouseForm
        onSubmit={(values) => {
          alert("Form was submitted with: " + JSON.stringify(values));
        }}
      >
        {({ isValid, submit }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <HouseField
              name="email"
              onBlurValidate={z.string().email("This must be an email")}
            >
              {({ value, setValue, onBlur, errors }) => {
                return (
                  <div>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => setValue(e.target.value)}
                        type="email"
                        placeholder="Enter email"
                      />
                      {errors.map((error) => (
                        <Form.Text className="text-danger" key={error}>
                          {error}
                        </Form.Text>
                      ))}
                    </Form.Group>
                  </div>
                );
              }}
            </HouseField>
            <Button disabled={!isValid} variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </HouseForm>
    </div>
  );
}
```

<ClickToIFrame title="HouseForm UI Library StackBlitz Example" src="https://stackblitz.com/edit/houseform-v1-example-with-bootstrap?embed=1&file=App.tsx"/>
