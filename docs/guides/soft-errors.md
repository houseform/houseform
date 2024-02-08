# Soft Errors / Hints

Assuming a sufficiently large form you may want to show hints to the user about what kind of inputs are needed for non-required fields.
Standard validation and errors would prevent submitting the form, but that's not what you want.

To sovle this, we've introduced the concept of "soft errors" or "hints".

To use hints, use the same API as you would for field validation but replace `onChangeValidate`, `onChangeHint` and `onBlurValidate` to `onBlurHint`, and such.
```tsx
import { Field } from "houseform";

const App = () => (
  <Field
    name="email"
    onChangeHint={z.string().email()}
  >
    {/* ... */}
  </Field>
);
```

Then, change `errors` to `hints` in your field component.

```tsx
const App = () => (
  <Field
    name="email"
    onChangeHint={z.string().email()}
  >
    {({ value, setValue, hints }) => (
      <div>
        <input
          placeholder="Email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {hints.map((hint) => (
          <p key={hint}>{hint}</p>
        ))}
        <button onClick={submit}>Submit</button>
      </div>
    )}
  </Field>
);
```
