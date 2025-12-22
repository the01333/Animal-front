<template>
  <div class="chat-manage-view">
    <div class="chat-container">
      <aside class="conversation-pane">
        <div class="conversation-header">
          <div class="conversation-title">客服会话</div>
          <el-input v-model="searchKeyword" placeholder="搜索用户..." :prefix-icon="Search" clearable />
        </div>
        <el-scrollbar class="conversation-list">
          <div v-for="session in sessions" :key="session.id" class="conversation-item"
            :class="{ active: session.id === activeSessionId }" @click="selectSession(session.id)">
            <div class="conversation-avatar-wrapper">
              <el-avatar :size="40" :src="session.avatar" />
            </div>
            <div class="conversation-main">
              <div class="conversation-top">
                <span class="conversation-name">{{ session.name }}</span>
                <span class="conversation-time">{{ session.lastTime }}</span>
              </div>
              <div class="conversation-bottom">
                <span class="conversation-preview">{{ session.lastMessage }}</span>
                <span v-if="session.unread > 0" class="conversation-unread">{{ session.unread }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </aside>

      <section v-if="currentSession" class="chat-main">
        <header class="chat-header">
          <div class="chat-header-left" @click="openUserProfile">
            <el-avatar :size="40" :src="currentSession.avatar" />
            <div class="chat-user-info">
              <div class="chat-user-name">{{ currentSession.name }}</div>
              <div class="chat-user-status">
                <span class="status-dot" :class="{ online: currentSession.online }" />
                <span>{{ currentSession.online ? '在线' : '离线' }}</span>
              </div>
            </div>
          </div>
          <div class="chat-header-actions">
            <el-button text @click="openUserProfile">查看资料</el-button>
            <el-button text type="danger" @click="endSession">结束会话</el-button>
          </div>
        </header>

        <div class="chat-body">
          <main class="message-pane" ref="messageContainer">
            <div class="message-scroll">
              <div v-for="(msg, index) in currentMessages" :key="msg.id">
                <div v-if="shouldShowDateDivider(index)" class="message-date-divider">
                  <span class="message-date-label">{{ getMessageDateLabel(msg) }}</span>
                </div>
                <div class="message-row" :class="msg.sender">
                  <el-avatar
                    v-if="msg.sender === 'user'"
                    :size="34"
                    :src="currentSession.avatar"
                    class="message-avatar"
                  />
                  <div class="message-bubble" :class="msg.sender">
                    <div class="message-content">
                      <template v-if="msg.messageType === 'image'">
                        <img :src="msg.content" class="message-image" alt="图片消息" />
                      </template>
                      <template v-else>
                        <div v-html="msg.content" />
                      </template>
                    </div>
                    <div class="message-time">{{ msg.time }}</div>
                  </div>
                  <el-avatar
                    v-if="msg.sender === 'agent'"
                    :size="34"
                    :src="agentAvatar"
                    class="message-avatar"
                  />
                </div>
              </div>
              <div class="message-bottom-spacer" />
            </div>
          </main>

          <aside class="side-pane" :class="{ collapsed: sideCollapsed }">
            <div class="side-toggle" @click="toggleSide">
              <span>{{ sideCollapsed ? '‹' : '›' }}</span>
            </div>
            <div v-if="!sideCollapsed" class="side-content">
              <div class="side-section side-user-info">
                <div class="side-title">用户信息</div>
                <div class="side-item"><span>昵称：</span>{{ currentSession.name }}</div>
              </div>
              <div class="side-section">
                <div class="side-title">快捷回复</div>
                <div v-for="item in quickReplies" :key="item.id" class="quick-reply-item"
                  @click="appendQuickReply(item.text)">
                  {{ item.text }}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer class="chat-input">
          <div class="chat-input-inner">
            <div class="chat-input-toolbar">
              <div class="emoji-wrapper">
                <button class="icon-btn" type="button" @click="toggleEmojiPanel">
                  😊
                </button>
                <div v-if="emojiPanelVisible" class="emoji-panel">
                  <button
                    v-for="emoji in emojiList"
                    :key="emoji"
                    type="button"
                    class="emoji-item"
                    @click="handleEmojiClick(emoji)"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>
              <div class="emoji-wrapper" @mouseleave="handleImageHoverLeave">
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
              </div>
            </div>
            <el-input
              v-model="draft"
              ref="inputRef"
              class="chat-input-textarea"
              type="textarea"
              :rows="3"
              placeholder="在此输入回复内容..."
              @keydown.ctrl.enter.prevent="sendMessage"
            />
            <div class="chat-input-actions">
              <span class="hint">按 Ctrl+Enter 发送，Enter 换行</span>
              <el-button type="primary" size="default" @click="sendMessage" :disabled="!draft.trim()">
                发送
              </el-button>
            </div>
          </div>
        </footer>
      </section>

      <section v-else class="chat-main-empty">
        <el-empty description="请选择左侧的用户会话开始聊天" />
      </section>

      <transition name="user-profile">
        <div v-if="showUserProfile && currentSession" class="user-profile-overlay" @click="closeUserProfile">
          <div class="user-profile-dialog" @click.stop>
            <div class="user-profile-header">
              <el-avatar :size="64" :src="currentSession.avatar" />
              <div class="user-profile-basic">
                <div class="user-profile-name">{{ currentSession.name }}</div>
                <div class="user-profile-status">
                  <span class="status-dot" :class="{ online: currentSession.online }" />
                  <span>{{ currentSession.online ? '在线' : '离线' }}</span>
                </div>
              </div>
            </div>
            <div class="user-profile-body">
              <div class="user-profile-row">
                <span class="label">用户ID：</span>
                <span class="value">{{ currentSession.userId }}</span>
              </div>
              <div class="user-profile-row">
                <span class="label">最近消息：</span>
                <span class="value">{{ currentSession.lastMessage || '暂无' }}</span>
              </div>
              <div class="user-profile-row">
                <span class="label">最近时间：</span>
                <span class="value">{{ currentSession.lastTimeFull || '暂无' }}</span>
              </div>
            </div>
            <div class="user-profile-footer">
              <el-button size="default" @click="closeUserProfile">关闭</el-button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { IMessage } from '@stomp/stompjs'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import {
  pageManualCsSessions,
  getManualCsMessages,
  longPollManualCsMessages,
  sendManualCsMessage,
  readAckManualCs,
  type CsSession,
  type CsMessage
} from '@/api/customerService'
import { processImageUrl } from '@/utils/image'
import { uploadArticleCover } from '@/api/article'

type Sender = 'user' | 'agent'

interface ChatMessage {
  id: string
  sender: Sender
  content: string
  time: string
  isoTime?: string | null
  messageType?: string
}

interface ChatSession {
  id: number
  userId: number
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  lastTimeFull: string
  unread: number
  online: boolean
  preference: string
  orders: string
}

const appStore = useAppStore()
const userStore = useUserStore()
const { token } = storeToRefs(userStore)
const searchKeyword = ref('')
const sessions = ref<ChatSession[]>([])
const messagesMap = ref<Record<number, ChatMessage[]>>({})

const agentAvatar = computed(() => {
  const avatar = userStore.userInfo?.avatar || ''
  return avatar ? processImageUrl(avatar) : 'http://localhost:9000/animal-adopt/default.jpg'
})

const quickReplies = ref([
  { id: 'q1', text: '您好，这里是 i宠园客服，请问有什么可以帮您？' },
  { id: 'q2', text: '当前这只宠物还在基地，可预约本周到访进行线下了解。' },
  { id: 'q3', text: '领养需要提交基本资料并通过简单的资质审核。' },
  { id: 'q4', text: '好的，我们已为您记录需求，如有合适的宠物会第一时间联系您。' }
])

// 当前选中的会话ID, 默认不选中任何会话
const activeSessionId = ref<number | null>(null)
const draft = ref('')
const sideCollapsed = ref(false)
const messageContainer = ref<HTMLElement | null>(null)
const showUserProfile = ref(false)
const emojiPanelVisible = ref(false)
const emojiList = ref<string[]>([
  '😀',
  '😁',
  '😂',
  '🤣',
  '😊',
  '😍',
  '😘',
  '😜',
  '🤔',
  '😄',
  '😅',
  '😭',
  '😡',
  '👍',
  '👎',
  '👏',
  '🙏',
  '🐶',
  '🐱',
  '🐰',
  '❤️',
  '💔',
  '✨',
  '🌟'
])
const imagePanelVisible = ref(false)
const imagePanelLastScrollTop = ref<number | null>(null)
const imageInputRef = ref<HTMLInputElement | null>(null)
const inputRef = ref<any | null>(null)

const loadingSessions = ref(false)
const loadingMessages = ref(false)
const sending = ref(false)
const wsConnected = ref(false)
let sessionsPollTimer: number | null = null
let messagesPollTimer: number | null = null
let wsSessionsRefreshTimer: number | null = null
let chatEventListener: EventListener | null = null
let presenceEventListener: EventListener | null = null
let agentUnreadEventListener: EventListener | null = null
const hasChatWsMessageEverArrived = ref(false)

const scheduleSessionsRefresh = () => {
  if (typeof window === 'undefined') return
  if (wsSessionsRefreshTimer) return
  wsSessionsRefreshTimer = window.setTimeout(() => {
    wsSessionsRefreshTimer = null
    loadSessions()
  }, 0)
}

const formatTime = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatTimeFull = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const h = pad(d.getHours())
  const min = pad(d.getMinutes())
  return `${y}-${m}-${day} ${h}:${min}`
}

