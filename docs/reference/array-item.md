# Array Field Item

An `ArrayFieldItem` is a helper used to validate sub-items in a `FieldArray`. An example `ArrayFieldItem` usage is:

```jsx
<FieldArray name={"people"} initialValue={[{ name: "Bob" }]}>
  {({ value }) => (
    <>
      {value.map((person, i) => (
        <FieldArrayItem key={`people[${i}].name`} name={`people[${i}].name`}>
          {({ setValue, value, onBlur }) => (
            <input
              value={value}
              onBlur={onBlur}
              onChange={(e) => setValue(e.target.value)}
              placeholder={"Name"}
            />
          )}
        </FieldArrayItem>
      ))}
    </>
  )}
</FieldArray>
```

## Array Field Item Props

| Property           | Type                                                                       | Description                                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`             | `string`                                                                   | The name of the field in the form.                                                                                                                                                                                       |
| `listenTo`         | `string[]`                                                                 | A list of form field names to listen to. When a listened field updates it's value, it will trigger the relevant `onChangeValidation` change detection. Useful when making one field depend on the validation of another. |
| `children`         | `(props: FieldInstance<T>) => JSX.Element`                                 | Passed [`FieldInstance`](/reference/field#interface-fieldinstance), expected to return a JSX element.                                                                                                                    |
| `onChangeValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has changed the field value. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                     |
| `onBlurValidate`   | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has blurred the field. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                           |
| `onMountValidate`  | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the component is mounted . Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                                |
| `onSubmitValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has submitted the form. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                          |
| `onSubmitTransform` | `(value: T) => any` or [`ZodType`](https://github.com/colinhacks/zod) | The transform function for when the user has submitted the form. Either a Zod transform or Function. The form will receive the transformed value instead if set. |
| `memoChild`        | `any[]`                                                                    | An array of items passed to the inner `useMemo` [which helps prevent re-renders on the field array item.](/guides/performance-optimizations)                                                                             |
