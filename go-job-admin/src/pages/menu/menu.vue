<script setup>
import router from "../../router/index.js";
import {ref, watch} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const getIconPath = (filename) => new URL(`/src/assets/${filename}`, import.meta.url).href
watch(
    () => route.path,
    (newPath) => {
      defaultActive.value = newPath;
    }
);
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
    name: "设置",
    frontpath: "/settings",
    icon: "system_mgr.svg",
    children: [
      {
        name: "个人中心",
        frontpath: "/settings/profile",
        icon: "profile.svg"
      }
    ]
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
        :router="false"
        @select="changeMenu"
    >
      <template
          v-for="(item, index) in asideMenus"
          :key="index">
        <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.frontpath">
          <template #title>
            <img
                class="menu-icon"
                :src="getIconPath(item.icon)"
                alt="icon"
                width="20"
                height="20"
            />
            <span>{{item.name}}</span>
          </template>
          <el-menu-item class="sub-menu-item" v-for="(subItem, index) in item.children" :key="index" :index="subItem.frontpath">
            <img
                class="menu-icon"
                :src="getIconPath(subItem.icon)"
                alt="icon"
                width="20"
                height="20"
            />
            <span>{{ subItem.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item class="root-menu-item" v-else :index="item.frontpath">
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

.root-menu-item {
  margin: 2px 15px;
  border-radius: 16px;
}
.sub-menu-item{
  margin: 0 15px;
  border-radius: 16px;
  overflow: hidden;
}
::v-deep(.el-sub-menu .el-sub-menu__title) {
  margin: 2px 15px;
  border-radius: 16px;
  font-size: 16px;
}

::v-deep(.el-menu--popup) {
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

::v-deep(.el-sub-menu__title.is-active) {
  background-color: #a383b6 !important; /* 自定义选中背景色 */
  color: #fff !important; /* 可选：选中文字颜色 */
}

::v-deep(.el-sub-menu__title:hover) {
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