<template>
  <Teleport to="body">
    <div class="manual-chat-root">
      <transition name="manual-chat-fade-slide">
        <div v-if="isExpanded" class="manual-chat-window">
          <header class="manual-chat-header">
            <div class="header-left">
              <img class="agent-avatar" :src="agentAvatar" alt="客服" />
              <div class="agent-info">
                <div class="agent-name">人工客服小宠</div>
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
              <textarea
                v-model="draft"
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

      <transition name="manual-chat-fade-slide">
        <button
          v-if="!isExpanded"
          class="manual-chat-floating-btn"
          type="button"
          @click="open"
        >
          人工客服咨询
        </button>
      </transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, nextTick, onMounted, ref, watch } from 'vue'

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

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const open = () => {
  isExpanded.value = true
  emit('update:visible', true)
  ensureWelcome()
  scrollToBottom()
}

const minimize = () => {
  isExpanded.value = false
  emit('update:visible', false)
}

const handleSend = () => {
  const content = draft.value.trim()
  if (!content) return

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  messages.value.push({
    id: `${Date.now()}-u`,
    sender: 'user',
    content,
    time: now
  })
  draft.value = ''
  scrollToBottom()

  setTimeout(() => {
    messages.value.push({
      id: `${Date.now()}-a`,
      sender: 'agent',
      content: '我们已收到您的消息，稍后会有工作人员为您解答。',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    scrollToBottom()
  }, 600)
}

watch(
  () => props.visible,
  (val) => {
    if (typeof val === 'boolean') {
      isExpanded.value = val
      if (val) {
        ensureWelcome()
        scrollToBottom()
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.visible) {
    ensureWelcome()
    scrollToBottom()
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
  opacity: 0.9;
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
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff9557 0%, #ff6b35 100%);
  color: #fff;
  box-shadow: 0 10px 25px rgba(255, 107, 53, 0.45);
  cursor: pointer;
  font-size: 12px;
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
