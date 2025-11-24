<template>
  <div class="front-layout">
    <Navbar />
    <main class="main-content">
      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <!-- AI客服助手 -->
    <AIChatWidget />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import AIChatWidget from '@/components/AIChatWidget.vue'
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

