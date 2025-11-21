<template>
  <div class="oauth-callback">
    <el-result icon="success" title="登录处理中" sub-title="正在获取登录信息，请稍候..." />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { wechatCallback, qqCallback } from '@/api/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const provider = route.path.includes('wechat') ? 'wechat' : 'qq'
  try {
    const res = provider === 'wechat' ? await wechatCallback(code, state) : await qqCallback(code, state)
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
      ElMessage.success('登录成功')
      router.replace('/')
    } else {
      ElMessage.error(res.message || '登录失败')
      router.replace('/login')
    }
  } catch (e) {
    ElMessage.error('登录失败')
    router.replace('/login')
  }
})
</script>

<style scoped>
.oauth-callback { padding: 40px; }
</style>