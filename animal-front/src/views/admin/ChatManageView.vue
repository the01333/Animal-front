<template>
  <div class="chat-manage-view">
    <div class="chat-container">
      <aside class="conversation-pane">
        <div class="conversation-header">
          <div class="conversation-title">客服会话</div>
          <el-input v-model="searchKeyword" placeholder="搜索用户..." :prefix-icon="Search" clearable />
        </div>
        <el-scrollbar class="conversation-list">
          <div v-for="session in filteredSessions" :key="session.id" class="conversation-item"
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
          <div class="chat-header-left">
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
            <el-button text>查看资料</el-button>
            <el-button text type="danger">结束会话</el-button>
          </div>
        </header>

        <div class="chat-body">
          <main class="message-pane" ref="messageContainer">
            <div class="message-scroll">
              <div
                v-for="msg in currentMessages"
                :key="msg.id"
                class="message-row"
                :class="msg.sender"
              >
                <div class="message-bubble" :class="msg.sender">
                  <div class="message-content" v-html="msg.content" />
                  <div class="message-time">{{ msg.time }}</div>
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
              <div class="side-section">
                <div class="side-title">用户信息</div>
                <div class="side-item"><span>昵称：</span>{{ currentSession.name }}</div>
                <div class="side-item"><span>宠物偏好：</span>{{ currentSession.preference }}</div>
                <div class="side-item"><span>历史订单：</span>{{ currentSession.orders }}</div>
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
          <el-input
            v-model="draft"
            type="textarea"
            :rows="3"
            placeholder="在此输入回复内容..."
            @keydown.ctrl.enter.prevent.native="sendMessage"
          />
          <div class="chat-input-actions">
            <span class="hint">按 Ctrl+Enter 发送，Enter 换行</span>
            <el-button type="primary" size="small" @click="sendMessage" :disabled="!draft.trim()">
              发送
            </el-button>
          </div>
        </footer>
      </section>

      <section v-else class="chat-main-empty">
        <el-empty description="请选择左侧的用户会话开始聊天" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import SockJS from 'sockjs-client'
import { Client, type IMessage } from '@stomp/stompjs'
import { useAppStore } from '@/stores/app'
import {
  pageManualCsSessions,
  getManualCsMessages,
  sendManualCsMessage,
  readAckManualCs,
  type CsSession,
  type CsMessage
} from '@/api/customerService'

type Sender = 'user' | 'agent'

interface ChatMessage {
  id: string
  sender: Sender
  content: string
  time: string
}

interface ChatSession {
  id: number
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
  preference: string
  orders: string
}

const appStore = useAppStore()
const searchKeyword = ref('')
const sessions = ref<ChatSession[]>([])
const messagesMap = ref<Record<number, ChatMessage[]>>({})

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

const loadingSessions = ref(false)
const loadingMessages = ref(false)
const sending = ref(false)
const stompClient = ref<Client | null>(null)
const wsConnected = ref(false)
let sessionsPollTimer: number | null = null
let messagesPollTimer: number | null = null

const getWsUrl = () => {
  // 后端设置了 server.servlet.context-path=/api, WebSocket endpoint 实际为 /api/ws
  // 通过查询参数 token 将当前登录 token 传给后端, 便于握手阶段绑定用户ID
  const base = '/api/ws'
  if (typeof window === 'undefined') return base
  const token = localStorage.getItem('token')
  if (token) {
    return `${base}?token=${encodeURIComponent(token)}`
  }
  return base
}

const formatTime = (iso?: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const filteredSessions = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return sessions.value
  return sessions.value.filter((s) =>
    s.name.toLowerCase().includes(keyword) || s.lastMessage.toLowerCase().includes(keyword)
  )
})

const currentSession = computed(() => {
  if (!activeSessionId.value) return null
  return sessions.value.find((s) => s.id === activeSessionId.value) || null
})

const currentMessages = computed(() => {
  if (!activeSessionId.value) return []
  return messagesMap.value[activeSessionId.value] || []
})

