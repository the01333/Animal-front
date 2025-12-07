import request from '@/utils/request'
import type {
  ApiResponse,
  User,
  LoginForm,
  RegisterForm,
  PageResponse,
  UserCertificationRecord
} from '@/types'

type VerificationPurpose = 'login' | 'register' | 'reset_password' | 'bind'

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
 * 验证Token是否有效
 * 前端可以定期调用此接口检查Token是否过期
 */
export function verifyToken(): Promise<ApiResponse<{
  valid: boolean
  userId?: number
  username?: string
  role?: string
}>> {
  return request({
    url: '/user/verify-token',
    method: 'get'
  })
}

/**
 * Token续约接口
 * 用户在线时调用此接口，自动续约Token的活跃时间
 * 类似Redisson的分布式锁续约机制
 */
export function refreshToken(): Promise<ApiResponse<{
  success: boolean
  userId?: number
  tokenTimeout?: number
  message?: string
}>> {
  return request({
    url: '/user/refresh-token',
    method: 'post'
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
 * 上传用户头像
 */
export function uploadUserAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
  const formData = new FormData()
  formData.append('avatar', file)
  return request({
    url: '/user/avatar/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
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
export function loginByEmailCode(
  email: string,
  code: string
): Promise<ApiResponse<{ token: string; userInfo: User }>> {
  return request({ url: '/user/login/email-code', method: 'post', data: { email, code } })
}

export function loginByPhoneCode(
  phone: string,
  code: string
): Promise<ApiResponse<{ token: string; userInfo: User }>> {
  return request({ url: '/user/login/phone-code', method: 'post', data: { phone, code } })
}

export function sendEmailVerificationCode(
  email: string,
  purpose: VerificationPurpose = 'login'
): Promise<ApiResponse<void>> {
  return request({ url: '/verification/email/send', method: 'post', data: { email, purpose } })
}

export function sendPhoneVerificationCode(
  phone: string,
  purpose: VerificationPurpose = 'login'
): Promise<ApiResponse<void>> {
  return request({ url: '/verification/phone/send', method: 'post', data: { phone, purpose } })
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
 * 管理员编辑用户信息/角色/状态
 */
export function updateAdminUser(id: number, data: Partial<{
  username: string
  nickname: string
  phone: string
  email: string
  avatar: string
  role: string
  status: number
}>): Promise<ApiResponse<void>> {
  return request({
    url: `/user/${id}/admin`,
    method: 'put',
    data
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

export function getCertificationList(params: {
  current: number
  size: number
  status?: string
  keyword?: string
}): Promise<ApiResponse<PageResponse<UserCertificationRecord>>> {
  return request({
    url: '/user/certification/admin/list',
    method: 'get',
    params
  })
}

export function getCertificationDetail(id: number): Promise<ApiResponse<UserCertificationRecord>> {
  return request({
    url: `/user/certification/admin/${id}`,
    method: 'get'
  })
}

export function reviewCertification(
  id: number,
  data: { status: 'approved' | 'rejected'; rejectReason?: string }
): Promise<ApiResponse<void>> {
  return request({
    url: `/user/certification/admin/${id}/review`,
    method: 'put',
    data
  })
}
