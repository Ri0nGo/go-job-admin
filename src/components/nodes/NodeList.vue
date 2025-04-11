<template>
  <div class="node-list-container">
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="节点ID" width="180" />
      <el-table-column prop="name" label="节点名称" width="180" />
      <el-table-column prop="ip" label="IP地址" width="180" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
</template>

<script setup>
import { ref } from 'vue'

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '节点-01',
    ip: '192.168.1.100',
    status: '在线',
    createTime: '2024-01-20 10:00:00'
  },
  {
    id: 2,
    name: '节点-02',
    ip: '192.168.1.101',
    status: '离线',
    createTime: '2024-01-19 15:30:00'
  }
])

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

// 分页方法
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
  // TODO: 重新获取数据
}

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
  // TODO: 重新获取数据
}

// 操作方法
const handleEdit = (row) => {
  console.log('编辑节点', row)
}

const handleDelete = (row) => {
  console.log('删除节点', row)
}
</script>

<style scoped>
.node-list-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 上下对齐 */
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>