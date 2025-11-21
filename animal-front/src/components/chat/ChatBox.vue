<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>{{ title }}</h3>
    </div>
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message"
        :class="{ 'message-sent': message.sender === 'user', 'message-received': message.sender !== 'user' }"
      >
        <div class="message-content">
          {{ message.content }}
        </div>
        <div class="message-time">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage" 
        placeholder="输入消息..." 
        :disabled="disabled"
      />
      <button @click="sendMessage" :disabled="disabled || !newMessage.trim()">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

// 定义消息接口
interface Message {
  id: string
  content: string
  sender: 'user' | 'ai' | 'housekeeper'
  timestamp: Date
}

// 定义组件props
const props = defineProps<{
  title: string
  disabled?: boolean
}>()

// 定义组件emits
const emit = defineEmits<{
  (e: 'send-message', message: string): void
}>()

const messages = ref<Message[]>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// 发送消息
const sendMessage = () => {
  if (newMessage.value.trim() && !props.disabled) {
    emit('send-message', newMessage.value.trim())
    newMessage.value = ''
  }
}

// 添加消息到聊天记录
const addMessage = (content: string, sender: 'user' | 'ai' | 'housekeeper') => {
  const message: Message = {
    id: Date.now().toString(),
    content,
    sender,
    timestamp: new Date()
  }
  messages.value.push(message)
  scrollToBottom()
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 暴露方法给父组件
defineExpose({
  addMessage
})

onMounted(() => {
  // 初始化示例消息
  messages.value.push({
    id: '1',
    content: '您好！欢迎使用我们的服务，请问有什么可以帮助您的吗？',
    sender: 'ai',
    timestamp: new Date()
  })
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.chat-header {
  background-color: #42b983;
  color: white;
  padding: 1rem;
  text-align: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f5f5f5;
}

.message {
  margin-bottom: 1rem;
  max-width: 80%;
}

.message-sent {
  margin-left: auto;
}

.message-received {
  margin-right: auto;
}

.message-content {
  padding: 0.5rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
}

.message-sent .message-content {
  background-color: #42b983;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-received .message-content {
  background-color: #e0e0e0;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.chat-input button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>