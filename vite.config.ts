import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: resolve(__dirname, "./lib"),
    }),
  ],
  resolve: {
    alias: {
      houseform: resolve(__dirname, "./lib"),
      "react-native": "react-native-web",
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "HouseForm",
      fileName: "houseform",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "zod"],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
          zod: "zod",
        },
      },
    },
  },
});
