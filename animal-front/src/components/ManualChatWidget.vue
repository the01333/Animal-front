<template>
  <Teleport to="body">
    <div class="manual-chat-root">
      <transition name="manual-chat-fade-slide">
        <div v-if="isExpanded" class="manual-chat-window">
          <header class="manual-chat-header">
            <div class="header-left">
              <svg
                class="agent-avatar"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M237.714286 292.571429c0 97.536 12.178286 146.285714 36.571428 146.285714h73.142857V292.571429H237.714286zM790.747429 292.571429c0 97.536-12.178286 146.285714-36.571429 146.285714h-73.142857V292.571429h109.714286z"
                  fill="#000000"
                ></path>
                <path
                  d="M310.857143 347.428571a237.714286 201.142857 90 1 0 402.285714 0 237.714286 201.142857 90 1 0-402.285714 0Z"
                  fill="#FFE4B9"
                ></path>
                <path
                  d="M201.142857 694.857143c99.218286-36.571429 109.714286-36.571429 178.285714-73.142857 0 133.997714 13.714286 267.958857 41.142858 401.956571H201.142857V694.857143zM822.857143 694.857143c-99.218286-36.571429-109.714286-36.571429-178.285714-73.142857 0 133.997714-13.714286 267.958857-41.142858 401.956571h219.428572V694.857143z"
                  fill="#591A91"
                ></path>
                <path
                  d="M274.285714 338.468571c24.393143-170.678857 85.321143-256 182.857143-256 146.285714-36.571429 236.214857 36.571429 264.411429 182.857143 18.761143 97.536 3.766857 170.678857-44.982857 219.428572C652.178286 429.787429 638.793143 365.714286 636.416 292.571429 590.043429 341.321143 469.321143 356.644571 274.285714 338.468571z"
                  fill="#7C7C7C"
                ></path>
                <path
                  d="M347.428571 487.606857c-24.393143-48.749714-36.571429-97.499429-36.571428-146.285714 24.393143-48.749714 48.749714-60.928 73.142857-36.571429l-36.571429 182.857143z"
                  fill="#7C7C7C"
                ></path>
                <path
                  d="M292.571429 293.266286l-36.571429-1.389715C262.875429 111.798857 349.659429 18.285714 511.853714 18.285714c162.194286 0 249.051429 93.513143 256.146286 273.554286l-36.571429 1.462857c-6.326857-161.28-78.006857-238.445714-219.574857-238.445714-141.568 0-213.138286 77.165714-219.282285 238.409143z"
                  fill="#252525"
                ></path>
                <path
                  d="M703.268571 437.577143l36.498286 2.56c-4.388571 62.72-34.230857 102.582857-87.844571 115.126857-33.28 7.753143-73.764571 11.593143-121.636572 11.593143v-36.571429c45.275429 0 83.090286-3.584 113.298286-10.642285 37.010286-8.630857 56.356571-34.486857 59.721143-82.066286z"
                  fill="#606060"
                ></path>
                <path
                  d="M530.285714 548.571429m-36.571428 0a36.571429 36.571429 0 1 0 73.142857 0 36.571429 36.571429 0 1 0-73.142857 0Z"
                  fill="#4A4A4A"
                ></path>
                <path
                  d="M420.571429 658.285714h107.885714l107.958857-36.571428L493.714286 768z"
                  fill="#9013FE"
                ></path>
              </svg>
              <div class="agent-info">
                <div class="agent-name">人工客服</div>
                <div class="agent-status">请稍候，消息将会很快回复</div>
              </div>
            </div>
            <div class="header-actions">
              <button class="icon-btn" @click="minimize">×</button>
            </div>
          </header>

          <main class="manual-chat-body" ref="messageContainer" @wheel="handleMessageWheel">
            <div
              v-if="imagePanelVisible"
              class="image-upload-overlay"
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

            <div v-else>
              <div v-for="(msg, index) in messages" :key="msg.id">
                <div v-if="shouldShowDateDivider(index)" class="message-date-divider">
                  <span class="message-date-label">{{ getMessageDateLabel(msg) }}</span>
                </div>
                <div class="message-row" :class="msg.sender">
                  <template v-if="msg.sender === 'agent'">
                    <div class="message-avatar">
                      <svg
                        class="agent-message-avatar-icon"
                        viewBox="0 0 1024 1024"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M237.714286 292.571429c0 97.536 12.178286 146.285714 36.571428 146.285714h73.142857V292.571429H237.714286zM790.747429 292.571429c0 97.536-12.178286 146.285714-36.571429 146.285714h-73.142857V292.571429h109.714286z"
                          fill="#000000"
                        ></path>
                        <path
                          d="M310.857143 347.428571a237.714286 201.142857 90 1 0 402.285714 0 237.714286 201.142857 90 1 0-402.285714 0Z"
                          fill="#FFE4B9"
                        ></path>
                        <path
                          d="M201.142857 694.857143c99.218286-36.571429 109.714286-36.571429 178.285714-73.142857 0 133.997714 13.714286 267.958857 41.142858 401.956571H201.142857V694.857143zM822.857143 694.857143c-99.218286-36.571429-109.714286-36.571429-178.285714-73.142857 0 133.997714-13.714286 267.958857-41.142858 401.956571h219.428572V694.857143z"
                          fill="#591A91"
                        ></path>
                        <path
                          d="M274.285714 338.468571c24.393143-170.678857 85.321143-256 182.857143-256 146.285714-36.571429 236.214857 36.571429 264.411429 182.857143 18.761143 97.536 3.766857 170.678857-44.982857 219.428572C652.178286 429.787429 638.793143 365.714286 636.416 292.571429 590.043429 341.321143 469.321143 356.644571 274.285714 338.468571z"
                          fill="#7C7C7C"
                        ></path>
                        <path
                          d="M347.428571 487.606857c-24.393143-48.749714-36.571429-97.499429-36.571428-146.285714 24.393143-48.749714 48.749714-60.928 73.142857-36.571429l-36.571429 182.857143z"
                          fill="#7C7C7C"
                        ></path>
                        <path
                          d="M292.571429 293.266286l-36.571429-1.389715C262.875429 111.798857 349.659429 18.285714 511.853714 18.285714c162.194286 0 249.051429 93.513143 256.146286 273.554286l-36.571429 1.462857c-6.326857-161.28-78.006857-238.445714-219.574857-238.445714-141.568 0-213.138286 77.165714-219.282285 238.409143z"
                          fill="#252525"
                        ></path>
                        <path
                          d="M703.268571 437.577143l36.498286 2.56c-4.388571 62.72-34.230857 102.582857-87.844571 115.126857-33.28 7.753143-73.764571 11.593143-121.636572 11.593143v-36.571429c45.275429 0 83.090286-3.584 113.298286-10.642285 37.010286-8.630857 56.356571-34.486857 59.721143-82.066286z"
                          fill="#606060"
                        ></path>
                        <path
                          d="M530.285714 548.571429m-36.571428 0a36.571429 36.571429 0 1 0 73.142857 0 36.571429 36.571429 0 1 0-73.142857 0Z"
                          fill="#4A4A4A"
                        ></path>
                        <path
                          d="M420.571429 658.285714h107.885714l107.958857-36.571428L493.714286 768z"
                          fill="#9013FE"
                        ></path>
                      </svg>
                    </div>
                    <div class="bubble agent-bubble">
                      <div class="bubble-content">
                        <template v-if="msg.messageType === 'image'">
                          <img :src="msg.content" class="chat-image" alt="图片消息" />
                        </template>
                        <template v-else>
                          <div v-html="msg.content"></div>
                        </template>
                      </div>
                      <div class="bubble-time">{{ msg.time }}</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="bubble user-bubble">
                      <div class="bubble-content">
                        <template v-if="msg.messageType === 'image'">
                          <img :src="msg.content" class="chat-image" alt="图片消息" />
                        </template>
                        <template v-else>
                          <div v-html="msg.content"></div>
                        </template>
                      </div>
                      <div class="bubble-time">{{ msg.time }}</div>
                    </div>
                    <div class="message-avatar user-avatar">
                      <img :src="userAvatar" alt="用户头像" />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </main>

          <footer class="manual-chat-footer">
            <div class="toolbar">
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
              <div class="emoji-wrapper">
                <button class="icon-btn" type="button" @click="toggleImagePanel">
                  📷
                </button>
              </div>
            </div>
            <div class="input-row">
              <textarea
                v-model="draft"
                ref="inputRef"
                class="chat-input"
                placeholder="请输入您的问题..."
                rows="2"
                @keydown.enter.exact.prevent="handleSend"
                @keydown.enter.ctrl.stop
              />
              <button class="send-btn" type="button" :disabled="!draft.trim()" @click="handleSend">
                发送
              </button>
            </div>
          </footer>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import {
  openManualCsSession,
  getManualCsMessages,
  longPollManualCsMessages,
  sendManualCsMessage,
  readAckManualCs,
  type CsMessage
} from '@/api/customerService'
import { uploadArticleCover } from '@/api/article'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { processImageUrl } from '@/utils/image'

