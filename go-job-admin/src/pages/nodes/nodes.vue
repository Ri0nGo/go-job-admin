<script setup>

import {Plus, Search} from "@element-plus/icons-vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {createNode, deleteNode, getNodes, updateNode} from "../../apis/node/node.js";
import FormDrawer from "../../components/formDrawer/formDrawer.vue";
import {notify} from "../../utils/notification.js";

// ---------- 节点数据初始化 ---------- //
const nodeData = ref(null)
const formRef = ref(null)
const formDrawerRef =ref(null)
const operationId = ref(0)
const initFormData = {
  name: "",
  description: "",
  address: "",
}
const formData = ref({...initFormData})

// ---------- 点击按钮 ---------- //
const search = ref(null)

const handleAddNode = async () => {
  formDrawerRef.value.openDrawer()
  operationId.value = 0
  resetForm()
}
const handleEditNode = async (row) => {
  formDrawerRef.value.openDrawer()
  operationId.value = row.id
  resetForm(row)
}
const handleDeleteNode = async (row) => {
  try {
    await deleteNode(row.id)
    notify("删除成功")
    fetchNodes()
  }catch(error) {
    console.log("删除节点错误:", error)
  }

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
  nodeData.value = res.data
}

const resetForm = (row) => {
  if (formRef.value) {
    formRef.value.resetFields();
  }

  if (row) {
    for (const key in row) {
      formData.value[key] = row[key];
    }
  }else{
    formData.value = {...initFormData}
  }
}

// ---------- 组件初始化 ---------- //
let timer = null;
const interval = 5000;
onMounted(() => {
  fetchNodes();
  timer = setInterval(fetchNodes, interval);
})

onBeforeUnmount(() => {
  clearInterval(timer);
});

// ---------- 右侧新增，编辑抽屉 ---------- //
const onSubmit = async () => {
  if (formRef.value) {
    const valid = await formRef.value.validate()
    if (!valid) {
      return
    }
  }
  formDrawerRef.value.showLoading()
  try {
    await (operationId.value === 0 ? createNode(formData.value) : updateNode(formData.value))
    await fetchNodes()
    resetForm()
  } finally {
    formDrawerRef.value.closeLoading()
    formDrawerRef.value.closeDrawer()
  }
}

const onClose = () => {
  formDrawerRef.value.closeDrawer()
}

const rules = {
  name: [
    {
      required: true,   // 表示这是必填项
      message: '节点名称不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ], address: [
    {
      required: true,   // 表示这是必填项
      message: '节点地址不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ]
}


</script>

<template>
  <div class="container">
    <el-card class="box-header">
      <div class="box-wrapper">
        <div class="box-left">
          <span style="font-size: 16px;margin-right: 8px;">查找节点:</span>
          <el-input
              v-model="search"
              placeholder="搜索节点"
              style="width: 240px"
          >
            <template #suffix>
              <el-icon @click="handleSearch" style="cursor: pointer;">
                <Search/>
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="box-right">
          <el-button type="primary" :icon="Plus" @click="handleAddNode">新增节点</el-button>
        </div>
      </div>
    </el-card>
    <div class="node-body">
      <div class="node-col" v-for="node in nodeData" :key="node.id">
        <el-card :class="['node-card', node.online ? '' : 'offline-bgc']">
          <div class="card-header">
            <div :class="node.online ? 'online-status': 'offline-status'"></div>
            <div :class="['online-text', node.online ? '' : 'offline-color']">{{ node.online ? '在线' : '离线' }}</div>
          </div>
          <div class="node-name">
            {{ node.name }}
          </div>
          <div class="content">
            <div>节点地址: <span class="ip-addr">{{ node.address }}</span></div>
            <div class="node-desc">描述: {{
                node.description.length > 40
                    ? node.description.slice(0, 50) + '...'
                    : node.description
              }}
            </div>
          </div>
          <div class="card-button">
            <el-button type="primary" @click="handleEditNode(node)">管理</el-button>
            <el-button type="danger" @click="handleDeleteNode(node)">删除</el-button>
          </div>
        </el-card>
      </div>
    </div>

    <FormDrawer
        ref="formDrawerRef"
        :title="operationId === 0? '新增节点' : '修改节点'"
        @submit="onSubmit"
        @close="onClose"
    >
      <el-form
          ref="formRef"
          :rules="rules"
          :model="formData"
          label-width="100px">

        <el-form-item label="节点名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入节点名称"/>
        </el-form-item>
        <el-form-item label="节点地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入节点地址"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<style scoped>
/* -------- 头部样式 -------- */
.container {
  display: flex;
  flex-direction: column;
}

.box-header {
  border-radius: 12px;
  overflow: hidden;
}

.box-wrapper {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* -------- 卡片样式 -------- */
.node-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  margin: 20px 0;
}

.node-card {
  border-radius: 18px;
  overflow: hidden;
}

.node-card:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(43, 197, 50, 0.2); /* 鼠标悬浮更明显 */
  background-color: #f9f9f9; /* 柔和背景变化 */
}
.offline-bgc:hover{
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(218, 48, 28, 0.2); /* 鼠标悬浮更明显 */
  background-color: rgba(243, 229, 224, 0.5);
}

/* -------- 卡片内部样式 -------- */
.card-header {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 18px;
  font-size: 20px;
  color: #000;
}
.offline-bgc{
  background-color: rgba(243, 229, 224, 0.5);
}
.offline-color {
  color: #999;
}

.online-status {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #31d131;
  margin-right: 8px;
}

.offline-status {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ea2418;
  margin-right: 8px;
}

.node-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.content {
  font-size: 16px;
  color: #666;
  height: 120px;
}

.content div {
  padding: 10px 0;
}

.ip-addr {
  font-family: Consolas, Menlo, Monaco, 'Courier New', monospace;
  font-weight: 500;
  font-size: 15px;
}

.card-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

</style>