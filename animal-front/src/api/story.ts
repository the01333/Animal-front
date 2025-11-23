import request from '@/utils/request'
import type { ApiResponse } from '@/types'

export interface StoryVO {
  id: number
  title: string
  excerpt: string
  content: string
  image?: string
  author: string
  tags: string[]
  likes: number
  publishDate: string
  liked?: boolean
  favorited?: boolean
}

/**
 * 获取所有故事列表
 */
export function getAllStories(): Promise<ApiResponse<StoryVO[]>> {
  return request({
    url: '/story/list',
    method: 'get'
  })
}

/**
 * 根据ID获取故事详情
 */
export function getStoryDetail(id: number, userId?: number): Promise<ApiResponse<StoryVO>> {
  return request({
    url: `/story/${id}`,
    method: 'get',
    params: { userId }
  })
}

/**
 * 点赞故事
 */
export function likeStory(id: number, userId: number): Promise<ApiResponse<void>> {
  return request({
    url: `/story/${id}/like`,
    method: 'post',
    params: { userId }
  })
}

/**
 * 取消点赞故事
 */
export function unlikeStory(id: number, userId: number): Promise<ApiResponse<void>> {
  return request({
    url: `/story/${id}/like`,
    method: 'delete',
    params: { userId }
  })
}

/**
 * 收藏故事
 */
export function favoriteStory(id: number, userId: number): Promise<ApiResponse<void>> {
  return request({
    url: `/story/${id}/favorite`,
    method: 'post',
    params: { userId }
  })
}

/**
 * 取消收藏故事
 */
export function unfavoriteStory(id: number, userId: number): Promise<ApiResponse<void>> {
  return request({
    url: `/story/${id}/favorite`,
    method: 'delete',
    params: { userId }
  })
}

/**
 * 获取故事点赞数量（无需认证）
 */
export function getStoryLikeCount(id: number): Promise<ApiResponse<number>> {
  return request({
    url: `/story/${id}/like/count`,
    method: 'get'
  })
}

/**
 * 获取故事收藏数量（无需认证）
 */
export function getStoryFavoriteCount(id: number): Promise<ApiResponse<number>> {
  return request({
    url: `/story/${id}/favorite/count`,
    method: 'get'
  })
}

/**
 * 检查用户是否已点赞故事（需要认证）
 */
export function isStoryLiked(id: number): Promise<ApiResponse<boolean>> {
  return request({
    url: `/story/${id}/like/check`,
    method: 'get'
  })
}

/**
 * 检查用户是否已收藏故事（需要认证）
 */
export function isStoryFavorited(id: number): Promise<ApiResponse<boolean>> {
  return request({
    url: `/story/${id}/favorite/check`,
    method: 'get'
  })
}
