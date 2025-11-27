import request from '@/utils/request'
import type { ApiResponse, Article, PageResponse } from '@/types'

const GUIDE = 'GUIDE'

export function getGuideList(params: { current?: number; size?: number; keyword?: string }): Promise<ApiResponse<PageResponse<Article>>> {
  return request({
    url: '/content/page',
    method: 'get',
    params: {
      ...params,
      category: GUIDE,
      current: params.current ?? 1,
      size: params.size ?? 10
    }
  })
}

export function getGuideDetail(id: number): Promise<ApiResponse<Article>> {
  return request({
    url: `/content/${GUIDE}/${id}`,
    method: 'get'
  })
}

export function likeGuide(id: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${GUIDE}/${id}/like`, method: 'post' })
}

export function unlikeGuide(id: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${GUIDE}/${id}/like`, method: 'delete' })
}

export function favoriteGuide(id: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${GUIDE}/${id}/favorite`, method: 'post' })
}

export function unfavoriteGuide(id: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${GUIDE}/${id}/favorite`, method: 'delete' })
}

export function isGuideLiked(id: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/content/${GUIDE}/${id}/like/check`, method: 'get' })
}

export function isGuideFavorited(id: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/content/${GUIDE}/${id}/favorite/check`, method: 'get' })
}
