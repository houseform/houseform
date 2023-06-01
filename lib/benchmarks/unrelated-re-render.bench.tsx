import { describe, bench } from "vitest";

import { Field, Form } from "houseform";
import {
  cleanup,
  findByTestId,
  fireEvent,
  render,
} from "@testing-library/react";
import { Formik, FastField as FormikFastField } from "formik";
import { FieldProps } from "formik/dist/Field";
import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";

const arr = Array.from({ length: 1000 }, (_, i) => i);

function HouseFormReRenderBenchmark() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((v) => v + 1)}>Add</button>
      <Form memoChild={[]}>
        {() => (
          <>
            {arr.map((num, i) => {
              return (
                <Field<number>
                  memoChild={[]}
                  key={i}
                  name={`num[${i}]`}
                  initialValue={num}
                >
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
    </div>
  );
}

function FormikReRenderBenchmark() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((v) => v + 1)}>Add</button>

      <Formik
        initialValues={{
          num: arr,
        }}
        onSubmit={(values) => {}}
      >
        {() => (
          <>
            {arr.map((num, i) => (
              <FormikFastField key={i} name={`num[${i}]`}>
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
              </FormikFastField>
            ))}
          </>
        )}
      </Formik>
    </div>
  );
}

function ReactHookFormHeadlessReRenderBenchmark() {
  const [count, setCount] = useState(0);
  const { control } = useForm({
    defaultValues: {
      num: arr,
    },
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((v) => v + 1)}>Add</button>

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
    </div>
  );
}

function ReactHookFormReRenderBenchmark() {
  const [count, setCount] = useState(0);
  const { register } = useForm({
    defaultValues: {
      num: arr,
    },
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((v) => v + 1)}>Add</button>

      {arr.map((num, i) => (
        <input data-testid={num} key={i} {...register(`num.${i}`)} />
      ))}
    </div>
  );
}

describe("Renders unrelated data in large forms", () => {
  bench(
    "HouseForm",
    async function (this) {
      const { findByTestId, findByText } = render(
        <HouseFormReRenderBenchmark />
      );

      await findByTestId("999");
      await findByText("Count: 0");
      fireEvent.click(await findByText("Add"));

      await findByText("Count: 1");
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
      const { findByTestId, findByText } = render(<FormikReRenderBenchmark />);

      await findByTestId("999");
      await findByText("Count: 0");
      fireEvent.click(await findByText("Add"));

      await findByText("Count: 1");
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
      const { findByTestId, findByText } = render(
        <ReactHookFormReRenderBenchmark />
      );

      await findByTestId("999");
      await findByText("Count: 0");
      fireEvent.click(await findByText("Add"));

      await findByText("Count: 1");
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
      const { findByTestId, findByText } = render(
        <ReactHookFormHeadlessReRenderBenchmark />
      );

      await findByTestId("999");
      await findByText("Count: 0");
      fireEvent.click(await findByText("Add"));

      await findByText("Count: 1");
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
