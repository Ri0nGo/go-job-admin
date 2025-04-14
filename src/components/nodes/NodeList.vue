<template>
  <div class="node-list-container">
    <div class="node-nav">
      <div class="operation-bar">
        <div class="left-operations">
          <el-button type="primary" @click="handleAdd">新增节点</el-button>
        </div>
        <div class="right-operations">
          <el-input v-model="searchKeyword" placeholder="请输入节点名称" style="width: 200px" clearable>
            <template #suffix>
              <el-icon class="search-icon" @click="handleSearch">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" v-loading="loading" :row-height="50" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
      <el-table-column prop="id" label="节点ID" width="120" />
      <el-table-column prop="name" label="节点名称" width="180" />
      <el-table-column prop="address" label="地址" width="180" />
      <el-table-column prop="description" label="描述" width="300" />
      <!-- <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button text type="primary" size="default" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button text type="primary" size="default" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

  <!-- 编辑节点对话框 -->
  <NodeEditDialog v-model:visible="editDialogVisible" :node-data="currentNode" @refresh="fetchNodes" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNodes, deleteNode } from '@/apis/nodes'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import NodeEditDialog from './NodeEditDialog.vue'

// 编辑对话框相关
const editDialogVisible = ref(false)
const currentNode = ref({})

// 搜索关键字
const searchKeyword = ref('')

// 表格数据
const tableData = ref([])

// 获取节点列表数据
const fetchNodes = async () => {
  loading.value = true
  try {
    const res = await getNodes({
      page_size: pageSize.value,
      page_num: currentPage.value
    })
    console.log("res: ", res)
    tableData.value = res.data || []
    // 如果后端返回了总数，更新total
    if (res.total) {
      total.value = res.total
    }
  } catch (err) {
    console.error('获取节点列表失败:', err)
  } finally {
    loading.value = false
  }
}

// 在组件挂载时获取数据
onMounted(() => {
  fetchNodes()
})

// 加载状态
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    '在线': 'success',
    '离线': 'danger',
    '维护中': 'warning',
    '未知': 'info'
  }
  return statusMap[status] || 'info'
}

// 格式化日期，只显示到天
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.split(' ')[0] // 假设日期格式为 'YYYY-MM-DD HH:MM:SS'，取第一部分
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchNodes()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchNodes()
}

// 操作方法
const handleEdit = (row) => {
  currentNode.value = { ...row }
  editDialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该节点吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteNode(row.id)
      ElMessage.success('删除成功')
      fetchNodes()
    } catch (error) {
      ElMessage.error('删除失败：' + error.message)
    }
  })
}

// 新增节点
const handleAdd = () => {
  currentNode.value = {}
  editDialogVisible.value = true
}

// 搜索节点
const handleSearch = () => {
  console.log('搜索关键字:', searchKeyword.value)
  // TODO: 调用搜索API
  fetchNodes()
}
</script>

<style scoped>
.node-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.node-nav {
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

.search-icon {
  cursor: pointer;
  color: #409eff;
}

.search-icon:hover {
  color: #79bbff;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
</style>