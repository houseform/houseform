# API Reference

This is the no-frills versions of the docs. Very little is explained here, but if you're looking for very-specific usage, this is the place for you.

## Form

The `Form` component is the main component of this library. It is responsible for managing the state of the form and
must be the parent of all `Field` components.

An example `Form` usage is:

```jsx
<Form onSubmit={() => {}}>
{({submit}) => <button onClick={submit}>Submit</button>}
</Form>
```

### Form Props

The `Form` component takes the following props:

| Method     | Parameters                                                   | Expected Return | Description                                                  |
| ---------- | ------------------------------------------------------------ | --------------- | ------------------------------------------------------------ |
| `onSubmit` | `Record<string, any>`, [`FormContext`](#interface-formcontext) |                 | The function to call when the form is submitted. The first argument is the values of a form submitted. It might look something like:<br />`{email: "test@example.com", password: "Hunter2!", confirmpassword: "Hunter2!"}` |
| `children` | [`FormInstance`](#interface-forminstance)                          | `JSX.Element`   | This is the component child function to pass, which accepts the arguments for FormInstance. |

### _Interface_ `FormInstance`

These are the properties that are passed to the `<Form>` component's child function, the `FormContext`, and the second arguments of the `onSubmit` function as well as all [`<Field>` `onXValidate` property functions](#field):


| Property         | Type                     | Description                                                  |
| ---------------- | ------------------------ | ------------------------------------------------------------ |
| `submit`         | `() => void`             | The function to run when you're ready to submit your form. This function will not do anything if there are `errors` on the form. |
| `errors`         | `string[]`               | An array of all errors on all form fields.                   |
| `isValid`        | `boolean`                | A boolean to check if the form is valid or not.              |
| `isSubmitted`    | `boolean`                | A boolean to check if the form has had an attempted submission or not. |
| `setIsSubmitted` | `(val: boolean) => void` | A method to reset the `isSubmitted` field                    |
| `isDirty`        | `boolean`                | A boolean to check if any of the form fields are dirty or not. |
| `setIsDirty`     | `(val: boolean) => void` | A method to reset the `isDirty` field                        |
| `isTouched`      | `boolean`                | A boolean to check if any of the form fields have been touched or not. |
| `setIsTouched`   | `(val: boolean) => void` | A method to reset the `isTouched` field                      |
| `getFieldValue` | `(fieldName: sting) => FieldInstance` | Takes the field name and returns a [`FieldInstance`](#interface-fieldinstance) or [`FieldArrayInstance`](#interface-fieldarrayinstance) representation of the named field. |

## Field

A field is the primitive for every input that you'd like to display to the user. This is what an example `Field` looks like:

```jsx
<Field<string> name="username" initialValue={""}>
    {({value, setValue}) => (
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={"Username"}/>
    )}
</Field>
```

### Field Props

| Property           | Type                                                         | Description                                                  |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `name`             | `string`                                                     | The name of the field in the form.                           |
| `initialValue`     | `T`                                                          | The initial value of the form field.                         |
| `listenTo`         | `string[]`                                                   | A list of form field names to listen to. When a listened field updates it's value, it will trigger the relevant `onChangeValidation` change detection. Useful when making one field depend on the validation of another. |
| `children`         | `(props: FieldInstance<T>) => JSX.Element`                   | Passed [`FieldInstance`](#interface-fieldinstance), expected to return a JSX element. |
| `onChangeValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has changed the field value. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `onBlurValidate`   | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has blurred the field. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `onMountValidate`   | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the component is mounted. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `onSubmitValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has submitted the form. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |

### _Interface_ `FieldInstance`

| Property       | Type                         | Description                                                  |
| -------------- | ---------------------------- | ------------------------------------------------------------ |
| `value`        | `T`                          | `T` is the type of the Field that's passed to the `<Field<T>>` component. |
| `setValue`     | `(val: T) => void`           | A function useful to change the value of a field             |
| `onBlur`       | `() => void`                 | A function expected to be passed to the `onBlur` element property. |
| `errors`       | `string[]`                   | The list of errors currently applied to the field.           |
| `setErrors`    | `(errors: string[]) => void` | A way to set the errors present on the field.                |
| `isValid`      | `boolean`                    | A helper property to check if `errors` is an empty array.    |
| `isTouched`    | `boolean`                    | A boolean to say if the field has been focused and blurred, regardless of user input. |
| `setIsTouched` | `(val: boolean) => void`     |                                                              |
| `isDirty`      | `boolean`                    | A boolean to say if the field has had any kind of user input. |
| `setIsDirty`   | `(val: boolean) => void`     |                                                              |
| `props`        | [`FieldProps`](#field-props) | The properties originally passed to a field from the component. |

## Array Field

An `ArrayField` is a wrapper used to handle arrays of form items. An example `ArrayField` usage is:

```jsx
<FieldArray name={"numbers"} initialValue={[1]}>
  {({ add, value }) => (
    <>
      {value.map(<p key={num}>{num}</p>)}
      <button onClick={() => add(1)}>Set value</button>
    </>
  )}
</FieldArray>
```

### Array Field Props

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

## Array Field Item

An `ArrayFieldItem` is a helper used to validate sub-items in a `FieldArray`. An example `ArrayFieldItem` usage is:

```jsx
<FieldArray name={"people"} initialValue={[1]}>
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

### Array Field Item Props

| Property           | Type                                                         | Description                                                  |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `name`             | `string`                                                     | The name of the field in the form.                           |
| `listenTo`         | `string[]`                                                   | A list of form field names to listen to. When a listened field updates it's value, it will trigger the relevant `onChangeValidation` change detection. Useful when making one field depend on the validation of another. |
| `children`         | `(props: FieldInstance<T>) => JSX.Element`                   | Passed [`FieldInstance`](#interface-fieldinstance), expected to return a JSX element. |
| `onChangeValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has changed the field value. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `onBlurValidate`   | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has blurred the field. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `onMountValidate`   | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the component is mounted . Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |
| `onSubmitValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has submitted the form. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error. |

