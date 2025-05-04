<script setup>
import {ref} from 'vue'
import {User, Lock} from '@element-plus/icons-vue'
import {login} from "@/apis/user/user.js";
import router from "../../router/index.js";
import {useUserStore} from "../../store/index.js";

// ---------- 初始化 ---------- //
const userStore = useUserStore()

// ---------- 数据 ---------- //
const formData = ref({
  username: '',
  password: ''
})

const loading = ref(false)

// ---------- 登录 ---------- //
const onLogin = async () => {
  loading.value = true
  try {
    const res = await login(formData.value)
    userStore.setUID(res.id)
    await router.push("/")
  } catch (e) {
  } finally {
    loading.value = false
  }

}

// ----------校验 ---------- //
const rules = {
  username: [
    {required: true, message: '用户名不能为空', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'}
  ],
}


</script>

<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" :sm="12" :xs="0" class="login-left">
      <div class="login-img"></div>
    </el-col>
    <el-col :lg="8" :md="12" :sm="12" :xs="24" class="login-right">
      <h2>Go Job Admin</h2>
      <div class="login-title-sm">任务管理系统</div>
      <el-form
          :model="formData"
          :rules="rules"
          class="login-form">
        <el-form-item prop="username" class="login-input">
          <el-input :prefix-icon="User" v-model="formData.username" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item prop="password" class="login-input">
          <el-input :prefix-icon="Lock" v-model="formData.password" type="password" show-password
                    placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item>
          <el-button
              round
              type="primary"
              color="#626aef"
              class="login-submit"
              @click="onLogin"
              :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.login-container {
  height: 100vh;
}

.login-left {
  position: relative;
  height: 100%;
}

.login-img {
  width: 100%;
  height: 100%;
  background-image: url('/src/assets/storybook.jpg'); /* 改为你的 SVG 路径 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-right {
  background-color: #FDFDFDFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.login-title-sm {
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
}

.login-form {
  width: 280px;
}

.login-input ::v-deep(.el-input) {
  border-radius: 30px;
  border: 1px solid #ccc;
  background-color: #fff;
  overflow: hidden;
}

.login-input ::v-deep(.el-input:hover) {
  border: 1px solid #8ac78a;
}

.login-input ::v-deep(.el-input .el-input__wrapper) {
  border-radius: 30px;
  border: 1px solid #ccc;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}


.login-submit {
  width: 300px;
  background-color: #8ac78a;
  border: 1px solid #ccc;
}

</style>