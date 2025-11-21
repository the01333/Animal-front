<template>
  <div class="ai-chat-container">
    <div class="chat-header">
      <h1>AI智能客服</h1>
      <p>24小时在线为您解答领养相关问题</p>
    </div>
    
    <div class="chat-content">
      <ChatBox 
        ref="chatBoxRef"
        title="AI智能客服"
        @send-message="handleSendMessage"
        :disabled="loading"
      />
    </div>
    
    <div class="quick-questions">
      <h3>常见问题</h3>
      <div class="questions-grid">
        <div 
          v-for="question in quickQuestions" 
          :key="question.id"
          class="question-item"
          @click="selectQuickQuestion(question)"
        >
          {{ question.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatBox from '../../components/chat/ChatBox.vue'
import service from '@/utils/request'
import type { ApiResponse } from '@/types'

// ChatBox组件引用
const chatBoxRef = ref<InstanceType<typeof ChatBox> | null>(null)

// 加载状态
const loading = ref(false)

// 常见问题
const quickQuestions = ref([
  { id: 1, text: '如何申请领养宠物？' },
  { id: 2, text: '领养需要什么条件？' },
  { id: 3, text: '领养后如何照顾宠物？' },
  { id: 4, text: '宠物生病了怎么办？' },
  { id: 5, text: '如何办理宠物证件？' },
  { id: 6, text: '宠物绝育有必要吗？' }
])

// 处理发送消息
const handleSendMessage = async (message: string) => {
  if (!message.trim()) return
  
  // 添加用户消息到聊天记录
  chatBoxRef.value?.addMessage(message, 'user')
  
  loading.value = true
  
  try {
    const res = await service.post<any, ApiResponse<string>>('/ai/service/chat', { content: message })
    if (res.code === 200) {
      chatBoxRef.value?.addMessage(res.data, 'ai')
    } else {
      chatBoxRef.value?.addMessage(res.message || '抱歉，AI客服暂时无法回答。', 'ai')
    }
  } catch (error) {
    // 添加错误消息到聊天记录
    chatBoxRef.value?.addMessage('抱歉，AI客服暂时无法回答您的问题，请稍后重试或联系人工客服。', 'ai')
  } finally {
    loading.value = false
  }
}

// 选择快捷问题
const selectQuickQuestion = (question: { id: number, text: string }) => {
  handleSendMessage(question.text)
}

onMounted(() => {
  // 添加欢迎消息
  setTimeout(() => {
    chatBoxRef.value?.addMessage('您好！我是AI智能客服，可以为您解答关于宠物领养的各种问题。请问有什么可以帮助您的吗？', 'ai')
  }, 500)
})
</script>

<style scoped>
.ai-chat-container {
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

.quick-questions {
  margin-top: 1.5rem;
}

.quick-questions h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.question-item {
  padding: 0.75rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  font-size: 0.9rem;
}

.question-item:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .ai-chat-container {
    height: auto;
  }
  
  .questions-grid {
    grid-template-columns: 1fr;
  }
}
</style>