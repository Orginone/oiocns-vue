import { defineElement } from '../../defineElement'
import { EnumTypeMeta } from '../../../core/ElementMeta'
import RootView from './index.vue'
import { h } from 'vue'

export default defineElement({
  render(props, ctx) {
    const isDesign = ctx.view.mode == 'design'
    const layoutType = ref(props.layoutType)
    ctx.view.subscribe((type, cmd, args) => {
      if (type == 'props' && cmd == 'change' && props.id == args) {
        const layout = ctx.view.treeManager.allElements[props.id].props.layoutType;
        layoutType.value = layout
      }
    })
    return h(RootView,{isDesign,layoutType,children:props.children})
  },
  displayName: 'Root',
  meta: {
    props: {
      layoutType: {
        type: 'enum',
        label: '布局方式',
        options: [
          { label: '滚动', value: 'scroll' },
          { label: '撑满', value: 'full' },
        ],
        default: 'scroll',
      } as EnumTypeMeta<'scroll' | 'full'>,
    },
    type: 'Container',
    label: '模板根元素',
  },
})
