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
