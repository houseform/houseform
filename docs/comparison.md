---
head:
  - - meta
    - property: og:title
      content: Compare HouseForm to Other Libs
  - - meta
    - property: og:description
      content: Compare HouseForm to other form libraries such as Formik and React Hook Form.
---

# Comparison Against Other Form Libraries

We know that we're not the only choice in the React ecosystem for form validation libraries. Let's compare HouseForm to some of the other popular libraries.

## HouseForm vs. [Formik](https://formik.org/)

- **HouseForm is lightweight:** [Formik is 68.3 kB without GZIP](https://unpkg.com/browse/formik@latest/dist/formik.esm.js). Meanwhile, [HouseForm is 9.54 kb without GZIP](https://unpkg.com/browse/houseform@latest/dist/houseform.umd.cjs)*.
- **HouseForm uses Zod:** Formik primarily uses [Yup](https://github.com/jquense/yup) to do validation, HouseForm relies more heavily on [Zod](https://github.com/colinhacks/zod) to do its validation.
                          While Yup is more popular, Zod generally has stricter TypeScript types and is well-loved by many React developers.
- **HouseForm is field-focused:** Formik requires you to pass [a `validationSchema` property](https://formik.org/docs/api/withFormik#validationschema-schema--props-props--schema) to validate the whole form with Yup. HouseForm, on the other hand, allows you to validate each field individually [using inline properties associated with the field itself](/reference#field-props).
- **HouseForm is flexible:** While [Formik forces you to choose between `onChange`, `onSubmit`, and `onMount` validation](https://formik.org/docs/api/withFormik#validateonblur-boolean), HouseForm allows you to choose which validation to use for each field.
- **HouseForm is being actively maintained:** As of this writing, [Formik has not seen a package publish in nearly 3 years](https://www.npmjs.com/package/formik), despite [many open community PRs](https://github.com/jaredpalmer/formik/pulls).
                                              There doesn't appear to be a clear community-led fork of Formik to help supplement this, either. HouseForm, on the other hand, is being actively maintained and is actively used in production today.
- **Formik is fast:** It's worth mentioning that HouseForm is not yet as performant as Formik. In general, [our benchmarks](https://github.com/crutchcorn/houseform/tree/main/lib/benchmarks) show that Formik is ~2x faster at most operations when rendering 1,000 form fields. 
                      However, HouseForm is still fast enough for most use cases. In those same benchmarks we're able to do an initial render of those 1,000 fields in ~100ms.
- **Formik is popular:** As of time of writing, [Formik has 2 million downloads a week](https://www.npmjs.com/package/formik). HouseForm, on the other hand, is still new and therefore doesn't have the same foothold in the industry.

## HouseForm vs. [React Hook Form](https://react-hook-form.com/)

- **HouseForm is lightweight:** [React Hook Form is 87.7 kb without GZIP](https://unpkg.com/browse/react-hook-form@latest/dist/index.esm.mjs). Meanwhile, [HouseForm is 9.54 kb without GZIP](https://unpkg.com/browse/houseform@latest/dist/houseform.umd.cjs)*.
- **HouseForm uses controlled components:** React Hook Form uses [uncontrolled components](https://beta.reactjs.org/learn/sharing-state-between-components#controlled-and-uncontrolled-components) to handle form state, while HouseForm uses controlled components. This allows HouseForm more control over field state, re-renders, and validation.
- **HouseForm allows for per-field validation with Zod:** While [React Hook Form supports some form of per-field validation](https://react-hook-form.com/get-started#Applyvalidation) it only support built-in validation provided by the DOM. [To use more complex validation with React Hook Form, you need to use a form schema.](https://react-hook-form.com/get-started#SchemaValidation) HouseForm, on the other hand, allows you to use [Zod](https://github.com/colinhacks/zod) right inline with your field definitions.
- **HouseForm has first-class support for React Native:** While [React Hook Form has some support for React Native](https://react-hook-form.com/get-started#ReactNative), it uses a different API than the web version. HouseForm, on the other hand, has a [the same API for React Native as it does the web version](/guides/react-native).
- **React Hook Form is popular:** As of time of writing, [React Hook Form has 3 million downloads a week](https://www.npmjs.com/package/react-hook-form). HouseForm, on the other hand, is still new and therefore doesn't have the same foothold in the industry.

> We've yet to run benchmarks comparing HouseForm to React Hook Form. 
> While we're fairly sure that React Hook Form is more performant than HouseForm, it's unclear by how much.
> 
> If you'd like to help us with this, please [open an issue](https://github.com/crutchcorn/houseform/issues/new).

----

> \* Sizes of bundles were taken in February 2023 and are subject to change as time goes on.

----

> Want to expand this section? [Open an issue with more details](https://github.com/crutchcorn/houseform/issues/new).
