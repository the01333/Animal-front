import request from '@/utils/request'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export interface ChatResponse {
  code: number
  message: string
  data: string
}

/**
 * 流式多轮对话（使用会话记忆）
 * @param content 用户输入的消息内容
 * @param sessionId 会话ID
 * @param onChunk 每次接收到数据块时的回调函数
 * @returns Promise
 */
export async function chatWithAIMemoryStream(
  content: string,
  sessionId: string | undefined,
  onChunk: (chunk: string) => void
): Promise<string> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch('/api/ai/service/chat-with-memory-stream', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ 
      content,
      sessionId: sessionId || ''
    })
  })

  // 处理 401 未授权错误（登录过期或未登录）
  if (response.status === 401) {
    console.warn('登录验证失败: 401')
    
    // 从响应体中获取错误信息
    let errorMessage = '登录信息已过期，请重新登录'
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch (e) {
      // TODO: 先忽略 JSON 解析错误
    }
    throw new Error(errorMessage)
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  // 根据 fetch 拿到的结果再获取 readableStream，循环拿到每一个chunk（二进制块），再解析成字符串，最后再格式化拼接，实现流式效果
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Response body is not readable')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let sessionIdFromResponse = sessionId || ''
  
  try {
    while (true) {
      // 每次读一小块数据（chunk）
      const { done, value } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      
      // 解析 SSE 格式 - data: { ... }\n
      const lines = buffer.split('\n')
      
      // 保留最后一个不完整的行
      buffer = lines[lines.length - 1]
      
      // 处理完整的行
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim()
        if (line.startsWith('data:')) {
          // 提取 data: 后面的内容（JSON格式的字符串）
          const jsonStr = line.substring(5).trim()
          if (jsonStr) {
            try {
              // 解析JSON字符串，恢复转义的换行符等特殊字符
              const data = JSON.parse(jsonStr)
              // 调用回调函数，data 现在是解析后的字符串，可以直接使用
              onChunk(data)
            } catch (e) {
              console.warn('Failed to parse JSON:', jsonStr, e)
            }
          }
        }
      }
    }
    
    // 处理最后的缓冲区
    if (buffer.trim().startsWith('data:')) {
      const jsonStr = buffer.trim().substring(5).trim()
      if (jsonStr) {
        try {
          const data = JSON.parse(jsonStr)
          onChunk(data)
        } catch (e) {
          console.warn('Failed to parse final JSON:', jsonStr, e)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
  
  // 如果没有 sessionId，从响应头中获取
  if (!sessionIdFromResponse) {
    const sessionIdFromHeader = response.headers.get('X-Session-Id')
    if (sessionIdFromHeader) {
      sessionIdFromResponse = sessionIdFromHeader
    }
  }
  
  console.log('📤 返回的 sessionId:', sessionIdFromResponse)
  return sessionIdFromResponse
}

/**
 * 获取AI客服的欢迎语
 */
export function getWelcomeMessage(): string {
  return `👋 欢迎来到i宠园AI客服！

我是您的宠物领养顾问，很高兴为您服务。我可以帮助您：

🐱 **宠物推荐** - 根据您的需求推荐合适的宠物
  例如："有什么推荐的宠物吗？"
  例如："我想要一只活泼的小狗"

👤 **性格匹配** - 根据您的性格推荐宠物
  例如："我性格内向，适合养什么宠物？"
  例如："我是个很忙的上班族"

🏠 **生活方式** - 根据您的生活环境推荐宠物
  例如："我住在公寓里，有什么推荐吗？"
  例如："我有一个小孩，想养一只宠物"

📚 **护理指南** - 提供宠物护理建议
  例如："怎样照顾小猫？"
  例如："新手养狗要注意什么？"

❓ **其他问题** - 回答关于宠物的各种问题
  例如："宠物需要打疫苗吗？"
  例如："宠物生病了怎么办？"

请告诉我您的需求，我会为您提供最好的建议！`
}