interface ManualMessage {
  id: string
  serverId?: number
  sender: 'user' | 'agent'
  content: string
  time: string
  isoTime?: string | null
  messageType?: string
}

const props = defineProps<{ visible?: boolean }>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const isExpanded = ref(false)
const messages = ref<ManualMessage[]>([])
const draft = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const emojiPanelVisible = ref(false)
const emojiList = ref<string[]>([
  '😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😜',
  '🤔', '😄', '😅', '😭', '😡', '👍', '👎', '👏',
  '🙏', '🐶', '🐱', '🐰', '❤️', '💔', '✨', '🌟'
])
const inputRef = ref<HTMLTextAreaElement | null>(null)
const imagePanelVisible = ref(false)
const imageInputRef = ref<HTMLInputElement | null>(null)

// 后端会话ID (t_cs_session.id)
const sessionId = ref<number | null>(null)
const loadingSession = ref(false)
const sending = ref(false)
const stompClient = ref<Client | null>(null)
const wsConnected = ref(false)
const lastMessageId = ref<number | null>(null)
let pollStopped = false
let pollRunning = false
let unreadPollTimer: number | null = null
const refreshingUnread = ref(false)
const sendingReadAck = ref(false)

const appStore = useAppStore()
const userStore = useUserStore()
const { token } = storeToRefs(userStore)

