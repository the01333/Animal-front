<template>
  <div class="chat-manage-view">
    <div class="chat-container">
      <aside class="conversation-pane">
        <div class="conversation-header">
          <div class="conversation-title">客服会话</div>
          <el-input
            v-model="searchKeyword"
            size="small"
            placeholder="搜索用户..."
            :prefix-icon="Search"
            clearable
          />
        </div>
        <el-scrollbar class="conversation-list">
          <div
            v-for="session in filteredSessions"
            :key="session.id"
            class="conversation-item"
            :class="{ active: session.id === activeSessionId }"
            @click="selectSession(session.id)"
          >
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
            <el-button size="small" text>查看资料</el-button>
            <el-button size="small" text type="danger">结束会话</el-button>
          </div>
        </header>

        <div class="chat-body">
          <main class="message-pane" ref="messageContainer">
            <el-scrollbar class="message-scroll">
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
            </el-scrollbar>
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
                <div
                  v-for="item in quickReplies"
                  :key="item.id"
                  class="quick-reply-item"
                  @click="appendQuickReply(item.text)"
                >
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
            placeholder="输入回复内容...(按 Enter 发送, Ctrl+Enter 换行)"
            @keydown.native="handleKeydown"
          />
          <div class="chat-input-actions">
            <span class="hint">按 Enter 发送，Ctrl+Enter 换行</span>
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
import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

type Sender = 'user' | 'agent'

interface ChatMessage {
  id: string
  sender: Sender
  content: string
  time: string
}

interface ChatSession {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
  preference: string
  orders: string
}

const searchKeyword = ref('')

const sessions = ref<ChatSession[]>([
  {
    id: '1',
    name: '林林1',
    avatar: 'http://localhost:9000/animal-adopt/default.jpg',
    lastMessage: '我想了解一下编号 #202401 的金毛犬情况。',
    lastTime: '10:23',
    unread: 1,
    online: true,
    preference: '大型犬、金毛、拉布拉多',
    orders: '已领养 1 只，进行中 1 单'
  },
  {
    id: '2',
    name: '爱心领养-张',
    avatar: 'http://localhost:9000/animal-adopt/default.jpg',
    lastMessage: '好的，我明天下午过去。',
    lastTime: '昨天',
    unread: 0,
    online: false,
    preference: '小型犬、猫咪',
    orders: '已领养 2 只'
  },
  {
    id: '3',
    name: '铲屎官2号',
    avatar: 'http://localhost:9000/animal-adopt/default.jpg',
    lastMessage: '谢谢！',
    lastTime: '周一',
    unread: 0,
    online: true,
    preference: '猫咪、短毛',
    orders: '咨询中 1 单'
  }
])

const messagesMap = ref<Record<string, ChatMessage[]>>({
  '1': [
    {
      id: 'm1-1',
      sender: 'user',
      content: '你好，请问这只金毛还在吗？',
      time: '10:20'
    },
    {
      id: 'm1-2',
      sender: 'agent',
      content: '您好！在的，这只金毛目前还在基地等待领养。',
      time: '10:21'
    },
    {
      id: 'm1-3',
      sender: 'user',
      content: '我想了解一下编号 #202401 的金毛犬当前的健康状况。',
      time: '10:23'
    }
  ],
  '2': [
    {
      id: 'm2-1',
      sender: 'user',
      content: '好的，我明天下午过去。',
      time: '昨天'
    }
  ],
  '3': [
    {
      id: 'm3-1',
      sender: 'user',
      content: '谢谢！',
      time: '周一'
    }
  ]
})

const quickReplies = ref([
  { id: 'q1', text: '您好，这里是 i宠园客服，请问有什么可以帮您？' },
  { id: 'q2', text: '当前这只宠物还在基地，可预约本周到访进行线下了解。' },
  { id: 'q3', text: '领养需要提交基本资料并通过简单的资质审核。' },
  { id: 'q4', text: '好的，我们已为您记录需求，如有合适的宠物会第一时间联系您。' }
])

const activeSessionId = ref<string | null>(sessions.value[0]?.id ?? null)
const draft = ref('')
const sideCollapsed = ref(false)
const messageContainer = ref<HTMLElement | null>(null)

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

const selectSession = (id: string) => {
  activeSessionId.value = id
}

const scrollToBottom = () => {
  nextTick(() => {
    if (!messageContainer.value) return
    const wrap = messageContainer.value.querySelector('.el-scrollbar__wrap') as HTMLElement | null
    if (wrap) {
      wrap.scrollTop = wrap.scrollHeight
    }
  })
}

const sendMessage = () => {
  const content = draft.value.trim()
  if (!content) return
  if (!currentSession.value || !activeSessionId.value) {
    ElMessage.warning('请选择一个会话')
    return
  }

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
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (event.ctrlKey) {
      return
    }
    event.preventDefault()
    sendMessage()
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
  font-size: 16px;
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
}

.message-pane {
  flex: 1;
  background-color: #e5ddd5;
  padding: 12px 16px;
}

.message-scroll {
  height: 100%;
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
  margin-top: 4px;
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

.side-section + .side-section {
  margin-top: 16px;
}

.side-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.side-item {
  font-size: 13px;
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

