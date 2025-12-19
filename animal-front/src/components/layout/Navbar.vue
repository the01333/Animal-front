<template>
  <div class="navbar-wrapper">
    <div class="nav-container">
      <div class="logo-item" @click="$router.push('/')">
        <el-icon class="logo-icon">
          <House />
        </el-icon>
        <span class="logo-text">i宠园</span>
      </div>

      <div class="nav-center">
        <div class="nav-capsule" :class="{ 'profile-mode': isProfilePage }">
          <div v-if="!isProfilePage" class="nav-slider" :style="{ left: `${getSliderPosition()}%` }"></div>
          <div class="nav-link-item"
            :class="{ active: !isProfilePage && activeMenu === '/', 'profile-mode': isProfilePage }"
            @click="$router.push('/')">
            首页
          </div>
          <div class="nav-link-item"
            :class="{ active: !isProfilePage && activeMenu === '/pets', 'profile-mode': isProfilePage }"
            @click="$router.push('/pets')">
            领养列表
          </div>
          <div class="nav-link-item"
            :class="{ active: !isProfilePage && activeMenu === '/guides', 'profile-mode': isProfilePage }"
            @click="$router.push('/guides')">
            领养指南
          </div>
          <div class="nav-link-item"
            :class="{ active: !isProfilePage && activeMenu === '/stories', 'profile-mode': isProfilePage }"
            @click="$router.push('/stories')">
            领养故事
          </div>
        </div>
      </div>

      <div class="nav-right">
        <template v-if="isLoggedIn">
          <div class="nav-right-actions">
            <button class="manual-chat-entry" type="button" @click="emitOpenManualChat">
              人工客服
              <span v-if="csUnreadForUser > 0" class="manual-chat-unread-dot"></span>
            </button>
            <el-dropdown trigger="hover" @command="handleUserCommand">
              <div class="user-entry">
                <el-avatar :size="32" :src="userAvatar">
                  <UserFilled />
                </el-avatar>
                <span class="user-name">{{ displayName }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon>
                      <User />
                    </el-icon>
                    <span>个人中心</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>

        <template v-else>
          <div class="auth-btn">
            <el-button class="login-btn" @click="emitShowAuthDialog('login')">
              <span>登入/注册</span>
            </el-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { openAuthDialog } from '@/utils/authHelper'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)
const { csUnreadForUser } = storeToRefs(appStore)

const emit = defineEmits<{
  (e: 'show-auth-dialog', tab?: 'login' | 'register'): void
  (e: 'open-manual-chat'): void
}>()

const isProfilePage = computed(() => route.path.startsWith('/profile'))

const activeMenu = computed(() => {
  if (isProfilePage.value) {
    return ''
  }
  const path = route.path

  // 根据路由路径判断应该高亮哪个菜单
  if (path === '/') return '/'
  if (path.startsWith('/pets') || path.startsWith('/pet/') || path.startsWith('/apply/')) return '/pets'
  if (path.startsWith('/guides') || path.startsWith('/guide/')) return '/guides'
  if (path.startsWith('/stories') || path.startsWith('/story/')) return '/stories'

  return path
})

// 处理图片URL（移除@前缀，处理IP地址替换）
function processImageUrl(url: string): string {
  if (!url) return ''

  // 移除@前缀
  if (url.startsWith('@')) {
    url = url.substring(1)
  }

  // 将IP地址替换为localhost
  url = url.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000')

  // 如果是相对路径，添加MinIO前缀
  if (!url.startsWith('http')) {
    url = `http://localhost:9000/animal-adopt${url.startsWith('/') ? '' : '/'}${url}`
  }

  return url
}

const userAvatar = computed(() => {
  const avatar = userInfo.value?.avatar?.trim()
  return avatar ? processImageUrl(avatar) : 'http://localhost:9000/animal-adopt/default.jpg'
})

const displayName = computed(() => {
  return userInfo.value?.username || userInfo.value?.email || '用户'
})

onMounted(() => {
  userStore.restoreFromStorage()
})

const handleUserCommand = async (command: 'profile' | 'logout') => {
  if (command === 'profile') {
    router.push('/profile')
    return
  }

  // 退出登录
  userStore.logout()

  // 如果在个人中心页面，重定向到首页并打开登录注册弹窗
  if (isProfilePage.value) {
    await router.push('/')
    emitShowAuthDialog('login')
  }
}