const currentSession = computed(() => {
  if (!activeSessionId.value) return null
  return sessions.value.find((s) => s.id === activeSessionId.value) || null
})

const currentMessages = computed(() => {
  if (!activeSessionId.value) return []
  return messagesMap.value[activeSessionId.value] || []
})

const formatDateOnly = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n))
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `${y}-${m}-${day}`
}

const isTodayIso = (iso?: string | null): boolean => {
  if (!iso) return false
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return false
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

const getMessageDateLabel = (msg: ChatMessage): string => {
  if (!msg || !msg.isoTime) return ''
  if (isTodayIso(msg.isoTime)) return '今天'
  return formatDateOnly(msg.isoTime)
}

const shouldShowDateDivider = (index: number): boolean => {
  const list = currentMessages.value
  if (index < 0 || index >= list.length) return false
  const msg = list[index]
  if (!msg || !msg.isoTime) return false
  const currentLabel = getMessageDateLabel(msg)
  if (!currentLabel) return false
  if (index === 0) return true
  const prev = list[index - 1]
  if (!prev || !prev.isoTime) return true
  const prevLabel = getMessageDateLabel(prev)
  return currentLabel !== prevLabel
}

const loadSessions = async () => {
  loadingSessions.value = true
  try {
    const keyword = searchKeyword.value.trim()
    const res = await pageManualCsSessions({
      current: 1,
      size: 50,
      keyword: keyword || undefined
    })
    const pageData = res.data
    const records: CsSession[] = pageData?.records || []

    const normalizeLastMessage = (raw?: string): string => {
      if (!raw) return ''
      const text = raw.trim()
      if (!text) return ''
      const withoutQuery = text.split('?')[0]
      const isMaybeImage = /\.(png|jpe?g|gif|webp)$/i.test(withoutQuery)
      if (isMaybeImage) {
        return '[图片]'
      }
      return text
    }

    sessions.value = records.map<ChatSession>((item) => ({
      id: item.id,
      userId: item.userId,
      name: item.userUsername || item.userNickname || `用户#${item.userId}`,
      avatar: item.userAvatar ? processImageUrl(item.userAvatar) : 'http://localhost:9000/animal-adopt/default.jpg',
      lastMessage: normalizeLastMessage(item.lastMessage),
      lastTime: item.lastTime ? formatTime(item.lastTime as unknown as string) : '',
      lastTimeFull: item.lastTime ? formatTimeFull(item.lastTime as unknown as string) : '',
      unread: item.unreadForAgent || 0,
      online: !!item.online,
      preference: '',
      orders: ''
    }))

    // 根据最新会话列表同步全局客服未读总数, 驱动左侧导航红点显示
    const totalUnread = sessions.value.reduce((sum, s) => sum + (s.unread || 0), 0)
    appStore.setCsUnreadForAgent(totalUnread)
  } catch (error) {
    console.error('加载客服会话列表失败:', error)
    ElMessage.error('加载客服会话列表失败，请稍后重试')
  } finally {
    loadingSessions.value = false
  }
}

watch(
  () => searchKeyword.value,
  () => {
    // 根据输入关键字走接口按用户账号模糊搜索会话列表
    loadSessions()
  }
)

const loadMessages = async (sessionId: number) => {
  loadingMessages.value = true
  try {
    const res = await getManualCsMessages(sessionId)
    const list: CsMessage[] = res.data || []

    const serverMsgs = list.map<ChatMessage>((item) => ({
      id: String(item.id),
      sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
      content: item.contentType === 'image' ? processImageUrl(item.content) : item.content,
      time: item.createTime ? formatTime(item.createTime as unknown as string) : '',
      isoTime: (item.createTime as unknown as string) || '',
      messageType: item.contentType
    }))

    // 注意：当 WS 正常但页面仍“需要刷新才能看到”时，常见原因是这里的 HTTP 拉取覆盖了 WS
    // 已追加的新消息。这里改为按 id 合并，避免覆盖掉更“新”的本地消息。
    const existing = messagesMap.value[sessionId] || []

    const toNum = (id: string) => {
      const n = Number(id)
      return Number.isFinite(n) ? n : null
    }

    const mergedMap = new Map<string, ChatMessage>()
    for (const m of serverMsgs) {
      mergedMap.set(m.id, m)
    }
    for (const m of existing) {
      if (!mergedMap.has(m.id)) {
        mergedMap.set(m.id, m)
      }
    }
    const merged = Array.from(mergedMap.values()).sort((a, b) => {
      const an = toNum(a.id)
      const bn = toNum(b.id)
      if (an == null || bn == null) return 0
      return an - bn
    })
    messagesMap.value = { ...messagesMap.value, [sessionId]: merged }

    scrollToBottom()
  } catch (error) {
    console.error('加载会话消息失败:', error)
    ElMessage.error('加载会话消息失败，请稍后重试')
  } finally {
    loadingMessages.value = false
  }
}

const ackingSessionIds = new Set<number>()
const pendingAckSessionIds = new Set<number>()

const ackAgentRead = async (sessionId: number) => {
  if (!sessionId || sessionId <= 0) return
  if (ackingSessionIds.has(sessionId)) {
    pendingAckSessionIds.add(sessionId)
    return
  }
  ackingSessionIds.add(sessionId)
  try {
    do {
      pendingAckSessionIds.delete(sessionId)
      // 立即清零本地会话的未读数，确保UI立即响应
      const target = sessions.value.find((s) => s.id === sessionId)
      if (target) {
        target.unread = 0
      }
      // 立即重新计算并更新全局未读总数
      const totalUnread = sessions.value.reduce((sum, s) => sum + (s.unread || 0), 0)
      appStore.setCsUnreadForAgent(totalUnread)
      
      // 发送ack到后端，后端会清零数据库并再次广播未读数（作为兜底同步）
      await readAckManualCs(sessionId, 'AGENT')
    } while (pendingAckSessionIds.has(sessionId))
  } catch (error) {
    console.error('更新客服侧未读状态失败:', error)
  } finally {
    ackingSessionIds.delete(sessionId)
    pendingAckSessionIds.delete(sessionId)
  }
}

const selectSession = async (id: number) => {
  activeSessionId.value = id
  await loadMessages(id)
  startMessagesPolling(id)

  // 点击会话后, 将客服侧未读数清零
  await ackAgentRead(id)
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (!messageContainer.value) return
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  })
}

