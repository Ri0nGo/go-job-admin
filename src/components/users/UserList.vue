<template>
  <div class="user-list-container">
    <div class="header-actions">
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入用户名搜索"
          clearable
          @clear="fetchUsers"
          @keyup.enter="fetchUsers"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="nickname" label="昵称" width="200" align="center" />
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="about" label="简介" width="300" align="center" />
      <el-table-column prop="created_time" label="创建时间" align="center"/>
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button text type="primary" size="default" @click="handleEdit(row)">编辑</el-button>
          <el-button text type="primary" size="default" @click="handleDelete(row)">删除</el-button>
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

    <UserEditDialog
      v-model:visible="editDialogVisible"
      :userData="currentUser"
      @refresh="fetchUsers"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, deleteUser } from '@/apis/users'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import UserEditDialog from './UserEditDialog.vue'

// 搜索关键字
const searchKeyword = ref('')

// 表格数据
const tableData = ref([])

// 加载状态
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 编辑对话框相关
const editDialogVisible = ref(false)
const currentUser = ref({})

// 用户编辑对话框组件
const userEditDialogRef = ref(null)

// 获取用户列表数据
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value
    }
    const res = await getUsers(params)
    tableData.value = res.data
    total.value = res.total
  } catch (error) {
    ElMessage.error(error.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    '正常': 'success',
    '禁用': 'danger',
    '待审核': 'warning',
    '未知': 'info'
  }
  return statusMap[status] || 'info'
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUsers()
}

// 新增用户
const handleAdd = () => {
  currentUser.value = {}
  editDialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  currentUser.value = { ...row }
  editDialogVisible.value = true
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      fetchUsers()
    } catch (error) {
      ElMessage.error(error.message || '删除失败')
    }
  })
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-list-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>