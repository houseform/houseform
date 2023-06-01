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
import { ErrorMessage } from "@hookform/error-message";

const arr = Array.from({ length: 1000 }, (_, i) => i);

function HouseFormOnSubmitBenchmark() {
  return (
    <Form>
      {({ submit }) => (
        <>
          {arr.map((num, i) => {
            return (
              <Field
                key={i}
                name={`num[${i}]`}
                initialValue={num}
                onSubmitValidate={z.number().min(3, "Must be at least three")}
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
          <button onClick={submit}>Submit</button>
        </>
      )}
    </Form>
  );
}

function FormikOnSubmitBenchmark() {
  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
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
      {({ submitForm }) => (
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
          <button onClick={submitForm}>Submit</button>
        </>
      )}
    </Formik>
  );
}

function ReactHookFormOnSubmitBenchmark() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      num: arr,
    },
    mode: "onSubmit",
    resolver: zodResolver(
      z.object({
        num: z.array(z.number().min(3, "Must be at least three")),
      })
    ),
  });

  return (
    <>
      {arr.map((num, i) => {
        return (
          <div key={i}>
            <input
              {...register(`num.${i}`)}
              data-testid={`value${i}`}
              type="number"
              placeholder={`Number ${i}`}
            />
            <ErrorMessage errors={errors} name={`num.${i}`} />
          </div>
        );
      })}
      <button onClick={handleSubmit(() => {})}>Submit</button>
    </>
  );
}

function ReactHookFormHeadlessOnSubmitBenchmark() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      num: arr,
    },
    mode: "onSubmit",
    resolver: zodResolver(
      z.object({
        num: z.array(z.number().min(3, "Must be at least three")),
      })
    ),
  });

  return (
    <>
      {arr.map((num, i) => {
        return (
          <Controller
            key={i}
            control={control}
            render={({
              field: { value, onBlur, onChange },
              fieldState: { error },
            }) => {
              return (
                <div>
                  <input
                    data-testid={`value${i}`}
                    type="number"
                    value={value}
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.valueAsNumber)}
                    placeholder={`Number ${i}`}
                  />
                  {error && <p>{error.message}</p>}
                </div>
              );
            }}
            name={`num.${i}`}
          />
        );
      })}
      <button onClick={handleSubmit(() => {})}>Submit</button>
    </>
  );
}

describe("Validates onSubmit on 1,000 form items", () => {
  bench(
    "HouseForm",
    async () => {
      const { getByText, findAllByText, queryAllByText } = render(
        <HouseFormOnSubmitBenchmark />
      );

      if (queryAllByText("Must be at least three")?.length) {
        throw "Should not be present yet";
      }

      fireEvent.click(getByText("Submit"));

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
      const { getByText, findAllByText, queryAllByText } = render(
        <FormikOnSubmitBenchmark />
      );

      if (queryAllByText("Must be at least three")?.length) {
        throw "Should not be present yet";
      }

      fireEvent.click(getByText("Submit"));

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
    "React Hook Form",
    async () => {
      const { getByText, findAllByText, queryAllByText } = render(
        <ReactHookFormOnSubmitBenchmark />
      );

      if (queryAllByText("Must be at least three")?.length) {
        throw "Should not be present yet";
      }

      fireEvent.click(getByText("Submit"));

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
    "React Hook Form (Headless)",
    async () => {
      const { getByText, findAllByText, queryAllByText } = render(
        <ReactHookFormHeadlessOnSubmitBenchmark />
      );

      if (queryAllByText("Must be at least three")?.length) {
        throw "Should not be present yet";
      }

      fireEvent.click(getByText("Submit"));

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
});
