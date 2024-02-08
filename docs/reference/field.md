# Field

A field is the primitive for every input that you'd like to display to the user. This is what an example `Field` looks like:

```jsx
<Field<string> name="username" initialValue={""}>
    {({value, setValue}) => (
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={"Username"}/>
    )}
</Field>
```

## Field Props

| Property            | Type                                                                       | Description                                                                                                                                                                                                              |
|---------------------| -------------------------------------------------------------------------- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`              | `string`                                                                   | The name of the field in the form.                                                                                                                                                                                       |
| `initialValue`      | `T`                                                                        | The initial value of the form field.                                                                                                                                                                                     |
| `resetWithValue`    | `T`                                                                        | The value to which a form field should be reset upon calling the `reset()` method.                                                                                                                                       |
| `preserveValue`     | `boolean`                                                                  | Preserve the field's values when unmount.                                                                                                                                                                                |
| `listenTo`          | `string[]`                                                                 | A list of form field names to listen to. When a listened field updates it's value, it will trigger the relevant `onChangeValidation` change detection. Useful when making one field depend on the validation of another. |
| `children`          | `(props: FieldInstance<T>) => JSX.Element`                                 | Passed [`FieldInstance`](#interface-fieldinstance), expected to return a JSX element.                                                                                                                                    |
| `onChangeValidate`  | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has changed the field value. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                     |
| `onBlurValidate`    | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has blurred the field. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                           |
| `onMountValidate`   | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the component is mounted. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                                 |
| `onSubmitValidate`  | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has submitted the form. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                          |
| `onChangeHint`      | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The soft validation logic for when the user has changed the field value. Either a Zod type or Promise. If resolved, no hint is passed. If rejected, rejection string is set as a hint.                                   |
| `onBlurHint`        | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has blurred the field. Either a Zod type or Promise. If resolved, no hint is passed. If rejected, rejection string is set as a hint.                                              |
| `onMountHint`       | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The soft validation logic for when the component is mounted. Either a Zod type or Promise. If resolved, no hint is passed. If rejected, rejection string is set as a hint.                                               |
| `onSubmitHint`      | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The soft validation logic for when the user has submitted the form. Either a Zod type or Promise. If resolved, no hint is passed. If rejected, rejection string is set as a hint.                                        |
| `onSubmitTransform` | `(value: T) => any` or [`ZodType`](https://github.com/colinhacks/zod) | The transform function for when the user has submitted the form. Either a Zod transform or Function. The form will receive the transformed value instead if set.                                                         |
| `memoChild`         | `any[]`                                                                    | An array of items passed to the inner `useMemo` [which helps prevent re-renders on the field.](/guides/performance-optimizations)                                                                                        |

### _Interface_ `FieldInstance`

| Property       | Type                                                                                                 | Description                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `value`        | `T`                                                                                                  | `T` is the type of the Field that's passed to the `<Field<T>>` component.             |
| `setValue`     | `(val: T) => void`                                                                                   | A function useful to change the value of a field                                      |
| `onBlur`       | `() => void`                                                                                         | A function expected to be passed to the `onBlur` element property.                    |
| `errors`       | `string[]`                                                                                           | The list of errors currently applied to the field.                                    |
| `setErrors`    | `(errors: string[]) => void`                                                                         | A way to set the errors present on the field.                                         |
| `hints`        | `string[]`                                                                                          | The list of hints currently applied to the field.                                     |
| `setHints`     | `(hints: string[]) => void`                                                                         | A way to set the hints present on the field.                                          |
| `isValid`      | `boolean`                                                                                            | A helper property to check if `errors` is an empty array.                             |
| `isValidating` | `boolean`                                                                                            | A helper property to check if the field is running a validation.                      |
| `isTouched`    | `boolean`                                                                                            | A boolean to say if the field has been focused and blurred, regardless of user input. |
| `setIsTouched` | `(val: boolean) => void`                                                                             |                                                                                       |
| `isDirty`      | `boolean`                                                                                            | A boolean to say if the field has had any kind of user input.                         |
| `setIsDirty`   | `(val: boolean) => void`                                                                             |                                                                                       |
| `props`        | [`FieldProps`](#field-props)                                                                         | The properties originally passed to a field from the component.                       |
| `validate`     | `(rule: 'onChangeValidate' \| 'onSubmitValidate' \| 'onMountValidate' \|  'onBlurValidate') => void` | A function used to manually run change detection on a field instance.                 |
