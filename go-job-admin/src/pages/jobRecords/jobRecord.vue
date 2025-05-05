<script setup>
import {ref} from "vue";
import {getJobs} from "../../apis/job/job.js";
import {getJobRecord, getJobRecords} from "../../apis/jobRecord/jobRecord.js";
import dayjs from "dayjs";
import {formatTime} from "../../utils/time.js";
import DefaultPagination from "../../components/pagination/defaultPagination.vue";
import {RefreshRight} from "@element-plus/icons-vue"

const outerDrawer = ref(false);
const innerDrawer = ref(false);
const loading = ref(false)

const logListData = ref(null)
const tmpListData = ref(null)

const props = defineProps({
  jobId: {
    type: Number,
    default: 0
  },
  outerSize: {
    type: String,
    default: "45%"
  },
  innerSize: {
    type: String,
    default: "40%"
  },
  direction: {
    type: String,
    default: 'rtl',
  },
  jobName: {
    type: String,
    default: ""
  }
})

// ---------- 筛选按钮 ---------- //
const selectStatusValue = ref(null)
// todo 后续这里要做成接口调用的形式，目前仅仅通过前端过滤
const statusOptions = [
  {
    value: 0,
    label: '待运行',
  },
  {
    value: 1,
    label: '运行中',
  },
  {
    value: '2',
    label: '成功',
  },
  {
    value: '3',
    label: '失败',
  }
]

const handleSelectStatus = () => {
  if (selectStatusValue.value == null) {
    logListData.value = tmpListData.value
    return
  }

  let data = []
  tmpListData.value.forEach(item => {
    if (item.status == selectStatusValue.value) {
      data.push(item)
    }
  })
  logListData.value = data
}

const fetchJobRecords = async () => {
  const res = await getJobRecords({
    page_size: pageSize.value,
    page_num: currentPage.value,
    job_id: props.jobId
  })
  tmpListData.value = res.data
  logListData.value = res.data
  total.value = res.total
}

const onRefresh = async () => {
  loading.value = true
  await fetchJobRecords()
  loading.value = false
}

// ---------- 抽屉操作 ---------- //
const openDrawer = async () => {
  outerDrawer.value = true
  loading.value = true
  await fetchJobRecords()
  loading.value = false
}
const closeDrawer = () => {
  outerDrawer.value = false
  getJobs({
    page_size: 20,
    page_num: 1,
    job_id: 25,
  })
}

defineExpose({
  openDrawer,
  closeDrawer
})

// ---------- 枚举 ---------- //
function formatStatus(type) {
  switch (type) {
    case 0:
      return '待运行'
    case 1:
      return '运行中'
    case 2:
      return '成功'
    case 3:
      return '失败'
    default:
      return ''
  }
}

function getTagType(type) {
  switch (type) {
    case 0:
      return 'primary'
    case 1:
      return 'warning'
    case 2:
      return 'success'
    case 3:
      return 'danger'
    default:
      return 'info'
  }
}

const statusClass = (status) => {
  switch (status) {
    case 0:
      return 'status-primary'
    case 1:
      return 'status-warning'
    case 2:
      return 'status-success'
    case 3:
      return 'status-danger'
    default:
      return 'status-primary'
  }
}

// ---------- 日志详情 ---------- //
const logDetailData = ref({})
const handleJobRecord = async (row) => {
  innerDrawer.value = true
  const res = await getJobRecord(row.id)
  logDetailData.value = res
}

// ---------- 分页处理 ---------- //
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const handleSizeChange = async (val) => {
  loading.value = true
  await fetchJobRecords()
  loading.value = false
}
const handleCurrentChange = async (val) => {
  loading.value = true
  await fetchJobRecords()
  loading.value = false

}

</script>

