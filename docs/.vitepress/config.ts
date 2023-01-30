import {defineConfig} from 'vitepress'

const { description, version } = require('../../package.json')

export default defineConfig({
    title: 'HouseForm',
    description: description,
    base: "/houseform/",
    themeConfig: {
        logo: '/logo.svg',
        socialLinks: [
            { icon: 'github', link: 'https://github.com/crutchcorn/houseform' },
        ],
        nav: [
            {text: "Home", link: "/"},
            {text: "Reference", link: "/reference"},
            {
                text: version,
                items: [
                    // Change to `Changelog` when we have one
                    { text: 'Releases', link: 'https://github.com/crutchcorn/houseform/tags' },
                    { text: 'Contributing', link: 'https://github.com/crutchcorn/houseform/blob/main/CONTRIBUTING.md' },
                ]
            },
        ],
        sidebar: [
            {
                text: "Docs", items: [
                    {
                        text: "Introduction",
                        link: "/"
                    },
                    {
                        text: "Comparison to X",
                        link: "/comparison"
                    },
                    {
                        text: "Usage Guides",
                        collapsed: false,
                        collapsible: true,
                        items: [
                            {
                                text: "Basic Usage",
                                link: "/guides/basic-usage"
                            },
                            {
                                text: "HTML Forms",
                                link: "/guides/html-forms"
                            },
                            {
                                text: "React Native",
                                link: "/guides/react-native"
                            },
                            {
                                "text": "Non-Text Inputs",
                                "link": "/guides/non-text-inputs"
                            },
                            {
                                text: "Linked Fields",
                                link: "/guides/linked-fields"
                            },
                            {
                                text: "Submission Errors",
                                link: "/guides/submission-errors"
                            },
                            {
                                text: "Access Data Externally",
                                link: "/guides/access-data-externally"
                            },
                            {
                                text: "TypeScript",
                                link: "/guides/typescript"
                            }
                        ]
                    },
                    {
                        text: "API Reference",
                        link: "/reference"
                    }
                ]
            }
        ]
    }
})
