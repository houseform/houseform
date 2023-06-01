import { describe, bench } from "vitest";

import { Field, Form } from "houseform";
import React, { useState } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { Formik, Field as FormikField } from "formik";
import { Controller, useForm } from "react-hook-form";
import { FieldProps } from "formik/dist/Field";

const arr = Array.from({ length: 1000 }, (_, i) => i);

function HouseFormOnSubmitBenchmark() {
  const [val, setVal] = useState<Record<string, any> | null>(null);

  if (val) {
    return (
      <p>
        <span>Value:</span>
        {JSON.stringify(val)}
      </p>
    );
  }

  return (
    <Form<{ num: number[] }>
      onSubmit={(values) => {
        setVal(values);
      }}
    >
      {({ submit }) => (
        <>
          <button onClick={submit}>Submit</button>

          {arr.map((num, i) => {
            return (
              <Field key={i} name={`num[${i}]`} initialValue={num}>
                {({ value, onBlur, setValue }) => {
                  return (
                    <input
                      onBlur={onBlur}
                      onChange={(e) => setValue(e.target.valueAsNumber)}
                      value={value}
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

function FormikOnSubmitBenchmark() {
  const [val, setVal] = useState<Record<string, any> | null>(null);

  if (val) {
    return (
      <p>
        <span>Value:</span>
        {JSON.stringify(val)}
      </p>
    );
  }

  return (
    <Formik
      initialValues={{
        num: arr,
      }}
      onSubmit={(values) => {
        setVal(values);
      }}
    >
      {({ submitForm }) => (
        <>
          <button onClick={submitForm}>Submit</button>
          {arr.map((num, i) => (
            <FormikField key={i} name={`num[${i}]`}>
              {({ field }: FieldProps) => {
                return (
                  <input
                    name={field.name}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
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

function ReactHookFormOnSubmitBenchmark() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      num: arr,
    },
  });

  const [val, setVal] = useState<Record<string, any> | null>(null);

  if (val) {
    return (
      <p>
        <span>Value:</span>
        {JSON.stringify(val)}
      </p>
    );
  }

  return (
    <>
      <button onClick={handleSubmit((data) => setVal(data))}>Submit</button>

      {arr.map((num, i) => {
        return <input key={i} {...register(`num.${i}`)} />;
      })}
    </>
  );
}

function ReactHookFormHeadlessOnSubmitBenchmark() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      num: arr,
    },
  });

  const [val, setVal] = useState<Record<string, any> | null>(null);

  if (val) {
    return (
      <p>
        <span>Value:</span>
        {JSON.stringify(val)}
      </p>
    );
  }

  return (
    <>
      <button onClick={handleSubmit((data) => setVal(data))}>Submit</button>

      {arr.map((num, i) => {
        return (
          <Controller
            key={i}
            control={control}
            render={({ field: { value } }) => <p>{value}</p>}
            name={`num.${i}`}
          />
        );
      })}
    </>
  );
}

describe("Submits 1,000 form items", () => {
  bench(
    "HouseForm",
    async () => {
      const { getByText, findByText } = render(<HouseFormOnSubmitBenchmark />);

      fireEvent.click(getByText("Submit"));

      await findByText("Value:");
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
      const { getByText, findByText } = render(<FormikOnSubmitBenchmark />);

      fireEvent.click(getByText("Submit"));

      await findByText("Value:");
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
      const { getByText, findByText } = render(
        <ReactHookFormOnSubmitBenchmark />
      );

      fireEvent.click(getByText("Submit"));

      await findByText("Value:");
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
      const { getByText, findByText } = render(
        <ReactHookFormHeadlessOnSubmitBenchmark />
      );

      fireEvent.click(getByText("Submit"));

      await findByText("Value:");
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
