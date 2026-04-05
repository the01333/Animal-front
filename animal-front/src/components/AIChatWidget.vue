<template>
  <Teleport to="body">
    <div class="ai-chat-widget" :class="{ expanded: isExpanded }">
      <!-- 聊天窗口 -->
      <div v-if="isExpanded" class="chat-container">
        <!-- 头部 -->
        <div class="chat-header">
          <div class="header-content">
            <svg class="header-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16"
              height="16">
              <path
                d="M891.41 346.29c-46.89-161.32-193.96-272.8-363.47-272.8-166.19 0-312.34 108.65-361.42 265.97-56.86 2.45-102.24 49.18-102.24 106.64v141.34c0 59.03 47.85 106.88 106.88 106.88h35.32c33.43 0 60.53-27.1 60.53-60.53V399.76c0-29.46-21.07-53.96-48.96-59.36 46.65-129.34 170.24-217.45 309.88-217.45 139.96 0 262.38 87.4 309.3 216.28h-19.08c-33.43 0-60.53 27.1-60.53 60.53v234.03c0 29.93 21.78 54.63 50.32 59.5-53.12 85.52-143.18 142.53-243.25 153.88-10.82-27.59-37.53-47.2-68.96-47.2-40.99 0-74.21 33.23-74.21 74.21 0 40.99 33.22 74.21 74.21 74.21 33.07 0 60.76-21.78 70.34-51.66 126.45-12.93 239.52-89.27 298.36-202.97 53.88-5.49 95.91-51 95.91-106.32V446.11c0.01-45.65-28.66-84.51-68.93-99.82z m-673.84 287.5c0 6.11-4.97 11.08-11.08 11.08h-35.32c-31.67 0-57.43-25.76-57.43-57.43V446.11c0-31.67 25.76-57.43 57.43-57.43h35.32c6.11 0 11.08 4.97 11.08 11.08v234.03z m278.17 265.15c-13.65 0-24.76-11.11-24.76-24.76s11.11-24.76 24.76-24.76c13.65 0 24.76 11.11 24.76 24.76s-11.11 24.76-24.76 24.76z m415.16-311.5c0 31.67-25.76 57.43-57.42 57.43h-35.32c-6.11 0-11.08-4.97-11.08-11.08V399.76c0-6.11 4.97-11.08 11.08-11.08h35.32c31.66 0 57.42 25.76 57.42 57.43v141.33z"
                fill="#ffffff" />
              <path
                d="M669.84 570.03l-47.55-13.55c-12.88 45.18-54.73 76.74-101.77 76.74-46.52 0-88.24-31.12-101.44-75.66l-47.42 14.07c19.38 65.37 80.6 111.04 148.87 111.04 69-0.01 130.41-46.32 149.31-112.64z"
                fill="#ffffff" />
            </svg>
            <span class="header-title">智能助手小林</span>
          </div>
          <el-button link :icon="Close" @click="toggleChat" class="close-btn" />
        </div>

        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer" @wheel="handleMessagesWheel">
          <template v-for="(msg, index) in messages" :key="index">
            <div v-if="shouldShowDateDivider(index)" class="message-date-divider">
              <span class="message-date-label">{{ getMessageDateLabel(msg) }}</span>
            </div>
            <div :class="['message', msg.role]">
              <div class="message-avatar" v-if="msg.role === 'assistant'">
                <svg class="ai-avatar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24"
                  height="24">
                  <path
                    d="M891.41 346.29c-46.89-161.32-193.96-272.8-363.47-272.8-166.19 0-312.34 108.65-361.42 265.97-56.86 2.45-102.24 49.18-102.24 106.64v141.34c0 59.03 47.85 106.88 106.88 106.88h35.32c33.43 0 60.53-27.1 60.53-60.53V399.76c0-29.46-21.07-53.96-48.96-59.36 46.65-129.34 170.24-217.45 309.88-217.45 139.96 0 262.38 87.4 309.3 216.28h-19.08c-33.43 0-60.53 27.1-60.53 60.53v234.03c0 29.93 21.78 54.63 50.32 59.5-53.12 85.52-143.18 142.53-243.25 153.88-10.82-27.59-37.53-47.2-68.96-47.2-40.99 0-74.21 33.23-74.21 74.21 0 40.99 33.22 74.21 74.21 74.21 33.07 0 60.76-21.78 70.34-51.66 126.45-12.93 239.52-89.27 298.36-202.97 53.88-5.49 95.91-51 95.91-106.32V446.11c0.01-45.65-28.66-84.51-68.93-99.82z m-673.84 287.5c0 6.11-4.97 11.08-11.08 11.08h-35.32c-31.67 0-57.43-25.76-57.43-57.43V446.11c0-31.67 25.76-57.43 57.43-57.43h35.32c6.11 0 11.08 4.97 11.08 11.08v234.03z m278.17 265.15c-13.65 0-24.76-11.11-24.76-24.76s11.11-24.76 24.76-24.76c13.65 0 24.76 11.11 24.76 24.76s-11.11 24.76-24.76 24.76z m415.16-311.5c0 31.67-25.76 57.43-57.42 57.43h-35.32c-6.11 0-11.08-4.97-11.08-11.08V399.76c0-6.11 4.97-11.08 11.08-11.08h35.32c31.66 0 57.42 25.76 57.42 57.43v141.33z"
                    fill="#efb336" />
                  <path
                    d="M669.84 570.03l-47.55-13.55c-12.88 45.18-54.73 76.74-101.77 76.74-46.52 0-88.24-31.12-101.44-75.66l-47.42 14.07c19.38 65.37 80.6 111.04 148.87 111.04 69-0.01 130.41-46.32 149.31-112.64z"
                    fill="#efb336" />
                </svg>
              </div>
              <div class="message-content">
                <div class="message-text">
                  <template v-if="msg.messageType === 'IMAGE'">
                    <img :src="processImageUrl(msg.content)" class="chat-image" alt="图片消息" />
                  </template>
                  <template v-else>
                    <div v-html="formatMessage(msg.content)"></div>
                  </template>
                  <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
                </div>
                <!-- 流式输出时显示光标 -->
                <span
                  v-if="isLoading && msg.role === 'assistant' && index === messages.length - 1"
                  class="typing-cursor"
                >▌</span>
              </div>
              <div class="message-avatar user" v-if="msg.role === 'user'">
                <img :src="userAvatar" alt="用户头像" />
              </div>
            </div>
          </template>
        </div>

        <!-- 输入框 -->
        <div class="chat-input-area">
          <el-input
            v-model="userInput"
            type="textarea"
            :rows="3"
            placeholder="在此输入您的问题..."
            @keyup.enter.ctrl="sendMessage"
            class="chat-input"
            :disabled="isLoading"
          />
          <div class="input-actions">
            <span class="hint">按 Ctrl+Enter 发送</span>
            <div class="input-actions-right">
              <!-- <div class="emoji-wrapper" @mouseleave="handleImageHoverLeave">
                <button
                  class="icon-btn"
                  type="button"
                  @click="toggleImagePanel"
                  @mouseenter="handleImageIconHover"
                >
                  📷
                </button>
                <transition name="image-upload-fade-slide">
                  <div
                    v-if="imagePanelVisible"
                    class="image-upload-pop"
                    @dragover.prevent
                    @dragenter.prevent
                    @drop.prevent="handleImageDrop"
                  >
                    <div class="image-upload-card" @click="triggerImageSelect">
                      <div class="image-upload-folder">📁</div>
                      <div class="image-upload-dropzone">
                        <div class="image-upload-plus">+</div>
                      </div>
                      <div class="image-upload-desc">
                        <div class="image-upload-text">拖拽图片到此上传，或点击选择本地图片</div>
                        <div class="image-upload-tip">支持 JPG / PNG，大小不超过 5MB</div>
                      </div>
                    </div>
                    <input
                      ref="imageInputRef"
                      type="file"
                      accept="image/*"
                      class="hidden-file-input"
                      @change="handleImageSelect"
                    />
                  </div>
                </transition>
              </div> -->
              <el-button
                type="primary"
                @click="sendMessage"
                :loading="isLoading"
                :disabled="!userInput.trim() || isLoading"
              >
                发送
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 浮动按钮 -->
      <div v-else class="chat-button">
        <button @click="toggleChat" class="floating-btn" title="智能助手小林">
          <svg class="ai-avatar-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            width="32" height="32">
            <path
              d="M891.41 346.29c-46.89-161.32-193.96-272.8-363.47-272.8-166.19 0-312.34 108.65-361.42 265.97-56.86 2.45-102.24 49.18-102.24 106.64v141.34c0 59.03 47.85 106.88 106.88 106.88h35.32c33.43 0 60.53-27.1 60.53-60.53V399.76c0-29.46-21.07-53.96-48.96-59.36 46.65-129.34 170.24-217.45 309.88-217.45 139.96 0 262.38 87.4 309.3 216.28h-19.08c-33.43 0-60.53 27.1-60.53 60.53v234.03c0 29.93 21.78 54.63 50.32 59.5-53.12 85.52-143.18 142.53-243.25 153.88-10.82-27.59-37.53-47.2-68.96-47.2-40.99 0-74.21 33.23-74.21 74.21 0 40.99 33.22 74.21 74.21 74.21 33.07 0 60.76-21.78 70.34-51.66 126.45-12.93 239.52-89.27 298.36-202.97 53.88-5.49 95.91-51 95.91-106.32V446.11c0.01-45.65-28.66-84.51-68.93-99.82z m-673.84 287.5c0 6.11-4.97 11.08-11.08 11.08h-35.32c-31.67 0-57.43-25.76-57.43-57.43V446.11c0-31.67 25.76-57.43 57.43-57.43h35.32c6.11 0 11.08 4.97 11.08 11.08v234.03z m278.17 265.15c-13.65 0-24.76-11.11-24.76-24.76s11.11-24.76 24.76-24.76c13.65 0 24.76 11.11 24.76 24.76s-11.11 24.76-24.76 24.76z m415.16-311.5c0 31.67-25.76 57.43-57.42 57.43h-35.32c-6.11 0-11.08-4.97-11.08-11.08V399.76c0-6.11 4.97-11.08 11.08-11.08h35.32c31.66 0 57.42 25.76 57.42 57.43v141.33z"
              fill="#ffffff" />
            <path
              d="M669.84 570.03l-47.55-13.55c-12.88 45.18-54.73 76.74-101.77 76.74-46.52 0-88.24-31.12-101.44-75.66l-47.42 14.07c19.38 65.37 80.6 111.04 148.87 111.04 69-0.01 130.41-46.32 149.31-112.64z"
              fill="#ffffff" />
          </svg>
        </button>
        <div class="unread-badge" v-if="unreadCount > 0">
          {{ unreadCount }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Close } from '@element-plus/icons-vue'
