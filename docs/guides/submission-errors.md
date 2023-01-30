# Set an Error from Form Submit Function

> This section is still being written.

<!-- onSubmit={(_, form) => form.getFieldValue('fieldName').setError} -->

There are many times where you need to run validation on a submit. While HouseForm supports per-field submission validation using `onSubmitValidate` property, sometimes there's just no alternative to running validation in the `onSubmit` function.

But, in order to validate a form properly inside of the `onSubmit` function, you need a way to set errors on fields. The way to do this is by using the `getFieldValue` method on the `onSubmit`'s second passed argument, like so:

```jsx
<Form
    onSubmit={(values, form) => {
    	form.getFieldValue("fieldName")?.setErrors(["This is an error"]);
    }}
>

// ...

</Form>
```

This will cause the respective `Field` to re-render with the appropriate errors.