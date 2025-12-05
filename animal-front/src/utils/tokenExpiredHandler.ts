import { ElMessage } from 'element-plus'
import { openAuthDialog } from './authHelper'
import { useUserStore } from '@/stores/user'

let isNotifying = false
let resetTimer: number | null = null

/**
 * 全局 Token 失效处理，避免重复弹 Toast，并自动唤起登录弹窗。
 */
export function handleGlobalTokenExpired(message?: string) {
  const userStore = useUserStore()
  userStore.logout()

  // 始终唤起登录弹窗，方便用户立即重新登录
  openAuthDialog('login')

  if (isNotifying) {
    return
  }

  isNotifying = true
  ElMessage({
    message: message || '登录状态已过期，请重新登录',
    type: 'warning',
    duration: 3000
  })

  if (resetTimer) {
    clearTimeout(resetTimer)
  }
  resetTimer = window.setTimeout(() => {
    isNotifying = false
    resetTimer = null
  }, 3000)
}
