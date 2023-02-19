import { defineConfig } from "vitepress";

const { description } = require("../../package.json");

export default defineConfig({
  title: "HouseForm",
  description: description,
  head: [
    ["meta", {property: "og:image", content: "https://houseform.dev/social-banner.png"}],
    ["meta", {property: "twitter:card", content: "summary_large_image"}],
  ],
  themeConfig: {
    logo: "/logo.svg",
    socialLinks: [
      { icon: "github", link: "https://github.com/crutchcorn/houseform" },
    ],
    nav: [
      { text: "Home", link: "/" },
      { text: "Reference", link: "/reference" },
      {
        text: "v1",
        items: [
          // Change to `Changelog` when we have one
          {
            text: "Releases",
            link: "https://github.com/crutchcorn/houseform/releases",
          },
          {
            text: "Contributing",
            link: "https://github.com/crutchcorn/houseform/blob/main/CONTRIBUTING.md",
          },
        ],
      },
    ],
    sidebar: [
      {
        text: "Docs",
        items: [
          {
            text: "Introduction",
            link: "/",
          },
          {
            text: "Comparison to X",
            link: "/comparison",
          },
          {
            text: "Usage Guides",
            collapsed: false,
            collapsible: true,
            items: [
              {
                text: "Basic Usage",
                link: "/guides/basic-usage",
              },
              {
                text: "HTML Forms",
                link: "/guides/html-forms",
              },
              {
                text: "React Native",
                link: "/guides/react-native",
              },
              {
                text: "UI Libraries",
                link: "/guides/ui-libraries",
              },
              {
                text: "Non-Text Inputs",
                link: "/guides/non-text-inputs",
              },
              {
                text: "Linked Fields",
                link: "/guides/linked-fields",
              },
              {
                text: "Nested Field Values",
                link: "/guides/nested-field-values",
              },
              {
                text: "Submission Errors",
                link: "/guides/submission-errors",
              },
              {
                text: "Access Data Externally",
                link: "/guides/access-data-externally",
              },
              {
                text: "Form Arrays",
                link: "/guides/arrays",
              },
              {
                text: "TypeScript",
                link: "/guides/typescript",
              },
            ],
          },
          {
            text: "API Reference",
            link: "/reference",
          },
        ],
      },
    ],
  },
});
