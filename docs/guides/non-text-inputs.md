# Non-Text Inputs

> This section is still being written.

<!-- Radio buttons, select -->

The following is an example of a HouseForm form capable of handling a radio input:

```jsx
import { Field, Form } from "houseform";
import { set, z } from "zod";

export default function App() {
  return (
    <Form>
      {({ submit }) => (
        <div>
          <Field<string>
            name="email"
            onChangeValidate={z
              .literal("darksouls")
              .or(z.literal("bloodborne"))
              .or(z.literal("sekiro"))}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <fieldset>
                    <legend>What's the best FromSoftware game:</legend>

                    <div>
                      <input
                        type="radio"
                        id="darksouls"
                        name="game"
                        value="darksouls"
                        checked={value === "darksouls"}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      <label htmlFor="darksouls">Dark Souls</label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="bloodborne"
                        name="game"
                        value="bloodborne"
                        checked={value === "bloodborne"}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      <label htmlFor="bloodborne">Bloodborne</label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="sekiro"
                        name="game"
                        value="sekiro"
                        checked={value === "sekiro"}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      <label htmlFor="sekiro">Sekiro</label>
                    </div>
                  </fieldset>
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              );
            }}
          </Field>
          <button onClick={submit}>Submit</button>
        </div>
      )}
    </Form>
  );
}
```

 