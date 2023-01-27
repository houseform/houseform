import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ['./config/setup-tests.ts'],
        environment: "jsdom"
    }
})