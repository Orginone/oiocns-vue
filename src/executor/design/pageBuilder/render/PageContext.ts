import { HostMode } from '../core/IViewHost'
import DesignerManager from '../design/DesignerManager'
import type HostManagerBase from './HostManager'

export interface PageContext {
  view: NonNullable<any>,
}

export interface IPageContext<T extends HostMode> {
  view: HostManagerBase<T>
}

export interface DesignContext extends IPageContext<'design'> {
  view: DesignerManager
}

export interface ViewContext extends IPageContext<'view'> {
  view: HostManagerBase<'view'>
}

export type Context = DesignContext | ViewContext;