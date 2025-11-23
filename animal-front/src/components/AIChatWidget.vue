<template>
  <Teleport to="body">
    <div class="ai-chat-widget" :class="{ expanded: isExpanded }">
    <!-- 聊天窗口 -->
    <div v-if="isExpanded" class="chat-container">
      <!-- 头部 -->
      <div class="chat-header">
        <div class="header-content">
          <el-icon class="header-icon">
            <ChatDotRound />
          </el-icon>
          <span class="header-title">AI客服助手</span>
        </div>
        <el-button 
          link 
          :icon="Close" 
          @click="toggleChat"
          class="close-btn"
        />
      </div>

      <!-- 消息列表 -->
      <div class="messages-container" ref="messagesContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div class="message-avatar" v-if="msg.role === 'assistant'">
            <el-icon>
              <ChatDotRound />
            </el-icon>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(msg.content)"></div>
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
            <!-- 流式输出时显示光标 -->
            <span v-if="isLoading && msg.role === 'assistant' && index === messages.length - 1" class="typing-cursor">▌</span>
          </div>
          <div class="message-avatar user" v-if="msg.role === 'user'">
            <el-icon>
              <User />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="chat-input-area">
        <el-input
          v-model="userInput"
          type="textarea"
          :rows="3"
          placeholder="输入您的问题..."
          @keyup.enter.ctrl="sendMessage"
          class="chat-input"
          :disabled="isLoading"
        />
        <div class="input-actions">
          <span class="hint">按 Ctrl+Enter 发送</span>
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

    <!-- 浮动按钮 -->
    <div v-else class="chat-button">
      <button 
        @click="toggleChat"
        class="floating-btn"
        title="AI客服助手"
      >
        <el-icon>
          <ChatDotRound />
        </el-icon>
      </button>
      <div class="unread-badge" v-if="unreadCount > 0">
        {{ unreadCount }}
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Close, User } from '@element-plus/icons-vue'
import { chatWithAIStream, getWelcomeMessage, type ChatMessage } from '@/api/ai'

const isExpanded = ref(false)
const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()
const unreadCount = ref(0)

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

  const content = userInput.value.trim()
  
  // 添加用户消息
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

    // 创建AI回复消息（初始为空）
    const aiMessageIndex = messages.value.length
    messages.value.push({
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    })

    // 调用流式AI服务
    console.log('📤 发送消息:', content)
    let fullContent = ''
    
    await chatWithAIStream(content, (chunk: string) => {
      fullContent += chunk
      // 更新AI消息内容
      if (messages.value[aiMessageIndex]) {
        messages.value[aiMessageIndex].content = fullContent
      }
      // 滚动到底部
      scrollToBottom()
    })

    console.log('✅ 流式对话完成:', fullContent)
  } catch (error: any) {
    console.error('❌ AI服务错误:', error)
    
    // 移除不完整的AI消息
    if (messages.value[messages.value.length - 1]?.role === 'assistant') {
      messages.value.pop()
    }
    
    // 处理限流错误
    if (error.message?.includes('429')) {
      ElMessage.warning('请求过于频繁，请稍后再试')
    } else if (error.message?.includes('过于频繁')) {
      ElMessage.warning(error.message)
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

onMounted(() => {
  // 初始化时不自动打开
})
</script>

<style scoped>
.ai-chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 浮动按钮 */
.chat-button {
  position: relative;
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
  width: 400px;
  height: 600px;
  max-height: calc(100vh - 40px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  overflow: hidden;
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
  font-size: 20px;
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

.message-avatar.user {
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  color: white;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 280px;
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
  font-size: 12px;
  color: #999;
  padding: 0 4px;
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
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
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
