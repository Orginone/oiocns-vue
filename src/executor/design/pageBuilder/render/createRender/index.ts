import { generateUuid } from '@/ts/base/common'
// import { Result } from 'antd';
import _ from 'lodash';
// import React, {
//   FC,
//   MouseEvent,
//   useCallback,
//   useContext,
//   useState,
// } from 'react';
import {
  Component,
  h,
  inject
} from 'vue'
import ElementFactory from '../../core/ElementFactory'
import { HostMode } from '../../core/IViewHost'
import { PageElement } from '../../core/PageElement'
// import { ElementFC } from '../elements/defineElement'
import { DesignContext, PageContext, ViewContext } from '../PageContext'
import Slot from '../Slot.vue'


export type Render = Component<ElementRenderProps>
  
export interface ElementRenderProps {
  readonly element: PageElement;
  readonly slotParams?: Dictionary<any>;
}

export function createSlotRender(slot: PageElement | PageElement[]) {
  if (Array.isArray(slot)) {
    return (params: Dictionary<any> = {}) => {
      return slot.map((s) => h(Slot,{key:s.id,child:s,params:params}))
    };
  }
  const render = (params: Dictionary<any> = {}) => {
    return h(Slot,{child:slot,params:params})
  };
  return render;
}

/**
 * 将元素的配置处理为react的属性对象
 * @param e 要处理的元素
 * @returns ReactNode所需的属性对象
 */
export function mergeProps(
  e: PageElement,
  f: ElementFactory,
  slotParams: Dictionary<any> = {},
) {
  const defaultMeta = f.getDefaultsFromMeta(e.kind);
  for (const item of Object.entries(defaultMeta.props)) {
    if (!e.props[item[0]]) {
      e.props[item[0]] = item[1];
    }
  }

  const props = {
    ...e.props,
  }
  for (const item of Object.entries(slotParams)) {
    if (item[1]) {
      props[item[0]] = item[1];
    }
  }

  let className = e.className;
  if (Array.isArray(className)) {
    className = className.join(' ');
  }
  props.className = className;

  let style = Object.fromEntries(
    Object.entries(e.style || {}).map((p) => {
      p[0] = _.camelCase(p[0]);
      return p;
    }),
  );
  props.style = style;
  props.id = e.id;
  props.children = e.children;
  props.props = e.props;

  if (e.slots) {
    for (const [name, slot] of Object.entries(e.slots)) {
      props[name] = createSlotRender(slot);
    }
  }
  return props
}

export function createRender(component: ElementFC, mode: HostMode): Render {
  if (mode == 'view') {
    return createViewRender(component);
  } else {
    return createDesignRender(component);
  }
}

function createViewRender(component: ElementFC) {
  return (props: ElementRenderProps) => {
    const ctx = inject('PageContext') as ViewContext
    return h(
      component,
      mergeProps(props.element, ctx.view.treeManager.factory, props.slotParams),
    )
  }
}




