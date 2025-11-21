import request from '@/utils/request'
import type { ApiResponse } from '@/types'

export interface GuideVO {
  id: number
  title: string
  excerpt: string
  content: string
  image?: string
  category: string
  views: number
  publishDate: string
  liked?: boolean
  likeCount?: number
  favorited?: boolean
}

/**
 * 获取所有指南列表
 */
export function getAllGuides(): Promise<ApiResponse<GuideVO[]>> {
  return request({
    url: '/guide/list',
    method: 'get'
  })
}

/**
 * 根据ID获取指南详情
 */
export function getGuideDetail(id: number, userId?: number): Promise<ApiResponse<GuideVO>> {
  return request({
    url: `/guide/${id}`,
    method: 'get',
    params: { userId }
  })
}

/**
 * 根据分类获取指南列表
 */
export function getGuidesByCategory(category: string): Promise<ApiResponse<GuideVO[]>> {
  return request({
    url: `/guide/category/${category}`,
    method: 'get'
  })
}

/**
 * 点赞指南
 */
export function likeGuide(id: number, userId: number): Promise<ApiResponse<void>> {
  return request({
    url: `/guide/${id}/like`,
    method: 'post',
    params: { userId }
  })
}

/**
 * 取消点赞指南
 */
export function unlikeGuide(id: number, userId: number): Promise<ApiResponse<void>> {
  return request({
    url: `/guide/${id}/like`,
    method: 'delete',
    params: { userId }
  })
}

/**
 * 收藏指南
 */
export function favoriteGuide(id: number, userId: number): Promise<ApiResponse<void>> {
  return request({
    url: `/guide/${id}/favorite`,
    method: 'post',
    params: { userId }
  })
}

/**
 * 取消收藏指南
 */
export function unfavoriteGuide(id: number, userId: number): Promise<ApiResponse<void>> {
  return request({
    url: `/guide/${id}/favorite`,
    method: 'delete',
    params: { userId }
  })
}
