import { describe, bench } from "vitest";

import { Field, Form } from "houseform";
import { cleanup, render } from "@testing-library/react";
import { Formik, Field as FormikField } from "formik";
import { FieldProps } from "formik/dist/Field";

const arr = Array.from({ length: 1000 }, (_, i) => i);

function HouseFormInitialRenderBenchmark() {
  return (
    <Form>
      {() => (
        <>
          {arr.map((num, i) => {
            return (
              <Field key={i} name={`num[${i}]`} initialValue={num}>
                {({ value }) => {
                  return <p>{value}</p>;
                }}
              </Field>
            );
          })}
        </>
      )}
    </Form>
  );
}

function FormikInitialRenderBenchmark() {
  return (
    <Formik
      initialValues={{
        num: arr,
      }}
      onSubmit={(values) => {}}
    >
      {() => (
        <>
          {arr.map((num, i) => (
            <FormikField key={i} name={`num[${i}]`}>
              {({ field }: FieldProps) => {
                return <p>{field.value}</p>;
              }}
            </FormikField>
          ))}
        </>
      )}
    </Formik>
  );
}

describe("Renders 1,000 form items", () => {
  bench("Houseform", async () => {
    cleanup();

    const { findByText } = render(<HouseFormInitialRenderBenchmark />);

    await findByText("999");
  });

  bench("Formik", async () => {
    cleanup();

    const { findByText } = render(<FormikInitialRenderBenchmark />);

    await findByText("999");
  });
});
