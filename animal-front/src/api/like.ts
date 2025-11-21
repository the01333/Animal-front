import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 宠物点赞
export function likePet(petId: number): Promise<ApiResponse<void>> {
  return request({ url: `/pet/like/${petId}`, method: 'post' })
}

export function unlikePet(petId: number): Promise<ApiResponse<void>> {
  return request({ url: `/pet/like/${petId}`, method: 'delete' })
}

export function isPetLiked(petId: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/pet/like/check/${petId}`, method: 'get' })
}

// 文章点赞
export function likeArticle(articleId: number): Promise<ApiResponse<void>> {
  return request({ url: `/article/like/${articleId}`, method: 'post' })
}

export function unlikeArticle(articleId: number): Promise<ApiResponse<void>> {
  return request({ url: `/article/like/${articleId}`, method: 'delete' })
}

export function isArticleLiked(articleId: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/article/like/check/${articleId}`, method: 'get' })
}