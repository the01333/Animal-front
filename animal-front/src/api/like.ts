import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 宠物点赞
export function likePet(petId: number): Promise<ApiResponse<void>> {
  return request({ url: `/pet/like/${petId}`, method: 'post' })
}

export function unlikePet(petId: number): Promise<ApiResponse<void>> {
  return request({ url: `/pet/like/${petId}`, method: 'delete' })
}

/**
 * 获取宠物点赞数量（无需认证）
 */
export function getPetLikeCount(petId: number): Promise<ApiResponse<number>> {
  return request({ url: `/pet/like/count/${petId}`, method: 'get' })
}

/**
 * 检查是否已点赞（需要认证）
 */
export function isPetLiked(petId: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/pet/like/check/${petId}`, method: 'get' })
}

// 内容点赞
export function likeArticle(category: string, articleId: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${category}/${articleId}/like`, method: 'post' })
}

export function unlikeArticle(category: string, articleId: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${category}/${articleId}/like`, method: 'delete' })
}

export function isArticleLiked(category: string, articleId: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/content/${category}/${articleId}/like/check`, method: 'get' })
}