import request from '@/utils/request'
import type { ApiResponse } from '@/types'

export interface DictData {
  petCategories: Record<string, string>
  genders: Record<number, string>
  adoptionStatuses: Record<string, string>
  healthStatuses: Record<string, string>
}

export interface DictItem {
  id: number
  dictType: string
  dictKey: string
  dictLabel: string
  sortOrder: number
  status: number
  remark?: string
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
 * 获取健康状态选项
 */
export function getHealthStatuses(): Promise<ApiResponse<Record<string, string>>> {
  return request({
    url: '/dict/healthStatuses',
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

export function listDictItems(dictType?: string): Promise<ApiResponse<DictItem[]>> {
  return request({
    url: '/dict/items',
    method: 'get',
    params: dictType ? { dictType } : undefined
  })
}

export function createDictItem(data: Partial<DictItem>): Promise<ApiResponse<number>> {
  return request({
    url: '/dict/items',
    method: 'post',
    data
  })
}

export function updateDictItem(id: number, data: Partial<DictItem>): Promise<ApiResponse<void>> {
  return request({
    url: `/dict/items/${id}`,
    method: 'put',
    data
  })
}

export function deleteDictItem(id: number): Promise<ApiResponse<void>> {
  return request({
    url: `/dict/items/${id}`,
    method: 'delete'
  })
}

/**
 * 刷新字典缓存（系统工具）
 */
export function refreshDictCache(): Promise<ApiResponse<void>> {
  return request({
    url: '/dict/refresh',
    method: 'post'
  })
}

/**
 * 自动创建宠物类别（仅传中文名称，后端用 AI 生成英文编码）
 */
export function createPetCategoryAuto(label: string): Promise<ApiResponse<number>> {
  return request({
    url: '/dict/items/pet-category/auto',
    method: 'post',
    data: { label }
  })
}
