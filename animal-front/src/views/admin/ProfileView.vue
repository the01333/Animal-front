<template>
  <div class="admin-profile-view">
    <el-card shadow="never">
      <template #header>
        <span>个人信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">{{ userStore.userInfo?.username }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userStore.userInfo?.email }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ getRoleText(userStore.userInfo?.role) }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userStore.userInfo?.phone || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

function getRoleText(role?: string) {
  const map: Record<string, string> = {
    ADMIN: '管理员',
    MANAGER: '经理',
    USER: '用户'
  }
  return role ? map[role] || role : '-'
}
</script>

<style scoped lang="scss">
.admin-profile-view {
  max-width: 800px;
}
</style>

