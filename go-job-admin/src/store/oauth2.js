import {ref} from "vue";
import {defineStore} from "pinia";


export const useOAuth2Store = defineStore('oauth2-info', () => {
    // 🌟 用 ref/reactive 定义状态
    const code = ref(null)
    const platform = ref(null)

    const setCode = (val) => {
        code.value = val;
    }
    const getCode = () => {
        return code.value
    }

    const setPlatform = (val) => {
        platform.value = val;
    }
    const getPlatform = () => {
        return platform.value
    }

    // 清除用户信息
    const clean = () => {
        code.value = null;
    }

    return {
        setCode,
        getCode,
        setPlatform,
        getPlatform,
        clean,
    }
})