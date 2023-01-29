import {defineConfig} from 'vitepress'

export default defineConfig({
    title: 'HouseForm',
    description: 'Simple to use React forms, where your validation and UI code live together in harmony.',
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
                        text: "Reference",
                        link: "/reference"
                    }
                ]
            }
        ]
    }
})
