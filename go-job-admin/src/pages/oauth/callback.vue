<script setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Loading} from '@element-plus/icons-vue'
import {oauthLogin} from "../../apis/oauth2/oauth2.js";
import {useUserStore} from "../../store/index.js";
import {notify} from "../../utils/notification.js";
import {clearOAuthState, consumeLoginRedirect, getSavedOAuthState} from "../../utils/oauth.js";

const error = ref('')
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const userStore = useUserStore()
  const code = route.query.code || ''
  const state = route.query.state || ''
  const savedState = getSavedOAuthState()

  try {
    if (!code) {
      throw new Error('OAuth2 回调缺少 code')
    }
    if (!state || !savedState || state !== savedState) {
      throw new Error('OAuth2 state 校验失败，请重新登录')
    }

    await oauthLogin({code})
    clearOAuthState()
    await router.replace(consumeLoginRedirect())
  } catch (err) {
    error.value = err.message || '登录失败'
    userStore.clearUserStore()
    clearOAuthState()
    notify(error.value, 'error', '登录失败', 3000)
    window.setTimeout(() => {
      router.replace('/login')
    }, 1200)
  }
})
</script>

<template>
  <el-row class="oauth-callback-container">
    <el-card class="oauth-callback-card">
      <template v-if="error">
        <h2>登录失败</h2>
        <div class="oauth-callback-desc">{{ error }}</div>
      </template>
      <template v-else>
        <el-icon class="oauth-callback-loading"><Loading /></el-icon>
        <h2>正在完成登录</h2>
        <div class="oauth-callback-desc">请稍候，正在校验授权信息...</div>
      </template>
    </el-card>
  </el-row>
</template>

<style scoped>
.oauth-callback-container {
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #FDFDFDFF;
}

.oauth-callback-card {
  width: 360px;
  text-align: center;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.oauth-callback-loading {
  color: #8ac78a;
  font-size: 34px;
  animation: oauth-callback-rotate 1s linear infinite;
}

.oauth-callback-desc {
  color: #999;
  font-size: 14px;
  margin-top: 12px;
}

@keyframes oauth-callback-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
