import { describe, bench } from "vitest";

import { Field, Form } from "houseform";
import { useState } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";

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
              <Field key={i} name={`num[${i}]`} initialValue={num}>
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

describe("Submits 1,000 form items", () => {
  bench("Houseform", async () => {
    cleanup();

    const { getByText, findByText } = render(
      <HouseFormOnSubmitBenchmark />
    );

    fireEvent.click(getByText("Submit"));

    await findByText("Value:");
  });
});
