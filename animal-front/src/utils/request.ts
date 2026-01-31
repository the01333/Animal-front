import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { triggerRefreshOnOperation } from './tokenRefreshManager'
import { handleGlobalTokenExpired } from './tokenExpiredHandler'

// NProgress 配置
NProgress.configure({ showSpinner: false })

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    NProgress.start()
    // 获取token
    const token = localStorage.getItem('token')
    if (token) {
      // 从 header 中 的 Authorization 获取 token
      // 默认带 'Bearer ' 前缀
      config.headers['Authorization'] = `Bearer ${token}`

      // 触发Token续约（用户有操作时自动续约）
      // 这样即使用户没有显式调用续约接口，也能通过操作来续约Token
      triggerRefreshOnOperation()
    }
    return config
  },
  (error) => {
    NProgress.done()
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()
    const { code, message, data } = response.data
    console.log('🔍 响应拦截器 - 原始响应:', response.data)

    // 根据业务状态码统一处理
    if (code === 200 || code === 0) {
      // 统一返回整个 Result 对象（ApiResponse<T>）
      // 这样现有代码中的 res.code / res.data 都可以正常工作
      console.log('✅ 响应成功，返回数据:', response.data)
      return response.data
    } else if (code === 401) {
      console.warn('⚠️ Token已过期或无效:', message)
      handleTokenExpired(message)
      return Promise.reject(new Error(message || '未授权'))
    } else {
      // 业务错误：创建一个包含完整信息的错误对象
      console.error('❌ 业务错误:', message)
      const error: any = new Error(message || '请求失败')
      error.response = { data: response.data }
      return Promise.reject(error)
    }
  },
  (error) => {
    NProgress.done()
    console.error('响应错误:', error)

    if (error.response) {
      const { status, data } = error.response
      
      // 401 Token过期特殊处理
      if (status === 401) {
        console.warn('⚠️ HTTP 401 - Token已过期或无效')
        handleTokenExpired(data?.message || '登录信息已过期')
        return Promise.reject(error)
      }
      
      // 其他HTTP错误：确保错误信息在 error.response.data.message 中
      console.error(`HTTP ${status} 错误:`, data?.message || error.message)
    } else {
      // 网络连接失败才在拦截器中提示
      ElMessage.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

/**
 * 处理Token过期
 */
function handleTokenExpired(message?: string) {
  handleGlobalTokenExpired(message)
}

export default service

