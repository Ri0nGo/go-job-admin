<script setup>

import {onMounted} from "vue";
import {getUser} from "../../apis/user/user.js";
import {useUserStore} from "../../store/index.js";
import { useRoute, useRouter } from "vue-router";
import {notify} from "../../utils/notification.js";

onMounted(async () => {
  const userStore = useUserStore()
  const route = useRoute();
  const router = useRouter();

  const token = route.query.t;
  const uid = route.query.uid;

  if (token && uid) {
    userStore.setUID(uid)
    userStore.setToken(token)
  } else {
    await router.push("/login")
    notify("认证异常，请重新登录~", "error","", 3000)
    return
  }

  try{
    const res = await getUser(uid);
    console.log(res)
    await router.push("/");
  }catch(err){
    console.log(err)
    await router.push("/login")
  }
})

</script>

<template>

</template>

<style scoped>

</style>