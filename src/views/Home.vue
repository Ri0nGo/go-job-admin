<template>
    <div class="home-container">
        <!-- 上层结构 -->
        <Header />

        <!-- 下层结构 -->
        <el-container class="main-container">
            <!-- 左侧菜单 -->
            <el-aside width="180px" class="left-menu">
                <Menu />
            </el-aside>

            <!-- 右侧内容区 -->
            <el-main class="right-content">
                <div class="content-wrapper">
                    <router-view />
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import Menu from './Menu.vue'

const router = useRouter()

onMounted(() => {
    const token = localStorage.getItem('token')
    if (!token) {
        // 添加延迟确保登录页已完全加载
        setTimeout(() => {
            router.push('/login').catch(err => {
                console.warn('路由跳转失败:', err)
            })
        }, 100)
    }
})
</script>

<style scoped>
.home-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-container {
    flex: 1;
    overflow: hidden;
}

.right-content {
    padding: 16px;
}

.content-wrapper {
    height: 100%;
    border: 1px solid #e6e6e6;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
