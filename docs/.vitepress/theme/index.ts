import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { EnhanceAppContext } from "vitepress";
import ClickToIFrame from "./ClickToIFrame.vue";

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('ClickToIFrame', ClickToIFrame)
  }
}
