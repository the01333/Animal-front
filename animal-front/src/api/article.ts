import request from '@/utils/request'
import type { ApiResponse, Article, ArticleCategoryOption, PageResponse } from '@/types'
import { getGuideCategories } from './guide'
import { getStoryCategories } from './story'

/**
 * 获取文章列表（分页）
 * 统一使用 /page 接口
 */
export function getArticleList(params: {
  current: number
  size: number
  category?: string
  keyword?: string
}): Promise<ApiResponse<PageResponse<Article>>> {
  return request({
    url: '/content/page',
    method: 'get',
    params
  })
}

/**
 * 获取文章详情
 */
export function getArticleDetail(category: string, id: number): Promise<ApiResponse<Article>> {
  return request({
    url: `/content/${category}/${id}`,
    method: 'get'
  })
}

/**
 * 创建文章（管理员）
 */
export function createArticle(data: Partial<Article>): Promise<ApiResponse<void>> {
  return request({
    url: '/content',
    method: 'post',
    data
  })
}

/**
 * 更新文章（管理员）
 */
export function updateArticle(category: string, id: number, data: Partial<Article>): Promise<ApiResponse<void>> {
  return request({
    url: `/content/${category}/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除文章（管理员）
 */
export function deleteArticle(category: string, id: number): Promise<ApiResponse<void>> {
  return request({
    url: `/content/${category}/${id}`,
    method: 'delete'
  })
}

/**
 * 获取文章分类
 */
export function getArticleCategories(): Promise<ApiResponse<ArticleCategoryOption[]>> {
  return request({
    url: '/content/categories',
    method: 'get'
  })
}

export function uploadArticleCover(formData: FormData): Promise<ApiResponse<string>> {
  return request({
    url: '/file/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getUserLikedArticles(params: {
  current: number
  size: number
  category?: 'GUIDE' | 'STORY'
}): Promise<ApiResponse<PageResponse<Article>>> {
  return request({
    url: '/content/like/my',
    method: 'get',
    params
  })
}

export function getUserFavoritedArticles(params: {
  current: number
  size: number
  category?: 'GUIDE' | 'STORY'
}): Promise<ApiResponse<PageResponse<Article>>> {
  return request({
    url: '/content/favorite/my',
    method: 'get',
    params
  })
}

/**
 * 获取指南分类列表
 */
export async function getGuideCategoriesList(): Promise<string[]> {
  try {
    const res = await getGuideCategories()
    return res.data || []
  } catch (error) {
    console.error('获取指南分类失败:', error)
    return []
  }
}

/**
 * 获取故事分类列表
 */
export async function getStoryCategoriesList(): Promise<string[]> {
  try {
    const res = await getStoryCategories()
    return res.data || []
  } catch (error) {
    console.error('获取故事分类失败:', error)
    return []
  }
}