const userAvatar = computed(() => {
  const avatar = userStore.userInfo?.avatar || ''
  return avatar ? processImageUrl(avatar) : 'http://localhost:9000/animal-adopt/default.jpg'
})

const ensureWelcome = () => {
  if (messages.value.length === 0) {
    messages.value.push({
      id: Date.now().toString(),
      sender: 'agent',
      content:
        '您好，我是人工客服小宠。如果您在领养流程、宠物健康或平台使用上有任何问题，都可以直接在这里告诉我哦~',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isoTime: new Date().toISOString()
    })
  }
}

const startPolling = async () => {
  // 队列式长轮询: 始终通过 HTTP 长轮询获取新消息
  if (pollRunning) return
  pollStopped = false
  pollRunning = true
  while (!pollStopped && sessionId.value && isExpanded.value) {
    try {
      const res = await longPollManualCsMessages(
        sessionId.value,
        lastMessageId.value == null ? undefined : lastMessageId.value
      )
      if (pollStopped || !isExpanded.value) {
        break
      }
      const list: CsMessage[] = res.data || []
      if (list.length > 0) {
        for (const item of list) {
          const serverId = item.id
          const idStr = String(serverId)
          // 避免重复追加已经存在的消息
          if (messages.value.some((m) => m.serverId === serverId || m.id === idStr)) continue

          // 用户端发送的消息可能已在本地回显，长轮询再拉到时应合并而不是追加
          if (item.senderRole === 'USER') {
            for (let i = messages.value.length - 1; i >= 0; i--) {
              const m = messages.value[i]
              if (m.sender !== 'user') continue
              if (typeof m.serverId === 'number') continue
              if (!m.id.endsWith('-u')) continue
              if (m.content !== item.content) continue
              m.serverId = serverId
              m.time = formatTime(item.createTime)
              break
            }
            // 如果成功合并，本轮无需 push
            if (messages.value.some((m) => m.serverId === serverId)) continue
          }

          messages.value.push({
            id: idStr,
            serverId,
            sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
            content: item.content,
            time: formatTime(item.createTime),
            messageType: item.contentType
          })
        }
        lastMessageId.value = list[list.length - 1].id
        scrollToBottom()

        if (list.some((it) => it.senderRole === 'AGENT')) {
          ackUserRead()
        }
      }
    } catch (e) {
      console.error('长轮询刷新客服消息失败', e)
      // 出错时稍作等待，避免空转
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
  pollRunning = false
}

const stopPolling = () => {
  pollStopped = true
}

const ackUserRead = async () => {
  if (sendingReadAck.value) return
  const tokenValue = token.value || localStorage.getItem('token')
  if (!tokenValue) return
  if (!sessionId.value) return
  sendingReadAck.value = true
  try {
    await readAckManualCs(sessionId.value, 'USER')
    appStore.setCsUnreadForUser(0)
  } catch (err) {
    console.error('发送用户侧已读回执失败:', err)
  } finally {
    sendingReadAck.value = false
  }
}

const refreshUnreadFromHttp = async () => {
  if (refreshingUnread.value) return
  const tokenValue = token.value || localStorage.getItem('token')
  if (!tokenValue) return
  refreshingUnread.value = true
  try {
    const res = await openManualCsSession()
    const session = res.data
    if (session && typeof session.id === 'number') {
      sessionId.value = session.id
    }
    if (session && typeof session.unreadForUser === 'number') {
      if (isExpanded.value && sessionId.value && session.unreadForUser > 0) {
        appStore.setCsUnreadForUser(0)
        await ackUserRead()
      } else {
        appStore.setCsUnreadForUser(session.unreadForUser)
      }
    }
  } catch (e) {
    console.error('加载客服未读数失败', e)
  } finally {
    refreshingUnread.value = false
  }
}

const formatTime = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

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

const getMessageDateLabel = (msg: ManualMessage): string => {
  if (!msg || !msg.isoTime) return ''
  if (isTodayIso(msg.isoTime)) return '今天'
  return formatDateOnly(msg.isoTime)
}

const shouldShowDateDivider = (index: number): boolean => {
  const list = messages.value
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

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// 在人工客服对话区域内滚动滚轮时，只滚动对话内容，不影响外层页面
const handleMessageWheel = (event: WheelEvent) => {
  const el = messageContainer.value
  if (!el) return

  // 没有可滚动内容时，允许冒泡给外层页面
  if (el.scrollHeight <= el.clientHeight) return

  const delta = event.deltaY
  if (delta === 0) return

  el.scrollTop += delta
  event.preventDefault()
  event.stopPropagation()
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
    if (inputRef.value) {
      const el = inputRef.value
      el.focus()
      const len = el.value.length
      try {
        el.setSelectionRange(len, len)
      } catch {
        // ignore selection errors in some browsers
      }
    }
  })
}

const toggleImagePanel = () => {
  imagePanelVisible.value = !imagePanelVisible.value
  if (imagePanelVisible.value) {
    emojiPanelVisible.value = false
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

  if (!sessionId.value) {
    await ensureSession()
  }
  if (!sessionId.value) return

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadArticleCover(formData)
    const imageUrl = res.data
    if (!imageUrl) {
      ElMessage.error('图片上传失败，请稍后重试')
      return
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const localId = `${Date.now()}-img`

    messages.value.push({
      id: localId,
      sender: 'user',
      content: imageUrl,
      time: now,
      isoTime: new Date().toISOString(),
      messageType: 'image'
    })
    scrollToBottom()

    sending.value = true
    try {
      const resMsg = await sendManualCsMessage(sessionId.value, { content: imageUrl, messageType: 'image' })
      const serverMsg = resMsg.data
      if (serverMsg && typeof serverMsg.id === 'number') {
        lastMessageId.value = serverMsg.id
        const serverId = serverMsg.id
        const serverIdStr = String(serverId)
        let localIdx = messages.value.findIndex((m) => m.id === localId)
        const dupIdx = messages.value.findIndex((m) => m.serverId === serverId || m.id === serverIdStr)

        if (localIdx !== -1) {
          if (dupIdx !== -1 && dupIdx !== localIdx) {
            messages.value.splice(dupIdx, 1)
            if (dupIdx < localIdx) localIdx -= 1
          }
          messages.value[localIdx].serverId = serverId
          messages.value[localIdx].time = formatTime(serverMsg.createTime)
          messages.value[localIdx].isoTime = (serverMsg.createTime as unknown as string) || messages.value[localIdx].isoTime
          messages.value[localIdx].messageType = serverMsg.contentType
        }
      }
    } finally {
      sending.value = false
    }
  } catch (error) {
    console.error('上传图片并发送失败:', error)
    ElMessage.error('图片发送失败，请稍后重试')
  } finally {
    imagePanelVisible.value = false
    scrollToBottom()
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

// 未读数轮询（WS 失败时的兜底）
const startUnreadPolling = () => {
  if (typeof window === 'undefined') return
  if (unreadPollTimer) {
    window.clearInterval(unreadPollTimer)
    unreadPollTimer = null
  }
  unreadPollTimer = window.setInterval(async () => {
    if (isExpanded.value) return
    try {
      await refreshUnreadFromHttp()
    } catch (e) {
      console.error('轮询刷新客服未读数失败', e)
    }
  }, 3000)
}

const stopUnreadPolling = () => {
  if (typeof window === 'undefined') return
  if (unreadPollTimer) {
    window.clearInterval(unreadPollTimer)
    unreadPollTimer = null
  }
}

const getWsUrl = () => {
  // 后端设置了 server.servlet.context-path=/api, WebSocket endpoint 实际为 /api/ws
  // 通过 STOMP CONNECT headers 携带 Authorization, 便于 CONNECT 阶段绑定用户ID
  const base = '/api/ws'
  if (typeof window === 'undefined') return base
  return base
}

const initWs = () => {
  if (stompClient.value) return
  const socketUrl = getWsUrl()
  const socket = new SockJS(socketUrl)
  const tokenValue = token.value || localStorage.getItem('token')
  const client = new Client({
    webSocketFactory: () => socket as any,
    connectHeaders: tokenValue ? { Authorization: `Bearer ${tokenValue}` } : {},
    reconnectDelay: 5000,
    debug: () => { }
  })

  client.onConnect = () => {
    wsConnected.value = true

    // 订阅未读汇总推送, 更新用户侧客服未读数以驱动前台入口红点
    client.subscribe('/user/queue/cs/unread', (frame: any) => {
      try {
        console.log('[WS] 收到未读汇总原始帧', frame)
        const payload = JSON.parse(frame.body) as { unreadForUser?: number; unreadForAgent?: number }
        console.log('[WS] 解析后的未读汇总', payload)
        if (typeof payload.unreadForUser === 'number') {
          if (isExpanded.value && sessionId.value && payload.unreadForUser > 0) {
            appStore.setCsUnreadForUser(0)
            ackUserRead()
            console.log('[WS] 已更新 appStore.csUnreadForUser =', 0)
          } else {
            appStore.setCsUnreadForUser(payload.unreadForUser)
            console.log('[WS] 已更新 appStore.csUnreadForUser =', payload.unreadForUser)
          }
        }
      } catch (e) {
        console.error('解析客服未读汇总失败', e, frame && frame.body)
      }
    })

    // WS 连接成功后主动拉一次未读数，避免用户离线期间错过 push 导致红点不更新
    refreshUnreadFromHttp()
  }

  client.onStompError = () => {
    wsConnected.value = false
  }

  client.onWebSocketClose = () => {
    wsConnected.value = false
  }

  client.activate()
  stompClient.value = client
}

watch(
  () => token.value,
  (val, oldVal) => {
    if (val && val !== oldVal) {
      if (stompClient.value) {
        stompClient.value.deactivate()
        stompClient.value = null
        wsConnected.value = false
      }
      initWs()
      refreshUnreadFromHttp()
    }

    if (!val && stompClient.value) {
      stompClient.value.deactivate()
      stompClient.value = null
      wsConnected.value = false
      appStore.setCsUnreadForUser(0)
    }
  },
  { immediate: true }
)

const loadHistory = async () => {
  if (!sessionId.value) return
  try {
    const res = await getManualCsMessages(sessionId.value)
    const list: CsMessage[] = res.data || []

    if (list.length > 0) {
      messages.value = list.map((item) => ({
        id: String(item.id),
        serverId: item.id,
        sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
        content: item.content,
        time: formatTime(item.createTime),
        isoTime: (item.createTime as unknown as string) || null,
        messageType: item.contentType
      }))
      // 记录当前最新消息ID, 供后续长轮询只拉取增量
      lastMessageId.value = list[list.length - 1].id
    } else {
      messages.value = []
      ensureWelcome()
      lastMessageId.value = null
    }

    scrollToBottom()

    // 打开窗口后, 将当前会话的用户侧未读数清零
    await ackUserRead()
  } catch (error) {
    console.error('加载人工客服消息失败:', error)
    if (messages.value.length === 0) {
      ensureWelcome()
    }
    ElMessage.error('加载客服消息失败，请稍后再试')
  }
}

const ensureSession = async () => {
  if (loadingSession.value) return
  loadingSession.value = true
  try {
    if (!sessionId.value) {
      const res = await openManualCsSession()
      const session = res.data
      sessionId.value = session.id
      if (session && typeof session.unreadForUser === 'number') {
        appStore.setCsUnreadForUser(session.unreadForUser)
      }
    }
    await loadHistory()
    // 会话就绪后启动长轮询获取新消息
    startPolling()
  } catch (error) {
    console.error('打开人工客服会话失败:', error)
    if (messages.value.length === 0) {
      ensureWelcome()
      scrollToBottom()
    }
    ElMessage.error('人工客服暂时不可用，请稍后再试')
  } finally {
    loadingSession.value = false
  }
}

const open = async () => {
  // 保留方法以兼容外部可能的调用，但当前入口由外层 v-model 控制
  isExpanded.value = true
  emit('update:visible', true)
  await ensureSession()
}

const minimize = () => {
  isExpanded.value = false
  emit('update:visible', false)
  emojiPanelVisible.value = false
  imagePanelVisible.value = false
  stopPolling()
  appStore.setCsUnreadForUser(0)
  ackUserRead()
}

const handleSend = async () => {
  const content = draft.value.trim()
  if (!content || sending.value) return

  if (!sessionId.value) {
    await ensureSession()
  }
  if (!sessionId.value) return

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const localId = `${Date.now()}-u`

  // 本地先显示用户消息
  messages.value.push({
    id: localId,
    sender: 'user',
    content,
    time: now,
    isoTime: new Date().toISOString(),
    messageType: 'text'
  })
  draft.value = ''
  scrollToBottom()

  sending.value = true
  try {
    const res = await sendManualCsMessage(sessionId.value, { content, messageType: 'text' })
    const serverMsg = res.data
    if (serverMsg && typeof serverMsg.id === 'number') {
      lastMessageId.value = serverMsg.id
      const serverId = serverMsg.id
      const serverIdStr = String(serverId)
      let localIdx = messages.value.findIndex((m) => m.id === localId)
      const dupIdx = messages.value.findIndex((m) => m.serverId === serverId || m.id === serverIdStr)

      if (localIdx !== -1) {
        if (dupIdx !== -1 && dupIdx !== localIdx) {
          messages.value.splice(dupIdx, 1)
          if (dupIdx < localIdx) localIdx -= 1
        }
        messages.value[localIdx].serverId = serverId
        messages.value[localIdx].time = formatTime(serverMsg.createTime)
        messages.value[localIdx].isoTime = (serverMsg.createTime as unknown as string) || messages.value[localIdx].isoTime
        messages.value[localIdx].messageType = serverMsg.contentType
      }
    }
  } catch (error) {
    console.error('发送人工客服消息失败:', error)
    ElMessage.error('发送失败，请稍后重试')
  } finally {
    sending.value = false
  }
}

watch(
  () => props.visible,
  async (val, oldVal) => {
    if (typeof val === 'boolean') {
      isExpanded.value = val
      if (val) {
        await ensureSession()
      } else {
        emojiPanelVisible.value = false
        stopPolling()
        if (oldVal) {
          appStore.setCsUnreadForUser(0)
          ackUserRead()
        }
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  initWs()
  refreshUnreadFromHttp()
  // 初始阶段先开启低频 HTTP 兜底, 等 WS 连接成功后会自动 stop
  startUnreadPolling()
  if (props.visible) {
    await ensureSession()
  }
})

onUnmounted(() => {
  stopPolling()
  stopUnreadPolling()
  if (stompClient.value) {
    stompClient.value.deactivate()
    stompClient.value = null
    wsConnected.value = false
  }
})
</script>

<style scoped>
.manual-chat-root {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2200;
}

.manual-chat-window {
  width: 380px;
  height: 560px;
  max-height: calc(100vh - 48px);
  background: #fffdf9;
  border-radius: 22px;
  box-shadow: 0 22px 55px rgba(255, 143, 88, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.manual-chat-header {
  height: 64px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0a46b 0%, #ff9c6a 40%, #ff7b4b 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.3);
}

.agent-info {
  display: flex;
  flex-direction: column;
}

.agent-name {
  font-size: 15px;
  font-weight: 600;
}

.agent-status {
  font-size: 12px;
  opacity: 0.77;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  font-size: 16px;
  padding: 4px;
  border-radius: 999px;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.icon-btn:hover {
  background-color: rgba(255, 165, 110, 0.16);
  transform: translateY(-1px);
}

.manual-chat-body {
  flex: 1;
  padding: 10px 12px;
  background: transparent;
  overflow-y: auto;
  position: relative;
}

.manual-chat-body::before {
  content: '';
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  right: 0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 35, 52, 0.06);
  z-index: 0;
}

.manual-chat-body > * {
  position: relative;
  z-index: 1;
}

.manual-chat-body::-webkit-scrollbar {
  width: 6px;
}

.manual-chat-body::-webkit-scrollbar-track {
  background: transparent;
}

.manual-chat-body::-webkit-scrollbar-thumb {
  background: rgba(255, 165, 110, 0.45);
  border-radius: 999px;
}

.message-date-divider {
  display: flex;
  justify-content: center;
  margin: 6px 0 10px;
}

.message-date-label {
  padding: 2px 10px;
  border-radius: 999px;
  background-color: rgba(255, 184, 120, 0.08);
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 8px 0;
}

.message-row.agent {
  justify-content: flex-start;
}

.message-row.user {
  justify-content: flex-end;
}

.bubble {
  max-width: 72%;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.3;
  position: relative;
  background: #f5f5f5;
  color: #333;
}

.agent-bubble {
  background: #eceaea;
  color: #333;
}

.user-bubble {
  background-color: #95ec69;
  color: #302f2f;
}

.bubble-time {
  text-align: right;
  margin-top: 4px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffe6c8;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-avatar .agent-message-avatar-icon {
  width: 100%;
  height: 100%;
}

.user-avatar {
  background-color: #ffe6c8;
  color: #f57c2b;
  border-radius: 999px;
}

.user-avatar .el-icon {
  font-size: 18px;
}

.manual-chat-footer {
  border-top: 1px solid #f0e2d6;
  padding: 8px 10px 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f69c5d;
}

.image-panel {
  grid-template-columns: none;
  max-width: 300px;
  max-height: 200px;
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

.image-upload-overlay {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-upload-card {
  width: 100%;
  max-width: 280px;
  padding: 18px 20px 16px;
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

.chat-image {
  max-width: 160px;
  max-height: 200px;
  border-radius: 8px;
  display: block;
}

.image-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px dashed #f0e2d6;
  background-color: #fffafa;
  cursor: pointer;
  text-align: center;
}

.image-upload-icon {
  font-size: 24px;
  margin-bottom: 6px;
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

.emoji-item {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1.2;
  padding: 2px;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chat-input {
  flex: 1;
  resize: none;
  border-radius: 16px;
  border: 1px solid #f7d7be;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  background-color: #fffaf5;
}

.chat-input:focus {
  border-color: #ff9557;
  box-shadow: 0 0 0 1px rgba(255, 149, 87, 0.24);
}

.send-btn {
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  background: linear-gradient(135deg, #ffb27b 0%, #ff8c55 100%);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(255, 140, 85, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  margin-bottom: 8px;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.send-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(255, 140, 85, 0.4);
}

.manual-chat-floating-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff9557 0%, #ff6b35 100%);
  color: #fff;
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.45);
  cursor: pointer;
  font-size: 10px;
}

.manual-chat-fade-slide-enter-active,
.manual-chat-fade-slide-leave-active {
  transition: all 0.25s ease;
}

.manual-chat-fade-slide-enter-from,
.manual-chat-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .manual-chat-root {
    right: 0;
    bottom: 0;
  }

  .manual-chat-window {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
