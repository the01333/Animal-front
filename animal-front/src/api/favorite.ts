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

// 内容收藏
export function addArticleFavorite(category: string, articleId: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${category}/${articleId}/favorite`, method: 'post' })
}

export function removeArticleFavorite(category: string, articleId: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${category}/${articleId}/favorite`, method: 'delete' })
}

export function isArticleFavorited(category: string, articleId: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/content/${category}/${articleId}/favorite/check`, method: 'get' })
}