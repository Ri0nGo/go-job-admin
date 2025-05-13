<script setup>
import {ref} from 'vue'
import Line from '@/components/charts/line.vue'

const chartOption = ref({
  title: {
    text: '折线图示例'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '温度',
      type: 'line',
      data: [10, 22, 28, 43, 30, 25, 19],
      smooth: true
    }
  ]
});

</script>

<template>
  <div class="home-box">
    <div class="home-top">
      <el-card class="box-header-card">
        <div class="card-top">
          <div class="job-title">
            <div class="job-name">
              任务总数
            </div>
            <div style="font-size: 32px; font-weight: bold; color: #1a1a1a; margin-bottom: 20px">
              23
            </div>
            <div>
              <span class="status-circle online"></span>
              <span style="margin-right: 28px;">启用: 20</span>
              <span class="status-circle offline"></span>
              <span>关闭: 3</span>
            </div>
          </div>
          <div class="icon-bg job-icon">
            <div class="job-svg-icon svg-icon-common"></div>
          </div>
        </div>
      </el-card>
      <el-card class="box-header">
        <div class="card-top">
          <div class="job-title">
            <div class="job-name">
              节点总数
            </div>
            <div style="font-size: 32px; font-weight: bold; color: #1a1a1a; margin-bottom: 20px">
              5
            </div>
            <div>
              <span class="status-circle online"></span>
              <span style="margin-right: 28px;">在线: 4</span>
              <span class="status-circle offline"></span>
              <span>离线: 1</span>
            </div>
          </div>
          <div class="icon-bg node-icon ">
            <div class="node-svg-icon svg-icon-common"></div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="home-chart">
      <el-card>
        <div class="chart-wrapper">
          <Line :option="chartOption" />
        </div>
      </el-card>
      <el-card>图表2</el-card>
    </div>
    <div class="home-table">

    </div>
  </div>
</template>

<style scoped>

/* ------ 顶部卡片样式 ------- */
.home-top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, auto));
  justify-content: start;
  align-items: center;
  gap: 1rem;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: self-start;
}

.job-name {
  font-size: 19px;
  margin-bottom: 16px;
  font-weight: 500;
  color: #494b4e;
}

.status-circle {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%; /* 变成圆形 */
  margin-right: 0.5em;
  vertical-align: middle;
}

.online {
  background-color: #28a745; /* 绿色 */
}

.offline {
  background-color: #dc3545; /* 红色 - 离线或异常 */
}


.icon-bg {
  padding: 12px;
  margin-left: 30px;
  border-radius: 50%;
}

.job-icon {
  background-color: #bfdbfe;
}

.node-icon {
  background-color: #e9d5ff;
}


.svg-icon-common {
  width: 24px;
  height: 24px;
}

.job-svg-icon {
  background-color: #2563eb;
  mask: url('@/assets/job_mgr.svg') no-repeat center / contain;
  -webkit-mask: url('@/assets/job_mgr.svg') no-repeat center / contain;
}

.node-svg-icon {
  background-color: #9333ea;
  mask: url('@/assets/node_mgr.svg') no-repeat center / contain;
  -webkit-mask: url('@/assets/node_mgr.svg') no-repeat center / contain;
}

/* ----------- 中间图表样式 ----------- */
.home-chart{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  justify-content: start;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.chart-wrapper {
  width: 100%; /* 容器宽度可以动态调整 */
  height: 400px; /* 容器高度可以调整 */
  margin: 0;
  padding: 0;
}
</style>