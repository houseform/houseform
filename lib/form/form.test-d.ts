import { Form } from "houseform";
import { assertType } from "vitest";
import { ComponentProps } from "react";

interface TestObject {
  test: 1;
}

const FormProps = 0 as unknown as ComponentProps<typeof Form<TestObject>>;

const onSubmit = FormProps["onSubmit"];

const onSubmitValues = 0 as unknown as Parameters<
  Exclude<typeof onSubmit, undefined>
>[0];

assertType<TestObject>(onSubmitValues);
assertType<TestObject>(onSubmitValues);
