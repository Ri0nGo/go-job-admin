<template>
  <el-dialog v-model="visible" title="任务执行记录" width="1000px" :modal-append-to-body="true" :close-on-click-modal="false">
    <el-table :data="recordData" v-loading="loading" :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ textAlign: 'center' }" style="font-size: 15px;" height="550" :max-height="650"
      virtual-scrolling>
      <el-table-column prop="job_id" label="任务ID" width="80" align="center" />
      <el-table-column prop="status" label="执行状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="default">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="start_time" label="开始时间" width="160">
        <template #default="{ row }">
          {{ formatTime(row.start_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="end_time" label="结束时间" width="160">
        <template #default="{ row }">
          {{ formatTime(row.end_time) }}
        </template>
      </el-table-column>
      <el-table-column label="耗时" width="80" align="center">
        <template #default="{ row }">
          {{ calculateDuration(row.start_time, row.end_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="next_time" label="下次执行时间" width="160">
        <template #default="{ row }">
          {{ formatTime(row.next_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button text type="primary" size="default" @click="handleDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <!-- 详情对话框 -->
  <el-dialog v-model="detailVisible" title="执行详情" width="800px" append-to-body>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="任务ID">{{ currentRecord?.job_id }}</el-descriptions-item>
      <el-descriptions-item label="执行状态">
        <el-tag :type="getStatusType(currentRecord?.status)" size="default">
          {{ getStatusText(currentRecord?.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="输出">
        <el-input
          v-model="currentRecord.output"
          type="textarea"
          :rows="8"
          readonly
          placeholder="无输出"
        />
      </el-descriptions-item>
      <el-descriptions-item label="异常信息">
        <el-input
          v-model="currentRecord.error"
          type="textarea"
          :rows="4"
          readonly
          placeholder="无异常"
        />
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getJobRecords, getJobRecord } from '@/apis/jobRecords'
import { ElMessage } from 'element-plus'

// 对话框可见性
const visible = defineModel('visible')
// 任务ID
const props = defineProps({
  jobId: {
    type: [String, Number],
    required: true
  }
})

// 表格数据
const recordData = ref([])
// 加载状态
const loading = ref(false)
// 详情对话框可见性
const detailVisible = ref(false)
// 当前选中的记录
const currentRecord = ref({})

// 获取任务记录数据
const fetchRecords = async () => {
  loading.value = true
  try {
    const res = await getJobRecords({ job_id: props.jobId })
    recordData.value = res.data.map(item => ({
      ...item,
      next_time: item.next_exec_time
    }))
  } catch (err) {
    console.error('获取任务记录失败:', err)
  } finally {
    loading.value = false
  }
}

// 监听对话框显示状态，只在显示时加载数据
watch(visible, (newVal) => {
  if (newVal) {
    fetchRecords()
  }
})

// 状态类型
const getStatusType = (status) => {
  const statusMap = {
    0: 'primary',
    1: 'warning',
    2: 'success',
    3: 'danger'
  }
  return statusMap[status] || 'info'
}

// 状态文本
const getStatusText = (status) => {
  const textMap = {
    0: '待执行',
    1: '运行中',
    2: '成功',
    3: '失败'
  }
  return textMap[status] || '未知'
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// 计算耗时
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '-'
  const start = new Date(startTime)
  const end = new Date(endTime)
  const duration = end - start
  
  if (duration < 0) return '-'
  
  if (duration < 1000) return `${duration}ms`
  if (duration < 60000) return `${Math.floor(duration / 1000)}s`
  if (duration < 3600000) return `${Math.floor(duration / 60000)}m ${Math.floor((duration % 60000) / 1000)}s`
  return `${Math.floor(duration / 3600000)}h ${Math.floor((duration % 3600000) / 60000)}m`
}

// 查看详情
const handleDetail = async (row) => {
  try {
    const res = await getJobRecord(row.id)
    console.log("res -->", res )
    if (res) {
      currentRecord.value = res
      detailVisible.value = true
    } else {
      ElMessage.error('获取任务详情失败：数据为空')
    }
  } catch (err) {
    console.error('获取任务详情失败:', err)
    ElMessage.error('获取任务详情失败：' + err.message)
  }
}
</script>

<style scoped>
.el-dialog {
  --el-dialog-margin-top: 10vh;
  display: flex;
  flex-direction: column;
}

.el-dialog__body {
  flex: 1;
  overflow: hidden;
}
</style>