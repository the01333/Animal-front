import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
      // Sa-Token 默认从 Authorization header 中获取 token
      config.headers['Authorization'] = token
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
      ElMessage.error('未授权,请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/#/login'
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
      const { status } = error.response
      switch (status) {
        case 400:
          ElMessage.error('请求参数错误')
          break
        case 401:
          ElMessage.error('未授权,请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/#/login'
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

export default service

