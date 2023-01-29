# Usage Guides

Every form in HouseForm starts with a `<Form>` component:

```jsx
import {Form} from 'houseform';

const App = () => (
    <Form onSubmit={() => {}}>
		{({submit}) => <button onClick={submit}>Submit</button>}
	</Form>
)
```

Within `Form`, there's a required `onSubmit` prop. This property should be a function that you want ran when the `submit` function is ran.

The child of a `Form` should be a function that returns a JSX element. This can be anything - a `div`, `Fragment`, or anything in between.

Once you have a `<Form>` established, you'll want to add a `<Field>` component.

```jsx
import {Form, Field} from 'houseform';

const App = () => (
    <Form onSubmit={() => {}}>
		{({submit}) => <div>
			<Field name="username" initialValue={""}>
                {({value, setValue, onBlur}) => (
                	<input value={value} onChange={e => setValue(e.target.value)} onBlur={onBlur}/>
                )}
             </Field>			
			<button onClick={submit}>Submit</button>
		</div>}
	</Form>
)
```

This is the most basic a form field can get within HouseForm. This field has:

- `name` - A string that can be used to lookup the field and handle the result value during form submission.
- `intialValue`.
- A child function.

Much like the parent `<Form>` component, the function of `Field` will render the contained `input` element without adding any UI elements. It is your responsibility to pass the appropriate fields to a given `input`. In this case, we're passing the three required fields to make a text input work:

- `value` - The current value of the field.
- `setValue` - A function used to update the current field value.
- `onBlur` - A function used to track internal logic pertaining to user input.

## Usage with HTML forms

> This section is still being written.

## Usage with React Native

> This section is still being written.

## How to link two elements together

> This section is still being written.

## Set an error from form submit function

> This section is still being written.