import { XPageTemplate } from '@/ts/base/schema'
import ElementFactory from '../core/ElementFactory'
import ElementTreeManager from '../core/ElementTreeManager'
import VueComponentFactory from './VueComponentFactory'
import { HostMode, IViewHost } from '../core/IViewHost'
import staticContext from '..'
import { PageElement } from '../core/PageElement'
import { IPageTemplate } from '@/ts/core/thing/standard/page'
import { onMounted,onBeforeUnmount } from 'vue'

export default class HostManagerBase<T extends HostMode>
  implements IViewHost<T, VueComponentFactory>, EventTarget
{
  readonly mode: T;
  treeManager: ElementTreeManager;
  components: VueComponentFactory;
  elements: ElementFactory;

  readonly pageInfo: IPageTemplate;

  constructor(mode: T, pageFile: IPageTemplate) {
    this.mode = mode;
    this.pageInfo = pageFile;

    const componentFactory = new VueComponentFactory()
    componentFactory.registerComponents(staticContext.components)
    this.components = componentFactory

    this.elements = new ElementFactory(staticContext.metas);

    this.treeManager = new ElementTreeManager(
      this.elements,
      pageFile.metadata.rootElement,
    );
  }

  get page(): XPageTemplate {
    return this.pageInfo.metadata;
  }

  /** 获取根元素 */
  get rootElement(): Readonly<PageElement> {
    return this.treeManager.root;
  }

  /** TODO:订阅变动 */
  subscribe(onChange: (type: string, cmd: string, args: any) => void) {
    let subId: string
    onMounted(() => {
      subId = this.pageInfo.command.subscribe((type, cmd, args) => {
        onChange(type, cmd, args);
      })
    })
    onBeforeUnmount(() => this.pageInfo.command.unsubscribe(subId))
  }

  /** 触发变动 */
  emitter(type: string, cmd: string, args?: any) {
    this.pageInfo.command.emitter(type, cmd, args);
  }

  //#region EventTarget

  protected _event = new EventTarget();
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
  ): void {
    this._event.addEventListener(type, callback);
  }
  dispatchEvent(event: Event): boolean {
    return this._event.dispatchEvent(event);
  }
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
  ): void {
    this._event.removeEventListener(type, callback);
  }

  //#endregion
}
