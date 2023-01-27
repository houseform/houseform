<div align="center">
<h1>HouseForm</h1>

<p>Simple to use React forms, where your validation and UI code live together in harmony.</p>

</div>


> This is a work in progress library. Docs are still being written.

## Installation

```
npm install houseform
```

## Example

```tsx
function App() {
    return (
        <Form onSubmit={(values) => {
            alert("Form was submitted with: " + JSON.stringify(values));
        }}>
            <Field name="email"
                   onChangeValidate={z.string().email("This must be an email")}
                   onSubmitValidate={isEmailUnique}>
                {({value, setValue, errors}) => {
                    return <div>
                        <input value={value} onChange={e => setValue(e.target.value)} placeholder={"Email"}/>
                        {errors.map(error => <p>{error}</p>)}
                    </div>
                }}
            </Field>
            <Field<string> name="password"
                           onChangeValidate={z.string().min(8, "Must be at least 8 characters long")}
            >
                {({value, setValue, errors}) => {
                    return <div>
                        <input value={value} onChange={e => setValue(e.target.value)} placeholder={"Password"} type="password"/>
                        {errors.map(error => <p>{error}</p>)}
                    </div>
                }}
            </Field>
            <Field<string> name="confirmpassword"
                           onChangeValidate={(val, form) => {
                               if (val === form.getFieldValue("password")!.value) {
                                   return Promise.resolve(true);
                               } else {
                                   return Promise.reject("Passwords must match");
                               }
                           }}
            >
                {({value, setValue, errors}) => {
                    return <div>
                        <input value={value} onChange={e => setValue(e.target.value)} placeholder={"Password Confirmation"} type="password"/>
                        {errors.map(error => <p>{error}</p>)}
                    </div>
                }}
            </Field>
            <SubmitField>
                {({onSubmit, isValid}) => <button disabled={!isValid} onClick={onSubmit}>Submit</button>}
            </SubmitField>
        </Form>
    )
}
```