import { chatWithAIMemoryStream, getWelcomeMessage, type ChatMessage } from '@/api/ai'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { openAuthDialog } from '@/utils/authHelper'
import { processImageUrl } from '@/utils/image'
import { uploadArticleCover } from '@/api/article'

type AiChatMessage = ChatMessage & { messageType?: 'TEXT' | 'IMAGE' }

const isExpanded = ref(false)
// 消息列表
const messages = ref<AiChatMessage[]>([])
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()
const unreadCount = ref(0)
const sessionId = ref<string>('')
const imagePanelVisible = ref(false)
const imagePanelLastScrollTop = ref<number | null>(null)
const imageInputRef = ref<HTMLInputElement | null>(null)

// 获取用户登录状态和信息
const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)

const userAvatar = computed(() => {
  const avatar = userInfo.value?.avatar || ''
  return avatar ? processImageUrl(avatar) : 'http://localhost:9000/animal-adopt/default.jpg'
})

// localStorage 键名
const SESSION_ID_KEY = 'ai_chat_session_id'
const MESSAGES_KEY = 'ai_chat_messages'

// 切换聊天窗口
const toggleChat = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    unreadCount.value = 0
    // 如果是第一次打开，添加欢迎消息
    if (messages.value.length === 0) {
      messages.value.push({
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: Date.now()
      })
    }
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  // 在发送消息前检查登录状态
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage({
      message: '当前未登录，请先登录',
      type: 'warning',
      duration: 3000
    })
    openAuthDialog('login')
    return
  }

  const content = userInput.value.trim()

  // 添加用户消息到界面（角色和内容）
  messages.value.push({
    role: 'user',
    content,
    timestamp: Date.now()
  })

  userInput.value = ''
  isLoading.value = true

  try {
    // 滚动到底部
    await nextTick()
    scrollToBottom()

    // 创建 AI 回复消息（初始为空，接收 AI 回复）
    const aiMessageIndex = messages.value.length
    messages.value.push({
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    })

    console.log('发送消息:', content)
    console.log('当前会话ID:', sessionId.value)
    let fullContent = ''

    // 调用 api，获取 AI 答复，通过 chunk 回调函数 - 每次收到一小段消息就调用
    const newSessionId = await chatWithAIMemoryStream(content, sessionId.value, (chunk: string) => {
      fullContent += chunk
      // 更新AI消息内容
      if (messages.value[aiMessageIndex]) {
        messages.value[aiMessageIndex].content = fullContent
      }
      // 滚动到底部
      scrollToBottom()
    })

    // 更新会话ID（后端可能创建了新会话）
    const isNewSession = !sessionId.value && newSessionId
    if (newSessionId && newSessionId !== sessionId.value) {
      console.log('更新会话ID:', sessionId.value, '->', newSessionId)
      sessionId.value = newSessionId
      
      // 如果是新创建的会话，先保存欢迎消息到后端
      if (isNewSession && messages.value.length > 1) {
        const welcomeMsg = messages.value.find(m => m.role === 'assistant' && m.content.includes('欢迎'))
        if (welcomeMsg) {
          try {
            const token = localStorage.getItem('token')
            const headers: Record<string, string> = {
              'Content-Type': 'application/json'
            }
            if (token) {
              headers['Authorization'] = `Bearer ${token}`
            }

            await fetch('/api/ai/service/save-message', {
              method: 'POST',
              headers,
              credentials: 'include',
              body: JSON.stringify({
                sessionId: newSessionId,
                role: 'assistant',
                content: welcomeMsg.content
              })
            })
            console.log('💾 欢迎消息已保存到后端')
          } catch (e) {
            console.error('❌ 保存欢迎消息失败:', e)
          }
        }
      }
    }

    // 保存会话到 localStorage
    saveSession()
    console.log('💾 会话已保存到 localStorage, sessionId:', sessionId.value)

    console.log('✅ 流式对话完成:', fullContent)
    console.log('📋 会话ID:', sessionId.value)
    console.log('📝 完整内容长度:', fullContent.length)

    // 流完成后，保存AI回复到数据库
    // 注意：用户消息已在后端 chatWithMemoryStream 中保存，这里只需保存AI回复
    if (sessionId.value && fullContent.trim()) {
      try {
        console.log('🔄 开始保存AI回复...')
        const token = localStorage.getItem('token')
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch('/api/ai/service/save-message', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            sessionId: sessionId.value,
            role: 'assistant',
            content: fullContent
          })
        })

        const result = await response.json()
        if (result.code === 200) {
          console.log('💾 AI回复已保存到 Cassandra')
        } else {
          console.warn('⚠️ 保存AI回复失败:', result.message)
        }
      } catch (saveError) {
        console.error('❌ 保存AI回复错误:', saveError)
      }
    } else {
      console.warn('⚠️ 跳过保存: sessionId=', sessionId.value, ', fullContent.length=', fullContent.length)
    }
  } catch (error: any) {
    console.error('❌ AI服务错误:', error)

    // 移除不完整的AI消息
    if (messages.value[messages.value.length - 1]?.role === 'assistant') {
      messages.value.pop()
    }

    // 处理登录过期错误
    if (error.message?.includes('登录信息已过期')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      ElMessage({
        message: '当前登录信息已过期，请重新登录',
        type: 'warning',
        duration: 3000
      })
      openAuthDialog('login')
    }
    // 处理未登录错误
    else if (error.message?.includes('未登录')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      ElMessage({
        message: '当前未登录，请先登录',
        type: 'warning',
        duration: 3000
      })
      openAuthDialog('login')
    }
    // 处理限流错误
    else if (error.message?.includes('429') || error.message?.includes('过于频繁')) {
      ElMessage.warning('请求过于频繁，请稍后再试')
    } else {
      ElMessage.error('服务暂时不可用，请稍后重试')
    }
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleImagePanel = () => {
  const nextVisible = !imagePanelVisible.value
  imagePanelVisible.value = nextVisible
  if (nextVisible) {
    if (messagesContainer.value) {
      imagePanelLastScrollTop.value = messagesContainer.value.scrollTop
    } else {
      imagePanelLastScrollTop.value = null
    }
  } else {
    nextTick(() => {
      if (messagesContainer.value && imagePanelLastScrollTop.value != null) {
        messagesContainer.value.scrollTop = imagePanelLastScrollTop.value
      } else {
        scrollToBottom()
      }
    })
  }
}

const handleImageIconHover = () => {
  if (imagePanelVisible.value) return
  imagePanelVisible.value = true
  if (messagesContainer.value) {
    imagePanelLastScrollTop.value = messagesContainer.value.scrollTop
  } else {
    imagePanelLastScrollTop.value = null
  }
}

const handleImageHoverLeave = () => {
  if (!imagePanelVisible.value) return
  imagePanelVisible.value = false
  nextTick(() => {
    if (messagesContainer.value && imagePanelLastScrollTop.value != null) {
      messagesContainer.value.scrollTop = imagePanelLastScrollTop.value
    } else {
      scrollToBottom()
    }
  })
}

const triggerImageSelect = () => {
  imageInputRef.value?.click()
}

const uploadAndAddImageMessage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB')
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage({
      message: '当前未登录，请先登录',
      type: 'warning',
      duration: 3000
    })
    openAuthDialog('login')
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadArticleCover(formData)
    const imageUrl = res.data
    if (!imageUrl) {
      ElMessage.error('图片上传失败，请稍后重试')
      return
    }

    messages.value.push({
      role: 'user',
      content: imageUrl,
      timestamp: Date.now(),
      messageType: 'IMAGE'
    })
    await nextTick()
    scrollToBottom()
    saveSession()
  } catch (error) {
    console.error('上传图片失败:', error)
    ElMessage.error('图片上传失败，请稍后重试')
  } finally {
    imagePanelVisible.value = false
    nextTick(() => {
      if (messagesContainer.value && imagePanelLastScrollTop.value != null) {
        messagesContainer.value.scrollTop = imagePanelLastScrollTop.value
      } else {
        scrollToBottom()
      }
    })
  }
}

const handleImageSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  await uploadAndAddImageMessage(file)
  target.value = ''
}

const handleImageDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  await uploadAndAddImageMessage(file)
}

// 在消息区域内滚动滚轮时，只滚动对话内容，不影响外层页面
const handleMessagesWheel = (event: WheelEvent) => {
  const el = messagesContainer.value
  if (!el) return

  // 没有可滚动内容时，允许冒泡给外层页面
  if (el.scrollHeight <= el.clientHeight) return

  const delta = event.deltaY
  if (delta === 0) return

  el.scrollTop += delta
  event.preventDefault()
  event.stopPropagation()
}

// 日期分组相关
const formatDateOnly = (timestamp?: number): string => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `${y}-${m}-${day}`
}

const isTodayTimestamp = (timestamp?: number): boolean => {
  if (!timestamp) return false
  const d = new Date(timestamp)
  if (Number.isNaN(d.getTime())) return false
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

const getMessageDateLabel = (msg: ChatMessage): string => {
  if (!msg || !msg.timestamp) return ''
  if (isTodayTimestamp(msg.timestamp)) return '今天'
  return formatDateOnly(msg.timestamp)
}

const shouldShowDateDivider = (index: number): boolean => {
  const list = messages.value
  if (index < 0 || index >= list.length) return false
  const msg = list[index]
  if (!msg || !msg.timestamp) return false
  const currentLabel = getMessageDateLabel(msg)
  if (!currentLabel) return false
  if (index === 0) return true
  const prev = list[index - 1]
  if (!prev || !prev.timestamp) return true
  const prevLabel = getMessageDateLabel(prev)
  return currentLabel !== prevLabel
}

// 格式化消息（支持换行和基本格式）
const formatMessage = (content: string): string => {
  let result = content

  // 先处理现有的换行符
  result = result.replace(/\n/g, '<br/>')

  // 处理特殊符号和格式
  result = result.replace(/【(.*?)】/g, '<strong style="color: #ff8c42;">【$1】</strong>')
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/✓/g, '<span style="color: #42b983;">✓</span>')

  return result
}

