import { describe, test } from "vitest";

import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "./exhaustive-child-deps";

const ruleTester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaFeatures: { jsx: true } },
});

describe("ESLint - Exhaustive Child Deps", () => {
  test("Should not error on valid JSX", () => {
    ruleTester.run("exhaustive-child-deps", rule, {
      valid: [
        `
      <div></div>
      `,
      ],
      invalid: [],
    });
  });

  test("Form with no function body should not error", () => {
    ruleTester.run("exhaustive-child-deps", rule, {
      valid: [
        `
        <Form>
          <div></div>
        </Form>
      `,
      ],
      invalid: [],
    });
  });

  test("Form with no memoChild should not error", () => {
    // We're relying on the TypeScript compiler to catch this
    ruleTester.run("exhaustive-child-deps", rule, {
      valid: [
        `
      <Form>
        {() => <div></div>}
      </Form>
      `,
      ],
      invalid: [],
    });
  });

  test("Form with no function body but memoChild should not error", () => {
    // We're relying on the TypeScript compiler to catch this
    ruleTester.run("exhaustive-child-deps", rule, {
      valid: [
        `
        <Form memoChild={[]}>
          <div></div>
        </Form>
      `,
      ],
      invalid: [],
    });
  });

  test("Form with non-array memoChild should not error", () => {
    // We're relying on the TypeScript compiler to catch this
    ruleTester.run("exhaustive-child-deps", rule, {
      valid: [
        `
      <Form memoChild={"Test"}>
        {() => <div></div>}
      </Form>
      `,
      ],
      invalid: [],
    });
  });

  test("Form with empty memoChild and no through vars should not error", () => {
    ruleTester.run("exhaustive-child-deps", rule, {
      valid: [
        `
      <Form memoChild={[]}>
        {() => <div></div>}
      </Form>
      `,
      ],
      invalid: [],
    });
  });
});
