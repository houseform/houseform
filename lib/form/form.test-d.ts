import { FieldArrayInstance, FieldInstance, Form, ErrorsMap } from "houseform";
import { assertType } from "vitest";
import { ComponentProps } from "react";

interface TestObject {
  test: 1;
  other: {
    hello: {
      world: 2;
    };
  };
}

const specificErrorMap = 0 as unknown as ErrorsMap<TestObject>;
const defaultErrorMap = 0 as unknown as ErrorsMap;

assertType<string[]>(specificErrorMap.other.hello.world);
assertType<string[]>(specificErrorMap.test);
assertType<string[]>(defaultErrorMap.other);
assertType<string[]>(defaultErrorMap.one);

const FormProps = 0 as unknown as ComponentProps<typeof Form<TestObject>>;

const onSubmit = FormProps["onSubmit"];

const onSubmitValues = 0 as unknown as Parameters<
  Exclude<typeof onSubmit, undefined>
>[0];

const FormChildrenProps = 0 as unknown as Parameters<
  (typeof FormProps)["children"]
>[0];

const getFieldValue = FormChildrenProps["getFieldValue"];

assertType<TestObject>(onSubmitValues);
assertType<TestObject>(onSubmitValues);

/**
 * Recognized dot-notation string is treated as a typed instance
 */
assertType<FieldInstance<1> | FieldArrayInstance<1> | undefined>(
  getFieldValue("test")
);
assertType<FieldInstance<2> | FieldArrayInstance<2> | undefined>(
  getFieldValue("other.hello.world")
);

/**
 * Unrecognized string is treated as any instance
 */
assertType<FieldInstance | FieldArrayInstance | undefined>(
  getFieldValue(`other["hello"].world`)
);