// 格式化时间
const formatTime = (timestamp?: number): string => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 保存会话到 localStorage
const saveSession = () => {
  if (sessionId.value) {
    localStorage.setItem(SESSION_ID_KEY, sessionId.value)
  }
  if (messages.value.length > 0) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.value))
  }
}

// 从 localStorage 恢复会话
const restoreSession = async () => {
  const savedSessionId = localStorage.getItem(SESSION_ID_KEY)

  if (savedSessionId) {
    sessionId.value = savedSessionId
    console.log('✅ 恢复会话ID:', sessionId.value)

    // 从后端获取完整的聊天记录
    try {
      const token = localStorage.getItem('token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/ai/service/session/${savedSessionId}/messages`, {
        method: 'GET',
        headers,
        credentials: 'include'
      })

      const result = await response.json()
      console.log('📥 后端返回的原始数据:', result.data)
      if (result.code === 200 && result.data && result.data.length > 0) {
        // 将后端返回的消息转换为前端格式
        messages.value = result.data.map((msg: any) => {
          // 处理时间戳：后端返回的是格式化字符串如 "2025-11-23 17:40:00"
          let timestamp = Date.now()
          if (msg.timestamp) {
            // 如果是字符串格式的时间戳，需要转换
            if (typeof msg.timestamp === 'string') {
              timestamp = new Date(msg.timestamp).getTime()
            } else if (typeof msg.timestamp === 'number') {
              // 如果已经是毫秒级时间戳
              timestamp = msg.timestamp > 10000000000 ? msg.timestamp : msg.timestamp * 1000
            }
          }

          // 处理内容：后端可能返回了双重转义的JSON字符串
          let content = msg.content
          if (typeof content === 'string' && content.startsWith('"') && content.endsWith('"')) {
            try {
              // 尝试解析JSON字符串，恢复原始内容
              content = JSON.parse(content)
            } catch (e) {
              // 如果解析失败，保持原样
              console.warn('⚠️ 内容解析失败，使用原始内容')
            }
          }

          return {
            role: msg.role,
            content,
            timestamp,
            messageType: msg.messageType
          }
        })
        console.log('✅ 从后端恢复聊天记录:', messages.value.length, '条消息')

        // 同时保存到 localStorage
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.value))
      }
    } catch (e) {
      console.error('❌ 从后端恢复聊天记录失败:', e)

      // 降级方案：从 localStorage 恢复
      const savedMessages = localStorage.getItem(MESSAGES_KEY)
      if (savedMessages) {
        try {
          messages.value = JSON.parse(savedMessages)
          console.log('✅ 从本地存储恢复聊天记录:', messages.value.length, '条消息')
        } catch (parseError) {
          console.error('❌ 恢复本地聊天记录失败:', parseError)
        }
      }
    }
  }
}

