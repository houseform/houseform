import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { FunctionScope } from "@typescript-eslint/scope-manager";

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
          return;
        }

        const scope = context.getScope();

        // I'm sorry for the `as never` :(
        const innerFnScope = scope.childScopes[0] as never as FunctionScope;

        const innerVariableNames = innerFnScope.through.map(
          (reference) => reference.identifier.name
        );

        /**
         * TODO: Don't assume all elements are `Identifier`s,
         *  they could be spread elements, etc.
         *
         *  Cross-reference with Rules of React Hooks' exhaustive-deps rule
         */
        const memoChildVariableNames =
          memoChildAttr.value.expression.elements.map(
            (element) => (element as TSESTree.Identifier).name
          );

        if (
          innerVariableNames.every((name) =>
            memoChildVariableNames.includes(name)
          )
        ) {
          return;
        }

        context.report({
          messageId: "exhaustiveChildDeps",
          node: memoChildAttr,
        });
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
      exhaustiveChildDeps: "You are missing deps in the memoChild field",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
});