const emitShowAuthDialog = (tab: 'login' | 'register' = 'login') => {
  emit('show-auth-dialog', tab)
  openAuthDialog(tab)
}

const emitOpenManualChat = () => {
  emit('open-manual-chat')
}

// 计算滑块位置（百分比）
function getSliderPosition(): number {
  const positions: Record<string, number> = {
    '/': 0,
    '/pets': 25,
    '/guides': 50,
    '/stories': 75
  }
  return positions[activeMenu.value] || 0
}
</script>

<style scoped>
.navbar-wrapper {
  background: linear-gradient(135deg, #fffbf5 0%, #fff8f0 25%, #fffcf9 50%, #fff8f0 75%, #fffbf5 100%);
  background-size: 400% 400%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  animation: gradientShift 15s ease infinite;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  gap: 40px;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.nav-capsule {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 28px;
  padding: 0;
  gap: 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 40px;
  width: 360px;
  overflow: hidden;
}

.nav-slider {
  position: absolute;
  height: 32px;
  width: 25%;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  border-radius: 22px;
  top: 4px;
  left: 0;
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  box-shadow: 0 2px 6px rgba(255, 140, 66, 0.25);
  margin: 0 2px;
}

.nav-link-item {
  position: relative;
  z-index: 1;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  flex: 1;
  width: 25%;
}

.nav-link-item.active {
  color: white;
}

.nav-link-item:hover:not(.active) {
  color: #ff8c42;
}

.nav-capsule.profile-mode {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.logo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}

.logo-item:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: 28px;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  padding: 6px;
  border-radius: 8px;
  color: white;
}

.logo-text {
  color: #1a1a1a;
}

.nav-link {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
  font-weight: 500;
}

.nav-link:hover {
  color: #ff8c42;
}

.push-btn {
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%) !important;
  color: white !important;
  border: none !important;
  padding: 8px 20px !important;
  border-radius: 20px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s !important;
  box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3) !important;
}

.push-btn:hover {
  background: linear-gradient(135deg, #ff7a1f 0%, #ff5a1f 100%) !important;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.4) !important;
  transform: translateY(-2px) !important;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
  white-space: nowrap;
}

.nav-right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.manual-chat-entry {
  position: relative;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  background: linear-gradient(135deg, #ff9557 0%, #ff6b35 100%);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 107, 53, 0.3);
}

.manual-chat-entry:hover {
  opacity: 0.9;
}

.manual-chat-unread-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f56c6c;
}

.user-entry {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  cursor: pointer;
  color: #666;
  font-weight: 500;
  transition: all 0.3s;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.user-entry:hover {
  color: #ff8c42;
}

.user-entry:focus {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.user-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  height: 15px;
}

/* 移除头像的边框和背景 */
:deep(.el-avatar) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.el-dropdown-selfdefine:focus .el-avatar) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.user-entry .el-avatar) {
  border: none !important;
  background: transparent !important;
  outline: none !important;
}

/* 移除 dropdown 触发器的焦点样式 */
:deep(.el-dropdown-trigger:focus) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.el-dropdown-trigger:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
}

/* 移除所有可能的边框 */
:deep(.user-entry:focus-within) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.el-avatar img) {
  border: none !important;
  box-shadow: none !important;
}

.auth-btn {
  padding: 0;
}

.login-btn {
  background: #1a1a1a !important;
  color: white !important;
  border: none !important;
  padding: 8px 20px !important;
  border-radius: 6px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s !important;
}

.login-btn:hover {
  background: #333 !important;
  transform: translateY(-2px) !important;
}

@media (max-width: 1200px) {
  .nav-container {
    padding: 0 20px;
    height: auto;
    flex-wrap: wrap;
  }

  .nav-menu {
    gap: 20px;
  }

  .nav-link {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 15px;
    gap: 10px;
  }

  .nav-left {
    gap: 20px;
  }

  .nav-menu {
    gap: 15px;
  }

  .nav-link {
    font-size: 12px;
  }

  .push-btn {
    padding: 6px 16px !important;
    font-size: 12px !important;
  }

  .login-btn {
    padding: 6px 16px !important;
    font-size: 12px !important;
  }
}

/* 移除el-avatar的边框 */
:deep(.el-avatar) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

:deep(.el-avatar:hover) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

:deep(.el-avatar img) {
  border: none !important;
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