const loadSessions = async () => {
  loadingSessions.value = true
  try {
    const res = await pageManualCsSessions({ current: 1, size: 50 })
    const pageData = res.data
    const records: CsSession[] = pageData?.records || []

    sessions.value = records.map<ChatSession>((item) => ({
      id: item.id,
      name: item.userNickname || `用户#${item.userId}`,
      avatar: item.userAvatar || 'http://localhost:9000/animal-adopt/default.jpg',
      lastMessage: item.lastMessage || '',
      lastTime: item.lastTime ? formatTime(item.lastTime as unknown as string) : '',
      unread: item.unreadForAgent || 0,
      online: false,
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

const loadMessages = async (sessionId: number) => {
  loadingMessages.value = true
  try {
    const res = await getManualCsMessages(sessionId)
    const list: CsMessage[] = res.data || []

    messagesMap.value[sessionId] = list.map<ChatMessage>((item) => ({
      id: String(item.id),
      sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
      content: item.content,
      time: item.createTime ? formatTime(item.createTime as unknown as string) : ''
    }))

    scrollToBottom()
  } catch (error) {
    console.error('加载会话消息失败:', error)
    ElMessage.error('加载会话消息失败，请稍后重试')
  } finally {
    loadingMessages.value = false
  }
}

const selectSession = async (id: number) => {
  activeSessionId.value = id
  await loadMessages(id)
  startMessagesPolling(id)

  // 点击会话后, 将客服侧未读数清零
  try {
    await readAckManualCs(id, 'AGENT')
    const target = sessions.value.find((s) => s.id === id)
    if (target) {
      target.unread = 0
    }
    // 重新计算客服未读总数并更新到全局，用于导航红点
    const totalUnread = sessions.value.reduce((sum, s) => sum + (s.unread || 0), 0)
    appStore.setCsUnreadForAgent(totalUnread)
  } catch (error) {
    console.error('更新客服侧未读状态失败:', error)
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (!messageContainer.value) return
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  })
}

const startSessionsPolling = () => {
  // 只有在 WS 未连接时才使用轮询作为降级方案
  if (wsConnected.value) return
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
  }, 15000)
}

const startMessagesPolling = (sessionId: number) => {
  // 只有在 WS 未连接时才使用轮询作为降级方案
  if (wsConnected.value) return
  if (messagesPollTimer) {
    window.clearInterval(messagesPollTimer)
    messagesPollTimer = null
  }
  messagesPollTimer = window.setInterval(async () => {
    if (wsConnected.value) return
    try {
      await loadMessages(sessionId)
    } catch (e) {
      console.error('轮询刷新会话消息失败', e)
    }
  }, 10000)
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
    client.subscribe('/user/queue/cs/chat', (frame: IMessage) => {
      try {
        const payload = JSON.parse(frame.body) as CsMessage
        const sid = payload.sessionId
        const list = messagesMap.value[sid] || []
        list.push({
          id: String(payload.id),
          sender: payload.senderRole === 'AGENT' ? 'agent' : 'user',
          content: payload.content,
          time: payload.createTime ? formatTime(payload.createTime as unknown as string) : ''
        })
        messagesMap.value[sid] = list
        const s = sessions.value.find((it) => it.id === sid)
        if (s) {
          s.lastMessage = payload.content
          s.lastTime = payload.createTime
            ? formatTime(payload.createTime as unknown as string)
            : s.lastTime
          if (payload.senderRole === 'USER') {
            s.unread = (s.unread || 0) + 1
          }
        }
        if (activeSessionId.value === sid) {
          scrollToBottom()
        }
      } catch (e) {
        console.error('解析客服WS消息失败', e)
      }
    })
    // 订阅未读汇总推送, 更新全局客服未读数以驱动左侧导航红点
    client.subscribe('/user/queue/cs/unread', (frame: IMessage) => {
      try {
        const payload = JSON.parse(frame.body) as { unreadForUser?: number; unreadForAgent?: number }
        if (typeof payload.unreadForAgent === 'number') {
          appStore.setCsUnreadForAgent(payload.unreadForAgent)
        }
      } catch (e) {
        console.error('解析客服未读汇总失败', e)
      }
    })
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

const sendMessage = async () => {
  const content = draft.value.trim()
  if (!content) return
  if (!currentSession.value || !activeSessionId.value) {
    ElMessage.warning('请选择一个会话')
    return
  }

  if (sending.value) return

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const msg: ChatMessage = {
    id: `${Date.now()}`,
    sender: 'agent',
    content,
    time
  }

  const list = messagesMap.value[activeSessionId.value] || []
  list.push(msg)
  messagesMap.value[activeSessionId.value] = list
  draft.value = ''
  scrollToBottom()

  try {
    sending.value = true
    // 统一通过 HTTP 接口发送消息，由后端负责写入数据库并通过 WebSocket 推送给双方
    await sendManualCsMessage(activeSessionId.value, { content, messageType: 'text' })
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

onMounted(async () => {
  await loadSessions()
  initWs()
  startSessionsPolling()
})

onUnmounted(() => {
  stopAllPolling()
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
  background-color: #f0f9ff;
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
  background-color: #e5ddd5;
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
  margin-bottom: 8px;
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

.message-time {
  margin-top: 2px;
  font-size: 11px;
  color: #909399;
  text-align: right;
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

.chat-input-actions {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-input-actions .hint {
  font-size: 12px;
  color: #909399;
}

.chat-main-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}
</style>
