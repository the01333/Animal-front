<template>
  <div class="forbidden-page">
    <div class="forbidden-card">
      <div class="forbidden-title">无权限访问</div>
      <div class="forbidden-subtitle">抱歉，您当前的账号没有权限访问这个页面。</div>
      <div class="forbidden-tips">
        您可以返回首页继续浏览，或者使用拥有更高权限的账号重新登录。
      </div>
      <div class="forbidden-actions">
        <el-button type="primary" @click="goHome">返回首页（{{ countdown }} 秒）</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(3)
let timer: number | null = null

const goHome = () => {
  router.push({ name: 'home' })
}

onMounted(() => {
  timer = window.setInterval(() => {
    if (countdown.value <= 1) {
      countdown.value = 0
      if (timer !== null) {
        clearInterval(timer)
        timer = null
      }
      goHome()
    } else {
      countdown.value -= 1
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.forbidden-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.forbidden-card {
  max-width: 480px;
  padding: 32px 28px 28px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.forbidden-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.forbidden-subtitle {
  font-size: 14px;
  color: #606266;
  margin-bottom: 6px;
}

.forbidden-tips {
  font-size: 13px;
  color: #909399;
  margin-bottom: 20px;
}

.forbidden-actions {
  margin-top: 4px;
}
</style>
