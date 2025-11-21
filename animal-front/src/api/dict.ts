import request from '@/utils/request'
import type { ApiResponse } from '@/types'

/**
 * 字典数据类型
 */
export interface DictData {
  petCategories: Record<string, string>
  genders: Record<number, string>
  adoptionStatuses: Record<string, string>
  healthStatuses: Record<string, string>
}

/**
 * 获取宠物类型选项
 */
export function getPetCategories(): Promise<ApiResponse<Record<string, string>>> {
  return request({
    url: '/dict/petCategories',
    method: 'get'
  })
}

/**
 * 获取性别选项
 */
export function getGenders(): Promise<ApiResponse<Record<number, string>>> {
  return request({
    url: '/dict/genders',
    method: 'get'
  })
}

/**
 * 获取领养状态选项
 */
export function getAdoptionStatuses(): Promise<ApiResponse<Record<string, string>>> {
  return request({
    url: '/dict/adoptionStatuses',
    method: 'get'
  })
}

/**
 * 获取所有字典数据
 */
export function getAllDictData(): Promise<ApiResponse<DictData>> {
  return request({
    url: '/dict/all',
    method: 'get'
  })
}
