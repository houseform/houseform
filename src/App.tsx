import {Field, Form, SubmitField} from "./lib";
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
        <Form onSubmit={(values: any) => {
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
            <SubmitField>
                {({onSubmit, isValid}) => <button disabled={!isValid} onClick={onSubmit}>Submit</button>}
            </SubmitField>
        </Form>
    )
}

export default App