// 清空会话（登出时调用，真正删除后端数据）
const clearSession = async () => {
  const currentSessionId = sessionId.value

  // 清空前端数据
  sessionId.value = ''
  messages.value = []
  localStorage.removeItem(SESSION_ID_KEY)
  localStorage.removeItem(MESSAGES_KEY)

  // 从后端删除会话及其所有消息
  if (currentSessionId) {
    try {
      const token = localStorage.getItem('token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/ai/service/session/${currentSessionId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })

      const result = await response.json()
      if (result.code === 200) {
        console.log('🗑️ 会话已从后端删除')
      } else {
        console.warn('⚠️ 后端删除会话失败:', result.message)
      }
    } catch (e) {
      console.error('❌ 删除后端会话失败:', e)
    }
  }

  console.log('🗑️ 会话已清空')
}

// 监听登出事件
watch(() => isLoggedIn.value, (newVal) => {
  if (!newVal) {
    // 用户已登出，清空会话
    clearSession()
  }
})

onMounted(async () => {
  // 如果已登录，恢复会话
  if (isLoggedIn.value) {
    await restoreSession()
  }

  // 如果没有消息，添加欢迎消息
  if (messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: Date.now()
    })
    // 保存到 localStorage（后端保存会在第一次发送消息时进行）
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.value))
  }

  // 监听来自首页的打开事件
  window.addEventListener('openAIChat', () => {
    isExpanded.value = true
    nextTick(() => {
      scrollToBottom()
    })
  })

  // 初始化时不自动打开
})
</script>

