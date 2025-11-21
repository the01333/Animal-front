import request from '@/utils/request'
import type { ApiResponse, Article, PageResponse } from '@/types'

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
    url: '/article/page',
    method: 'get',
    params
  })
}

/**
 * 获取文章详情
 */
export function getArticleDetail(id: number): Promise<ApiResponse<Article>> {
  return request({
    url: `/article/${id}`,
    method: 'get'
  })
}

/**
 * 创建文章（管理员）
 */
export function createArticle(data: Partial<Article>): Promise<ApiResponse<void>> {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}

/**
 * 更新文章（管理员）
 */
export function updateArticle(id: number, data: Partial<Article>): Promise<ApiResponse<void>> {
  return request({
    url: `/article/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除文章（管理员）
 */
export function deleteArticle(id: number): Promise<ApiResponse<void>> {
  return request({
    url: `/article/${id}`,
    method: 'delete'
  })
}

