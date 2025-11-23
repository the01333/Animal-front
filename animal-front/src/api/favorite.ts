import request from '@/utils/request'
import type { ApiResponse } from '@/types'

// 宠物收藏
export function addPetFavorite(petId: number): Promise<ApiResponse<void>> {
  return request({ url: `/favorite/${petId}`, method: 'post' })
}

export function removePetFavorite(petId: number): Promise<ApiResponse<void>> {
  return request({ url: `/favorite/${petId}`, method: 'delete' })
}

/**
 * 获取宠物收藏数量（无需认证）
 */
export function getPetFavoriteCount(petId: number): Promise<ApiResponse<number>> {
  return request({ url: `/favorite/count/${petId}`, method: 'get' })
}

/**
 * 检查是否已收藏（需要认证）
 */
export function isPetFavorited(petId: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/favorite/check/${petId}`, method: 'get' })
}

// 文章收藏
export function addArticleFavorite(articleId: number): Promise<ApiResponse<void>> {
  return request({ url: `/article/favorite/${articleId}`, method: 'post' })
}

export function removeArticleFavorite(articleId: number): Promise<ApiResponse<void>> {
  return request({ url: `/article/favorite/${articleId}`, method: 'delete' })
}

export function isArticleFavorited(articleId: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/article/favorite/check/${articleId}`, method: 'get' })
}