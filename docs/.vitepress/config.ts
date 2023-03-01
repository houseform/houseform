import { defineConfig } from "vitepress";

const { description } = require("../../package.json");

const ogImage = "https://houseform.dev/social-banner.png";

export default defineConfig({
  lang: "en-US",
  title: "HouseForm",
  description: description,
  lastUpdated: true,
  head: [
    ['meta', { property: 'og:image', content: ogImage }],
    ["meta", { name: "twitter:image", content: ogImage }],
    ["meta", { name: "theme-color", content: "#DBCAFF" }],
    ["meta", { property: "twitter:card", content: "summary_large_image" }],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    ["link", { rel: "mask-icon", href: "/logo.svg", color: "#ffffff" }],
  ],
  themeConfig: {
    logo: "/logo.svg",
    socialLinks: [
      { icon: "github", link: "https://github.com/crutchcorn/houseform" },
    ],
    editLink: {
      pattern: 'https://github.com/crutchcorn/houseform/edit/main/docs/:path'
    },
    nav: [
      { text: "Introduction", link: "/introduction" },
      { text: "Guides", link: "/guides/basic-usage" },
      { text: "Reference", link: "/reference/form" },
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
        text: "Getting Started",
        items: [
          {
            text: "Introduction",
            link: "/introduction",
          },
          {
            text: "Comparisons",
            link: "/comparison",
          },
        ],
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
          {
            text: "Performance Optimizations",
            link: "/guides/performance-optimizations",
          },
        ],
      },
      {
        text: "API",
        collapsed: false,
        collapsible: true,
        items: [
          {
            text: "Form",
            link: "/reference/form",
          },
          {
            text: "Field",
            link: "/reference/field",
          },
          {
            text: "Array",
            link: "/reference/array",
          },
          {
            text: "Array Item",
            link: "/reference/array-item",
          },
        ],
      },
    ],
  },
});
