# Access Data Outside Render Functions

There are instances where you might want to access form or field data outside of the render function. Luckily, HouseForm supports this capability via `ref` usage:

```jsx
import { Form } from "houseform";
import { useRef } from "react";

const App = () => {
  const formRef = useRef(null);

  const doSubmit = () => {
    if (formRef.current?.getFieldValue("name")?.value === "test") {
      return;
    }
    formRef.current?.submit();
  };

  return (
    <div>
      <Form onSubmit={() => {}} ref={formRef}>
        {() => (
          // ...
          <></>
        )}
      </Form>
      <button onClick={doSubmit}>Submit</button>
    </div>
  );
};
```

## Access Field Data Outside Render Functions

While forms provide the `getFieldValue` helper, sometimes it's nicer to directly access the internals of the `<Field>` components. This usage is also support using a `ref`:

```jsx
export default function App() {
  const fieldRef = useRef(null);

  const logFieldValue = () => {
    console.log(fieldRef.current?.value);
  };

  return (
    <>
      <Form>
        {() => (
          <Field name="email" ref={fieldRef}>
            {() => <></>}
          </Field>
        )}
      </Form>
      <button onClick={logFieldValue}>Log Field Value</button>
    </>
  );
}
```
