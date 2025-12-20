<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { trackVisit } from '@/api/visit'

const userStore = useUserStore()

onMounted(async () => {
  // 从本地存储恢复用户信息
  userStore.restoreFromStorage()

  // 登录后记录当日 UV（同一用户当日只计一次，后端 Redis+DB 幂等）
  if (userStore.token) {
    try {
      await trackVisit()
    } catch (e) {
      console.warn('记录访问失败（忽略，不影响使用）', e)
    }
  }
})
</script>

<style scoped>
/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
