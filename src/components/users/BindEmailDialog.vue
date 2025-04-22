<template>
  <el-dialog
    v-model="dialogVisible"
    title="绑定邮箱"
    width="400px"
    :close-on-click-modal="false"
    class="bind-email-dialog"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="bind-email-form">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="code-input">
          <el-input v-model="form.code" placeholder="请输入验证码" class="code-el-input"></el-input>
          <el-button
            type="primary"
            :disabled="countdown > 0"
            @click="handleSendCode"
            class="code-btn"
          >
            {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
          </el-button>
        </div>
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
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { sendEmailCode, bindEmail } from '@/apis/users'

const dialogVisible = ref(false)
const countdown = ref(0)
const formRef = ref(null)

const form = reactive({
  email: '',
  code: ''
})

// 监听dialogVisible变化，关闭时清空表单
watch(dialogVisible, (val) => {
  if (!val) {
    form.email = ''
    form.code = ''
    if (formRef.value) formRef.value.clearValidate && formRef.value.clearValidate()
  }
})
const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度必须为6位', trigger: 'blur' }
  ]
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSendCode = async () => {
  try {
    await formRef.value.validateField('email')
    await sendEmailCode(form.email)
    startCountdown()
    ElMessage.success('验证码已发送')
  } catch (error) {
    ElMessage.error(error.message || '发送验证码失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    await bindEmail({
      email: form.email,
      code: form.code
    })
    ElMessage.success('邮箱绑定成功')
    dialogVisible.value = false
    form.email = ''
    form.code = ''
  } catch (error) {
    ElMessage.error(error.message || '邮箱绑定失败')
  }
}

defineExpose({
  dialogVisible
})
</script>

<style scoped>
.bind-email-dialog >>> .el-dialog {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  background: #f9fafc;
}
.bind-email-form {
  padding: 16px 8px 0 8px;
}
.code-input {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 2px;
}
.el-form-item {
  margin-bottom: 22px;
}
.el-input, .code-el-input {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  background: #fff;
  transition: box-shadow 0.2s;
}
.el-input:focus-within, .code-el-input:focus-within {
  box-shadow: 0 0 0 2px #a0cfff;
}
.code-btn {
  width: 120px;
  border-radius: 8px;
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(64,158,255,0.08);
  transition: background 0.2s, box-shadow 0.2s;
}
.code-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #66b1ff 0%, #409eff 100%);
  box-shadow: 0 4px 16px rgba(64,158,255,0.16);
}
.code-btn:disabled {
  background: #d3e4fa;
  color: #a0aec0;
  cursor: not-allowed;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 0 0 0;
}
</style>