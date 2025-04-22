import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    userInfo: {}
  }),
  actions: {
    setUserId(id) {
      this.userId = id
    },
    setUserInfo(info) {
      this.userInfo = info
    },
    clearUserInfo() {
      this.userId = null
      this.userInfo = {}
    }
  },
  getters: {
    getUserId: (state) => state.userId,
    getUserInfo: (state) => state.userInfo
  }
})