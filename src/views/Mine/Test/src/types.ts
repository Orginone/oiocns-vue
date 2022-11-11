// 子页面发送
export interface SendMessage {
  type: string; // 通信类型
  data: any; // 通信数据
}

// 主页面返回
export interface ReturnMessage {
  status: "success" | "error"; // 通信返回状态
  data: any; // 通信数据
}

export type VerifyCallback = (appid: string) => Promise<boolean> | boolean;

export type ReturnCallback = (
  data: any
) => ReturnMessage | Promise<ReturnMessage>;
