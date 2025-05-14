<script setup>
import {onMounted, ref} from 'vue'
import Line from '@/components/charts/line.vue'
import dayjs from "dayjs";
import {RefreshRight} from "@element-plus/icons-vue";
import {formatJobStatus, getTagType} from "../../utils/text.js";
import {getJobRecords} from "../../apis/jobRecord/jobRecord.js";
import {getChart, getDashboardSummary} from "../../apis/home/home.js";
import {graphic} from 'echarts';

// 初始化数据
const chartJobKey = "job"
const chartJobDay = "day"
const chartDayColorArr = [
  ['rgb(255, 191, 0)', 'rgb(224, 62, 76)'],
  ['rgb(0, 221, 255)', 'rgb(77, 119, 255)'],
  ['rgb(128, 255, 165)', 'rgb(1, 191, 236)'],
  ['rgb(255, 0, 135)', 'rgb(135, 0, 157)'],
]
const labels = ['待执行', '运行中', '成功', '失败']
const tableData = ref([])
const lineChartData = ref({
  color: ['#FAC858', '#5470C6', '#91CC75', '#EE6666'],
  legend: {
    right: '5%',
    data: labels
  },
  grid: {
    left: '5%',   // 默认可能是 '10%' 或更大
    right: '5%',  // 同样缩小右侧空隙
    top: '20%',   // 视需要调整上下边距
    bottom: '30%'
  },
  title: {
    text: '近7天任务执行情况'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: []
})
const barChartData = ref({
  color: ['#FAC858', '#5470C6', '#91CC75', '#EE6666'],
  legend: {
    right: '5%',
    data: labels
  },
  grid: {
    left: '5%',   // 默认可能是 '10%' 或更大
    right: '5%',  // 同样缩小右侧空隙
    top: '20%',   // 视需要调整上下边距
    bottom: '30%'
  },
  title: {
    text: '近7天任务运行情况'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow' // 显示堆叠的提示框
    }
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: []
});
const summaryData = ref([])


// 查询图表数据
const getChartData = async (type) => {
  const begin = dayjs().subtract(7, 'day').startOf('day').unix();
  const end = dayjs().unix();
  const data = {
    "key": type,
    "begin": begin,
    "end": end,
  }

  switch (type) {
    case chartJobKey:
      const jobData = await fetchChartData(data)
      parseJobData(jobData)
      return
    case chartJobDay:
      const dayData = await fetchChartData(data)
      parseDayData(dayData)
      return
  }
}

// 折线图数据处理
function parseDayData(dayData) {
  const { xAxisData, tempSeriesData} = parseChartData(dayData)
  lineChartData.value.xAxis.data = xAxisData
  lineChartData.value.series = tempSeriesData.map((data, i) => ({
    name: labels[i],
    type: 'line',
    stack: 'Total',
    smooth: true,
    lineStyle: {
      width: 0
    },
    showSymbol: false,
    areaStyle: {
      opacity: 0.8,
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: chartDayColorArr[i][0]
        },
        {
          offset: 1,
          color: chartDayColorArr[i][1]
        }
      ])
    },
    emphasis: {
      focus: 'series'
    },
    data: data
  }));
}
// 柱状图数据处理
function parseJobData(jobData) {
  const { xAxisData, tempSeriesData} = parseChartData(jobData)
  barChartData.value.xAxis.data = xAxisData
  barChartData.value.series = tempSeriesData.map((data, i) => ({
    name: labels[i],
    data: data,
    type: 'bar',
    stack: 'Total'
  }));
}
// 公共处理函数
function parseChartData(data) {
  const xAxisData = []
  const firstEntry = Object.values(data)[0] || [];
  const seriesCount = firstEntry.length;
  const tempSeriesData = Array.from({length: seriesCount}, () => []);

  // 构造 x 轴 和 series 数据
  for (const [jobName, values] of Object.entries(data)) {
    xAxisData.push(jobName);
    values.forEach((val, i) => {
      tempSeriesData[i].push(val);
    });
  }
  return { xAxisData, tempSeriesData}
}

