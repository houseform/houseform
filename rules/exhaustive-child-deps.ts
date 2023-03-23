import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://hi.joshuakgoldberg.com`
);

export const rule = createRule({
  create(context) {
    return {
      JSXElement(node) {
        /**
         * TODO:
         *  1) Support `Field`, `FieldArray`, `FieldArrayItem`
         *  2) Support aliasing of component names (e.g. `import { Form as MyForm } from "houseform"`)
         *
         *  Josh Goldberg: "Solve #2 via type checking API to check if the component is a Form component"
         *  @see https://typescript-eslint.io/custom-rules#typed-rules
         *  @see https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker
         */
        if (
          node.openingElement.name.type !== "JSXIdentifier" ||
          node.openingElement.name.name !== "Form" ||
          node.openingElement.attributes.length === 0
        ) {
          return;
        }

        const memoChildAttr = node.openingElement.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === "JSXAttribute" && attr.name.name === "memoChild"
        );

        // Only support `memoChild={[]}`
        if (
          !memoChildAttr ||
          !memoChildAttr.value ||
          memoChildAttr.value.type !== "JSXExpressionContainer" ||
          memoChildAttr.value.expression.type !== "ArrayExpression"
        ) {
          return;
        }

        const childFnNode = node.children.find(
          (childNode): childNode is TSESTree.JSXExpressionContainer =>
            childNode.type === "JSXExpressionContainer"
        );

        if (
          !childFnNode ||
          // TODO: Support `function() {}` declarations (?)
          childFnNode.expression.type !== "ArrowFunctionExpression"
        ) {
          // TODO: Break this logic out to its own rule
          context.report({
            messageId: "missingChildFn",
            node: node,
          });
          return;
        }

        if (childFnNode.expression.body.type !== "Literal") {
          return;
        }

        if (childFnNode.expression.body.value === "Test") {
          context.report({
            messageId: "exhaustiveChildDeps",
            node: node,
          });
        }
      },
    };
  },
  name: "exhaustive-child-deps",
  meta: {
    docs: {
      description:
        "Function declaration names should start with an upper-case letter.",
      recommended: "warn",
    },
    messages: {
      missingChildFn: "You are missing a child function",
      exhaustiveChildDeps: "You are missing deps in the memoChild field",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
});
