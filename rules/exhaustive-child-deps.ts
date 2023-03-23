/**
 * TODO: Match react-hooks/exhaustive-deps rules:
 *  1) Support data structures and sub-props like this:
 *   // `props` -> `props.foo` -> `props.foo.bar` -> `props.foo.bar.baz`
 *   //         -> `props.lol`
 *   //         -> `props.huh` -> `props.huh.okay`
 *   //         -> `props.wow`
 *  2) Ignore stable references
 *   // Next we'll define a few helpers that helps us
 *   // tell if some values don't have to be declared as deps.
 *   //
 *   // Some are known to be stable based on Hook calls.
 *   // const [state, setState] = useState() / React.useState()
 *   //               ^^^ true for this reference
 *   // const [state, dispatch] = useReducer() / React.useReducer()
 *   //               ^^^ true for this reference
 *   // const ref = useRef()
 *   //       ^^^ true for this reference
 *   // const onStuff = useEffectEvent(() => {})
 *   //       ^^^ true for this reference
 *   // False for everything else.
 *   //
 *   //
 *   // Some are just functions that don't reference anything dynamic.
 *  3) Warn about infinite loops
 *   // `React Hook ${reactiveHookName} contains a call to '${setStateInsideEffectWithoutDeps}'. ` +
 *   // `Without a list of dependencies, this can lead to an infinite chain of updates. ` +
 *   // `To fix this, pass [` +
 *   // suggestedDependencies.join(', ') +
 *   // `] as a second argument to the ${reactiveHookName} Hook.`,
 */
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
         * TODO: Warn about spreads:
         *  @see https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js#L643-L647
         *
         * TODO: Warn about literals:
         *  @see https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js#L681-L697
         *
         * Don't just assume Identifiers
         *  Cross-reference with Rules of React Hooks' exhaustive-deps rule
         *  @see https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js#L738-L749
         * @see https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js#L1325-L1333
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

        /**
         * TODO: Suggest a fix
         *  @see https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js#L842-L850
         *  @see https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js#L601-L613
         */
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
