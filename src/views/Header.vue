<template>
    <el-header class="top-header" height="64px">
        <div class="header-left">
            <h1>任务管理系统</h1>
        </div>
        <div class="header-right">
            <el-dropdown>
                <span class="user-info">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span style="color: #333;">admin</span>
                    <el-icon>
                        <CaretBottom />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleViewUserInfo">个人信息</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item @click="bindEmailDialogRef.dialogVisible = true">绑定邮箱</el-dropdown-item>
                        <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
    <BindEmailDialog ref="bindEmailDialogRef" />
    <UserInfoDialog ref="userInfoDialogRef" />
</template>

<script setup>
import { User, CaretBottom } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUser } from '@/apis/users'
import BindEmailDialog from '@/components/users/BindEmailDialog.vue'
import UserInfoDialog from '@/components/users/UserInfoDialog.vue'

const router = useRouter()
const userStore = useUserStore()
const bindEmailDialogRef = ref(null)
const userInfoDialogRef = ref(null)

const handleViewUserInfo = async () => {
    const userId = userStore.getUserId
    console.log(userId)
    if (userId) {
        try {
            const response = await getUser(userId)
            if (response) {
                userInfoDialogRef.value.userInfo = response
                userInfoDialogRef.value.dialogVisible = true
            }
        } catch (error) {
            console.error('获取用户信息失败:', error)
        }
    }
}

const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
}
</script>

<style scoped>
.top-header {
    background-color: #fff;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    margin-bottom: 12px;
    border-bottom: 2px solid #e6e6e6;
    box-shadow: 0 1px 2px rgba(24, 24, 24, 0.05);
}

.header-left {
    display: flex;
    align-items: center;
}

.header-left h1 {
    margin: 0;
    font-size: 20px;
}

.header-right {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #fff;
    font-size: 14px;
}

.user-info:hover {
    opacity: 0.9;
}

.el-icon {
    margin: 0;
}
</style>