const toggleEmojiPanel = () => {
  emojiPanelVisible.value = !emojiPanelVisible.value
  if (emojiPanelVisible.value) {
    imagePanelVisible.value = false
  }
}

const handleEmojiClick = (emoji: string) => {
  draft.value += emoji
  nextTick(() => {
    if (inputRef.value && typeof inputRef.value.focus === 'function') {
      inputRef.value.focus()
    }
  })
}

const handleImageIconHover = () => {
  // 仅在面板当前未打开时响应 hover，避免反复切换
  if (imagePanelVisible.value) return
  if (!currentSession.value || !activeSessionId.value) return

  imagePanelVisible.value = true
  if (messageContainer.value) {
    imagePanelLastScrollTop.value = messageContainer.value.scrollTop
  } else {
    imagePanelLastScrollTop.value = null
  }
  emojiPanelVisible.value = false
}

const toggleImagePanel = () => {
  if (!currentSession.value || !activeSessionId.value) {
    ElMessage.warning('请选择一个会话')
    return
  }
  const nextVisible = !imagePanelVisible.value
  imagePanelVisible.value = nextVisible
  if (nextVisible) {
    // 打开图片面板时收起表情面板
    if (messageContainer.value) {
      imagePanelLastScrollTop.value = messageContainer.value.scrollTop
    } else {
      imagePanelLastScrollTop.value = null
    }
    emojiPanelVisible.value = false
  } else {
    // 关闭图片面板后，恢复到打开前的位置；若记录不存在则退回最新消息
    nextTick(() => {
      if (messageContainer.value && imagePanelLastScrollTop.value != null) {
        messageContainer.value.scrollTop = imagePanelLastScrollTop.value
      } else {
        scrollToBottom()
      }
    })
  }
}

