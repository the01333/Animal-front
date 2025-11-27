import request from '@/utils/request'
import type { ApiResponse, Article, PageResponse } from '@/types'

const STORY = 'STORY'

export function getStoryList(params: { current?: number; size?: number; keyword?: string }): Promise<ApiResponse<PageResponse<Article>>> {
  return request({
    url: '/content/page',
    method: 'get',
    params: {
      ...params,
      category: STORY,
      current: params.current ?? 1,
      size: params.size ?? 10
    }
  })
}

export function getStoryDetail(id: number): Promise<ApiResponse<Article>> {
  return request({
    url: `/content/${STORY}/${id}`,
    method: 'get'
  })
}

export function likeStory(id: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${STORY}/${id}/like`, method: 'post' })
}

export function unlikeStory(id: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${STORY}/${id}/like`, method: 'delete' })
}

export function favoriteStory(id: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${STORY}/${id}/favorite`, method: 'post' })
}

export function unfavoriteStory(id: number): Promise<ApiResponse<void>> {
  return request({ url: `/content/${STORY}/${id}/favorite`, method: 'delete' })
}

export function isStoryLiked(id: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/content/${STORY}/${id}/like/check`, method: 'get' })
}

export function isStoryFavorited(id: number): Promise<ApiResponse<boolean>> {
  return request({ url: `/content/${STORY}/${id}/favorite/check`, method: 'get' })
}
