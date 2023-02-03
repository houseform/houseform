import { describe, bench, afterEach } from "vitest";

import { Field, Form } from "houseform";
import { z } from "zod";
import { useState } from "react";
import {
  cleanup,
  fireEvent,
  getByTestId,
  render,
} from "@testing-library/react";

const arr = Array.from({ length: 1000 }, (_, i) => i);

function Benchmark({ disableValidation }: { disableValidation: boolean }) {
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
    <Form
      onSubmit={(values) => {
        setVal(values);
      }}
    >
      {({ submit }) => (
        <>
          <button onClick={submit}>Submit</button>

          {arr.map((num, i) => {
            return (
              <Field
                key={i}
                name={`num[${i}]`}
                initialValue={num}
                onChangeValidate={
                  disableValidation
                    ? undefined
                    : z.number().min(3, "Must be at least three")
                }
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <div>
                      <input
                        data-testid={`value${i}`}
                        type="number"
                        value={`${value}`}
                        onBlur={onBlur}
                        onChange={(e) => setValue(Number(e.target.value))}
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

describe("Houseform", () => {
  bench("Submits 1,000 form items", async () => {
    cleanup();

    const { getByText, findByText } = render(
      <Benchmark disableValidation={true} />
    );

    fireEvent.click(getByText("Submit"));

    await findByText("Value:");
  });

  bench("Validates onChange on 1,000 form items", async () => {
    cleanup();

    const { getByTestId, findByText, queryByText } = render(
      <Benchmark disableValidation={false} />
    );

    if (queryByText("Must be at least three")) {
      throw "Should not be present yet";
    }

    fireEvent.change(getByTestId("value1"), { target: { value: 0 } });

    await findByText("Must be at least three");
  });
});
