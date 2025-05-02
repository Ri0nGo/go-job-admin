<script setup>
import Header from "@/pages/header/header.vue"
import Menu from "@/pages/menu/menu.vue"
</script>

<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside>
        <Menu/>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.main {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  position: fixed;
  top: 65px;
  left: 250px;
  right: 0;
  bottom: 0;
  background-color: #ececec;
}
</style>