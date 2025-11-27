import { ElMessage } from 'element-plus'
import { verifyToken } from '@/api/user'
import { useUserStore } from '@/stores/user'

/**
 * Token管理器
 * 负责定期检查Token有效性，自动处理过期和刷新
 */

let tokenCheckInterval: number | null = null
let isCheckingToken = false

/**
 * 启动Token检查定时器
 * 每5分钟检查一次Token是否有效
 * 
 * 注意：不在启动时立即检查，只在定时器触发时检查
 * 这样可以避免用户刚登录就被检查出过期的问题
 */
export function startTokenCheck() {
  // 避免重复启动
  if (tokenCheckInterval !== null) {
    return
  }

  // 不立即检查，等待5分钟后第一次检查
  // 这样给续约机制充足的时间来续约Token
  tokenCheckInterval = window.setInterval(() => {
    checkToken()
  }, 5 * 60 * 1000)

  console.log('✅ Token检查定时器已启动，每5分钟检查一次（不立即检查）')
}

/**
 * 停止Token检查定时器
 */
export function stopTokenCheck() {
  if (tokenCheckInterval !== null) {
    clearInterval(tokenCheckInterval)
    tokenCheckInterval = null
    console.log('⏹️ Token检查定时器已停止')
  }
}

/**
 * 检查Token是否有效
 * 
 * 工作原理：
 * 1. 定期检查Token是否有效
 * 2. 如果Token有效，继续使用
 * 3. 如果Token无效，清除登录信息（但不跳转）
 * 4. 下次用户操作时，会被重定向到登录页
 * 
 * 这样可以避免在用户操作中途突然跳转
 */
async function checkToken() {
  // 避免并发检查
  if (isCheckingToken) {
    return
  }

  const userStore = useUserStore()

  // 如果没有登录，不需要检查
  if (!userStore.isLoggedIn) {
    return
  }

  isCheckingToken = true

  try {
    const response = await verifyToken()

    if (response.code === 200 && response.data.valid) {
      // Token有效，继续使用
      console.log('✅ Token有效')
      return
    } else {
      // Token无效或过期，清除登录信息
      console.warn('⚠️ Token已过期，清除登录信息')
      handleTokenExpired()
    }
  } catch (error) {
    console.warn('⚠️ Token检查失败:', error)
    // 如果检查失败（比如网络错误），不立即处理，等待下次检查
    // 但如果是401错误，则清除登录信息
    if ((error as any)?.response?.status === 401) {
      console.warn('⚠️ Token验证返回401，清除登录信息')
      handleTokenExpired()
    }
  } finally {
    isCheckingToken = false
  }
}

/**
 * 处理Token过期
 * 
 * 工作原理：
 * 1. 清除登录信息
 * 2. 显示提示信息（不自动跳转）
 * 3. 用户可以继续查看内容
 * 4. 下次用户尝试操作（需要登录）时，会被重定向到登录页
 * 
 * 这样可以避免在用户操作中途突然跳转
 */
function handleTokenExpired() {
  const userStore = useUserStore()

  console.warn('⚠️ Token已过期，清除登录信息')

  // 清除登录信息
  userStore.logout()

  // 显示提示信息（不自动跳转）
  ElMessage({
    message: '登录信息已过期，请重新登录后继续操作',
    type: 'warning',
    duration: 5000
  })
  
  // 不立即跳转，让用户继续查看内容
  // 下次用户尝试操作时，会被重定向到登录页
}

/**
 * 手动检查Token（用于特殊场景）
 */
export async function manualCheckToken(): Promise<boolean> {
  const userStore = useUserStore()

  if (!userStore.isLoggedIn) {
    return false
  }

  try {
    const response = await verifyToken()
    return response.code === 200 && response.data.valid
  } catch (error) {
    console.error('Token检查失败:', error)
    return false
  }
}

/**
 * 在用户操作时刷新Token活跃时间
 * Sa-Token的active-timeout会在用户有操作时自动刷新
 */
export function refreshTokenActivity() {
  // Sa-Token会自动处理，我们这里只需要确保请求被发送
  // 实际上每次API请求都会刷新Token的活跃时间
  console.debug('Token活跃时间已刷新')
}
