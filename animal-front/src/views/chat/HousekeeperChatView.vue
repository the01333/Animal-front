<template>
  <div class="housekeeper-chat-container">
    <div class="chat-header">
      <h1>联系管家</h1>
      <p>与领养管家实时沟通，获取专业建议</p>
    </div>
    
    <div class="chat-content">
      <ChatBox 
        ref="chatBoxRef"
        title="领养管家"
        @send-message="handleSendMessage"
        :disabled="!connected"
      />
    </div>
    
    <div class="connection-status">
      <div class="status-indicator" :class="{ connected: connected }"></div>
      <span>{{ connected ? '已连接' : '连接中...' }}</span>
      <button 
        v-if="!connected" 
        @click="reconnect" 
        class="btn-reconnect"
      >
        重新连接
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ChatBox from '../../components/chat/ChatBox.vue'

// ChatBox组件引用
const chatBoxRef = ref<InstanceType<typeof ChatBox> | null>(null)

// 连接状态
const connected = ref(false)

// WebSocket连接
let websocket: WebSocket | null = null

// WebSocket服务器地址
const websocketUrl = 'ws://localhost:8080/websocket'

// 处理发送消息
const handleSendMessage = (message: string) => {
  if (!message.trim() || !connected.value) return
  
  // 添加用户消息到聊天记录
  chatBoxRef.value?.addMessage(message, 'user')
  
  // 通过WebSocket发送消息
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify({
      type: 'message',
      content: message
    }))
  }
}

// 初始化WebSocket连接
const initWebSocket = () => {
  try {
    websocket = new WebSocket(websocketUrl)
    
    websocket.onopen = () => {
      console.log('WebSocket连接已建立')
      connected.value = true
      
      // 添加连接成功消息
      chatBoxRef.value?.addMessage('您好！我是您的领养管家，有什么可以帮助您的吗？', 'housekeeper')
    }
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
          // 添加管家回复到聊天记录
          chatBoxRef.value?.addMessage(data.content, 'housekeeper')
        }
      } catch (error) {
        console.error('解析WebSocket消息失败:', error)
      }
    }
    
    websocket.onclose = () => {
      console.log('WebSocket连接已关闭')
      connected.value = false
    }
    
    websocket.onerror = (error) => {
      console.error('WebSocket连接错误:', error)
      connected.value = false
    }
  } catch (error) {
    console.error('初始化WebSocket连接失败:', error)
    connected.value = false
  }
}

// 重新连接
const reconnect = () => {
  if (websocket) {
    websocket.close()
  }
  initWebSocket()
}

// 组件挂载时初始化连接
onMounted(() => {
  initWebSocket()
})

// 组件卸载时关闭连接
onUnmounted(() => {
  if (websocket) {
    websocket.close()
  }
})
</script>

<style scoped>
.housekeeper-chat-container {
  padding: 1rem 0;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.chat-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.chat-header h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.chat-header p {
  color: #666;
  margin: 0;
}

.chat-content {
  flex: 1;
  min-height: 0;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ff6b6b;
}

.status-indicator.connected {
  background-color: #42b983;
}

.btn-reconnect {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: auto;
}

@media (max-width: 768px) {
  .housekeeper-chat-container {
    height: auto;
  }
}
</style>