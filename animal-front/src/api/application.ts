import request from '@/utils/request'
import type { ApiResponse, AdoptionApplication, ApplicationForm, PageResponse } from '@/types'

/**
 * 提交领养申请
 */
export function submitApplication(data: ApplicationForm): Promise<ApiResponse<void>> {
  return request({
    url: '/application',
    method: 'post',
    data
  })
}

/**
 * 获取我的申请列表
 */
export function getMyApplications(params: {
  current: number
  size: number
  status?: string
}): Promise<ApiResponse<PageResponse<AdoptionApplication>>> {
  return request({
    url: '/application/my',
    method: 'get',
    params
  })
}

/**
 * 获取申请详情
 */
export function getApplicationDetail(id: number): Promise<ApiResponse<AdoptionApplication>> {
  return request({
    url: `/application/${id}`,
    method: 'get'
  })
}

/**
 * 取消申请
 */
export function cancelApplication(id: number): Promise<ApiResponse<void>> {
  return request({
    url: `/application/${id}/cancel`,
    method: 'put'
  })
}

/**
 * 获取所有申请列表（管理员）
 */
export function getAllApplications(params: {
  current: number
  size: number
  status?: string
  keyword?: string
}): Promise<ApiResponse<PageResponse<AdoptionApplication>>> {
  return request({
    url: '/application/list',
    method: 'get',
    params
  })
}

/**
 * 审核申请（管理员）
 */
export function reviewApplication(
  id: number,
  data: { status: string; reviewComment?: string }
): Promise<ApiResponse<void>> {
  return request({
    url: `/application/${id}/review`,
    method: 'put',
    data
  })
}

