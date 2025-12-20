import request from '@/utils/request'
import type { ApiResponse, PageResponse } from '@/types'

export interface CsSession {
  id: number
  userId: number
  userUsername?: string
  userNickname?: string
  userAvatar?: string
  agentId?: number
  agentNickname?: string
  status: string
  lastMessage?: string
  lastTime?: string
  unreadForUser?: number
  unreadForAgent?: number
  online?: boolean
}

export interface CsMessage {
  id: number
  sessionId: number
  senderId: number
  receiverId?: number | null
  senderRole: 'USER' | 'AGENT'
  contentType: string
  content: string
  read: boolean
  readTime?: string | null
  createTime?: string | null
}

/**
 * 长轮询获取指定会话中的新消息
 */
export function longPollManualCsMessages(
  sessionId: number,
  lastMessageId?: number
): Promise<ApiResponse<CsMessage[]>> {
  return request({
    url: `/cs/sessions/${sessionId}/lp-messages`,
    method: 'get',
    params: lastMessageId ? { lastMessageId } : undefined
  })
}

/**
 * 前台用户: 获取或创建当前用户的人工客服会话
 */
export function openManualCsSession(): Promise<ApiResponse<CsSession>> {
  return request({
    url: '/cs/session/open',
    method: 'post'
  })
}

/**
 * 获取指定会话的历史消息
 */
export function getManualCsMessages(sessionId: number): Promise<ApiResponse<CsMessage[]>> {
  return request({
    url: `/cs/sessions/${sessionId}/messages`,
    method: 'get'
  })
}

/**
 * 后台客服: 分页查询会话列表
 */
export function pageManualCsSessions(params: {
  current: number
  size: number
  keyword?: string
  status?: string
}): Promise<ApiResponse<PageResponse<CsSession>>> {
  return request({
    url: '/cs/sessions',
    method: 'get',
    params
  })
}

/**
 * 发送人工客服消息
 */
export function sendManualCsMessage(
  sessionId: number,
  data: { content: string; messageType?: string }
): Promise<ApiResponse<CsMessage>> {
  return request({
    url: `/cs/sessions/${sessionId}/messages`,
    method: 'post',
    data
  })
}

/**
 * 已读回执: 将会话的未读数清零
 */
export function readAckManualCs(
  sessionId: number,
  readSide: 'USER' | 'AGENT'
): Promise<ApiResponse<void>> {
  return request({
    url: `/cs/sessions/${sessionId}/read-ack`,
    method: 'post',
    params: { readSide }
  })
}
