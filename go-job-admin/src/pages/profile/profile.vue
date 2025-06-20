<script setup>
import {ref} from 'vue'
import {useUserStore} from "../../store/index.js";
import dayjs from "dayjs";
import {bindEmail, getAccountSecurity, unbindOAuth2} from "../../apis/user/user.js";
import {notify} from "../../utils/notification.js";
import {ElMessage} from "element-plus";
import {getGithubAuthUrl, getQQAuthUrl} from "../../apis/oauth2/oauth2.js";

const userStore = useUserStore()
const userInfo = userStore.userInfo
const bindAccountData = ref({})
const activeName = ref('profile')

const fetchAccountSecurity = async () => {
  bindAccountData.value = await getAccountSecurity()
}

const handleTagClick = async (tab, event) => {
  console.log("event", activeName.value, tab.paneName)
  switch (tab.paneName) {
    case 'profile':
    case 'security':
      await fetchAccountSecurity()
      console.log(tab.paneName, bindAccountData.value)
      return;
    default:
      console.log("nothing")
  }
}

const formatDay = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
}
const sceneParams = {
  "scene": "account-security",
}

const handleBind = async (flag) => {
  console.log(flag)
  switch (flag) {
    case 'qq':
      if (bindAccountData.value?.qq) {
        try{
          const res = await unbindOAuth2({
            "auth_type": 2,
          })
        } catch(err){
          console.log(err)
        }


        console.log(bindAccountData.value?.qq, "解绑", res)
      } else {
        window.location.href = await getQQAuthUrl(sceneParams)
      }
      return;
    case 'github':
      if (bindAccountData.value?.github) {
        const res = await unbindOAuth2({
          "auth_type": 1,
        })
        console.log(bindAccountData.value?.github, "解绑", res)

      } else {
        window.location.href = await getGithubAuthUrl(sceneParams)
      }
      return;
    case 'email':
      if (bindAccountData.value?.email) {
        console.log(bindAccountData.value?.email, "解绑")
      } else {
        dialogFormVisible.value = true;
      }
      return;
    default:
      return;
  }
}

// ---------- 绑定邮箱相关 ---------- //
const dialogFormVisible = ref(null)
const codeTime = ref(0)
const bindEmailLoading = ref(false)
const emailFormData = ref({
  email: "",
  code: ""
})

const onBindEmail = async () => {
  dialogFormVisible.value = true;
  bindEmailLoading.value = true;
  try {
    await bindEmail(emailFormData.value)
    dialogFormVisible.value = false;
    await userStore.getUserInfo()
    notify("绑定邮箱成功")
  } finally {
    bindEmailLoading.value = false;
  }
}

