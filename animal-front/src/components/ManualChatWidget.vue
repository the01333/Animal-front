<template>
  <Teleport to="body">
    <div class="manual-chat-root">
      <transition name="manual-chat-fade-slide">
        <div v-if="isExpanded" class="manual-chat-window">
          <header class="manual-chat-header">
            <div class="header-left">
              <img class="agent-avatar" :src="agentAvatar" alt="客服" />
              <div class="agent-info">
                <div class="agent-name">人工客服</div>
                <div class="agent-status">通常在几分钟内回复</div>
              </div>
            </div>
            <div class="header-actions">
              <button class="icon-btn" @click="minimize">×</button>
            </div>
          </header>

          <main class="manual-chat-body" ref="messageContainer">
            <div v-for="msg in messages" :key="msg.id" class="message-row" :class="msg.sender">
              <div v-if="msg.sender === 'agent'" class="bubble agent-bubble">
                <div class="bubble-content" v-html="msg.content"></div>
                <div class="bubble-time">{{ msg.time }}</div>
              </div>
              <div v-else class="bubble user-bubble">
                <div class="bubble-content" v-html="msg.content"></div>
                <div class="bubble-time">{{ msg.time }}</div>
              </div>
            </div>
          </main>

          <footer class="manual-chat-footer">
            <div class="toolbar">
              <button class="icon-btn" type="button">
                😊
              </button>
              <button class="icon-btn" type="button">
                📷
              </button>
            </div>
            <div class="input-row">
              <textarea v-model="draft" class="chat-input" placeholder="请输入您的问题..." rows="2"
                @keydown.enter.exact.prevent="handleSend" @keydown.enter.ctrl.stop />
              <button class="send-btn" type="button" :disabled="!draft.trim()" @click="handleSend">
                发送
              </button>
            </div>
          </footer>
        </div>
      </transition>

      <transition name="manual-chat-fade-slide">
        <button v-if="!isExpanded" class="manual-chat-floating-btn" type="button" @click="open">
          人工客服咨询
        </button>
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

interface ManualMessage {
  id: string
  sender: 'user' | 'agent'
  content: string
  time: string
}

const props = defineProps<{ visible?: boolean }>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const isExpanded = ref(false)
const messages = ref<ManualMessage[]>([])
const draft = ref('')
const messageContainer = ref<HTMLElement | null>(null)

// 后端会话ID (t_cs_session.id)
const sessionId = ref<number | null>(null)
const loadingSession = ref(false)
const sending = ref(false)
const stompClient = ref<Client | null>(null)
const wsConnected = ref(false)
const lastMessageId = ref<number | null>(null)
let pollStopped = false
let pollRunning = false

const agentAvatar = computed(
  () => 'http://localhost:9000/animal-adopt/default.jpg'
)

const ensureWelcome = () => {
  if (messages.value.length === 0) {
    messages.value.push({
      id: Date.now().toString(),
      sender: 'agent',
      content:
        '您好，我是人工客服小宠。如果您在领养流程、宠物健康或平台使用上有任何问题，都可以直接在这里告诉我哦~',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  }
}

const formatTime = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
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
      const list: CsMessage[] = res.data || []
      if (list.length > 0) {
        for (const item of list) {
          const idStr = String(item.id)
          // 避免重复追加已经存在的消息
          if (messages.value.some((m) => m.id === idStr)) continue
          messages.value.push({
            id: idStr,
            sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
            content: item.content,
            time: formatTime(item.createTime)
          })
        }
        lastMessageId.value = list[list.length - 1].id
        scrollToBottom()
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

const getWsUrl = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  const base = apiBase.replace(/\/api\/?$/, '')
  return `${base}/ws`
}

const initWs = () => {
  if (stompClient.value) return
  const socketUrl = getWsUrl()
  const socket = new SockJS(socketUrl)
  const client = new Client({
    webSocketFactory: () => socket as any,
    reconnectDelay: 5000,
    debug: () => { }
  })

  client.onConnect = () => {
    wsConnected.value = true
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

const loadHistory = async () => {
  if (!sessionId.value) return
  try {
    const res = await getManualCsMessages(sessionId.value)
    const list: CsMessage[] = res.data || []

    if (list.length > 0) {
      messages.value = list.map((item) => ({
        id: String(item.id),
        sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
        content: item.content,
        time: formatTime(item.createTime)
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
    if (sessionId.value) {
      try {
        await readAckManualCs(sessionId.value, 'USER')
      } catch (err) {
        console.error('发送用户侧已读回执失败:', err)
      }
    }
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
      sessionId.value = res.data.id
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
  isExpanded.value = true
  emit('update:visible', true)
  await ensureSession()
}

const minimize = () => {
  isExpanded.value = false
  emit('update:visible', false)
  stopPolling()
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
    time: now
  })
  draft.value = ''
  scrollToBottom()

  sending.value = true
  try {
    const res = await sendManualCsMessage(sessionId.value, { content, messageType: 'text' })
    const serverMsg = res.data
    if (serverMsg && typeof serverMsg.id === 'number') {
      lastMessageId.value = serverMsg.id
      const idx = messages.value.findIndex((m) => m.id === localId)
      if (idx !== -1) {
        messages.value[idx].id = String(serverMsg.id)
        messages.value[idx].time = formatTime(serverMsg.createTime)
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
  async (val) => {
    if (typeof val === 'boolean') {
      isExpanded.value = val
      if (val) {
        await ensureSession()
      } else {
        stopPolling()
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  initWs()
  if (props.visible) {
    await ensureSession()
  }
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.manual-chat-root {
  position: fixed;
  right: 24px;
  bottom: 100px;
  z-index: 2200;
}

.manual-chat-window {
  width: 380px;
  height: 600px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.manual-chat-header {
  height: 64px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ffb86c 0%, #ff8a4a 40%, #ff6b35 100%);
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
  opacity: 0.75;
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
}

.manual-chat-body {
  flex: 1;
  padding: 12px 14px;
  background: #fdf6f0;
  overflow-y: auto;
}

.message-row {
  display: flex;
  margin-bottom: 10px;
}

.message-row.agent {
  justify-content: flex-start;
}

.message-row.user {
  justify-content: flex-end;
}

.bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  position: relative;
}

.agent-bubble {
  background: #fff;
  border-radius: 12px 12px 12px 0;
  color: #333;
}

.user-bubble {
  background: #ff9557;
  border-radius: 12px 12px 0 12px;
  color: #fff;
}

.bubble-time {
  text-align: right;
  margin-left: 25px;
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.7;
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
  color: #ff9557;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chat-input {
  flex: 1;
  resize: none;
  border-radius: 12px;
  border: 1px solid #f0e2d6;
  padding: 8px 10px;
  font-size: 14px;
  outline: none;
}

.chat-input:focus {
  border-color: #ff9557;
  box-shadow: 0 0 0 1px rgba(255, 149, 87, 0.2);
}

.send-btn {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ff9557 0%, #ff6b35 100%);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
    border-radius: 0;
  }
}
</style>
