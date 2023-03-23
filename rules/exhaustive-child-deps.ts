import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://hi.joshuakgoldberg.com`
);

export const rule = createRule({
  create(context) {
    return {
      JSXElement(node) {
        if (
          node.openingElement.name.type === "JSXIdentifier" &&
          node.openingElement.name.name === "Form"
        ) {
          if (
            node.children.some(
              (childNode) =>
                childNode.type === "JSXElement" &&
                childNode.openingElement.name.type === "JSXIdentifier" &&
                childNode.openingElement.name.name === "p"
            )
          ) {
            context.report({
              messageId: "incorrectField",
              node: node,
            });
          }
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
      incorrectField: "Start this name with an upper-case letter.",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
});
