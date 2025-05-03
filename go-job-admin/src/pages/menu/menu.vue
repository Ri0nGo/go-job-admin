<script setup>
import router from "../../router/index.js";
import {ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const getIconPath = (filename) => new URL(`/src/assets/${filename}`, import.meta.url).href

const asideMenus = [
  {
    name: "首页",
    frontpath: "/",
    icon: "index.svg"
  }, {
    name: "任务管理",
    frontpath: "/jobs",
    icon: "job_mgr.svg"
  }, {
    name: "节点管理",
    frontpath: "/nodes",
    icon: "node_mgr.svg"
  }, {
    name: "系统管理",
    frontpath: "/systems",
    icon: "system_mgr.svg"
  }
]

// ---------- 菜单切换 ---------- //

const changeMenu = (menu) => {
  router.push(menu);
}

const defaultActive = ref(route.path)

</script>

<template>
  <div class="menu-container">
    <el-menu
        class="menu-box"
        :default-active="defaultActive"
        :collapse-transition="false"
        @select="changeMenu"
    >
      <template
          v-for="(item, index) in asideMenus"
          :key="index">
        <el-menu-item :index="item.frontpath">
          <img
              class="menu-icon"
              :src="getIconPath(item.icon)"
              alt="icon"
              width="20"
              height="20"
          />
          <span class="menu-name">{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>

.menu-container {
  transition: all 0.2s;
  overflow-y: auto;
  overflow-x: hidden;
  width: 250px;
  height: 100%;
  position: fixed;
  top: 65px;
  left: 0;
  bottom: 0;
  background-color: white;
}
.menu-container::-webkit-scrollbar{
  width: 0;
}

.menu-box{
  border: 0;
}

.el-menu-item {
  margin: 2px 15px;
  border-radius: 16px;
}

::v-deep(.el-menu-item.is-active) {
  background-color: #a383b6 !important; /* 自定义选中背景色 */
   color: #fff !important; /* 可选：选中文字颜色 */
}

::v-deep(.el-menu-item:hover) {
  background-color: #f2edf5; /* 自定义选中背景色 */
  color: #000;  /* 可选：选中文字颜色 */
}


.menu-box{
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.menu-icon {
  margin-right: 8px;
}
.menu-name{
  font-size: 16px;
}
</style>