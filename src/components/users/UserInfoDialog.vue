<template>
    <el-dialog
        v-model="dialogVisible"
        title="个人信息"
        width="50%"
        :close-on-click-modal="false"
    >
        <el-card class="user-info-card">
            <template #header>
                <div class="card-header">
                    <el-avatar :size="64" :icon="UserFilled" />
                    <h2>{{ userInfo.username }}</h2>
                </div>
            </template>
            <div class="info-content">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="用户ID">
                        {{ userInfo.id }}
                    </el-descriptions-item>
                    <el-descriptions-item label="用户名">
                        {{ userInfo.username }}
                    </el-descriptions-item>
                    <el-descriptions-item label="昵称">
                        {{ userInfo.nickname || '-' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="邮箱">
                        {{ userInfo.email || '-' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间">
                        {{ formatDate(userInfo.created_time) }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-card>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const userInfo = ref({
    id: '',
    username: '',
    nickname: '',
    email: '',
    created_time: '',
})

// 格式化时间为年月日格式
const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 暴露方法给父组件
defineExpose({
    dialogVisible,
    userInfo
})
</script>

<style scoped>
.user-info-card {
    margin: 0;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 20px;
}

.card-header h2 {
    margin: 0;
    font-size: 24px;
    color: #303133;
}

.info-content {
    margin-top: 20px;
}

:deep(.el-descriptions__cell) {
    padding: 12px 20px;
}

:deep(.el-descriptions__label) {
    font-weight: bold;
    color: #606266;
    width: 120px;
}
</style>