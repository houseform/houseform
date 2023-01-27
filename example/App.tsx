import {Field, Form, SubmitField} from "uniform";
import {z} from 'zod';

function isEmailUnique(val: string) {
    return new Promise<boolean>((resolve, reject) => {
        setTimeout(() => {
            const isUnique = !val.startsWith("crutchcorn");
            if (isUnique) {
                resolve(true);
            } else {
                reject("That email is already taken");
            }
        }, 20)
    })
}

function App() {
    return (
        <Form onSubmit={(values) => {
            alert("Form was submitted with: " + JSON.stringify(values));
        }}>
            <Field name="email"
                   onChangeValidate={z.string().email("This must be an email")}
                   onSubmitValidate={isEmailUnique}>
                {({value, onChange, errors}) => {
                    return <div>
                        <input value={value} onChange={e => onChange(e.target.value)} placeholder={"Email"}/>
                        {errors.map(error => <p>{error}</p>)}
                    </div>
                }}
            </Field>
            <Field<string> name="password"
                           onChangeValidate={z.string().min(8, "Must be at least 8 characters long")}
            >
                {({value, onChange, errors}) => {
                    return <div>
                        <input value={value} onChange={e => onChange(e.target.value)} placeholder={"Password"} type="password"/>
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
                {({value, onChange, errors}) => {
                    return <div>
                        <input value={value} onChange={e => onChange(e.target.value)} placeholder={"Password Confirmation"} type="password"/>
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

export default App
