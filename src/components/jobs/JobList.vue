<template>
  <div class="job-list-container">
    <div class="job-nav">
      <div class="operation-bar">
        <div class="left-operations">
          <el-button type="primary" @click="handleAdd">新增任务</el-button>
          <el-button type="danger" @click="handleBatchDelete" :disabled="!selectedRows.length">批量删除</el-button>
        </div>
        <div class="right-operations">
          <el-input v-model="searchKeyword" placeholder="请输入任务名称" style="width: 200px" clearable>
            <template #suffix>
              <el-icon class="search-icon" @click="handleSearch">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <div class="job-content">
      <el-table :data="tableData" v-loading="loading" :row-height="50" :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }" style="font-size: 15px;">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="任务ID" width="80" align="center" />
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="node_name" label="节点名称" />
        <el-table-column prop="exec_type" label="执行方式" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getExecTypeTagType(scope.row.exec_type)" size="default" style="letter-spacing: 1px;">
              {{ getExecTypeName(scope.row.exec_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cron_expr" label="表达式" align="center">
          <template #default="scope">
            <el-tag size="default"
              style="font-family: monospace; margin: 2px; background-color: #eee; border: 0; color: #666;">
              {{ scope.row.cron_expr }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="active" label="状态" width="80" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.active" :active-value="1" :inactive-value="2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ececec" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间">
          <template #default="scope">
            {{ formatTime(scope.row.created_time) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" align="center">
          <template #default="scope">
            <div style="display: flex; justify-content: center; gap: 8px;">
              <el-button text type="primary" size="default" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button text type="primary" size="default" @click="handleDelete(scope.row)">删除</el-button>
              <el-button text type="primary" size="default" @click="handleViewRecords(scope.row)">日志</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="content-button">
        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            layout="total, prev, pager, next, sizes, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>


      <!-- 编辑任务对话框 -->
      <JobEditDialog v-model:visible="editDialogVisible" :job-data="currentJob" @refresh="fetchJobs" />
      <!-- 创建任务对话框 -->
      <CreateJob v-model:visible="createDialogVisible" @refresh="fetchJobs" />
      <!-- 任务记录对话框 -->
      <JobRecords v-model:visible="recordsDialogVisible" :job-id="selectedJobId" />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getJobs, deleteJob, updateJob } from '@/apis/jobs'
import JobEditDialog from './JobEditDialog.vue'
import { Search } from '@element-plus/icons-vue'
import CreateJob from './CreateJob.vue'
import JobRecords from './JobRecords.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// 搜索关键字
const searchKeyword = ref('')
// 选中的行
const selectedRows = ref([])

// 表格数据
const tableData = ref([])
// 加载状态
const loading = ref(false)
// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 获取任务列表数据
const fetchJobs = async () => {
  loading.value = true
  try {
    const res = await getJobs({
      page_size: pageSize.value,
      page_num: currentPage.value
    })
    tableData.value = res.data
    total.value = res.total
  } catch (err) {
    console.error('获取任务列表失败:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchJobs()
})

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchJobs()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchJobs()
}

// 状态标签类型
const getStatusType = (active) => {
  const statusMap = {
    1: '启用',
    2: '停用',
  }
  return statusMap[active] || ''
}

// 执行类型标签样式
const getExecTypeTagType = (type) => {
  const typeMap = {
    1: 'primary',
    2: 'primary',
    3: 'primary'
  }
  return typeMap[type] || ''
}

// 执行类型名称
const getExecTypeName = (type) => {
  const nameMap = {
    1: 'Shell',
    2: 'Http',
    3: 'File'
  }
  return nameMap[type] || ''
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString()
}

// 编辑对话框相关
const editDialogVisible = ref(false)
const createDialogVisible = ref(false)
const recordsDialogVisible = ref(false)
const currentJob = ref({})
const selectedJobId = ref(null)

// 操作方法
const handleEdit = (row) => {
  currentJob.value = { ...row }
  editDialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteJob(row.id)
      fetchJobs()
    } catch (error) {
      ElMessage.error('删除失败：' + error.message)
    }
  })
}

// 状态切换
const handleStatusChange = async (row) => {
  try {
    await updateJob(row)
    ElMessage.success('状态更新成功')
    fetchJobs()
  } catch (error) {
    ElMessage.error('状态更新失败：' + error.message)
    // 恢复状态
    row.active = row.active === 1 ? 2 : 1
  }
}

// 新增任务
const handleAdd = () => {
  currentJob.value = {}
  createDialogVisible.value = true
}

// 批量删除
const handleBatchDelete = () => {
  console.log('批量删除', selectedRows.value)
  // TODO: 调用批量删除API
}

// 搜索任务
const handleSearch = () => {
  console.log('搜索关键字:', searchKeyword.value)
  // TODO: 调用搜索API
}

// 查看任务记录
const handleViewRecords = (row) => {
  if (row && row.id) {
    selectedJobId.value = row.id
    recordsDialogVisible.value = true
  } else {
    ElMessage.warning('无法获取任务ID，请重试')
  }
}

// 表格选择事件
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}
</script>

<style scoped>
.job-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.job-nav {
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
}

.operation-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-operations {
  display: flex;
  gap: 10px;
}

.right-operations {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.job-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.el-table {
  flex: 1;
  overflow: hidden;
}

.content-button {
  margin-top: auto;
}

.pagination-container {
  padding: 15px 0;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
}

::v-deep(.el-pagination__sizes .el-select) {
  width: 100px !important;
  font-size: 14px;
}

::v-deep(.el-tag) {
  transition: none !important;
}

.content-button {
  padding-right: 30px;
  height: 60px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-operations {
  display: flex;
  gap: 10px;
}

.right-operations {
  display: flex;
  align-items: center;
}

.search-icon {
  cursor: pointer;
  color: #409eff;
}

.search-icon:hover {
  color: #79bbff;
}
</style>