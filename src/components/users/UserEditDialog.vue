<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="500px"
    :close-on-click-modal="false"
    @closed="handleDialogClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      style="padding: 0 20px"
      autocomplete="off"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称"/>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!formData.id">
        <el-input v-model="formData.password" type="password" show-password placeholder="请输入密码" autocomplete="new-password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password" v-if="!formData.id">
        <el-input v-model="formData.confirm_password" type="password" show-password placeholder="请再次输入密码" autocomplete="new-password" />
      </el-form-item>
      <el-form-item label="关于我" prop="about">
        <el-input v-model="formData.about" type="textarea" :rows="3" placeholder="请输入个人简介" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { createUser, updateUser } from '@/apis/users'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  userData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'refresh'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const dialogTitle = computed(() => formData.value.id ? '编辑用户' : '新增用户')

const formRef = ref(null)
const formData = ref({
  nickname: '',
  username: '',
  password: '',
  confirm_password: '',
  about: ''
})

const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirm_password: [{ 
    required: true, 
    message: '请再次输入密码', 
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== formData.value.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
  }],
  about: [{ required: false, message: '请输入个人简介', trigger: 'blur' }]
}

watch(
  () => props.userData,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      formData.value = { ...newVal }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.value.id) {
          await updateUser(formData.value)
          ElMessage.success('更新成功')
        } else {
          await createUser(formData.value)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        emit('refresh')
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      }
    }
  })
}

const handleDialogClosed = () => {
  formRef.value?.resetFields()
  formData.value = {
    nickname: '',
    username: '',
    password: '',
    confirm_password: '',
    about: '',
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>