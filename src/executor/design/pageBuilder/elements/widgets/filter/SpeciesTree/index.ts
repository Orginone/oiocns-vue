import { ExistTypeMeta } from '../../../../core/ElementMeta'
import {
  SpeciesProp,
} from '../../../../core/hooks/useSpecies'
import { defineElement } from '../../../defineElement'
import Design from './Design.vue'
import View from './View.vue'

export default defineElement({
  render(props, ctx) {
    if (ctx.view.mode == 'design') {
      return h(Design,{...props,ctx})
    }
    return h(View,{...props,ctx})
  },
  displayName: 'SpeciesTree',
  meta: {
    type: 'Element',
    label: '分类树',
    props: {
      species: {
        type: 'array',
        label: '分类数组',
        elementType: {
          type: 'type',
          label: '分类',
        } as ExistTypeMeta<SpeciesProp>,
        default: [],
      },
    },
  },
})