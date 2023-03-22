import { describe, test } from "vitest";

import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "./exhaustive-child-deps";

describe("ESLint", () => {
  test("Tests rules", () => {
    const ruleTester = new ESLintUtils.RuleTester({
      parser: "@typescript-eslint/parser",
    });

    ruleTester.run("exhaustive-child-deps", rule, {
      valid: [`function HELLO() {}`],
      invalid: [
        {
          code: `
            function test() {}
          `,
          errors: [
            {
              messageId: "uppercase",
            },
          ],
        },
      ],
    });
  });
});
