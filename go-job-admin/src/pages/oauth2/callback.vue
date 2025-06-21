<script setup>

import {onMounted} from "vue";
import {oauth2Code} from "../../apis/user/user.js";
import {useUserStore} from "../../store/index.js";
import {useRoute, useRouter} from "vue-router";
import {notify} from "../../utils/notification.js";
import {useOAuth2Store} from "../../store/oauth2.js";

onMounted(async () => {
  const oauth2Store = useOAuth2Store()
  const route = useRoute();
  const router = useRouter();

  const code = route.query.code;
  if (!code) {
    await router.push("/login");
    return;
  }
  oauth2Store.setCode(code)

  const res = await oauth2Code({
    "code": code,
  })
  oauth2Store.setPlatform(res.platform)

  if (res.redirect_page) {
    if (res.redirect_page === "/settings/profile"){
      oauth2Store.setKVToOAuth2("flag", "security")
    }
    await router.push(res.redirect_page);
  } else {
    await router.push("/");
  }
  if (res.err.length > 0) {
    notify(res.err, "error", "", 5000)
  }
})

</script>

<template>

</template>

<style scoped>

</style>