<script setup>
import {ref} from "vue";

const showDrawer = ref(false)
const loading = ref(false)

// 定义操控抽屉的方法
const openDrawer = () => showDrawer.value=true
const closeDrawer = () => {
  showDrawer.value=false
}
const showLoading = () => loading.value=true
const closeLoading = () => loading.value=false

// ---------- 组件的初始化数据 ---------- //
defineProps({
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: "40%"
  },
  direction: {
    type: String,
    default: 'rtl',
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

// ---------- 事件回调 ---------- //
// 声明当前组件可以触发 submit 事件
const emit = defineEmits(['submit', 'close'])
// 主动触发 submit 事件， 父组件通过 @submit="xxx" 来接收子组件传递的事件
const submit = () => emit('submit')
const close = () => emit('close')

defineExpose({
  openDrawer,
  closeDrawer,
  showLoading,
  closeLoading,
})

</script>

<template>
  <el-drawer
      v-model="showDrawer"
      :direction="direction"
      :with-header="false"
      :size="size"
      @close="close"
  >
    <div class="drawer-warpper">
      <div class="drawer-title" >
        {{ title }}
      </div>
      <div class="drawer-body">
        <slot></slot>
      </div>
      <div class="actions">
        <el-button type="primary" @click="submit" class="form-submit" :loading="loading">{{ confirmText }}</el-button>
        <el-button type="default" @click="close">{{ cancelText }}</el-button>
      </div>
    </div>
  </el-drawer>

</template>

<style scoped>
.drawer-warpper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-title {
  color: black;
  height: 64px;
  font-size: 24px;
}
.drawer-body {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* 移除右侧的滚动条 */
.drawer-body::-webkit-scrollbar {
  width: 0px;
}

.form-submit{
  margin-right: 20px;
}
.actions{
  height: 40px;
}
</style>