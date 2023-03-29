# Performance Optimizations

HouseForm makes heavy use of child functions in order to remain a headless React UI library:

```tsx
import { Form, Field } from "houseform";
const Comp = () => {
  return (
    <Form>
      {() => {
        // This is a child function
        return (
          <Field name="test">
            {({ value, setValue, onBlur }) => {
              // As is this
              return (
                <input
                  onBlur={onBlur}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              );
            }}
          </Field>
        );
      }}
    </Form>
  );
};
```

However, one major problem with this method is that when the parent component (in this case, `Comp`) re-renders, [React treats the child function as a new function reference and will re-render the entire contents of `Form` and `Field` regardless of if it's required](https://unicorn-utterances.com/posts/functions-are-killing-react-performance#children-functions).

> If the previous sentence didn't make sense to you, that's alright! I wrote an article that explains [what that means, how React handles this under-the-hood, and how to fix it in this article](https://unicorn-utterances.com/posts/functions-are-killing-react-performance#children-functions). It's highly encouraged you read that first before continuing on with this guide.

As such, if you have another part of state, unrelated to the form, that causes the parent to re-render, **React will re-render the entire form and its contents**.

```tsx
import { Form } from "houseform";

const Comp = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>

      <Form>
        {({ submit }) => {
          // This will re-render ALL of its contents
          //  every time `count` is updated

          return <>{/* ... */}</>;
        }}
      </Form>
    </div>
  );
};
```

To solve this, you _could_ move the `Form` child function to a `useMemo`:

```tsx
import { Form } from "houseform";

const Comp = () => {
  const [count, setCount] = useState(0);

  const formFn = useCallback(({ submit }) => {
    // This will re-render ALL of its contents
    //  every time `count` is updated

    return <>{/* ... */}</>;
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>

      <Form>{formFn}</Form>
    </div>
  );
};
```

However, this introduces two locations for your UI code to live; one inside the `return`, and one above.

To help sidestep this, HouseForm has a property that can be passed to `Form`, `Field`, `FieldArray`, and `FieldArrayItem` alike: `memoChild`.

`memoChild` acts as a way to wrap your `children` function inside of a `useMemo` hook, while still retaining all of the functionality you'd need otherwise.

```tsx
import { Form } from "houseform";

const Comp = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>

      <Form memoChild={[]}>
        {({ submit }) => {
          // This will only render once,
          //  even if `count` is updated.

          return <>{/* ... */}</>;
        }}
      </Form>
    </div>
  );
};
```

Similar to how the `useCallback` hook works, you'll need to pass in any properties that are used inside of the render function:

```tsx
import { Form } from "houseform";

const Comp = () => {
  const [count, setCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <p>Other Count: {otherCount}</p>
      <button onClick={() => setOtherCount(otherCount + 1)}>Add</button>

      <Form memoChild={[count]}>
        {({ submit }) => {
          // This will re-render when `count` is updated, but not `otherCount`
          return (
            <div>
              <p>{count}</p>
              {/* ... */}
            </div>
          );
        }}
      </Form>
    </div>
  );
};
```
