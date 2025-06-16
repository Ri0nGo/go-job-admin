import {ref} from "vue";
import {defineStore} from "pinia";
import {getUser} from "../apis/user/user.js";


export const useUserStore = defineStore('userInfo', () => {
    // 🌟 用 ref/reactive 定义状态
    const userInfo = ref(null)
    const uid = ref(null)
    const token = ref(null)

    // 设置用户信息
    const setUID = (id) => {
        uid.value = id;
    }

    const setToken = (t) => {
        token.value = t
    }
    const getToken = () => {
        return token.value
    }
    const getUid = () => {
        return uid.value
    }

    // 清除用户信息
    const clearUserStore = () => {
        // 清除持久化的 userInfo
        userInfo.value = null;
        token.value = null;
        uid.value = null;
    }

    const getUserInfo = async () => {
        const res = await getUser(uid.value)
        userInfo.value = res
        return res
    }

    // 🌟 返回出去
    return {
        userInfo,
        token,
        uid,
        setToken,
        setUID,
        getToken,
        getUid,
        getUserInfo,
        clearUserStore,
    }
}, {
    persist: true,  // 如果用持久化插件
})