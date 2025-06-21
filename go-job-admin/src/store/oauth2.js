import {ref} from "vue";
import {defineStore} from "pinia";


export const useOAuth2Store = defineStore('oauth2-info', () => {
    // 🌟 用 ref/reactive 定义状态
    const code = ref(null)
    const platform = ref(null)
    const oauth2 = ref({})

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

    const setKVToOAuth2 = (key, value) => {
        oauth2[key] = value;
    }

    const getKVWithOAuth2 = (key) => {
        return oauth2[key]
    }

    const getAllOAuth2 = () => {
        return oauth2.value
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
        setKVToOAuth2,
        getKVWithOAuth2,
        getAllOAuth2,
        clean,
    }
})