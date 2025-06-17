<script setup>

import {Lock, User} from "@element-plus/icons-vue";
import {useOAuth2Store} from "../../store/oauth2.js";
import {useUserStore} from "../../store/index.js";
import {bindOAuth2} from "../../apis/user/user.js";
import {ref} from "vue";
import router from "../../router/index.js";

const oauthStore = useOAuth2Store()
const platform = oauthStore.getPlatform()

// ---------- 初始化 ---------- //
const userStore = useUserStore()

// ---------- 数据 ---------- //
const formData = ref({
  username: '',
  password: '',
  key: oauthStore.getKey(),
})

const loading = ref(false)

// ---------- 登录 ---------- //
const onLogin = async () => {
  loading.value = true
  try {
    console.log("bind user data", formData.value)
    const res = await bindOAuth2(formData.value)
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

const handleLogin = () => {
  const token = userStore.getToken();
  if (!token) {
    router.push("/login")
  }else{
    router.push("/")
  }
}
</script>

<template>
  <div class="container">
    <div class="header-container">
      <div class="header-left" @click="handleLogin">
        <img class="logo-icon" src="/src/assets/go-job-logo.svg" alt="logo" width="32" height="32"/>
        <h3 class="logo">任务管理系统</h3>
      </div>
    </div>
    <div class="main">
      <div class="main-left">
        <div class="icons">
          <img v-if="(platform === 'qq')" src="/src/assets/qq.svg" alt="qq" width="100" height="100"/>
          <img v-else src="/src/assets/github.svg" alt="qq" width="100" height="100"/>
          <img class="double-arrow-icon" src="/src/assets/double-arrow.svg" alt="doublearrow" width="64" height="64"/>
          <img class="go-job-logo" src="/src/assets/go-job-logo.svg" alt="logo" width="100" height="100"/>
        </div>
        <div class="tip">
          输入账号信息登录立即绑定
        </div>
      </div>
      <div class="oauth2-line"></div>
      <div class="main-right">
        <div class="login-tip">
          账号密码登录
        </div>
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
      </div>
    </div>
  </div>
</template>

<style scoped>

.header-container {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-bottom: 1px solid #ccc;
}

.header-left {
  display: flex;
  width: 250px;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  margin-right: 8px;
}

.logo {
  color: #6f57b6;
}

.main{
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
}


.main-left{
  margin-right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icons{
  display: flex;
  justify-content: center;
  align-items: center;
}

.double-arrow-icon{
  margin: 0 26px;
}

.tip{
  margin-top: 40px;
  color: #666;
  font-size: 14px;
}

.oauth2-line{
  width: 2px;
  height: 120px;
  background-color: #d3d4d5;
  margin: 10px;
}

.main-right{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
}

.login-tip{
  margin-bottom: 20px;
  width: 300px;
  text-align: center;
  font-size: 22px;

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

.login-submit:hover {
  width: 300px;
  background-color: #85bc85;
  border: 1px solid #ccc;
}

</style>