import { ExistTypeMeta } from '../../../core/ElementMeta'
import { File, SEntity } from '../../../design/config/FileProp'
import { Context } from '../../../render/PageContext'
import { defineElement } from '../../defineElement'
import {StyleValue, h} from 'vue'
// import View from './View.vue'
import Design from './Design.vue'
interface IProps {
  height: number;
  url?: SEntity;
  props: any;
  ctx: Context;
}

// TODO:
export const style = (height: number, url?: string) => {
  return {
    position: 'relative',
    backgroundImage: `url(${url})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#fafafa',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: height+'px',
  } as StyleValue
}

const View: React.FC<IProps> = (props) => {
  return h('div',{style:style(props.height, props.url?.id)})
};



export default defineElement({
  render(props, ctx) {
    if (ctx.view.mode == 'design') {
      return h(Design,{...props,ctx})
    }
    return h(View,{...props,ctx})
  },
  displayName: 'HeadBanner',
  meta: {
    props: {
      height: {
        type: 'number',
        default: 200,
      },
      url: {
        type: 'type',
        label: '关联图片',
        typeName: 'picFile',
      } as ExistTypeMeta<SEntity | undefined>,
    },
    label: '横幅',
    type: 'Element',
  },
})