// 验证邮箱地址
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// ---------- 发送验证码倒计时 ---------- //
let timer = null
const onSendCode = async () => {
  if (codeTime.value > 0) return

  if (!emailFormData.value.email) {
    ElMessage.error("邮箱地址不能为空")
    return
  }
  if (!isValidEmail(emailFormData.value.email)) {
    ElMessage.error("请输入一个有效的邮箱地址")
    return
  }

  // 在这里调用你的发送验证码接口
  sendEmailCode(emailFormData.value.email)

  codeTime.value = 60
  timer = setInterval(() => {
    codeTime.value--
    if (codeTime.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}


</script>

<template>
  <el-card class="account-center">
    <el-tabs v-model="activeName" class="custom-tabs" @tab-click="handleTagClick">
      <el-tab-pane label="基本信息" name="profile">
        <div class="profile">
          <div class="introduction">
            <div class="title">个人简介</div>
            <div class="descript">{{ userInfo?.about }}</div>
          </div>
          <div class="account-info">
            <div class="title">账号信息</div>
            <div class="section">
              <div class="label-name">呢称</div>
              <div class="content">{{ userInfo?.nickname }}</div>
            </div>
            <div class="section">
              <div class="label-name">用户名</div>
              <div class="content">{{ userInfo?.username }}</div>
            </div>
            <div class="section">
              <div class="label-name">邮箱</div>
              <div class="content">{{ userInfo?.email }}</div>
            </div>
          </div>
          <div class="system-info">
            <div class="title">系统信息</div>
            <div class="section">
              <div class="label-name">注册时间</div>
              <div class="content">{{ formatDay(userInfo?.created_time) }}</div>
            </div>
            <div class="section">
              <div class="label-name">更新时间</div>
              <div class="content">{{ formatDay(userInfo?.updated_time) }}</div>
            </div>
            <div class="section">
              <div class="label-name">登录时间</div>
              <div class="content">{{ formatDay(userInfo?.login_time) }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="账号安全" name="security">
        <div class="security">
          <div class="security-title">
            绑定第三方账号，提升账号安全
          </div>
          <div class="security-body">
            <div class="bind-email bind-item">
              <span class="item-left">
                <img src="@/assets/email.svg" alt="Email" width="26" height="26"/>
                邮箱
              </span>
              <span class="bind-action"
                    :class="{ unbind: bindAccountData?.email }"
                    @click="handleBind('email')">
                {{ bindAccountData.email ? '解绑' : '绑定' }}
              </span>
            </div>
            <div class="bind-qq bind-item">
              <span class="item-left">
                <img src="@/assets/qq.svg" alt="QQ" width="26" height="26"/>
                QQ
              </span>
              <span class="bind-action"
                    :class="{ unbind: bindAccountData?.qq }"
                    @click="handleBind('qq')">
                {{ bindAccountData.qq ? '解绑' : '绑定' }}
              </span>
            </div>
            <div class="bind-github bind-item">
              <span class="item-left">
                <img src="@/assets/github.svg" alt="Github" width="26" height="26"/>
                Github
              </span>
              <span class="bind-action"
                    :class="{ unbind: bindAccountData?.github }"
                    @click="handleBind('github')">
                {{ bindAccountData.github ? '解绑' : '绑定' }}
              </span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>

  <!--  绑定邮箱 todo 这里需要抽离成组件-->
  <el-dialog v-model="dialogFormVisible" :show-close="false" header="标题" width="420">
    <div class="email-header">
      <div class="email-title">绑定邮箱</div>
      <span class="email-title-tip">绑定邮箱可以提高账号安全性，便于接收重要通知</span>
      <span style="margin-top: 5px; font-size: 12px"
            v-if="userStore.userInfo?.email">tip: 您以绑定过邮箱，邮箱地址: {{ userStore.userInfo?.email }}</span>
    </div>

    <el-form :model="emailFormData" class="email-main">
      <div class="email-addr-box">
        <div class="email-label">邮箱地址</div>
        <el-input style="height: 42px" v-model="emailFormData.email" autocomplete="off"/>

      </div>
      <div class="email-code-box">
        <div class="email-label">验证码</div>
        <div class="email-code">
          <el-input style="height: 42px" v-model="emailFormData.code" autocomplete="off"/>
          <el-button
              class="send-email-code"
              :disabled="codeTime > 0"
              :class="{'code-is-disabled': codeTime > 0 }"
              @click="onSendCode"
          >{{ codeTime > 0 ? `${codeTime}s后重发` : '发送验证码' }}
          </el-button>
        </div>
      </div>

    </el-form>
    <div class="footer">
      <el-button class="btn-bind-email" :loading="bindEmailLoading" @click="onBindEmail">绑定邮箱</el-button>
      <el-button @click=" dialogFormVisible=false">
        暂不绑定
      </el-button>
    </div>
  </el-dialog>
</template>

<style scoped>

/* ------------- 基本信息 ---------------- */
/* todo 后面这里需要拆分*/

.account-center {
  overflow: hidden;
  height: calc(100vh - 107px);
}

.profile {
  border-radius: 15px;
  border: 1px #e6e6e6 solid;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}


.introduction {
  height: 160px;
  width: 100%;
  padding: 20px;
  border-bottom: 1px #e6e6e6 solid;
  box-sizing: border-box;
}

.title {
  color: #4e6ef2;
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: linear-gradient(to bottom, #4e6ef2, #7c96ff);
  margin-right: 8px;
  border-radius: 2px;
}

.descript {
  color: #666;
  font-size: 14px;
  padding: 12px;
  background: linear-gradient(145deg, #f8faff, #fff);
  border-radius: 8px;
  border: 1px solid #eaedf3;
  box-sizing: border-box;
}

.section {
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.content {
  width: 100%;
  color: #666;
  font-size: 14px;
  padding: 12px;
  background: linear-gradient(145deg, #f8faff, #fff);
  border-radius: 8px;
  border: 1px solid #eaedf3;
  box-sizing: border-box;
}

.label-name {
  font-size: 14px;
  width: 60px;
  font-weight: 500;
  color: #666;
  flex-shrink: 0; /* 不压缩 */
}

.account-info {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  height: 240px;
  width: 100%;
  padding: 20px;
  border-bottom: 1px #e6e6e6 solid;
  box-sizing: border-box;
}

.system-info {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}


/* ------------- 账号安全 ---------------- */
/* todo 后面这里需要拆分*/

.security-body {
  display: flex;
  flex-direction: column;
}

.security-title {
  height: 32px;
  line-height: 32px;
  margin: 10px;
  font-size: 16px;
  color: #6f42c1;
}

.security-body {
  display: flex;
  flex-direction: column;
}

.bind-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #eaedf3;
  padding: 16px;
  margin: 4px;
}

.item-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.item-left > img {
  margin-right: 12px;
}

.bind-action {
  font-size: 12px;
  padding: 5px 14px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(90deg, #845be3 30%, #4e6ef2 100%);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 4px #ece1ff;
  transition: background 0.2s, box-shadow 0.2s;
}

.bind-action.unbind {
  background: linear-gradient(90deg, #f87171 30%, #fbbf24 100%);
}


/* 邮箱相关样式 */
.email-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 22px;
}

.email-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #333;
}

.email-title-tip {
  font-size: 14px;
  color: #555;
}

.email-main {
  padding: 10px 20px 25px 20px;
  display: flex;
  flex-direction: column;
}

.email-label {
  font-size: 14px;
  font-weight: 700;
  padding: 6px 0;
  color: #555;
}

.email-addr-box {
  margin-bottom: 20px;
}

.email-code {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.send-email-code {
  width: 100px;
  height: 42px;
  margin-left: 10px;
  background-color: #f9f9f9;
  color: cornflowerblue;
}

.send-email-code:hover {
  background-color: #f3f4f5;
}

.code-is-disabled {
  background-color: #ccc !important;
  color: #899;
}


.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-bind-email {
  background-color: #4a90e2;
  color: #fff;
  font-size: 16px;
}

.footer .el-button:nth-child(2):hover {
  background-color: #fff;
  color: #666;
}

.btn-bind-email:hover {
  background-color: #3a7bc8;
  color: #fff;
}

.footer .el-button {
  width: 90%;
  height: 42px;
  margin: 10px 20px;
  border: none;
  border-radius: 8px;
}

/* ------ 标签页样式 ------*/


/* 自定义 tab 宽度 + 居中 */
::v-deep(.custom-tabs .el-tabs__item) {
  width: 120px;
  text-align: center;
  justify-content: center; /* 有时还需要 */
  display: flex;
  align-items: center;
  padding: 12px 0;
  font-size: 16px;
  color: #555;
  transition: background-color 0.3s;
}

/* 给 tabs 的标签页标题部分添加背景 */
::v-deep(.custom-tabs .el-tabs__nav-wrap) {
  background-color: #f5f7fa; /* 浅灰色背景 */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

/* 激活 tab 样式 */
::v-deep(.custom-tabs .el-tabs__item.is-active) {
  color: #6f42c1;
  font-weight: bold;
  background-color: #e2daf1;
  border-radius: 10px 10px 0 0;
}

/* hover 效果 */
::v-deep(.custom-tabs .el-tabs__item:hover) {
  background-color: #f5f0fa;
  cursor: pointer;
  border-radius: 10px 10px 0 0;
}

/* 隐藏底部横线 */
::v-deep(.custom-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
</style>