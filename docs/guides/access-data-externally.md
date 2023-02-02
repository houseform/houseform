# Access Data Outside Render Functions

> This section is still being written.

<!-- ref={} -->

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
        {() =>
          // ...
          null
        }
      </Form>
      <button onClick={doSubmit}>Submit</button>
    </div>
  );
};
```

 
