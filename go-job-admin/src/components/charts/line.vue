<template>
  <!-- chartRef 用于获取 DOM 元素引用，供 echarts.init 初始化使用。-->
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  option: {
    type: Object,
    required: true
  }
});

const chartRef = ref(null);    // DOM 引用
let chartInstance = null;   // echarts 实例

const updateChartSize = () => {
  if (chartRef.value && chartInstance) {
    chartInstance.resize(); // 在父容器变化时重新调整图表大小
  }
};

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);    // 初始化
  chartInstance.setOption(props.option);   // 设置配置项
};

onMounted(() => {
  initChart();

  // 使用 ResizeObserver 监听父容器尺寸变化
  const resizeObserver = new ResizeObserver(updateChartSize);
  resizeObserver.observe(chartRef.value.parentElement);

  // 在组件卸载时移除观察者
  onBeforeUnmount(() => {
    resizeObserver.disconnect();
  });
});

watch(
    () => props.option,
    (newOption) => {
      if (chartInstance) {
        chartInstance.setOption(newOption);
      }
    },
    { deep: true }
);
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
