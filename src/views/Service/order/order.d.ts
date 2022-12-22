export type Merchandise = { // 商品
    caption: string;
    days: string;
    sellAuth: string;
    price: string;
    information: string;
    marketId: string
}
export type OrderType = { // 订单主表
    code: string;
    name: string;
    status: number,
    belongId: string
}

export type CancelType = 'sell' | 'buy' | 'main'  // 取消订单

export type OrderListType = 'sell' | 'buy' // 加载订单