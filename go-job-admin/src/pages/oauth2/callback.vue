<script setup>

import {onMounted} from "vue";
import {getUser, oauth2Code} from "../../apis/user/user.js";
import {useUserStore} from "../../store/index.js";
import {useRoute, useRouter} from "vue-router";
import {notify} from "../../utils/notification.js";
import {useOAuth2Store} from "../../store/oauth2.js";
import {ElMessage} from "element-plus";

onMounted(async () => {
  const userStore = useUserStore()
  const oauth2Store = useOAuth2Store()
  const route = useRoute();
  const router = useRouter();


  console.log(route.query.code);

  const code = route.query.code;
  if (!code) {
    await router.push("/login");
    return;
  }
  oauth2Store.setCode(code)

  const res = await oauth2Code({
    "code": code,
  })
  console.log(res)
  oauth2Store.setPlatform(res.platform)

  if (res.redirect_page) {
    await router.push(res.redirect_page);
  }else{
    await router.push("/");
  }
  if (res.err.length > 0) {
    notify(res.err, "error", "", 3000)
  }
  console.log(res)



  // const token = route.query.t;
  // const status = route.query.status;
  // const redirect_page = route.query.redirect_page;
  // const key = route.query.key;  // key存在则表示需要将第三方账户关联已存在账户
  // const platform = route.query.platform;  // key存在则表示需要将第三方账户关联已存在账户
  // console.log("query:", key, platform, redirect_page, status);
  //
  // if (status && status === "2"){
  //   ElMessage.error('绑定第三方账号失败')
  //
  //   if (redirect_page){
  //     await router.push(redirect_page)
  //   }else{
  //     await router.push('/')
  //   }
  // }
  //
  // if (token) {  // token 存在则直接登录
  //   userStore.setToken(token)
  //
  //   try{
  //     const res = await getUser();
  //     console.log(res)
  //     await router.push(redirect_page);
  //   }catch(err){
  //     console.log(err)
  //     await router.push("/login")
  //   }
  //
  // } else if (key) {   // key 存在则表示需要绑定账户
  //   oauth2Store.setKey(key)
  //   oauth2Store.setPlatform(platform)
  //   await router.push("/oauth2/bind")
  // } else {
  //   await router.push("/login")
  //   notify("认证异常，请重新登录~", "error","", 3000)
  // }
})

</script>

<template>

</template>

<style scoped>

</style>