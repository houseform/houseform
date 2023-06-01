import { describe, bench } from "vitest";

import React from "react";
import { Field, Form } from "houseform";
import { cleanup, findByTestId, render } from "@testing-library/react";
import { Formik, Field as FormikField } from "formik";
import { FieldProps } from "formik/dist/Field";
import { Controller, useForm } from "react-hook-form";

const arr = Array.from({ length: 1000 }, (_, i) => i);

function HouseFormInitialRenderBenchmark() {
  return (
    <Form>
      {() => (
        <>
          {arr.map((num, i) => {
            return (
              <Field<number> key={i} name={`num[${i}]`} initialValue={num}>
                {({ value, onBlur, setValue }) => {
                  return (
                    <input
                      data-testid={num}
                      value={value}
                      onBlur={onBlur}
                      onChange={(e) => setValue(e.target.valueAsNumber)}
                    />
                  );
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
                return (
                  <input
                    data-testid={num}
                    value={field.value}
                    name={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                );
              }}
            </FormikField>
          ))}
        </>
      )}
    </Formik>
  );
}

function ReactHookFormHeadlessInitialRenderBenchmark() {
  const { control } = useForm({
    defaultValues: {
      num: arr,
    },
  });

  return (
    <>
      {arr.map((num, i) => {
        return (
          <Controller
            key={i}
            control={control}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <input
                ref={ref}
                data-testid={num}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
            name={`num.${i}`}
          />
        );
      })}
    </>
  );
}

function ReactHookFormInitialRenderBenchmark() {
  const { register } = useForm({
    defaultValues: {
      num: arr,
    },
  });

  return (
    <>
      {arr.map((num, i) => (
        <input data-testid={num} key={i} {...register(`num.${i}`)} />
      ))}
    </>
  );
}

describe("Renders 1,000 form items", () => {
  bench(
    "HouseForm",
    async () => {
      const { findByTestId } = render(<HouseFormInitialRenderBenchmark />);

      await findByTestId("999");
    },
    {
      setup(task) {
        task.opts.beforeEach = () => {
          cleanup();
        };
      },
    }
  );

  bench(
    "Formik",
    async () => {
      const { findByTestId } = render(<FormikInitialRenderBenchmark />);

      await findByTestId("999");
    },
    {
      setup(task) {
        task.opts.beforeEach = () => {
          cleanup();
        };
      },
    }
  );

  bench(
    "React Hook Form",
    async () => {
      const { findByTestId } = render(<ReactHookFormInitialRenderBenchmark />);

      await findByTestId("999");
    },
    {
      setup(task) {
        task.opts.beforeEach = () => {
          cleanup();
        };
      },
    }
  );

  bench(
    "React Hook Form (Headless)",
    async () => {
      const { findByTestId } = render(
        <ReactHookFormHeadlessInitialRenderBenchmark />
      );

      await findByTestId("999");
    },
    {
      setup(task) {
        task.opts.beforeEach = () => {
          cleanup();
        };
      },
    }
  );
});
