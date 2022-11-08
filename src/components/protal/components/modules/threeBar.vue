<template>
  <div ref="myChart" :style="{ width: '210px', height: '200px', marginTop: '-50px', marginLeft: '-40px' }"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import * as echarts from "echarts";

export default defineComponent({
  name: "home",
  components: {
  },
  setup(){
    const myChart = ref<HTMLElement>();  
    const myCharts = ref<any>();
    setTimeout(() => {
      // 绘制图表
      myCharts.value = echarts.init(myChart.value!);
      myCharts.value.setOption({
        color: ['#0e4cad','#2b6ed9','#7ca8ef','#a4c2f2'],
        xAxis: {
          type: 'category',
          data: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 80, 70, 110, 130],
            type: 'line'
          }
        ]
      });
    }, 10);
    return {
      myChart,
    };
  }
});
</script>
