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

## Basic `<Field>` usage

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

## Getting a form's value on submission

Now that we have a field, we can update our `<Form>`'s `onSubmit` function to show an `alert` when the form is submitted:

```jsx {2}
const App = () => (
    <Form onSubmit={(values) => alert(values)}>
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

This `values` object will represent the fields within the form. For example, when submitting this form, you'll see:

```javascript
{username: "User input here"}
```

If you had a second `<Field>` component rendered with `name="email"` you would see:

```javascript
{username: "User input here", email: "User input here"}
```

## Adding field validation



## Usage with HTML forms

> This section is still being written.

<!-- Wrap in `form` -->

## Usage with React Native

> This section is still being written.

<!-- No change -->

## How to link two elements together

> This section is still being written.

<!-- listenTo={[""]} -->

## Set an error from form submit function

> This section is still being written.

<!-- onSubmit={(_, form) => form.getFieldValue('fieldName').setError} -->