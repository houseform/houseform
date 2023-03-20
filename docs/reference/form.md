# Form

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

| Method              | Parameters                                                   | Expected Return | Description                                                  |
| ------------------- | ------------------------------------------------------------ | --------------- | ------------------------------------------------------------ |
| `onSubmit`          | `Record<string, any>`, [`FormInstance`](#interface-forminstance) |                 | The function to call when the form is submitted. The first argument is the values of a form submitted. It might look something like:<br />`{email: "test@example.com", password: "Hunter2!", confirmpassword: "Hunter2!"}` |
| `children`          | [`FormInstance`](#interface-forminstance)                    | `JSX.Element`   | This is the component child function to pass, which accepts the arguments for FormInstance. |
| `memoChild`         | `any[]`                                                      |                 | An array of items passed to the inner `useMemo` [which helps prevent re-renders on the form.](/guides/performance-optimizations) |
| `submitWhenInvalid` | `boolean`                                                    |                 | Typically, when a form's fields are invalid, the `onSubmit` function will not run. Passing `true` to `submitWhenInvalid` bypasses this functionality. |

### _Interface_ `FormInstance`

These are the properties that are passed to the `<Form>` component's child function, the `FormContext`, and the second arguments of the `onSubmit` function as well as all [`<Field>` `onXValidate` property functions](/reference/field#field-props):


| Property         | Type                     | Description                                                                                                                                                               |
| ---------------- | ------------------------ |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `submit`         | `() => void`             | The function to run when you're ready to submit your form. This function will not do anything if there are `errors` on the form.                                          |
| `errors`         | `string[]`               | An array of all errors on all form fields.                                                                                                                                |
| `isValid`        | `boolean`                | A boolean to check if the form is valid or not.                                                                                                                           |
| `isSubmitted`    | `boolean`                | A boolean to check if the form has had an attempted submission or not.                                                                                                    |
| `setIsSubmitted` | `(val: boolean) => void` | A method to reset the `isSubmitted` field                                                                                                                                 |
| `isDirty`        | `boolean`                | A boolean to check if any of the form fields are dirty or not.                                                                                                            |
| `setIsDirty`     | `(val: boolean) => void` | A method to reset the `isDirty` properties of all of the Form's Fields.                                                                                                   |
| `isTouched`      | `boolean`                | A boolean to check if any of the form fields have been touched or not.                                                                                                    |
| `setIsTouched`   | `(val: boolean) => void` | A method to reset the `isTouched` properties of all of the Form's Fields.                                                                                                                                    |
| `getFieldValue` | `(fieldName: sting) => FieldInstance` | Takes the field name and returns a [`FieldInstance`](/reference/field#interface-fieldinstance) or [`FieldArrayInstance`](/reference/array#interface-fieldarrayinstance) representation of the named field. |
| `value` | `Record<string, any>` | The values of a form's fields. It might look something like:<br />`{email: "test@example.com", password: "Hunter2!", confirmpassword: "Hunter2!"}` |
