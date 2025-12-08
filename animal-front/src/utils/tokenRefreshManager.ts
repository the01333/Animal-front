import { ElMessage } from 'element-plus'
import { refreshToken, verifyToken } from '@/api/user'
import { useUserStore } from '@/stores/user'

/**
 * Token续约管理器
 * 类似Redisson的分布式锁续约机制
 * 
 * 工作原理：
 * 1. 用户登录时启动续约定时器
 * 2. 定时器每30秒自动续约一次Token
 * 3. 用户操作时也会触发续约
 * 4. 确保用户在线时Token永不过期
 * 5. 用户离线（未点击续约）时Token会过期
 */

let refreshInterval: number | null = null
let lastRefreshTime = 0
let isRefreshing = false

// 续约配置
const REFRESH_CONFIG = {
  // 定时续约间隔（毫秒）
  INTERVAL: 30 * 1000, // 30秒
  
  // 操作触发续约的最小间隔（毫秒）
  // 避免频繁续约
  MIN_OPERATION_INTERVAL: 5 * 1000, // 5秒
  
  // 续约超时时间（毫秒）
  TIMEOUT: 5000, // 5秒
}

/**
 * 启动Token续约定时器
 * 用户登录时调用此函数
 */
export function startTokenRefresh() {
  // 避免重复启动
  if (refreshInterval !== null) {
    console.warn('⚠️ Token续约定时器已启动，不需要重复启动')
    return
  }

  // 立即续约一次
  performRefresh()

  // 每30秒自动续约一次
  refreshInterval = window.setInterval(() => {
    performRefresh()
  }, REFRESH_CONFIG.INTERVAL)

  console.log('✅ Token续约定时器已启动，每30秒自动续约一次')
}

/**
 * 停止Token续约定时器
 * 用户登出时调用此函数
 */
export function stopTokenRefresh() {
  if (refreshInterval !== null) {
    clearInterval(refreshInterval)
    refreshInterval = null
    lastRefreshTime = 0
    console.log('⏹️ Token续约定时器已停止')
  }
}

/**
 * 执行Token续约
 * 内部函数，不应该直接调用
 */
async function performRefresh() {
  // 避免并发续约
  if (isRefreshing) {
    return
  }

  const userStore = useUserStore()

  // 如果没有登录，不需要续约
  if (!userStore.isLoggedIn) {
    return
  }

  isRefreshing = true

  try {
    const response = await refreshToken()

    if (response.code === 200 && response.data.success) {
      const tokenTimeout = response.data.tokenTimeout
      console.log(`✅ Token已续约，剩余有效期: ${tokenTimeout}秒`)
      lastRefreshTime = Date.now()
      return
    } else {
      console.warn('⚠️ Token续约失败:', response.message)
      handleRefreshFailed()
    }
  } catch (error) {
    console.warn('⚠️ Token续约请求失败:', error)
    // 如果是401错误，说明Token已过期
    if ((error as any)?.response?.status === 401) {
      handleTokenExpired()
    }
  } finally {
    isRefreshing = false
  }
}

/**
 * 用户操作时触发续约
 * 在请求拦截器中调用
 */
export function triggerRefreshOnOperation() {
  const userStore = useUserStore()

  // 如果没有登录，不需要续约
  if (!userStore.isLoggedIn) {
    return
  }

  // 检查距离上次续约的时间
  const timeSinceLastRefresh = Date.now() - lastRefreshTime
  
  // 如果距离上次续约不足5秒，则不续约（避免频繁续约）
  if (timeSinceLastRefresh < REFRESH_CONFIG.MIN_OPERATION_INTERVAL) {
    return
  }

  // 异步执行续约，不阻塞主流程
  performRefresh().catch((error) => {
    console.error('操作触发的Token续约失败:', error)
  })
}

/**
 * 手动续约Token
 * 用于特殊场景，比如用户长时间未操作后重新操作
 */
export async function manualRefreshToken(): Promise<boolean> {
  const userStore = useUserStore()

  if (!userStore.isLoggedIn) {
    return false
  }

  try {
    const response = await refreshToken()
    return response.code === 200 && response.data.success
  } catch (error) {
    console.error('手动Token续约失败:', error)
    return false
  }
}

/**
 * 处理续约失败
 */
function handleRefreshFailed() {
  console.warn('⚠️ Token续约失败，可能Token已过期')
  // 尝试验证Token是否还有效
  verifyToken()
    .then((response) => {
      if (response.code !== 200 || !response.data.valid) {
        handleTokenExpired()
      }
    })
    .catch(() => {
      handleTokenExpired()
    })
}

/**
 * 处理Token过期
 * 
 * 工作原理：
 * 1. 停止续约定时器
 * 2. 清除登录信息
 * 3. 显示提示信息（不自动跳转）
 * 4. 下次用户操作时，会被重定向到登录页
 */
function handleTokenExpired() {
  const userStore = useUserStore()

  console.warn('⚠️ Token已过期，清除登录信息')

  // 停止续约定时器
  stopTokenRefresh()

  // 清除登录信息
  userStore.logout()

  // 显示提示信息（不自动跳转）
  ElMessage({
    message: '登录信息已过期，请重新登录后继续操作',
    type: 'warning',
    duration: 5000
  })
  if (window.location.hash !== '#/') {
    window.location.hash = '#/'
  }

  // 不立即跳转，让用户继续查看内容
  // 下次用户尝试操作时，会被重定向到登录页
}

/**
 * 获取续约配置
 */
export function getRefreshConfig() {
  return {
    interval: REFRESH_CONFIG.INTERVAL,
    minOperationInterval: REFRESH_CONFIG.MIN_OPERATION_INTERVAL,
    timeout: REFRESH_CONFIG.TIMEOUT,
  }
}

/**
 * 修改续约间隔
 * @param interval 新的续约间隔（毫秒）
 */
export function setRefreshInterval(interval: number) {
  if (interval < 10000) {
    console.warn('⚠️ 续约间隔不能小于10秒')
    return
  }

  REFRESH_CONFIG.INTERVAL = interval

  // 重启定时器
  if (refreshInterval !== null) {
    stopTokenRefresh()
    startTokenRefresh()
    console.log(`✅ Token续约间隔已修改为${interval}毫秒`)
  }
}

/**
 * 获取上次续约时间
 */
export function getLastRefreshTime(): number {
  return lastRefreshTime
}

/**
 * 获取续约状态
 */
export function getRefreshStatus() {
  return {
    isRunning: refreshInterval !== null,
    lastRefreshTime: lastRefreshTime,
    isRefreshing: isRefreshing,
  }
}
