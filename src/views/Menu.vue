<template>
    <div class="menu-box">
        <div class="menu-main">
            <!-- router属性用于开启路由模式，当开启时菜单项的index值会被用作导航路由的路径 -->
            <el-menu class="menu-container" :default-active="activeMenu" background-color="#fff" text-color="#000"
                active-text-color="#2a6ff6" router>

                <el-menu-item index="/">
                    <el-icon>
                        <House />
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="/jobs">
                    <el-icon>
                        <Tickets />
                    </el-icon>
                    <span>任务列表</span>
                </el-menu-item>
                <el-menu-item index="/nodes">
                    <el-icon>
                        <Monitor />
                    </el-icon>
                    <span>节点管理</span>
                </el-menu-item>
                <el-menu-item index="/users">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>用户管理</span>
                </el-menu-item>
            </el-menu>
        </div>
    </div>


</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { House, Tickets, Monitor, User } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.menu-box {
    height: 100%;
    background-color: fff;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.menu-main {
    height: 100%;
}

.menu-container {
    height: 100%;
    transition: width 0.3s;
    padding: 0 5px;
}

.el-menu-item {
    margin: 5px;
    display: flex;
    align-items: center;
    border-radius: 8px;
    transition: background-color 0.3s;

    &:hover {
        background-color: rgba(240, 240, 240, 0.8) !important;
        border-radius: 8px;
    }
}

.el-menu-item.is-active {
    background-color: rgb(149, 193, 235, 0.2) !important;
    border-radius: 8px;
}

.el-icon {
    margin-right: 8px;
    font-size: var(--el-font-size-large);
}
</style>