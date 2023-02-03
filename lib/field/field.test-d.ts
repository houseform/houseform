import { Field, FormInstance } from "houseform";
import { assertType } from "vitest";
import { ComponentProps } from "react";
import { ZodTypeAny } from "zod";

interface FormState {
  test: 1;
  other: {
    hello: {
      world: 2;
    };
  };
}

const FieldProps = 0 as unknown as ComponentProps<
  typeof Field<string, FormState>
>;

const onChangeValidate = FieldProps["onChangeValidate"];

const FieldInferredFormState = 0 as unknown as Parameters<
  Exclude<typeof onChangeValidate, ZodTypeAny | undefined>
>[1];

assertType<FormInstance<FormState>>(FieldInferredFormState);
