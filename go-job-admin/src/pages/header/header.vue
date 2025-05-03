<script setup>
import {ArrowDown} from "@element-plus/icons-vue";
import {useUserStore} from "../../store/index.js";
import router from "../../router/index.js";
import FormDrawer from "../../components/formDrawer/formDrawer.vue";
import {ref} from "vue";

const userStore = useUserStore();

// ---------- 子组件相关 ---------- //
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
  }
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

/*浏览器默认的焦点样式（outline）导致的*/
.el-dropdown * {
  outline: none;
}

.el-form-item {
  margin-bottom: 30px;
}

</style>