<style scoped>
/* 浮动按钮 */
.chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

.floating-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
}

.floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.floating-btn:active {
  transform: scale(0.95);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px);
  }
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* 聊天窗口 */
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 500px;
  height: 680px;
  max-height: calc(100vh - 40px);
  max-width: calc(100vw - 40px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  overflow: hidden;
  z-index: 1000;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头部 */
.chat-header {
  padding: 16px;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  width: 20px !important;
  height: 20px !important;
  min-width: 16px !important;
  min-height: 16px !important;
  flex-shrink: 0;
  display: block !important;
  font-size: 16px !important;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  color: white !important;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.message-date-divider {
  display: flex;
  justify-content: center;
  margin: 6px 0 10px;
}

.message-date-label {
  padding: 2px 10px;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.04);
  font-size: 12px;
  color: #909399;
}

/* 消息 */
.message {
  display: flex;
  gap: 8px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #666;
}

.message-avatar.user img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.ai-avatar-icon {
  width: 66%;
  height: 100%;
}

.message-avatar.user {
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  color: white;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 380px;
  word-wrap: break-word;
  word-break: break-word;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-text {
  padding: 10px 12px;
  border-radius: 8px;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.6;
  font-size: 14px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.message.assistant .message-text {
  background: #f0f0f0;
  color: #333;
}

.message.user .message-text {
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  color: white;
}

.message-time {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.message.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

/* 流式输出光标 */
.typing-cursor {
  display: inline-block;
  margin-left: 2px;
  color: #999;
  animation: blink 1s infinite;
  font-weight: bold;
}

@keyframes blink {

  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

/* 输入框区域 */
.chat-input-area {
  padding: 12px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-input {
  resize: none;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint {
  font-size: 12px;
  color: #999;
}

.input-actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.emoji-wrapper {
  position: relative;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background-color: #f5f7fa;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.icon-btn:hover {
  background-color: #e4f3ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.25);
}

.image-upload-pop {
  position: absolute;
  bottom: 42px;
  left: -40px;
  z-index: 20;
}

.image-upload-card {
  width: 320px;
  padding: 14px 18px 12px;
  border-radius: 20px;
  border: 1px solid #f0e2d6;
  background-color: #fffdf9;
  box-shadow: 0 10px 26px rgba(15, 35, 52, 0.08);
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease,
    background-color 0.2s ease;
}

.image-upload-folder {
  font-size: 30px;
  margin-bottom: 10px;
}

.image-upload-dropzone {
  width: 100%;
  max-width: 220px;
  height: 140px;
  margin: 0 auto 10px;
  border-radius: 16px;
  border: 1px dashed #d4d7de;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.image-upload-plus {
  font-size: 32px;
  color: #c0c4cc;
  border-radius: 999px;
  border: 1px dashed #c0c4cc;
  padding: 6px 12px;
  width: 65px;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.image-upload-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
}

.image-upload-card:hover {
  border-color: #ffb980;
  background-color: #fffaf5;
  box-shadow: 0 14px 32px rgba(15, 35, 52, 0.12);
  transform: translateY(-2px);
}

.image-upload-card:hover .image-upload-dropzone {
  border-color: #ffb980;
  background-color: #fffdf5;
}

.image-upload-card:hover .image-upload-plus {
  color: #ff9f5b;
  border-color: #ff9f5b;
  transform: scale(1.08);
}

.image-upload-text {
  font-size: 13px;
  color: #606266;
}

.image-upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.hidden-file-input {
  display: none;
}

.image-upload-fade-slide-enter-active,
.image-upload-fade-slide-leave-active {
  transition: all 0.18s ease;
}

.image-upload-fade-slide-enter-from,
.image-upload-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.chat-image {
  max-width: 160px;
  max-height: 200px;
  border-radius: 8px;
  display: block;
}

/* 响应式 */
@media (max-width: 768px) {
  .chat-container {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }

  .message-content {
    max-width: 70vw;
  }
}

/* 控制台打开时的适配 - 当视口高度较小时 */
@media (max-height: 700px) {
  .chat-container {
    max-height: calc(100vh - 60px);
    height: 500px;
  }
}

/* 超小屏幕适配 */
@media (max-height: 500px) {
  .chat-container {
    max-height: calc(100vh - 40px);
    height: 100%;
    width: 90vw;
    bottom: 10px;
    right: 5vw;
  }
}
</style>
