import { describe, bench } from "vitest";

import { Field, Form } from "houseform";
import { z } from "zod";
import {
  cleanup,
  fireEvent,
  getByTestId,
  render,
} from "@testing-library/react";
import { Formik, Form as FormikForm, Field as FormikField } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FieldProps } from "formik/dist/Field";

const arr = Array.from({ length: 1000 }, (_, i) => i);

function HouseFormOnChangeBenchmark() {
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
                onChangeValidate={z.number().min(3, "Must be at least three")}
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

function FormikOnChangeBenchmark() {
  return (
    <Formik
      validateOnChange={true}
      initialValues={{
        num: arr,
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          num: z.array(z.number().min(3, "Must be at least three")),
        })
      )}
      onSubmit={(values) => {}}
    >
      {({ errors, touched }) => (
        <>
          <FormikForm>
            {JSON.stringify(errors)}
            <button type="submit">Submit</button>
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
          </FormikForm>
        </>
      )}
    </Formik>
  );
}

describe("Validates onChange on 1,000 form items", () => {
  bench("HouseForm", async () => {
    cleanup();

    const { getByTestId, findAllByText, queryAllByText } = render(
      <HouseFormOnChangeBenchmark />
    );

    if (queryAllByText("Must be at least three")?.length) {
      throw "Should not be present yet";
    }

    fireEvent.change(getByTestId("value1"), { target: { value: 0 } });

    await findAllByText("Must be at least three");
  });

  bench("Formik", async () => {
    cleanup();

    const { getByTestId, findAllByText, queryAllByText } = render(
      <FormikOnChangeBenchmark />
    );

    if (queryAllByText("Must be at least three")?.length) {
      throw "Should not be present yet";
    }

    fireEvent.change(getByTestId("value1"), { target: { value: 0 } });

    await findAllByText("Must be at least three");
  });
});
