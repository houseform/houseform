import { describe, bench } from "vitest";

import { Field, Form } from "houseform";
import { z } from "zod";
import {
  cleanup,
  fireEvent,
  getByTestId,
  render,
} from "@testing-library/react";
import { Formik, Field as FormikField } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FieldProps } from "formik/dist/Field";
import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const arr = Array.from({ length: 1000 }, (_, i) => i);

function HouseFormOnMountBenchmark() {
  return (
    <Form>
      {() => (
        <>
          {arr.map((num, i) => {
            return (
              <Field
                key={i}
                name={`num[${i}]`}
                initialValue={num}
                onMountValidate={z.number().min(3, "Must be at least three")}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <div>
                      <input
                        data-testid={`value${i}`}
                        type="number"
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => setValue(e.target.valueAsNumber)}
                        placeholder={`Number ${i}`}
                      />
                      {errors.map((error) => (
                        <p key={error}>{error}</p>
                      ))}
                    </div>
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

function FormikOnMountBenchmark() {
  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={true}
      initialValues={{
        num: arr,
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          num: z.array(z.number().min(3, "Must be at least three")),
        })
      )}
      onSubmit={() => {}}
    >
      {() => (
        <>
          {arr.map((num, i) => (
            <FormikField key={i} name={`num[${i}]`} data-testid={`value${i}`}>
              {(props: FieldProps) => (
                <div>
                  <input
                    data-testid={`value${i}`}
                    type="number"
                    name={props.field.name}
                    value={props.field.value}
                    onBlur={props.field.onBlur}
                    onChange={props.field.onChange}
                    placeholder={`Number ${i}`}
                  />
                  {props.meta.error}
                </div>
              )}
            </FormikField>
          ))}
        </>
      )}
    </Formik>
  );
}

describe("Validates onMount on 1,000 form items", () => {
  bench(
    "HouseForm",
    async () => {
      const { findAllByText } = render(<HouseFormOnMountBenchmark />);

      await findAllByText("Must be at least three");
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
      const { findAllByText } = render(<FormikOnMountBenchmark />);

      await findAllByText("Must be at least three");
    },
    {
      setup(task) {
        task.opts.beforeEach = () => {
          cleanup();
        };
      },
    }
  );

  // Does not support this feature
  bench.todo("React Hook Form");
  bench.todo("React Hook Form (Headless)");
});
