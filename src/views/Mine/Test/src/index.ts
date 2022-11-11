import { SendMessage, ReturnMessage, ReturnCallback } from "./types";

let c = console;
const initSdk = () => {
  let eventQueue: any[] = [];
  let postQueue: any = {};
  let contentWindow: Window | null = null;
  let isDestroy: boolean = false;
  function handleMessage(e: MessageEvent) {
    const { type, data } = e.data;
    const event = eventQueue.find((i) => i.type === type);
    const post = postQueue[type];
    postQueue[type] = null;
    if (event) {
      event.callBack(data);
    }
    post && post(data);
  }

  function send(type: string, data?: any) {
    if (isDestroy) return;
    return new Promise<ReturnMessage>((resolve, reject) => {
      const sendData: SendMessage = {
        type,
        data,
      };
      if (postQueue[type]) {
        reject("发送太快了, 请稍后再试");
        return;
      }
      postQueue[type] = resolve;
      contentWindow
        ? contentWindow.postMessage(sendData, "*")
        : window.parent.postMessage(sendData, "*");
    });
  }

  function listen(type: string, callBack: ReturnCallback) {
    eventQueue.push({
      type,
      callBack: async (data: any) => {
        const postData = await callBack(data);
        send(type, postData);
      },
    });
  }

  function destroy() {
    eventQueue = null;
    postQueue = null;
    window.removeEventListener("message", handleMessage);
    console.log();
    isDestroy = true;
  }

  function connectParent() {
    return new Promise<ReturnMessage>((resolve, reject) => {
      if (window.parent === window) {
        reject("请在正确环境调用");
      }
      eventQueue = [];
      postQueue = {};
      isDestroy = false;
      send("init").then((res) => {
        isDestroy = false;
        resolve({ status: "success", data: "成功" });
      });
      window.addEventListener("message", handleMessage);
    });
  }

  function create(iframe: HTMLIFrameElement) {
    return new Promise<any>((resolve, reject) => {
      contentWindow = iframe.contentWindow;
      eventQueue = [];
      postQueue = {};
      isDestroy = false;
      iframe.addEventListener("load", (e) => {
        listen("init", () => {
          resolve({ status: "success", data: "成功" });
          return { status: "success", data: "成功" };
        });
      });
      window.addEventListener("message", handleMessage);
    });
  }
  return {
    connectParent,
    listen,
    send,
    create,
    destroy,
  };
};

let log = c.log;
c.log = function (...arg) {
  let args = arg.filter((item) => item !== initSdk);
  log(...args);
};

export default initSdk;
