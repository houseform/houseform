# Non-Text Inputs

Simple text inputs aren't the only useful item to keep track of in your form state. Because of HouseForm's headless nature, you're able to use any existing HTML or UI Library elements to track other parts of state.

## Radio Inputs

The following is an example of a HouseForm form capable of handling a radio input:

```tsx
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
                    <legend>What&apos;s the best FromSoftware game:</legend>

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

## Select Dropdowns

The following is a select field example in HouseForm:

```tsx
import { Field, Form } from "houseform";
import { z } from "zod";

export default function App() {
  return (
    <Form>
      {({ submit }) => (
        <div>
          <Field<string>
            name="email"
            onChangeValidate={z.union(
              [
                z.literal("ds3"),
                z.literal("bloodborne"),
                z.literal("sekiro"),
                z.literal("eldenring"),
              ],
              {
                errorMap: () => ({
                  message: "You have invalid tastes in games... JK!",
                }),
              }
            )}
          >
            {({ value, setValue, onBlur, errors }) => {
              return (
                <div>
                  <label htmlFor="games">
                    What&apos;s the best FromSoftware game:
                  </label>
                  <select
                    name="games"
                    id="games"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                  >
                    <optgroup label="Dark Souls">
                      <option value="ds1">Dark Souls</option>
                      <option value="ds2">Dark Souls 2</option>
                      <option value="ds3">Dark Souls 3</option>
                    </optgroup>
                    <optgroup label="SoulsLikes">
                      <option value="eldenring">Elden Ring</option>
                      <option value="sekiro">Sekiro</option>
                      <option value="bloodborne">Bloodborne</option>
                    </optgroup>
                  </select>
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
