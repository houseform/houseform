# Array Field

An `ArrayField` is a wrapper used to handle arrays of form items. An example `ArrayField` usage is:

```jsx
<FieldArray name={"numbers"} initialValue={[1]}>
  {({ add, value }) => (
    <>
      {value.map((num) => <p key={num}>{num}</p>)}
      <button onClick={() => add(1)}>Set value</button>
    </>
  )}
</FieldArray>
```

## Array Field Props

The `ArrayField` component takes the following props:

| Property           | Type                                                         | Description                                                  |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `name`             | `string`                                                     | The name of the array field within the form.                 |
| `initialValue`     | `T[]`                                                        | The initial value of the field array.                        |
| `listenTo`         | `string[]`                                                   | A list of form field names to listen to. When a listened field updates it's value, it will trigger the relevant `onChangeValidation` change detection. Useful when making one field depend on the validation of another. |
| `children`         | `(props: FieldArrayInstance<T>) => JSX.Element`              | Passed [`FieldArrayInstance`](#interface-fieldarrayinstance), expected to return a JSX element. |
| `onChangeValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has changed the field value. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `onMountValidate`   | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the component is mounted. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `onSubmitValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has submitted the form. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `memoChild` | `any[]` | An array of items passed to the inner `useMemo` [which helps prevent re-renders on the field array.](/guides/performance-optimizations) |

### _Interface_ `FieldArrayInstance`

| Property       | Type                                       | Description                                                  |
| -------------- | ------------------------------------------ | ------------------------------------------------------------ |
| `value`        | `T`                                        | `T` is the type of the Field that's passed to the `<Field<T>>` component. |
| `setValue`     | `(val: T) => void`                         | A function useful to change the value of a field             |
| `errors`       | `string[]`                                 | The list of errors currently applied to the field.           |
| `setErrors`    | `(errors: string[]) => void`               | A way to set the errors present on the field.                |
| `isValid`      | `boolean`                                  | A helper property to check if `errors` is an empty array.    |
| `isTouched`    | `boolean`                                  | A boolean to say if the field has been focused and blurred, regardless of user input. |
| `setIsTouched` | `(val: boolean) => void`                   |                                                              |
| `isDirty`      | `boolean`                                  | A boolean to say if the field has had any kind of user input. |
| `setIsDirty`   | `(val: boolean) => void`                   |                                                              |
| `props`        | [`ArrayFieldProps`](#array-field-props)    | The properties originally passed to a field from the component. |
| `add`          | `(val: T) => void`                         | A helper utility to add an item to the form array.           |
| `remove`       | `(index: number) => void`                  | A helper utility to remove an item via an index from the form array. |
| `insert`       | `(index: number, val: T) => void`          | A helper utility to insert an item at the index to the form array. |
| `move`         | `(from: number, to: number) => void`       | A helper utility to move an item from one index to another in the form array. |
| `replace`      | `(index: number, val: T) => void`          | A helper utility to replace an item at an index on the form array. |
| `swap`         | `(indexA: number, indexB: number) => void` | A helper utility to swap two items on the form array.        |
