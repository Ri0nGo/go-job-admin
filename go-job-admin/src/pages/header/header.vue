<script setup>
import {ArrowDown} from "@element-plus/icons-vue";
import {useUserStore} from "../../store/index.js";
import router from "../../router/index.js";
import FormDrawer from "../../components/formDrawer/formDrawer.vue";
import {ref} from "vue";
import {bindEmail, getUser, sendEmailCode} from "../../apis/user/user.js";
import {ElMessage, ElNotification} from "element-plus";
import {notify} from "../../utils/notification.js";

const userStore = useUserStore();

// ---------- 修改密码子组件相关 ---------- //
const rules = {
  oldpassword: [
    {
      required: true,   // 表示这是必填项
      message: '旧密码不能为空',  // 这是不符合规则是出发的消息
      trigger: 'blur'  // 这是鼠标移动到输入框外是会触发的回调
    },
  ],
  password: [
    {
      required: true,
      message: '新密码不能为空',
      trigger: 'blur'
    },
  ],
  repassword: [
    {
      required: true,
      message: '确认密码不能为空',
      trigger: 'blur'
    },
  ]
}
const formRef = ref(null)        // 用于表单rules校验的数据
const formDrawerRef = ref(null)  // 用于管理子组件暴露的方法
const formData = ref({           // 用于管理表单数据
  oldpassword: "",
  password: "",
  repassword: ""
})

const onSubmit = () => {
  formDrawerRef.value.showLoading()
  // TODO 发送修改密码请求

  formDrawerRef.value.closeLoading()
  formDrawerRef.value.closeDrawer()
}

const onClose = () => {
  formRef.value.resetFields()
  formDrawerRef.value.closeDrawer()
}

const handleUserOperation = async (cmd) => {
  switch (cmd) {
    case "logout":
      userStore.clearUserStore();
      await router.push("/login");
      window.location.reload();
      return
    case "changePassword":
      formDrawerRef.value.openDrawer();
      return
    case "bindEmail":
      dialogFormVisible.value = true;
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
  <div class="header-container">
    <div class="header-left">
      <img class="logo-icon" src="/src/assets/go-job-logo.svg" alt="logo" width="32" height="32"/>
      <h3 class="logo">任务管理系统</h3>
    </div>
    <div class="user-wrapper">
      <el-dropdown class="dropdown" @command="handleUserOperation">
        <div class="user-operation">
          <span class="user-name">{{ userStore.userInfo?.username || '' }}</span>
          <el-icon>
            <arrow-down/>
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="bindEmail">绑定邮箱</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <FormDrawer
      ref="formDrawerRef"
      title="修改密码"
      @submit="onSubmit"
      @close="onClose"
  >
    <el-form
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-width="80px"
        class="mt-2">
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input autocomplete="new-password" v-model="formData.oldpassword" placeholder="请输入旧密码"/>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input autocomplete="new-password" v-model="formData.password" type="password" placeholder="请输入新密码"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input autocomplete="new-password" v-model="formData.repassword" type="password" placeholder="再次确认密码"/>
      </el-form-item>
    </el-form>
  </FormDrawer>

  <!--  绑定邮箱-->
  <el-dialog v-model="dialogFormVisible" :show-close="false" header="标题" width="420">
    <div class="email-header">
      <div class="email-title">绑定邮箱</div>
      <span class="email-title-tip">绑定邮箱可以提高账号安全性，便于接收重要通知</span>
      <span style="margin-top: 5px; font-size: 12px" v-if="userStore.userInfo?.email">tip: 您以绑定过邮箱，邮箱地址: {{ userStore.userInfo?.email }}</span>
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

.user-wrapper {
  margin-left: auto;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  margin-right: 8px;
}

.logo {
  color: #6f57b6;
}

.user-name {
  font-size: 16px;
  color: #333;
  margin-right: 5px;
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


/*浏览器默认的焦点样式（outline）导致的*/
.el-dropdown * {
  outline: none;
}

.el-form-item {
  margin-bottom: 30px;
}

</style>