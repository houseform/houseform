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

We wrote a long-form explanation explaining why we build HouseForm and are using it over other form libraries here:

[Formik Works Great; Here's Why I Wrote My Own](https://dev.to/crutchcorn/formik-works-great-heres-why-i-wrote-my-own-591m)

That said, here's a quick recap of why you might choose HouseForm over other React forms libraries.

## HouseForm vs. [Formik](https://formik.org/)

- **HouseForm is lightweight:** [Formik is 68.3kB unminified without GZIP](https://unpkg.com/browse/formik@latest/dist/formik.esm.js). Meanwhile, [HouseForm is 13.5kb unminified without GZIP](https://unpkg.com/browse/houseform@latest/dist/houseform.js)*.
- **HouseForm uses Zod:** Formik primarily uses [Yup](https://github.com/jquense/yup) to do validation, HouseForm relies more heavily on [Zod](https://github.com/colinhacks/zod) to do its validation.
                          While Yup is more popular, Zod generally has stricter TypeScript types and is well-loved by many React developers.
- **HouseForm is field-focused:** Formik requires you to pass [a `validationSchema` property](https://formik.org/docs/api/withFormik#validationschema-schema--props-props--schema) to validate the whole form with Yup. HouseForm, on the other hand, allows you to validate each field individually [using inline properties associated with the field itself](/reference/field#field-props).
- **HouseForm is flexible:** While [Formik forces you to choose between `onChange`, `onSubmit`, and `onMount` validation](https://formik.org/docs/api/withFormik#validateonblur-boolean), HouseForm allows you to choose which validation to use for each field.
- **HouseForm is actively maintained:** As of this writing, [Formik has not seen a package publish in nearly 3 years](https://www.npmjs.com/package/formik), despite [many open community PRs](https://github.com/jaredpalmer/formik/pulls).
                                              There doesn't appear to be a clear community-led fork of Formik to help supplement this, either. HouseForm, on the other hand, is being actively maintained and is actively used in production today.
- **Formik is fast:** It's worth mentioning that HouseForm is not yet as performant as Formik. In general, [our benchmarks](https://github.com/houseform/houseform/tree/main/lib/benchmarks) show that Formik is ~1.25x faster at most operations when rendering 1,000 form fields. 
                      However, HouseForm is still more than fast enough for most use cases. In those same benchmarks we're able to do an initial render of those 1,000 fields in ~80ms.
- **Formik is popular:** As of time of writing, [Formik has 2 million downloads a week](https://www.npmjs.com/package/formik). HouseForm, on the other hand, is still new and therefore doesn't have the same foothold in the industry.

## HouseForm vs. [React Hook Form](https://react-hook-form.com/)

- **HouseForm is lightweight:** [React Hook Form is 87.7kb unminified without GZIP](https://unpkg.com/browse/react-hook-form@latest/dist/index.esm.mjs). Meanwhile, [HouseForm is 13.5kb unminified without GZIP](https://unpkg.com/browse/houseform@latest/dist/houseform.js)*.
- **HouseForm uses controlled components:** React Hook Form uses [uncontrolled components](https://beta.reactjs.org/learn/sharing-state-between-components#controlled-and-uncontrolled-components) to handle form state, while HouseForm uses controlled components. This allows HouseForm more control over field state, re-renders, and validation.
- **HouseForm allows for per-field validation with Zod:** While [React Hook Form supports some form of per-field validation](https://react-hook-form.com/get-started#Applyvalidation) it only support built-in validation provided by the DOM. [To use more complex validation with React Hook Form, you need to use a form schema.](https://react-hook-form.com/get-started#SchemaValidation) HouseForm, on the other hand, allows you to use [Zod](https://github.com/colinhacks/zod) right inline with your field definitions.
- **HouseForm has first-class support for React Native:** While [React Hook Form has some support for React Native](https://react-hook-form.com/get-started#ReactNative), it uses a different API than the web version. HouseForm, on the other hand, has a [the same API for React Native as it does the web version](/guides/react-native).
- **HouseForm is faster in headless mode:** When comparing apples-to-apples by running React Hook Form in [headless mode](https://react-hook-form.com/get-started#ReactNative), [our benchmarks](https://github.com/houseform/houseform/tree/main/lib/benchmarks) show that HouseForm is ~1.25x to ~2x faster at most operations when rendering 1,000 form fields.
- **React Hook Form is popular:** As of time of writing, [React Hook Form has 3 million downloads a week](https://www.npmjs.com/package/react-hook-form). HouseForm, on the other hand, is still new and therefore doesn't have the same foothold in the industry.

## HouseForm vs. [React Final Form](https://final-form.org/react)

- **HouseForm is lightweight:** [React Final Form is 24kb unminified without GZIP](https://unpkg.com/browse/react-final-form@latest/dist/react-final-form.es.js) and relies on [a 47.6kb (when unminified and non-GZIP) base package](https://unpkg.com/browse/final-form@latest/dist/final-form.es.js) for *a total unminified non-GZIP bundle size of 71.6 kb*. Meanwhile, [HouseForm is 13.5kb unminified without GZIP](https://unpkg.com/browse/houseform@latest/dist/houseform.js)*.
- **HouseForm uses Zod:** While React Final Form requires you to use a manual function to do validation, HouseForm allows you to use [Zod](https://github.com/colinhacks/zod) to do validation. Zod allows you to use an easier API to define common validation types than manual functions.
- **HouseForm supports React Native:** [React Final Form appears not to have React Native support currently](https://github.com/final-form/react-final-form-hooks/issues/48). This differs from [HouseForm, which fully supports React Native](/guides/react-native).
- **HouseForm has a consistent API**: [There appear to be many different ways to define a field in React Final Form, per their docs](https://final-form.org/docs/react-final-form/getting-started). In HouseForm? There's a single consistent method of creating fields. Less of an API surface area to know, smaller surface area for bugs to occur.
- **HouseForm is actively maintained:** As of this writing, [React Final Form has only had 5 commits in the past two years](https://github.com/final-form/react-final-form/commits/main), despite [many open GitHub issues](https://github.com/final-form/react-final-form/issues). HouseForm, on the other hand, is being actively maintained and is actively used in production today.
- **Final Form is framework agnostic:** While HouseForm is only built for React, [React Final Form has a framework agnostic core called "Final Form"](https://final-form.org/). This means that you can build variants of Final Form for any framework, including Vue, Angular, and more.
- **React Final Form is more popular:** As of time of writing, [React Final Form has 300 thousand downloads a week](https://www.npmjs.com/package/react-final-form). HouseForm, on the other hand, is still new and therefore doesn't have the same foothold in the industry.

> We've yet to run benchmarks comparing HouseForm to React Final Form.
>
> If you'd like to help us with this, please [open an issue](https://github.com/houseform/houseform/issues/new).



----

> \* Sizes of bundles were taken in February 2023 and are subject to change as time goes on.

----

> Want to expand this section? [Open an issue with more details](https://github.com/houseform/houseform/issues/new).
