<template>
  <div class="front-layout">
    <Navbar @show-auth-dialog="handleShowAuthDialog" @open-manual-chat="openManualChat" />
    <main class="main-content" :class="{ 'blurred-background': authDialogVisible }">
      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <!-- AI客服助手 -->
    <AIChatWidget />

    <!-- 人工客服悬浮聊天 -->
    <ManualChatWidget v-model:visible="manualChatVisible" />

    <!-- 全局登录/注册弹窗 -->
    <AuthDialog
      v-model="authDialogVisible"
      :default-tab="authDefaultTab"
      @login-success="handleAuthSuccess"
      @register-success="handleRegisterSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import AIChatWidget from '@/components/AIChatWidget.vue'
import AuthDialog from '@/components/auth/AuthDialog.vue'
import ManualChatWidget from '@/components/ManualChatWidget.vue'

const authDialogVisible = ref(false)
const authDefaultTab = ref<'login' | 'register'>('login')
const manualChatVisible = ref(false)

const route = useRoute()
const userStore = useUserStore()

const handleShowAuthDialog = (tab: 'login' | 'register' = 'login') => {
  authDefaultTab.value = tab
  authDialogVisible.value = true
}

const openManualChat = () => {
  manualChatVisible.value = true
}

const handleGlobalAuthDialog = (event: Event) => {
  const detail = (event as CustomEvent<{ tab?: 'login' | 'register' }>).detail || {}
  const tab = detail.tab || 'login'
  authDefaultTab.value = tab
  authDialogVisible.value = true
}

const handleAuthSuccess = () => {
  // 登录成功后的处理在 AuthDialog 内部完成（更新用户状态、消散动画等）
  authDialogVisible.value = false
}

const handleRegisterSuccess = () => {
  // 注册成功后默认切回登录标签，由 AuthDialog 自行处理
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('openAuthDialog', handleGlobalAuthDialog as EventListener)
  }

  const showAuth = route.query.showAuth as 'login' | 'register' | undefined
  if (showAuth && !userStore.isLoggedIn) {
    authDefaultTab.value = showAuth || 'login'
    authDialogVisible.value = true
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('openAuthDialog', handleGlobalAuthDialog as EventListener)
  }
})

watch(
  () => route.query.showAuth,
  (val) => {
    const tab = (val as 'login' | 'register' | undefined) || undefined
    if (tab && !userStore.isLoggedIn) {
      authDefaultTab.value = tab
      authDialogVisible.value = true
    }
  }
)
</script>

<style scoped lang="scss">
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #fffbf5 0%, #fff8f0 25%, #fffcf9 50%, #fff8f0 75%, #fffbf5 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  transition: filter 0.25s ease, transform 0.25s ease;
}

.blurred-background {
  filter: blur(3px);
  transform: scale(0.99);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>

