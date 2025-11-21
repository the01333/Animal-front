import request from '@/utils/request'
import type { ApiResponse, User, LoginForm, RegisterForm, PageResponse } from '@/types'

/**
 * 用户登录
 */
export function login(data: LoginForm): Promise<ApiResponse<{ token: string; user: User }>> {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 */
export function register(data: RegisterForm): Promise<ApiResponse<void>> {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

/**
 * 获取当前用户信息
 */
export function getUserInfo(): Promise<ApiResponse<User>> {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: Partial<User>): Promise<ApiResponse<void>> {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

/**
 * 修改密码
 */
export function changePassword(data: {
  oldPassword: string
  newPassword: string
}): Promise<ApiResponse<void>> {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

// 验证码登录
export function loginByEmailCode(email: string, code: string): Promise<ApiResponse<{ token: string; userInfo: User }>> {
  return request({ url: '/user/login/email-code', method: 'post', data: { email, code } })
}

export function loginByPhoneCode(phone: string, code: string): Promise<ApiResponse<{ token: string; userInfo: User }>> {
  return request({ url: '/user/login/phone-code', method: 'post', data: { phone, code } })
}

// 第三方登录 - 获取授权地址
export function wechatAuthorize(): Promise<ApiResponse<{ url: string; state: string }>> {
  return request({ url: '/oauth/wechat/authorize', method: 'get' })
}

export function qqAuthorize(): Promise<ApiResponse<{ url: string; state: string }>> {
  return request({ url: '/oauth/qq/authorize', method: 'get' })
}

// 第三方登录 - 回调交换token
export function wechatCallback(code: string, state: string): Promise<ApiResponse<{ token: string; userInfo: User }>> {
  return request({ url: '/oauth/wechat/callback', method: 'get', params: { code, state } })
}

export function qqCallback(code: string, state: string): Promise<ApiResponse<{ token: string; userInfo: User }>> {
  return request({ url: '/oauth/qq/callback', method: 'get', params: { code, state } })
}

/**
 * 获取用户列表（管理员）
 */
export function getUserList(params: {
  current: number
  size: number
  keyword?: string
  role?: string
}): Promise<ApiResponse<PageResponse<User>>> {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

/**
 * 删除用户（管理员）
 */
export function deleteUser(id: number): Promise<ApiResponse<void>> {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

/**
 * 更新用户状态（管理员）
 */
export function updateUserStatus(id: number, status: number): Promise<ApiResponse<void>> {
  return request({
    url: `/user/${id}/status`,
    method: 'put',
    data: { status }
  })
}

/**
 * 获取用户认证信息
 */
export function getCertificationInfo(): Promise<ApiResponse<{
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  rejectReason?: string
}>> {
  return request({
    url: '/user/certification/info',
    method: 'get'
  })
}

/**
 * 提交用户认证
 */
export function submitCertification(data: FormData): Promise<ApiResponse<void>> {
  return request({
    url: '/user/certification/submit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

