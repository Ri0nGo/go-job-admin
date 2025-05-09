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
      <el-aside width="250px">
        <Menu/>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.main{
  height: calc(100vh - 65px);
  padding: 20px;
  background-color: #f7f8fa;
}
</style>
