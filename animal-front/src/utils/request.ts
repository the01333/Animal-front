import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { triggerRefreshOnOperation } from './tokenRefreshManager'

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

    // 根据业务状态码处理
    if (code === 200 || code === 0) {
      console.log('✅ 响应成功，返回数据:', response.data)
      return response.data
    } else if (code === 401) {
      console.warn('⚠️ Token已过期或无效:', message)
      handleTokenExpired(message)
      return Promise.reject(new Error(message || '未授权'))
    } else {
      console.error('❌ 业务错误:', message)
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    NProgress.done()
    console.error('响应错误:', error)

    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 400:
          ElMessage.error('请求参数错误')
          break
        case 401:
          console.warn('⚠️ HTTP 401 - Token已过期或无效')
          handleTokenExpired(data?.message || '登录信息已过期')
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error('网络请求失败')
      }
    } else {
      ElMessage.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

/**
 * 处理Token过期
 */
function handleTokenExpired(message?: string) {
  // 清除本地存储
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')

  // 显示提示信息
  const msg = message || '登录信息已过期，请重新登录'
  ElMessage({
    message: msg,
    type: 'warning',
    duration: 3000,
    onClose: () => {
      // 获取当前页面路径
      const currentPath = window.location.pathname + window.location.hash
      // 跳转到登录页，并保存当前路径用于登录后返回
      window.location.href = `/#/login?redirect=${encodeURIComponent(currentPath)}`
    }
  })
}

export default service

