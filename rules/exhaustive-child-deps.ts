import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://hi.joshuakgoldberg.com`
);

export const rule = createRule({
  create(context) {
    return {
      JSXElement(node) {
        if (
          node.openingElement.name.type !== "JSXIdentifier" ||
          node.openingElement.name.name !== "Form"
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
