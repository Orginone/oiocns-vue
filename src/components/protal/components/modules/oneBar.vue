<template>
  <div ref="myChart" :style="{ width: '110px', height: '110px' }"></div>
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
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '90%',
            label: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
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