// 查询数据
const fetchChartData = async (data) => {
  return await getChart(data)
}
const fetchTableData = async () => {
  const res = await getJobRecords()
  tableData.value = res.data
}
const fetchSummaryData = async () => {
  const res = await getDashboardSummary()
  summaryData.value = res
}

const onRefresh = () => {
  fetchTableData()
}

onMounted(() => {
  fetchTableData()
  fetchSummaryData()
  getChartData(chartJobKey)
  getChartData(chartJobDay)
})

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
            <div class="top-total">
              {{ summaryData.job?.total }}
            </div>
            <div>
              <span class="status-circle online"></span>
              <span style="margin-right: 28px;">启用: {{ summaryData.job?.active }}</span>
              <span class="status-circle offline"></span>
              <span>关闭: {{ summaryData.job?.inactive }}</span>
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
            <div class="top-total">
              {{ summaryData.node?.total }}
            </div>
            <div>
              <span class="status-circle online"></span>
              <span style="margin-right: 28px;">在线: {{ summaryData.node?.online }}</span>
              <span class="status-circle offline"></span>
              <span>离线: {{ summaryData.node?.offline }}</span>
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
        <Line :option="lineChartData"/>
      </el-card>
      <el-card class="chart-card">
        <Line :option="barChartData"/>
      </el-card>
    </div>
    <div class="home-table">
      <el-card class="table-card">
        <div class="table-operation">
          <div>最近20个任务记录</div>
          <div class="header-right">
            <el-icon @click="onRefresh" style="width: 18px;cursor: pointer;">
              <RefreshRight/>
            </el-icon>
          </div>
        </div>
        <el-table
            :data="tableData"
            style="width: 100%; height: 100%;"
            class="table-column"
            :header-cell-style="{background: '#EAF3FB', color: '#2C3E50'}"
        >
          <el-table-column align="center" prop="id" label="任务ID"/>
          <el-table-column align="center" prop="job_name" label="任务名称"/>
          <el-table-column align="center" prop="node_name" label="节点">
          </el-table-column>
          <el-table-column align="center" prop="start_time" label="创建时间">
            <template #default="scope">
              {{ dayjs(scope.row.start_time).format('YYYY-MM-DD HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="end_time" label="结束时间">
            <template #default="scope">
              {{ dayjs(scope.row.end_time).format('YYYY-MM-DD HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="运行结果" width="120">
            <template #default="scope">
              <el-tag :type="getTagType(scope.row.status)">
                {{ formatJobStatus(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<style scoped>

.home-box {
  height: calc(100vh - 105px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ------ 顶部卡片样式 ------- */
.home-top {
  display: grid;
  grid-template-columns: repeat(4, 1fr);;
  justify-content: start;
  align-items: center;
  gap: 10px;
}

.top-total {
  font-size: 30px;
  font-weight: bold;
  color: #1a1a1a;
  margin-top: 5px;
  margin-bottom: 15px
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

.home-chart {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  align-items: stretch; /* 让网格项（el-card）在交叉轴方向拉伸 */
  gap: 10px;
  height: calc((100% - 105px) * 2 / 5);
}

.chart-card {
  margin-top: 10px;
  height: 100%;
}

::v-deep(.el-card__body) {
  height: 100%;
}

/* -------- 底部表格样式 -------- */

.home-table {
  width: 100%;
  height: calc((100% - 105px) * 3 / 5);
  margin-top: 10px;
}

.table-card {
  height: 100%;
  margin-top: 10px;
}

.table-operation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* --------  表头相关样式修改 -------- */
/* 表头左上角、右上角圆角处理 */
:deep(.table-column .el-table__header-wrapper thead th:first-child) {
  border-top-left-radius: 8px;
  overflow: hidden;
}

/* 表头单元格中间加一个小竖线（伪元素实现） */
:deep(.table-column .el-table__header-wrapper thead th:not(:last-child))::after {
  content: "";
  display: block;
  width: 1px;
  height: 16px; /* 控制线的长度 */
  background-color: #ccc;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.table-column .el-table__header-wrapper thead th:last-child) {
  border-top-right-radius: 8px;
  overflow: hidden;
}


/* 去掉el-table 底部白色的线 */
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}

</style>