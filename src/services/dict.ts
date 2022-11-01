
const dict: { [key: string]: any }  = {
    SF: [
      {name: '是', code: 1},
      {name: '否', code: 0}
    ],
    OrderStatus:[
        {name: '待交付', code: 1},
        //包含第三方监管和卖方的审核状态
        {name: '审核通过', code: 100},
        {name: '已付款', code: 101},
        {name: '已发货', code: 102},
        //后续可能有物流状态接入
        {name: '已收货', code: 103},
        {name: '已评价', code: 104},
        {name: '买方发起退款', code: 105},
        {name: '卖方同意退款', code: 106},
        {name: '已退款', code: 107},
        {name: '卖方拒绝退款', code: 108},
        {name: '审核不通过', code: 200},
        {name: '买方取消订单', code: 220},
        {name: '卖方取消订单', code: 221},
        {name: '已退货', code: 222},
    ]
}

const renderDict =  (data:any, element:any, dictName:any) => {
    const col = element.property
    const dictArr = dict[dictName]
    if (!dictArr) return
    for (let item of dictArr) {
      if (item.code === data[col]) {
        return item.name
      }
    }
  }
export default renderDict

//   const dictChange2 =  () =>{
//     alert('dd')
//   } 
//   export default {
//     dic:{
//         render:() =>{}
//     }
//   } 