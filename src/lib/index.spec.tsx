// @vitest-environment jsdom
import {expect, test} from "vitest";
import {render} from "@testing-library/react";
import {Form} from "./index";

import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

test("Form should render children", () => {
        const {getByText} = render(<Form onSubmit={(_) => {
        }}>
            <div>Test</div>
        </Form>)

        expect(getByText("Test")).toBeInTheDocument();
})