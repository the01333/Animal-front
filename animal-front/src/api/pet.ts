import request from '@/utils/request'
import type { ApiResponse, Pet, PetQuery, PageResponse } from '@/types'

/**
 * 获取宠物列表（分页）
 * 统一使用 /page 接口
 */
export function getPetList(params: PetQuery): Promise<ApiResponse<PageResponse<Pet>>> {
  return request({
    url: '/pet/page',
    method: 'get',
    params
  })
}

/**
 * 获取宠物详情
 */
export function getPetDetail(id: number): Promise<ApiResponse<Pet>> {
  return request({
    url: `/pet/${id}`,
    method: 'get'
  })
}

/**
 * 创建宠物（管理员）
 */
export function createPet(data: Partial<Pet>): Promise<ApiResponse<Pet>> {
  return request({
    url: '/pet',
    method: 'post',
    data
  })
}

/**
 * 更新宠物（管理员）
 */
export function updatePet(id: number, data: Partial<Pet>): Promise<ApiResponse<void>> {
  return request({
    url: `/pet/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除宠物（管理员）
 */
export function deletePet(id: number): Promise<ApiResponse<void>> {
  return request({
    url: `/pet/${id}`,
    method: 'delete'
  })
}

/**
 * 获取推荐宠物
 */
export function getRecommendedPets(limit: number = 6): Promise<ApiResponse<Pet[]>> {
  return request({
    url: '/pet/recommended',
    method: 'get',
    params: { limit }
  })
}

