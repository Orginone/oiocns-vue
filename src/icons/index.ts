import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon';
import '@yzfe/svgicon/lib/svgicon.css';
import { App } from 'vue';

export default function setSvgIcon(app: App<Element>) {
  app.use(VueSvgIconPlugin, {
    tagName: 'svg-icon'
  });
}
