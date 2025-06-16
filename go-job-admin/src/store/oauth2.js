import {ref} from "vue";
import {defineStore} from "pinia";


export const useOAuth2Store = defineStore('oauth2-info', () => {
    // 🌟 用 ref/reactive 定义状态
    const key = ref(null)
    const platform = ref(null)

    const setKey = (val) => {
        key.value = val;
    }
    const getKey = () => {
        return key.value
    }

    const setPlatform = (val) => {
        platform.value = val;
    }
    const getPlatform = () => {
        return platform.value
    }

    // 清除用户信息
    const clean = () => {
        key.value = null;
    }

    return {
        setKey,
        getKey,
        setPlatform,
        getPlatform,
        clean,
    }
})