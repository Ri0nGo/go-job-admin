import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    userInfo: {},
    username: ''
  }),
  actions: {
    setUserId(id) {
      this.userId = id
    },
    setUsername(name) {
      this.username = name
    },
    setUserInfo(info) {
      this.userInfo = info
    },
    clearUserInfo() {
      this.userId = null
      this.userInfo = {}
      this.username = ''
    }
  },
  getters: {
    getUserId: (state) => state.userId,
    getUserInfo: (state) => state.userInfo
  }
})