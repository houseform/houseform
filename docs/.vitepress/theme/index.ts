import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { EnhanceAppContext } from "vitepress";
import ClickToIFrame from "./ClickToIFrame.vue";
import { h } from 'vue'
import HomePage from './HomePage.vue';

const modules = import.meta.glob('../../../.all-contributorsrc', { as: 'raw' })

const allContributors = await modules["../../../.all-contributorsrc"]();

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(HomePage, {allContributors: JSON.parse(allContributors)}),
    })
  },
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('ClickToIFrame', ClickToIFrame)
  }
}
