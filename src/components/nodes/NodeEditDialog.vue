<template>
  <el-dialog
    v-model="dialogVisible"
    :title="form.id ? '编辑节点' : '新增节点'"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" label-position="right">
      <el-form-item label="节点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入节点名称" />
      </el-form-item>
      
      <el-form-item label="节点地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入节点地址" />
      </el-form-item>
      
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入节点描述"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createNode, updateNode } from '@/apis/nodes'

// 对话框可见性
const dialogVisible = defineModel('visible')

// 节点数据
const props = defineProps({
  nodeData: {
    type: Object,
    default: () => ({})
  }
})

// 表单数据
const form = ref({
  id: '',
  name: '',
  address: '',
  description: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入节点名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入节点地址', trigger: 'blur' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' }
  ]
}

// 表单引用
const formRef = ref(null)
// 加载状态
const loading = ref(false)

// 监听节点数据变化
watch(() => props.nodeData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    form.value = { ...newVal }
  } else {
    form.value = {
      id: '',
      name: '',
      address: '',
      description: ''
    }
  }
}, { deep: true })

// 定义emit
const emit = defineEmits(['refresh'])

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        const api = form.value.id ? updateNode : createNode
        const submitData = { ...form.value }
        if (!form.value.id) {
          delete submitData.id
        }
        await api(submitData)
        
        ElMessage.success(form.value.id ? '更新成功' : '创建成功')
        emit('refresh')
        handleClose()
      } catch (error) {
        ElMessage.error((form.value.id ? '更新' : '创建') + '失败：' + error.message)
      } finally {
        loading.value = false
      }
    } else {
      console.log('表单校验失败:', fields)
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>