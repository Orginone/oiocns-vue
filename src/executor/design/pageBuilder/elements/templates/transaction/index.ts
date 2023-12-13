import { kernel, schema } from '@/ts/base'

import { h } from 'vue'
import { ExistTypeMeta } from '../../../core/ElementMeta'
import { useStagings } from '../../../core/hooks/useChange'
import { defineElement } from '../../defineElement'
import Transaction from '/img/transaction.png'
import transactionView from './index.vue'


export interface Filter {
  id: string;
  name: string;
  valueType: string;
  rule: Range[];
  speciesId: string;
}

export interface Range {
  id: number;
  start: number;
  end: number;
  unit: string;
}


export default defineElement({
  render(props, ctx) {
    return h(transactionView,{...props,ctx})
  },
  displayName: 'MallTemplate',
  meta: {
    props: {
      size: {
        type: 'number',
        label: '每页个数',
        default: 12,
      },
      span: {
        type: 'number',
        label: '行卡片占比',
        default: 4,
      },
      forms: {
        type: 'array',
        label: '过滤',
        elementType: {
          type: 'type',
          label: '表单',
        } as ExistTypeMeta<SEntity>,
        default: [],
      },
    },
    slots: {
      banner: {
        label: '横幅插槽',
        single: true,
        params: {},
        default: 'HeadBanner',
      },
      content: {
        label: '实体列表插槽',
        single: true,
        params: {
          data: {
            label: '列表数据',
            type: {
              type: 'type',
              label: '卡片模板',
              typeName: 'thing',
            } as ExistTypeMeta<schema.XThing | undefined>,
          },
        },
        default: 'MetaCard',
      },
      leftTree: {
        label: '左侧树插槽',
        single: true,
        params: {},
        default: 'SpeciesTree',
      },
      topDicts: {
        label: '顶部字典',
        single: true,
        params: {},
        default: 'DictSearch',
      },
      topForm: {
        label: '左侧表单插槽',
        single: true,
        params: {
          forms: {
            label: '表单数据',
            type: {
              type: 'array',
              label: '表单数组',
              elementType: {
                type: 'type',
                label: '表单',
              } as ExistTypeMeta<SEntity>,
            },
          },
        },
        default: 'FormSearch',
      },
      badge: {
        label: '购物车徽标',
        single: true,
        params: {},
        default: 'Badge',
      },
      car: {
        label: '购物车列表',
        single: true,
        params: {},
        default: 'ListItem',
      },
    },
    type: 'Template',
    label: '商城',
    photo: Transaction,
    description: '用于展示交易商品',
    layoutType: 'full',
  },
})