const triggerImageSelect = () => {
  imageInputRef.value?.click()
}

const uploadAndSendImage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB')
    return
  }

  if (!currentSession.value || !activeSessionId.value) {
    ElMessage.warning('请选择一个会话')
    return
  }

  const sessionId = activeSessionId.value

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadArticleCover(formData)
    const imageUrl = res.data
    if (!imageUrl) {
      ElMessage.error('图片上传失败，请稍后重试')
      return
    }

    const localId = `${Date.now()}-img`
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const list = messagesMap.value[sessionId] || []
    list.push({
      id: localId,
      sender: 'agent',
      content: processImageUrl(imageUrl),
      time,
      isoTime: new Date().toISOString(),
      messageType: 'image'
    })
    messagesMap.value[sessionId] = list
    scrollToBottom()

    try {
      sending.value = true
      const resMsg = await sendManualCsMessage(sessionId, { content: imageUrl, messageType: 'image' })
      const serverMsg = resMsg.data as CsMessage | undefined
      if (serverMsg && typeof serverMsg.id === 'number') {
        const serverIdStr = String(serverMsg.id)
        const targetList = messagesMap.value[sessionId] || []
        let localIdx = targetList.findIndex((m) => m.id === localId)
        const dupIdx = targetList.findIndex((m) => m.id === serverIdStr)

        if (localIdx !== -1) {
          if (dupIdx !== -1 && dupIdx !== localIdx) {
            targetList.splice(dupIdx, 1)
            if (dupIdx < localIdx) localIdx -= 1
          }
          const target = targetList[localIdx]
          target.id = serverIdStr
          target.time = serverMsg.createTime
            ? formatTime(serverMsg.createTime as unknown as string)
            : target.time
          target.isoTime = (serverMsg.createTime as unknown as string) || target.isoTime
          target.messageType = serverMsg.contentType
          target.content =
            serverMsg.contentType === 'image'
              ? processImageUrl(serverMsg.content)
              : serverMsg.content
        } else if (dupIdx === -1) {
          const contentType = serverMsg.contentType
          targetList.push({
            id: serverIdStr,
            sender: serverMsg.senderRole === 'AGENT' ? 'agent' : 'user',
            content:
              contentType === 'image'
                ? processImageUrl(serverMsg.content)
                : serverMsg.content,
            time: serverMsg.createTime
              ? formatTime(serverMsg.createTime as unknown as string)
              : '',
            isoTime: (serverMsg.createTime as unknown as string) || '',
            messageType: contentType
          })
        }

        messagesMap.value[sessionId] = targetList
        scrollToBottom()
      }
    } finally {
      sending.value = false
    }
  } catch (error) {
    console.error('上传图片并发送失败:', error)
    ElMessage.error('图片发送失败，请稍后重试')
  } finally {
    imagePanelVisible.value = false
    nextTick(() => {
      if (messageContainer.value && imagePanelLastScrollTop.value != null) {
        messageContainer.value.scrollTop = imagePanelLastScrollTop.value
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
  await uploadAndSendImage(file)
  target.value = ''
}

const handleImageDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  await uploadAndSendImage(file)
}

// TODO: 后台消息轮询时间
const startSessionsPolling = () => {
  // 只有在 WS 未连接时才使用轮询作为降级方案
  if (sessionsPollTimer) {
    window.clearInterval(sessionsPollTimer)
    sessionsPollTimer = null
  }
  sessionsPollTimer = window.setInterval(async () => {
    if (wsConnected.value) return
    try {
      await loadSessions()
    } catch (e) {
      console.error('轮询刷新会话列表失败', e)
    }
  }, 3000)
}

const startMessagesPolling = (sessionId: number) => {
  // 只有在 WS 未连接时才使用轮询作为降级方案
  if (messagesPollTimer) {
    window.clearInterval(messagesPollTimer)
    messagesPollTimer = null
  }
  startMessagesLongPolling(sessionId)
}

const startMessagesLongPolling = async (sessionId: number) => {
  // 基于 longPollManualCsMessages 的长轮询，有新消息就立即返回并复用 WS 处理逻辑
  while (activeSessionId.value === sessionId) {
    try {
      const existing = messagesMap.value[sessionId] || []
      let lastNumericId: number | null = null
      for (let i = existing.length - 1; i >= 0; i--) {
        const n = Number(existing[i].id)
        if (Number.isFinite(n)) {
          lastNumericId = n
          break
        }
      }

      const res = await longPollManualCsMessages(
        sessionId,
        lastNumericId == null ? undefined : lastNumericId
      )
      if (activeSessionId.value !== sessionId) break

      const list: CsMessage[] = res.data || []
      if (list.length > 0) {
        for (const item of list) {
          // 统一走 WS 的处理分支，保证去重、会话排序、未读/已读逻辑一致
          handleChatWsPayload(item)
        }
      }
    } catch (e) {
      console.error('长轮询刷新会话消息失败', e)
      // 出错时稍作等待，避免空转
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

const stopAllPolling = () => {
  if (sessionsPollTimer) {
    window.clearInterval(sessionsPollTimer)
    sessionsPollTimer = null
  }
  if (messagesPollTimer) {
    window.clearInterval(messagesPollTimer)
    messagesPollTimer = null
  }
}

const handleChatWsPayload = (payload: any) => {
  try {
    const msg = payload as CsMessage
    const sid = Number((msg as any).sessionId)
    if (!Number.isFinite(sid) || sid <= 0) {
      console.warn('[ChatManageView WS] 收到非法 sessionId，已忽略', (msg as any).sessionId)
      return
    }
    const msgId = String((msg as any).id)
    const existingList = messagesMap.value[sid] || []
    if (existingList.some((m) => m.id === msgId)) {
      console.log('[ChatManageView WS] 重复消息，已忽略', { sessionId: sid, msgId })
      return
    }

    console.log('[ChatManageView WS] 处理 WS 聊天消息', {
      sessionId: sid,
      msgId,
      senderRole: (msg as any).senderRole,
      content: (msg as any).content
    })

    const contentType = (msg as any).contentType as string
    const rawContent = (msg as any).content as string

    const newMsg: ChatMessage = {
      id: msgId,
      sender: (msg as any).senderRole === 'AGENT' ? 'agent' : 'user',
      content: contentType === 'image' ? processImageUrl(rawContent) : rawContent,
      time: (msg as any).createTime ? formatTime((msg as any).createTime as unknown as string) : '',
      isoTime: (msg as any).createTime as unknown as string,
      messageType: contentType
    }
    const newList = [...existingList, newMsg]
    messagesMap.value = { ...messagesMap.value, [sid]: newList }

    const s = sessions.value.find((it) => it.id === sid)
    if (s) {
      s.lastMessage = contentType === 'image' ? '[图片]' : rawContent
      s.lastTime = (msg as any).createTime
        ? formatTime((msg as any).createTime as unknown as string)
        : s.lastTime
      s.lastTimeFull = (msg as any).createTime
        ? formatTimeFull((msg as any).createTime as unknown as string)
        : s.lastTimeFull

      if ((msg as any).senderRole === 'USER') {
        if (activeSessionId.value === sid) {
          console.log('[ChatManageView WS] 当前会话收到用户消息，立即发送 ack', { sessionId: sid })
          ackAgentRead(sid)
        } else {
          s.unread = (s.unread || 0) + 1
          const totalUnread = sessions.value.reduce((sum, sess) => sum + (sess.unread || 0), 0)
          appStore.setCsUnreadForAgent(totalUnread)
          console.log('[ChatManageView WS] 非当前会话收到用户消息，未读+1', { sessionId: sid, unread: s.unread, totalUnread })
        }
      }

      const idx = sessions.value.findIndex(sess => sess.id === sid)
      if (idx > 0) {
        const [movedSession] = sessions.value.splice(idx, 1)
        sessions.value.unshift(movedSession)
      }
    } else {
      console.log('[ChatManageView WS] 收到未知会话的消息，调度刷新会话列表', { sessionId: sid })
      scheduleSessionsRefresh()
    }

    if (activeSessionId.value === sid) {
      nextTick(() => {
        scrollToBottom()
      })
    }
  } catch (e) {
    console.error('[ChatManageView WS] 处理 WS 聊天消息异常', e)
  }
}

const sendMessage = async () => {
  const content = draft.value.trim()
  if (!content) return
  if (!currentSession.value || !activeSessionId.value) {
    ElMessage.warning('请选择一个会话')
    return
  }

  if (sending.value) return

  const sessionId = activeSessionId.value
  const localId = `${Date.now()}`
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // 本地先回显一条消息，提升发送体验
  const list = messagesMap.value[sessionId] || []
  list.push({
    id: localId,
    sender: 'agent',
    content,
    time,
    isoTime: new Date().toISOString(),
    messageType: 'text'
  })
  messagesMap.value[sessionId] = list
  draft.value = ''
  scrollToBottom()

  try {
    sending.value = true
    // 统一通过 HTTP 接口发送消息，由后端负责写入数据库并通过 WebSocket 推送给双方
    const res = await sendManualCsMessage(sessionId, { content, messageType: 'text' })
    const serverMsg = res.data as CsMessage | undefined
    if (serverMsg && typeof serverMsg.id === 'number') {
      const serverIdStr = String(serverMsg.id)
      const targetList = messagesMap.value[sessionId] || []
      let localIdx = targetList.findIndex((m) => m.id === localId)
      const dupIdx = targetList.findIndex((m) => m.id === serverIdStr)

      if (localIdx !== -1) {
        // 如果列表中已经存在同一个 serverId 的消息，去重后复用本地那条
        if (dupIdx !== -1 && dupIdx !== localIdx) {
          targetList.splice(dupIdx, 1)
          if (dupIdx < localIdx) localIdx -= 1
        }
        const target = targetList[localIdx]
        target.id = serverIdStr
        target.time = serverMsg.createTime
          ? formatTime(serverMsg.createTime as unknown as string)
          : target.time
        target.isoTime = (serverMsg.createTime as unknown as string) || target.isoTime
      } else if (dupIdx === -1) {
        // 未找到本地回显的那条，则直接追加一条以服务端为准的消息
        const contentType = serverMsg.contentType
        targetList.push({
          id: serverIdStr,
          sender: serverMsg.senderRole === 'AGENT' ? 'agent' : 'user',
          content: contentType === 'image' ? processImageUrl(serverMsg.content) : serverMsg.content,
          time: serverMsg.createTime
            ? formatTime(serverMsg.createTime as unknown as string)
            : '',
          isoTime: (serverMsg.createTime as unknown as string) || '',
          messageType: contentType
        })
      }

      messagesMap.value[sessionId] = targetList
      scrollToBottom()
    }
  } catch (error) {
    console.error('发送客服消息失败:', error)
    ElMessage.error('发送失败，请稍后重试')
  } finally {
    sending.value = false
  }
}

const appendQuickReply = (text: string) => {
  if (!text) return
  if (!draft.value) {
    draft.value = text
  } else {
    draft.value = `${draft.value}\n${text}`
  }
}

const toggleSide = () => {
  sideCollapsed.value = !sideCollapsed.value
}

const openUserProfile = () => {
  if (!currentSession.value) return
  showUserProfile.value = true
}

const closeUserProfile = () => {
  showUserProfile.value = false
}

const endSession = async () => {
  const sid = activeSessionId.value
  activeSessionId.value = null
  draft.value = ''
  if (messagesPollTimer) {
    window.clearInterval(messagesPollTimer)
    messagesPollTimer = null
  }
  if (sid) {
    try {
      await ackAgentRead(sid)
    } catch (e) {
    }
  }
  loadSessions()
}

onMounted(async () => {
  if (typeof window !== 'undefined') {
    ;(window as any).__csAdminChatViewActive = true
  }

  await loadSessions()
  startSessionsPolling()

  if (typeof window !== 'undefined') {
    chatEventListener = ((event: Event) => {
      const detail = (event as CustomEvent).detail
      hasChatWsMessageEverArrived.value = true
      console.log('[ChatManageView WS] 收到 cs-ws-chat 事件', {
        sessionId: (detail as any)?.sessionId,
        id: (detail as any)?.id
      })
      handleChatWsPayload(detail)
    }) as EventListener
    window.addEventListener('cs-ws-chat', chatEventListener)

    presenceEventListener = ((event: Event) => {
      try {
        const payload = (event as CustomEvent).detail as { userId?: number; online?: boolean }
        console.log('[ChatManageView WS] 收到 cs-ws-presence 事件', payload)
        if (!payload || typeof payload.userId !== 'number') return
        const target = sessions.value.find((s) => s.userId === payload.userId)
        if (target) {
          target.online = !!payload.online
        }
      } catch (e) {
        console.error('[ChatManageView WS] 处理在线状态事件异常', e)
      }
    }) as EventListener
    window.addEventListener('cs-ws-presence', presenceEventListener)

    agentUnreadEventListener = ((event: Event) => {
      try {
        const detail = (event as CustomEvent).detail as { oldVal?: number; newVal?: number }
        console.log('[ChatManageView WS] 收到 cs-ws-unread-agent 事件', detail)
        if (!detail || typeof detail.newVal !== 'number' || typeof detail.oldVal !== 'number') return
        if (detail.newVal <= detail.oldVal) return

        // 客服未读数变大，说明可能有新消息到达
        // 如果当前已经在正常接收聊天 WS 消息（hasChatWsMessageEverArrived 为 true），
        // 会话列表和未读红点已经通过 handleChatWsPayload 实时更新，这里就不再触发额外的 HTTP 刷新，
        // 避免因为接口延迟导致“红点和最新消息不同步”的观感。
        if (!hasChatWsMessageEverArrived.value) {
          // 仅在还未收到过聊天 WS 时，将未读推送当作兜底信号，主动刷新一次会话列表和当前会话消息。
          loadSessions()
          if (activeSessionId.value) {
            loadMessages(activeSessionId.value)
          }
        }
      } catch (e) {
        console.error('[ChatManageView WS] 处理客服未读事件异常', e)
      }
    }) as EventListener
    window.addEventListener('cs-ws-unread-agent', agentUnreadEventListener)
  }
})

onUnmounted(() => {
  stopAllPolling()

  activeSessionId.value = null

  if (typeof window !== 'undefined') {
    ;(window as any).__csAdminChatViewActive = false
    if (chatEventListener) {
      window.removeEventListener('cs-ws-chat', chatEventListener)
      chatEventListener = null
    }
    if (presenceEventListener) {
      window.removeEventListener('cs-ws-presence', presenceEventListener)
      presenceEventListener = null
    }
    if (agentUnreadEventListener) {
      window.removeEventListener('cs-ws-unread-agent', agentUnreadEventListener)
      agentUnreadEventListener = null
    }
  }
  if (wsSessionsRefreshTimer) {
    clearTimeout(wsSessionsRefreshTimer)
    wsSessionsRefreshTimer = null
  }
})
</script>

<style scoped>
.chat-manage-view {
  height: 100%;
  display: flex;
}

.chat-container {
  flex: 1;
  display: flex;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.conversation-pane {
  width: 320px;
  border-right: 1px solid #ebeef5;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.conversation-header {
  padding: 12px 12px 8px;
}

.conversation-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.conversation-list {
  flex: 1;
}

.conversation-item {
  display: flex;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f2f2f2;
}

.conversation-item.active {
  background-color: #e0e9f0;
}

.conversation-avatar-wrapper {
  margin-right: 10px;
}

.conversation-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.conversation-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.conversation-name {
  font-weight: 500;
}

.conversation-time {
  font-size: 12px;
  color: #999;
}

.conversation-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversation-preview {
  font-size: 13px;
  color: #999;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-unread {
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
  background-color: #f56c6c;
  color: #fff;
  font-size: 12px;
  text-align: center;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-header {
  height: 60px;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-header-left:hover {
  /* 移动鼠标由箭头变指针 */
  cursor: pointer;
}

.chat-user-info {
  display: flex;
  flex-direction: column;
}

.chat-user-name {
  font-weight: 600;
}

.chat-user-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #dcdfe6;
}

.status-dot.online {
  background-color: #67c23a;
}

.chat-header-actions {
  display: flex;
  gap: 8px;
}

.chat-body {
  flex: 1;
  display: flex;
  background-color: #f5f7fa;
  min-height: 0;
}

.message-pane {
  flex: 1;
  /* background-color: #e5ddd5; */
  /* background-color: #daead6; */
  background-color: #d7e8d5;
  padding: 12px 16px;
  overflow-y: auto;
}

.message-scroll {
  height: 100%;
  padding-bottom: 8px;
}

.message-bottom-spacer {
  height: 1px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.message-avatar {
  flex-shrink: 0;
}

.message-row.user {
  justify-content: flex-start;
}

.message-row.agent {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 60%;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.message-bubble.user {
  background-color: #ffffff;
  border-radius: 4px 12px 12px 4px;
}

.message-bubble.agent {
  background-color: #95ec69;
  border-radius: 12px 4px 4px 12px;
}

.message-content {
  word-break: break-word;
}

.message-image {
  max-width: 220px;
  max-height: 220px;
  border-radius: 8px;
  display: block;
}

.message-time {
  margin-top: 2px;
  font-size: 11px;
  color: #909399;
  text-align: right;
}

.message-date-divider {
  display: flex;
  justify-content: center;
  margin: 8px 0;
  font-size: 12px;
  color: #333334;
  height: 25px;
  text-align: center;
}

.message-date-label {
  padding: 2px 10px;
  /* background-color: #ece8e8; */
  background-color: rgba(199, 196, 196, 0.04);
  border-radius: 999px;
}

.side-pane {
  width: 260px;
  border-left: 1px solid #ebeef5;
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
}

.side-pane.collapsed {
  width: 18px;
}

.side-toggle {
  position: absolute;
  top: 8px;
  left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.side-content {
  flex: 1;
  padding: 12px 14px;
  overflow-y: auto;
}

.side-section+.side-section {
  margin-top: 16px;
}

.side-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.side-item {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.side-item span {
  color: #909399;
}

.quick-reply-item {
  padding: 6px 8px;
  border-radius: 4px;
  background-color: #f5f7fa;
  margin-bottom: 6px;
  cursor: pointer;
  font-size: 13px;
}

.quick-reply-item:hover {
  background-color: #e4f3ff;
}

.chat-input {
  padding: 8px 12px 10px;
  border-top: 1px solid #ebeef5;
  background-color: #fff;
}

.chat-input-inner {
  max-width: 820px;
  margin: 0 0 0 240px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chat-input-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.emoji-wrapper {
  position: relative;
}

.emoji-panel {
  position: absolute;
  left: 0;
  bottom: 30px;
  padding: 6px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #f0e2d6;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: repeat(8, 1.9em);
  gap: 4px;
  max-width: 260px;
  max-height: 180px;
  overflow-y: auto;
  z-index: 10;
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

.emoji-item {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1.2;
  padding: 2px;
}

.image-upload-pop {
  position: absolute;
  bottom: 46px;
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

.chat-input-actions {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-input-actions .hint {
  font-size: 13px;
  color: #909399;
}

.chat-input-textarea :deep(textarea) {
  border-radius: 16px;
  border: 1px solid #dcdfe6;
  padding: 8px 10px;
  font-size: 14px;
}

.chat-input-textarea :deep(textarea:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.16);
}

.chat-main-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.side-user-info:hover {
  background-color: #f5f7fa;
}

.user-profile-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.user-profile-dialog {
  width: 420px;
  max-width: 90vw;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
  padding: 20px 24px 16px;
}

.user-profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.user-profile-basic {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-profile-name {
  font-size: 18px;
  font-weight: 600;
}

.user-profile-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
}

.user-profile-body {
  font-size: 14px;
  color: #606266;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.user-profile-row {
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
}

.user-profile-row .label {
  color: #909399;
  margin-right: 6px;
}

.user-profile-footer {
  text-align: right;
}

.user-profile-enter-active,
.user-profile-leave-active {
  transition: all 0.25s ease;
}

.user-profile-enter-from,
.user-profile-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
</style>
