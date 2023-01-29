<div align="center">
<h1>HouseForm</h1>

<img
height="320"
width="320"
alt="A ledger with a house shape"
src="./assets/logo.svg"
/>

<p>Simple to use React forms, where your validation and UI code live together in harmony.</p>

</div>


> This is a work in progress library. Docs are still being written.

# Installation

```
npm install houseform zod
```

> Zod is a peer dependency of this project.

# Example

```tsx
function App() {
    return (
        <Form onSubmit={(values) => {
            alert("Form was submitted with: " + JSON.stringify(values));
        }}>
            {({isValid, submit}) => (
                <>
                    <Field name="email"
                           onChangeValidate={z.string().email("This must be an email")}
                           onSubmitValidate={isEmailUnique}>
                        {({value, setValue, onBlur, errors, isTouched, isDirty}) => {
                            return <div>
                                <input value={value} onBlur={onBlur} onChange={e => setValue(e.target.value)}
                                       placeholder={"Email"}/>
                                {errors.map(error => <p key={error}>{error}</p>)}
                                {isTouched && <p>Is Touched</p>}
                                {isDirty && <p>Is Dirty</p>}
                            </div>
                        }}
                    </Field>
                    <Field<string> name="password"
                                   onChangeValidate={z.string().min(8, "Must be at least 8 characters long")}
                    >
                        {({value, setValue, onBlur, errors}) => {
                            return <div>
                                <input value={value} onBlur={onBlur} onChange={e => setValue(e.target.value)}
                                       placeholder={"Password"} type="password"/>
                                {errors.map(error => <p key={error}>{error}</p>)}
                            </div>
                        }}
                    </Field>
                    <Field<string> name="confirmpassword"
                                   listenTo={["password"]}
                                   onChangeValidate={(val, form) => {
                                       if (val === form.getFieldValue("password")!.value) {
                                           return Promise.resolve(true);
                                       } else {
                                           return Promise.reject("Passwords must match");
                                       }
                                   }}
                    >
                        {({value, setValue, onBlur, errors}) => {
                            return <div>
                                <input value={value} onBlur={onBlur} onChange={e => setValue(e.target.value)}
                                       placeholder={"Password Confirmation"} type="password"/>
                                {errors.map(error => <p key={error}>{error}</p>)}
                            </div>
                        }}
                    </Field>
                    <button disabled={!isValid} onClick={submit}>Submit</button>
                </>)}
        </Form>
    )
}
```

# Documentation

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

| Method     | Parameters | Expected Return                        | Description |
|------------|--- |-----------------------------------------| --- |
| `onSubmit` | `Record<string, any>`, [`FormContext`](#interface-formcontext) | | The function to call when the form is submitted. The first argument is the values of a form submitted. It might look something like:<br />`{email: "test@example.com", password: "Hunter2!", confirmpassword: "Hunter2!"}` |
| `children` | [`FormState`](#interface-formstate) | `JSX.Element` | This is the component child function to pass, which accepts the arguments for FormState. |

### _Interface_ `FormState`

These are the properties that are passed to the `<Form>` component's child function.


| Property         | Type                     | Description                                                                                                                      |
|------------------|--------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `submit`         | `() => void`             | The function to run when you're ready to submit your form. This function will not do anything if there are `errors` on the form. |
| `errors`         | `string[]`               | An array of all errors on all form fields.                                                                                       |
| `isValid`        | `boolean`                | A boolean to check if the form is valid or not.                                                                                  |
| `isSubmitted`    | `boolean`                | A boolean to check if the form has had an attempted submission or not.                                                           |
| `setIsSubmitted` | `(val: boolean) => void` | A method to reset the `isSubmitted` field                                                                                        |
| `isDirty`        | `boolean`                | A boolean to check if any of the form fields are dirty or not.                                                                   |
| `isTouched`      | `boolean`                | A boolean to check if any of the form fields have been touched or not.                                                           |

### _Interface_ `FormContext`

This is the second argument passed to the `<Form>` `onSubmit` function and the second argument to all [`<Field>` `onXValidate` property functions](#field):

| Property        | Type                               | Description                                                  |
| --------------- | ---------------------------------- | ------------------------------------------------------------ |
| `errors`        | `string[]`                         | A list of all errors present on the form. When an empty array, the form is valid. |
| `getFieldValue` | `(fieldName: sting) => FieldProps` | Takes the field name and returns a [`FieldProp`](#interface-fieldprops) representation of the named field. |

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

| Property           | Type                                                                       | Description                                                                                                                                                                                                              |
|--------------------|----------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `initialValue`     | `T`                                                                        | The initial value of the form field.                                                                                                                                                                                     |
| `listenTo`         | `string[]`                                                                 | A list of form field names to listen to. When a listened field updates it's value, it will trigger the relevant `onChangeValidation` change detection. Useful when making one field depend on the validation of another. |
| `children`         | `(props: FieldProps<T>) => JSX.Element`                                    | Passed [`FieldProps`](#interface-fieldprops), expected to return a JSX element.                                                                                                                                          |
| `onChangeValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod) | The validation logic for when the user has changed the field value. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                     |
| `onBlurValidate`   | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod)                                      | The validation logic for when the user has blurred the field. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                           |
| `onSubmitValidate` | `() => Promise<boolean>` or [`ZodType`](https://github.com/colinhacks/zod)                                      | The validation logic for when the user has submitted the form. Either a Zod type or Promise. If resolved, no error is passed. If rejected, rejection string is set as an error.                                          |

### _Interface_ `FieldProps`

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

