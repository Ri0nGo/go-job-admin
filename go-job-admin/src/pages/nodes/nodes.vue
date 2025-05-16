<script setup>

import {Plus, Search, MoreFilled} from "@element-plus/icons-vue";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {createNode, deleteNode, getNodeInfo, getNodes, installNodeRef, updateNode} from "../../apis/node/node.js";
import FormDrawer from "../../components/formDrawer/formDrawer.vue";
import {notify} from "../../utils/notification.js";

// ---------- 节点数据初始化 ---------- //
const nodeData = ref(null)
const formRef = ref(null)
const formDrawerRef = ref(null)
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
  } catch (error) {
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
  } else {
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


// ---------- 卡片头部右侧操作 ---------- //
const handleMoreOperation = async (item) => {
  switch (item.action) {
    case "install_ref":
      formDrawerInstallRef.value.openDrawer()
      formInstallRefData.value.id = item.row.id;
      return
    case "info":
      formDrawerNodeInfoRef.value.openDrawer()
      fetchNodeInfo(item.row.id)
      return;
  }
}

// ---------- 卡片头部右侧操作 - 安装依赖包 ---------- //
const installRefRules = {
  pkg_name: [
    {
      required: true,   // 表示这是必填项
      message: '依赖包不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ], type: [
    {
      required: true,   // 表示这是必填项
      message: '运行时环境不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ]
}
const installRefOptions = [
  {
    value: 'py',
    label: 'Python',
  }
]
const formDrawerInstallRef = ref(null)
const formInstallRef = ref(null)
const initFormInstallRefData = {
  id: 0,
  pkg_name: "",
  type: "py"
}
const formInstallRefData = ref({...initFormInstallRefData})

const onInstallRefSubmit = async () => {
  if (formInstallRef.value) {
    const valid = await formInstallRef.value.validate()
    if (!valid) {
      return
    }
  }
  formDrawerInstallRef.value.showLoading()
  try {
    const res = await installNodeRef(formInstallRefData.value)
    notify(`安装包: ${res.pkg_name}, 版本: ${res.version}`, "success", "安装成功")
    formInstallRef.value.resetFields();
    formInstallRefData.value = ref({...initFormInstallRefData})
  } finally {
    formDrawerInstallRef.value.closeLoading()
    formDrawerInstallRef.value.closeDrawer()
  }


}
const onInstallRefClose = () => {
  formDrawerInstallRef.value.closeLoading()
  formDrawerInstallRef.value.closeDrawer()
}

// ---------- 卡片头部右侧操作 - 节点信息 ---------- //
const formDrawerNodeInfoRef = ref(null)
const nodeInfoData = ref({
  version: "",
  packages: {}
})
const pkgSearch = ref(null)

const fetchNodeInfo = async (id) => {
  const res = await getNodeInfo(id)
  nodeInfoData.value.version = res.version

  for (const pkg of res.packages) {
    if (pkg.length === 0) {
      continue;
    } else if (pkg.includes("==")) {
      const [name, pkg_version] = pkg.split("==");
      nodeInfoData.value.packages[name] = pkg_version;
    } else {
      nodeInfoData.value.packages[pkg] = "";  // 修复这里，pkg 作为 name
    }
  }
}

const onNodeSearch = () => {
  console.log(pkgSearch.value)
}

const filteredPackages = computed(() => {
  if (!pkgSearch.value) {
    return nodeInfoData.value.packages
  }
  const searchLower = pkgSearch.value.toLowerCase()
  // 过滤名字里包含输入内容的包
  return Object.fromEntries(
      Object.entries(nodeInfoData.value.packages)
          .filter(([name]) => name.toLowerCase().includes(searchLower))
  )
})

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
          <div class="header-card">
            <div class="header-left">
              <div :class="node.online ? 'online-status': 'offline-status'"></div>
              <div :class="['online-text', node.online ? '' : 'offline-color']">{{
                  node.online ? '在线' : '离线'
                }}
              </div>
            </div>
            <div class="header-right">
              <el-dropdown style="width: 32px" @command="handleMoreOperation">
                <span class="el-dropdown-link">
                  <el-icon style="font-size: 22px;">
                    <MoreFilled/>
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="card-dropdown">
                    <el-dropdown-item class="dropdown-item" :command="{ action: 'install_ref', row: node }">安装依赖包
                    </el-dropdown-item>
                    <el-dropdown-item class="dropdown-item" :command="{ action: 'info', row: node }">节点信息
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
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

    <FormDrawer
        ref="formDrawerInstallRef"
        title="安装依赖"
        size="30%"
        confirmText="确认安装"
        @submit="onInstallRefSubmit"
        @close="onInstallRefClose"
    >
      <el-form
          ref="formInstallRef"
          :rules="installRefRules"
          :model="formInstallRefData"
          label-width="100px">

        <el-form-item label="运行时环境" prop="type">
          <el-select
              v-model="formInstallRefData.type"
              placeholder="Select"
              style="width: 240px"
          >
            <el-option
                v-for="item in installRefOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="依赖包名称" prop="pkg_name">
          <el-input
              v-model="formInstallRefData.pkg_name"
              placeholder="请输入依赖包, numpy=1.22.0"
              style="width: 240px;"
          />
        </el-form-item>
      </el-form>
    </FormDrawer>

    <FormDrawer
        ref="formDrawerNodeInfoRef"
        title="节点信息"
        size="32%"
        :showButton="false"
    >
      <div class="node-info-box">
        <div class="info-header">
          <div style="font-size: 22px; font-weight: bold; color: #fff">Python 3.10.11</div>
          <svg width="40" height="40" viewBox="0 0 300 300" style="overflow: visible;">
            <g>
              <path
                  d="M116.948 0C58.063 0 62.399 26.118 62.399 26.118L62.469 53.195H118.225V62.399H39.113C39.113 62.399 0 58.406 0 117.239C0 176.068 34.052 173.394 34.052 173.394H54.56V145.373C54.56 145.373 53.166 111.328 88.052 111.328H143.379C143.379 111.328 176.875 112.339 176.875 79.376V29.897C176.875 29.897 181.573 0 116.948 0zM85.826 17.632C95.153 17.632 102.621 25.099 102.621 34.426C102.621 43.753 95.153 51.221 85.826 51.221C76.499 51.221 69.032 43.753 69.032 34.426C69.032 25.099 76.499 17.632 85.826 17.632z"
                  fill="#3776AB"/>
              <path
                  d="M117.729 235.676C176.612 235.676 172.276 209.559 172.276 209.559L172.206 182.481H116.45V173.278H195.564C195.564 173.278 234.676 177.271 234.676 118.437C234.676 59.608 200.625 62.282 200.625 62.282H180.116V90.304C180.116 90.304 181.511 124.349 146.625 124.349H91.297C91.297 124.349 57.799 123.337 57.799 156.301V205.779C57.799 205.779 53.103 235.676 117.729 235.676zM148.849 218.044C139.522 218.044 132.055 210.575 132.055 201.249C132.055 191.922 139.522 184.454 148.849 184.454C158.177 184.454 165.644 191.922 165.644 201.249C165.644 210.575 158.177 218.044 148.849 218.044z"
                  fill="#FFD43B"/>
            </g>
          </svg>
        </div>
        <div class="info-body">
          <div class="body-top">
            <div style="font-size:16px; font-weight: bold; margin-bottom: 6px;">Installed Packages</div>
            <el-input
                v-model="pkgSearch"
                class="node-search"
                placeholder="Search package"
                :suffix-icon="Search"
                @suffix-icon-click="onNodeSearch"
            />
          </div>
          <div class="pkg-list">
            <div class="pkg-detail" v-for="(version, name) in filteredPackages" :key="name">
              <span class="pkg-name">{{ name }}</span>
              <span>{{ version }}</span>
            </div>
          </div>
        </div>
      </div>

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
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin: 20px 0;
}

.node-card {
  border-radius: 18px;
  overflow: hidden;
}

/* -------- 卡片内部样式 -------- */

.header-card {
  display: flex;
  justify-content: space-between;
}

.header-left {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 18px;
  font-size: 20px;
  color: #000;
}

.offline-bgc {
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


.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-dropdown * {
  outline: none;
}

/* ---------- 安装依赖 --------- */


/* -------- 卡片主体样式 -----------*/

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

/* -------- 节点信息样式 -----------*/

.node-info-box {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 8px;
  border-radius: 12px;
  background-color: rgba(2, 132, 199, 0.6);
}

.info-body {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding: 8px;
  border: 2px solid #ccc;
  background-color: rgba(239, 246, 255, 0.2);
  border-radius: 12px;
}

.body-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 16px;
}

.pkg-detail {
  height: 32px;
  line-height: 32px;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 0 12px;
  background-color: rgba(239, 246, 255);
  margin-bottom: 8px;
}

.pkg-name {
  width: 200px;
  display: inline-block;
}

.node-search {
  width: 240px;
}

::v-deep(.node-search .el-input__wrapper) {
  border-radius: 30px;
  border: 1px solid #ccc;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

</style>