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

function HouseFormOnChangeBenchmark() {
  return (
    <Form>
      {({ submit }) => (
        <>
          <button onClick={submit}>Submit</button>

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

describe("Validates onChange on 1,000 form items", () => {
  bench("HouseForm", async () => {
    cleanup();

    const { getByTestId, findByText, queryByText } = render(
      <HouseFormOnChangeBenchmark />
    );

    if (queryByText("Must be at least three")) {
      throw "Should not be present yet";
    }

    fireEvent.change(getByTestId("value1"), { target: { value: 0 } });

    await findByText("Must be at least three");
  });
});
