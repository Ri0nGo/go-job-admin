<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建任务"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" label-position="right">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入任务名称" />
      </el-form-item>
      
      <el-form-item label="节点名称" prop="node_name">
        <el-select v-model="form.node_id" placeholder="请选择节点" style="width: 100%" @change="handleNodeChange">
          <el-option v-for="node in nodes" :key="node.id" :value="node.id" :label="node.name" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="执行方式" prop="exec_type">
        <el-select v-model="form.exec_type" placeholder="请选择执行方式" style="width: 100%">
          <el-option :value="1" label="Shell" />
          <el-option :value="2" label="Http" />
          <el-option :value="3" label="File" />
        </el-select>
      </el-form-item>
      
      <el-form-item v-if="form.exec_type === 3" label="上传文件" prop="file">
        <el-upload
          class="upload-demo"
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          accept=".py"
          :file-list="fileList"
          :on-remove="handleFileRemove"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">
              支持 .py 格式文件，单个文件不超过5MB
            </div>
          </template>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="表达式" prop="cron_expr">
        <el-input v-model="form.cron_expr" placeholder="秒 分 时 日 月 周" />
        <div class="cron-tip">示例：0 */10 * * * * （每十分钟执行）</div>
      </el-form-item>
      
      <el-form-item label="状态" prop="active">
        <el-switch
          v-model="form.active"
          :active-value="1"
          :inactive-value="2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ececec"
        />
        <span class="status-text">{{ form.active === 1 ? '启用' : '停用' }}</span>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createJob, uploadFile } from '@/apis/jobs'
import { getNodes } from '@/apis/nodes'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'refresh'])

// 对话框可见性控制
const dialogVisible = ref(false)
watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    loadNodes()
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

// 表单数据
const formRef = ref(null)
const loading = ref(false)
const fileList = ref([])
const form = reactive({
  name: '',
  node_name: '',
  node_id: '',
  exec_type: 1,
  cron_expr: '',
  active: 1,
  file: null,
  filename: '',
  file_key: ''
})

const nodes = ref([])
const loadNodes = async () => {
  try {
    const res = await getNodes()
    nodes.value = res.data
  } catch (error) {
    console.error('获取节点列表失败:', error)
    ElMessage.error('获取节点列表失败')
  }
}

const handleNodeChange = (value) => {
  const selectedNode = nodes.value.find(node => node.id === value)
  if (selectedNode) {
    form.node_name = selectedNode.name
  }
}

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  node_name: [
    { required: true, message: '请输入节点名称', trigger: 'blur' }
  ],
  exec_type: [
    { required: true, message: '请选择执行方式', trigger: 'change' }
  ],
  cron_expr: [
    { required: true, message: '请输入Cron表达式', trigger: 'blur' }
  ]
}

// 处理文件删除
const handleFileRemove = () => {
  form.file = null
  form.filename = ''
  form.file_key = ''
  fileList.value = []
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 重置所有表单字段为初始值
  form.name = ''
  form.node_name = ''
  form.node_id = ''
  form.exec_type = 1
  form.cron_expr = ''
  form.active = 1
  form.file = null
  form.filename = ''
  form.file_key = ''
  // 清空文件列表
  fileList.value = []
}

// 关闭对话框
const handleClose = () => {
  resetForm()
  dialogVisible.value = false
}

// 处理文件变更
const handleFileChange = async (file) => {
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过5MB')
    return false
  }
  form.file = file.raw
  form.filename = file.name
  // 立即更新文件列表显示
  fileList.value = [{
    name: file.name,
    status: 'ready'
  }]
  try {
    const res = await uploadFile(file.raw)
    form.file_key = res.key
    // 更新上传成功后的状态，保持原始文件名显示
    fileList.value = [{
      name: file.name,
      status: 'success'
    }]
    ElMessage.success('文件上传成功')
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败，请重试')
    // 上传失败时清空文件列表
    fileList.value = []
    form.file = null
    form.filename = ''
    form.file_key = ''
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (form.exec_type === 3 && !form.filename) {
        ElMessage.error('请选择上传文件')
        return
      }
      
      loading.value = true
      try {
        const json_data = {}
        Object.keys(form).forEach(key => {
          if (key !== 'file') {
            json_data[key] = form[key]
          }
        })
        
        // 调用API创建任务
        await createJob(json_data)
        
        ElMessage.success('创建成功')
        dialogVisible.value = false
        emit('refresh') // 通知父组件刷新数据
      } catch (error) {
        console.error('创建失败:', error)
        // ElMessage.error('创建失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.status-text {
  margin-left: 10px;
  color: #606266;
  font-size: 14px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 18px;
}

:deep(.el-dialog__body) {
  padding: 20px 25px;
}

.cron-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}
</style>