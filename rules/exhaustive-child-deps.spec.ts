import { describe, test } from "vitest";

import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "./exhaustive-child-deps";

describe("ESLint", () => {
  test("Tests rules", () => {
    const ruleTester = new ESLintUtils.RuleTester({
      parser: "@typescript-eslint/parser",
      parserOptions: { ecmaFeatures: { jsx: true } },
    });

    ruleTester.run("exhaustive-child-deps", rule, {
      valid: [
        `
        <Form>
          <div></div>
        </Form>
      `,
        "<div><div></div></div>",
      ],
      invalid: [
        {
          code: `
            <Form>
              <p></p>
            </Form>
          `,
          errors: [
            {
              messageId: "incorrectField",
            },
          ],
        },
      ],
    });
  });
});