<template>
  <el-drawer
      v-model="outerDrawer"
      :with-header="false"
      :size="outerSize"
      :direction="direction"
  >
    <div class="drawer-container">
      <div class="log-header">
        <div class="header-left">
          <span style="margin-right: 8px;font-size: 16px; color: #666">运行状态</span>
          <el-select
              v-model="selectStatusValue"
              clearable
              placeholder="请选择"
              style="width: 120px"
              @change="handleSelectStatus"
              size=""
          >
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
        <div class="header-right">
          <el-icon @click="onRefresh" style="width: 18px;cursor: pointer;">
            <RefreshRight/>
          </el-icon>
        </div>
      </div>
      <div class="log-body">
        <el-table
            :data="logListData"
            style="width: 100%"
            class="table-column"
            :header-cell-style="{background: '#EAF3FB', color: '#2C3E50'}"
            height="calc(100% - 20px)"
            :loading="loading"
        >
          <el-table-column align="center" label="开始时间">
            <template #default="scope">
              {{ dayjs(scope.row.start_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="结束时间">
            <template #default="scope">
              {{ dayjs(scope.row.end_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="运行结果" width="120">
            <template #default="scope">
              <el-tag :type="getTagType(scope.row.status)">
                {{ formatStatus(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="耗时" width="100">
            <template #default="scope">
              <div>
                {{ scope.row.duration?.toFixed(3) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下次执行时间">
            <template #default="scope">
              {{ dayjs(scope.row.next_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="160">
            <template #default="scope">
              <el-button link type="primary" size="default" disabled>
                删除
              </el-button>
              <el-button link type="primary" size="default" @click="handleJobRecord(scope.row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--        内部日志详情抽屉框-->
        <el-drawer
            v-model="innerDrawer"
            :append-to-body="true"
            :with-header="false"
            class="drawer-inner"
        >
          <div class="log-detail-wrapper">
            <div class="detail-title">
              <div class="log-detail-title">
                <div style="font-size: 18px; color: #333; font-weight: 700">日志详情&nbsp;# {{ logDetailData.id }}</div>
                <div class="detail-status" :class="statusClass(logDetailData.status)">
                  {{ formatStatus(logDetailData.status) }}
                </div>
              </div>
              <div class="detail-header-bottom">
                <div>任务名称: {{ props.jobName }}</div>
                <div>执行时长: {{ logDetailData.duration?.toFixed(3) }}秒</div>
              </div>
            </div>

            <div class="detail-body">
              <div class="base-item">
                <h2 class="section-title">基本信息</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">开始时间</div>
                    <div class="info-value">{{ formatTime(logDetailData.start_time) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">结束时间</div>
                    <div class="info-value">{{ formatTime(logDetailData.end_time) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">下次执行时间</div>
                    <div class="info-value">{{ formatTime(logDetailData.next_time) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">执行时长</div>
                    <div class="info-value">{{ logDetailData.duration?.toFixed(3) }}秒</div>
                  </div>
                </div>
              </div>
              <div class="base-item">
                <h2 class="section-title">输出内容</h2>
                <div class="output-content">{{ logDetailData.output }}</div>
              </div>
              <div class="base-item">
                <h2 class="section-title">错误信息</h2>
                <div class="error-content">
                  <span class="empty-error" v-if="!logDetailData.error">无错误信息</span>
                  <span class="empty-error" v-else>{{ logDetailData.error }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-drawer>
      </div>
      <div class="box-pagination">
        <DefaultPagination
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            @pageCurrentChange="handleCurrentChange"
            @pageSizeChange="handleSizeChange"
        />
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 44px;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin: 10px 0;
  padding: 0 10px;
  flex-shrink: 0; /* 防止header被压缩 */
}

.header-left {
  margin-right: auto;
}

.log-body {
  flex: 1;
  overflow: hidden;
  height: calc(100% - 64px); /* 减去header高度和margin */
}

.box-pagination {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.table-column {
  user-select: none;
}

/* 日志详情样式 */

.log-detail-wrapper {
  height: 100%;
}

.detail-title {
  display: flex;
  flex-direction: column;
  height: 90px;
  background-color: #f0f5ff;
  padding: 0 10px;
  border-radius: 10px;
}

.log-detail-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 10px 0;
}

.detail-status {
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 25px;
  background-color: #37cd37;
  color: #fff;
}

.detail-header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
  font-weight: bold;
  padding: 0 2px;
}

/*日志详情主体部分*/
.detail-body {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 5px 10px;
  background-color: rgba(240, 245, 255, 0.8);
  border-radius: 10px;
}

.base-item {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #1890ff;
  margin-right: 8px;
  border-radius: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 6px;
}

.info-label {
  font-size: 13px;
  color: #345;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: #333;
  word-break: break-all;
}

/* 主色调 + 淡色背景 */
.status-success {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.2);
}

.status-danger {
  color: #f5222d;
  background: rgba(245, 34, 45, 0.2);
}

.status-primary {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.2);
}

.status-warning {
  color: #faad14;
  background: rgba(250, 173, 20, 0.2);
}

.status-default {
  color: #909399;
  background: #f4f4f5;
}

.output-content {
  white-space: pre-wrap;
  word-break: break-word; /* 如果内容太长也能断行 */
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
  padding: 12px;
  background: #f1f1f1;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
}

.error-content {
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  color: #f8c4c6;
  line-height: 1.5;
  padding: 12px;
  background: #faf0f0;
  border-radius: 4px;
  border: 1px solid #fadcd9;
}

.empty-error {
  color: #999;
  font-style: italic;
}

/* 确保表格内的滚动正常工作 */
:deep(.el-table__body-wrapper) {
  overflow-y: auto;
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