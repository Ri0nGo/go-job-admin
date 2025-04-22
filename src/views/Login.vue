<template>
    <div class="login-container">
        <div class="login-box">
            <h2>系统登录</h2>
            <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock"
                        show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="handleLogin" class="login-button">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../apis/users'
import { useUserStore } from '../stores/user'

const router = useRouter()
const loading = ref(false)
const loginFormRef = ref()
const userStore = useUserStore()

onMounted(() => {
    const token = localStorage.getItem('token')
    if (token) {
        router.push('/').catch(err => {
            console.warn('路由跳转失败:', err)
        })
    }
})

const loginForm = reactive({
    username: '',
    password: ''
})

const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
}

const handleLogin = async () => {
    if (!loginFormRef.value) return

    await loginFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                // 先设置token再跳转
                await login(loginForm).then((response) => {
                    // 将用户ID存储到Pinia
                    if (response && response.id) {
                        userStore.setUserId(response.id)
                    }
                })
                // 添加延迟确保token设置完成
                await new Promise(resolve => setTimeout(resolve, 50))
                await router.push('/')
            } catch (error) {
                console.log('登录失败:', error)
            } finally {
                loading.value = false
            }
        }
    })
}
</script>

<style scoped>
.login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
}

.login-box {
    width: 350px;
    padding: 30px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-box h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.login-button {
    width: 100%;
}
</style>
