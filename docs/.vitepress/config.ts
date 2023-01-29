import {defineConfig} from 'vitepress'

export default defineConfig({
    title: 'HouseForm',
    description: 'Simple to use React forms, where your validation and UI code live together in harmony.',
    base: "/houseform/",
    themeConfig: {
        logo: '/logo.svg',
        sidebar: [
            {
                text: "Docs", items: [
                    {
                        text: "Introduction",
                        link: "/"
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
