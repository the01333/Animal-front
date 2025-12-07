import request from '@/utils/request'
import type { ApiResponse, Statistics } from '@/types'

/**
 * 获取统计数据（管理员）
 */
export function getStatistics(): Promise<ApiResponse<Statistics>> {
  return request({
    url: '/stats/dashboard',
    method: 'get'
  })
}

/**
 * 获取宠物分类统计
 */
export function getPetCategoryStats(): Promise<
  ApiResponse<Array<{ category: string; count: number }>>
> {
  return request({
    url: '/stats/pet-category',
    method: 'get'
  })
}

/**
 * 获取申请状态统计
 */
export function getApplicationStatusStats(): Promise<
  ApiResponse<Array<{ status: string; count: number }>>
> {
  return request({
    url: '/stats/application-status',
    method: 'get'
  })
}

/**
 * 获取最近访问趋势
 */
export function getVisitTrend(days: number = 7): Promise<
  ApiResponse<Array<{ date: string; count: number }>>
> {
  return request({
    url: '/stats/visit-trend',
    method: 'get',
    params: { days }
  })
}

/**
 * 手动触发浏览次数同步任务
 */
export function manualSyncViewCount(): Promise<ApiResponse<void>> {
  return request({
    url: '/stats/view-count/sync',
    method: 'post'
  })
}

