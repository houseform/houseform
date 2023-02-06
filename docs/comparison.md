---
head:
  - - meta
    - property: og:title
      content: Compare HouseForm to Other Libs
  - - meta
    - property: og:description
      content: Compare HouseForm to other form libraries such as Formik, React Hook Form, and React Final Form.
---

# Comparison Against Other Form Libraries

> This section is still being written.

## HouseForm vs. [Formik](https://formik.org/)

- **HouseForm is Lightweight:** [Formik is 68.3 kB without GZIP](https://unpkg.com/browse/formik@latest/dist/formik.esm.js). Meanwhile, [HouseForm is 9.54 kb without GZIP](https://unpkg.com/browse/houseform@latest/dist/houseform.umd.cjs)*.
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

> This section is still being written.

- **HouseForm is Lightweight:** [React Hook Form is 87.7 kb without GZIP](https://unpkg.com/browse/react-hook-form@latest/dist/index.esm.mjs). Meanwhile, [HouseForm is 9.54 kb without GZIP](https://unpkg.com/browse/houseform@latest/dist/houseform.umd.cjs)*.

<!-- Controlled vs. Uncontrolled -->

## HouseForm vs. [React Final Form](https://github.com/final-form/react-final-form)

> This section is still being written.

- **HouseForm is Lightweight:** [React Final Form is 24 kb without GZIP](https://unpkg.com/browse/react-final-form@latest/dist/react-final-form.es.js) and relies on [a 47.6 kb base package](https://unpkg.com/browse/final-form@latest/dist/final-form.es.js) for *a total non-GZIP bundle size of 71.6 kb*. Meanwhile, [HouseForm is 9.54 kb without GZIP](https://unpkg.com/browse/houseform@latest/dist/houseform.umd.cjs)*.



----

> \* Sizes of bundles were taken in February 2023 and are subject to change as time goes on.
