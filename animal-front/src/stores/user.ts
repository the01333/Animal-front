import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>('')
    const userInfo = ref<User | null>(null)

    const isLoggedIn = computed(() => !!token.value)
    const isAdmin = computed(() => {
      const role = String(userInfo.value?.role || '').toLowerCase()
      return role === 'admin' || role === 'super_admin'
    })
    const isManager = computed(() => {
      const role = String(userInfo.value?.role || '').toLowerCase()
      return role === 'admin' || role === 'super_admin'
    })

    // 登录
    async function login(username: string, password: string) {
      const res = await loginApi({ username, password })
      token.value = res.data.token
      userInfo.value = (res.data as any).userInfo || (res.data as any).user
      localStorage.setItem('token', token.value)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return res
    }

    // 获取用户信息
    async function getUserInfo() {
      const res = await getUserInfoApi()
      userInfo.value = res.data
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return res
    }

    // 登出
    function logout() {
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }

    // 从本地存储恢复
    function restoreFromStorage() {
      const storedToken = localStorage.getItem('token')
      const storedUserInfo = localStorage.getItem('userInfo')
      if (storedToken) {
        token.value = storedToken
      }
      if (storedUserInfo) {
        try {
          userInfo.value = JSON.parse(storedUserInfo)
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
    }

    return {
      token,
      userInfo,
      isLoggedIn,
      isAdmin,
      isManager,
      login,
      getUserInfo,
      logout,
      restoreFromStorage
    }
  },
  {
    persist: true
  }
)

