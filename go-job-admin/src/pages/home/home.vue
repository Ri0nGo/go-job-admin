<script setup>
import {ref} from 'vue'
import Line from '@/components/charts/line.vue'

const chartOption = ref({
  grid: {
    left: '5%',   // 默认可能是 '10%' 或更大
    right: '5%',  // 同样缩小右侧空隙
    top: '20%',   // 视需要调整上下边距
    bottom: '30%'
  },
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
      <el-card class="chart-card">
        <Line :option="chartOption" />
      </el-card>
      <el-card class="chart-card">
        <Line :option="chartOption" />
      </el-card>
    </div>
    <div class="home-table">
      <el-card class="table-card"></el-card>
    </div>
  </div>
</template>

<style scoped>

.home-box{
  height: calc(100vh - 105px);
  display: flex;
  flex-direction: column;
}

/* ------ 顶部卡片样式 ------- */
.home-top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, auto));
  justify-content: start;
  align-items: center;
  gap: 10px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: self-start;
}

.job-name {
  font-size: 19px;
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
  align-items: stretch; /* 让网格项（el-card）在交叉轴方向拉伸 */
  gap: 10px;
  flex: 2;
  min-height: 0;
}

.chart-card {
  margin-top: 10px;
  height: 100%;
}

::v-deep(.el-card__body) {
  height: 100%;
}

.home-table{
  flex:3;
}

.table-card{
  margin-top: 10px;
}
</style>