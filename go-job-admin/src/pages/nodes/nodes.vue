<script setup>

import {Delete, Plus, Search} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {getNodes} from "../../apis/node/node.js";

// ---------- 节点数据初始化 ---------- //
const nodeData = ref(null)

// ---------- 点击按钮 ---------- //
const search = ref(null)

const handleAddNode = async () => {
}
const handleEditNode = async () => {
}
const handleSearch = async () => {
  console.log("search", search.value);
}

// ---------- 功能函数 ---------- //
const fetchNodes = async () => {
  const res = await getNodes({
    page_size: 50,
    page: 1,
  })
  console.log(res)
  nodeData.value = res.data
}

// ---------- 组件初始化 ---------- //
onMounted(() =>{
  fetchNodes()
})


</script>

<template>
<div class="container">
  <el-card class="box-header">
    <div class="box-wrapper">
      <div class="box-left">
        <el-input
            v-model="search"
            placeholder="搜索节点"
            style="width: 240px"
        >
          <template #suffix>
            <el-icon @click="handleSearch" style="cursor: pointer;">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div class="box-right">
        <el-button type="primary" :icon="Plus" @click="handleAddNode">新增任务</el-button>
        <el-button type="danger" :icon="Delete" @click="handleAddNode">删除任务</el-button>
      </div>
    </div>
  </el-card>
  <div class="node-body">
    <div class="node-col" v-for="node in nodeData" :key="node.id">
      <el-card class="node-card">
        <div class="card-header">
          <div class="online-status"></div>
          <div class="online-text">在线</div>
        </div>
        <div class="node-name">
          {{ node.name }}
        </div>
        <div class="content">
          <div>节点地址: <i class="ip-addr">{{ node.address }}</i></div>
          <div class="node-desc">描述: {{
              node.description.length > 40
                  ? node.description.slice(0, 50) + '...'
                  : node.description
            }}</div>
        </div>
        <div class="card-button">
          <el-button type="primary">管理</el-button>
          <el-button type="danger">删除</el-button>
        </div>
      </el-card>
    </div>
  </div>
</div>
</template>

<style scoped>
/* -------- 头部样式 -------- */
.container {
  display: flex;
  flex-direction: column;
}
.box-header{
  border-radius: 12px;
  overflow: hidden;
}
.box-wrapper{
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* -------- 卡片样式 -------- */
.node-body{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.node-card{
  border-radius: 18px;
  overflow: hidden;
}

.node-card:hover{
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.3); /* 鼠标悬浮更明显 */
  background-color: #f9f9f9; /* 柔和背景变化 */
}

/* -------- 卡片内部样式 -------- */
.card-header{
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 18px;
  font-size: 20px;
  color: #000;
}

.online-status{
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: #8ac78a;
  margin-right: 8px;
}

.node-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.content{
  font-size: 16px;
  color: #666;
  height: 120px;
}

.content div{
  padding: 10px 0;
}

.ip-addr {
  font-family: monospace;
  font-weight: 500;
  font-size: 15px;
}

.card-button{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

</style>