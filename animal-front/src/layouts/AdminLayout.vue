<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="sidebarWidth" class="admin-aside">
        <div class="logo-container" @click="goToDashboard">
          <img src="http://localhost:9000/animal-adopt/backendIcon.png" alt="Logo" class="logo-img" />
          <span v-if="!appStore.sidebarCollapsed" class="logo-text">i宠园后台</span>
        </div>
        <el-menu :default-active="activeMenu" :collapse="appStore.sidebarCollapsed" :unique-opened="true"
          background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" router>
          <el-menu-item index="/admin/dashboard">
            <el-icon>
              <DataAnalysis />
            </el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>

          <el-sub-menu index="pet">
            <template #title>
              <el-icon>
                <House />
              </el-icon>
              <span>宠物管理</span>
            </template>
            <el-menu-item index="/admin/pet/list">宠物列表</el-menu-item>
            <el-menu-item index="/admin/pet/add">添加宠物</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="application">
            <template #title>
              <el-icon>
                <Document />
              </el-icon>
              <span>申请管理</span>
            </template>
            <el-menu-item index="/admin/application/list">申请列表</el-menu-item>
            <el-menu-item index="/admin/application/pending">待审核</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="user">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item v-if="isSuperAdmin" index="/admin/user/list">用户列表</el-menu-item>
            <el-menu-item index="/admin/user/certification">认证审核</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="content">
            <template #title>
              <el-icon>
                <Reading />
              </el-icon>
              <span>内容管理</span>
            </template>
            <el-menu-item index="/admin/article/list">文章列表</el-menu-item>
            <el-menu-item index="/admin/article/add">发布文章</el-menu-item>
          </el-sub-menu>

          <el-menu-item v-if="isSuperAdmin" index="/admin/chat" class="menu-item-chat">
            <el-icon class="menu-chat-icon-wrapper">
              <ChatDotRound />
              <span v-if="appStore.csUnreadForAgent > 0" class="menu-chat-unread-dot" />
            </el-icon>
            <template #title>客服会话</template>
          </el-menu-item>

          <el-menu-item index="/admin/settings">
            <el-icon>
              <Setting />
            </el-icon>
            <template #title>系统设置</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区 -->
      <el-container class="admin-main-container">
        <!-- 顶部导航栏 -->
        <el-header class="admin-header">
          <div class="header-left">
            <el-icon class="collapse-icon" @click="appStore.toggleSidebar">
              <Expand v-if="appStore.sidebarCollapsed" />
              <Fold v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path">
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-button text @click="goToFrontend">
              <el-icon>
                <House />
              </el-icon>
              <div class="header-right-front-home">前台首页</div>
            </el-button>
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :size="32" :src="userAvatar">
                  {{ userStore.userInfo?.username?.charAt(0) }}
                </el-avatar>
                <span class="username">{{ userStore.userInfo?.username }}</span>
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon>
                      <User />
                    </el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="password">
                    <el-icon>
                      <Lock />
                    </el-icon>
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="admin-content">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>

        <!-- 页脚 -->
        <el-footer class="admin-footer">
          <div>Copyright © 2025 i宠园 - 宠物领养管理系统</div>
        </el-footer>

        <AdminAuthDialog v-model="adminAuthVisible" @login-success="handleAdminLoginSuccess" />
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminAuthDialog from '@/components/auth/AdminAuthDialog.vue'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { storeToRefs } from 'pinia'
import { pageManualCsSessions, type CsSession } from '@/api/customerService'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const adminAuthVisible = ref(false)
const { token } = storeToRefs(userStore)

const adminWsClient = ref<Client | null>(null)
const adminWsConnected = ref(false)

const sidebarWidth = computed(() => (appStore.sidebarCollapsed ? '64px' : '200px'))
const activeMenu = computed(() => route.path)

const isSuperAdmin = computed(() => {
  const role = String(userStore.userInfo?.role || '').toLowerCase()
  return role === 'super_admin'
})

// 客服相关逻辑仅在超级管理员下生效
const isAdminRole = computed(() => isSuperAdmin.value)

const getAdminWsUrl = () => {
  const base = '/api/ws'
  if (typeof window === 'undefined') return base
  return base
}

const initAdminWs = () => {
  if (adminWsClient.value) return
  const socket = new SockJS(getAdminWsUrl())
  const tokenValue = token.value || localStorage.getItem('token')
  const client = new Client({
    webSocketFactory: () => socket as any,
    connectHeaders: tokenValue ? { Authorization: `Bearer ${tokenValue}` } : {},
    reconnectDelay: 5000,
    debug: () => { }
  })

  client.onConnect = () => {
    adminWsConnected.value = true
    client.subscribe('/user/queue/cs/unread', (frame: any) => {
      try {
        const payload = JSON.parse(frame.body) as { unreadForUser?: number; unreadForAgent?: number }
        if (typeof payload.unreadForAgent === 'number') {
          appStore.setCsUnreadForAgent(payload.unreadForAgent)
        }
      } catch (e) {
        console.error('解析客服未读汇总失败(后台布局)', e)
      }
    })
  }

  client.onStompError = () => {
    adminWsConnected.value = false
  }

  client.onWebSocketClose = () => {
    adminWsConnected.value = false
  }

  client.activate()
  adminWsClient.value = client
}

const refreshAgentUnreadFromHttp = async () => {
  if (!isAdminRole.value) return
  try {
    const res = await pageManualCsSessions({ current: 1, size: 50 })
    const pageData = res.data
    const records: CsSession[] = pageData?.records || []
    const total = records.reduce((sum, item) => sum + (item.unreadForAgent || 0), 0)
    appStore.setCsUnreadForAgent(total)
  } catch (e) {
    console.error('加载客服未读汇总失败(后台布局)', e)
  }
}

watch(
  () => token.value,
  (val, oldVal) => {
    if (val && val !== oldVal) {
      if (adminWsClient.value) {
        adminWsClient.value.deactivate()
        adminWsClient.value = null
        adminWsConnected.value = false
      }
      initAdminWs()
      refreshAgentUnreadFromHttp()
    }

    if (!val && adminWsClient.value) {
      adminWsClient.value.deactivate()
      adminWsClient.value = null
      adminWsConnected.value = false
      appStore.setCsUnreadForAgent(0)
    }
  },
  { immediate: true }
)

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta && item.meta.title)
  const breadcrumbList = matched.map((item) => ({
    path: item.path,
    title: item.meta.title as string
  }))
  return breadcrumbList
})

function processImageUrl(url?: string | null) {
  if (!url) return ''
  let normalized = url.trim()

  if (normalized.startsWith('@')) {
    normalized = normalized.substring(1)
  }

  normalized = normalized.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000')

  if (!normalized.startsWith('http')) {
    normalized = `http://localhost:9000/animal-adopt${normalized.startsWith('/') ? '' : '/'}${normalized}`
  }

  return normalized
}

const userAvatar = computed(() => {
  const avatar = userStore.userInfo?.avatar || ''
  return avatar ? processImageUrl(avatar) : ''
})

// 上面已定义 isSuperAdmin，这里不再重复定义

const handleGlobalAuthDialog = () => {
  adminAuthVisible.value = true
}

function handleAdminLoginSuccess() {
  userStore.getUserInfo().catch(() => { })
}

onMounted(async () => {
  try {
    await userStore.getUserInfo()
  } catch (error) {
    console.warn('获取用户信息失败', error)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('openAuthDialog', handleGlobalAuthDialog as EventListener)
  }

  if (userStore.userInfo) {
    refreshAgentUnreadFromHttp()
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('openAuthDialog', handleGlobalAuthDialog as EventListener)
  }
  if (adminWsClient.value) {
    adminWsClient.value.deactivate()
    adminWsClient.value = null
    adminWsConnected.value = false
  }
})

// 下拉菜单命令
function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/admin/profile')
      break
    case 'password':
      router.push('/admin/password')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore.logout()
      router.push('/')
      ElMessage.success('退出成功')
    })
    .catch(() => { })
}

// 前往前台
function goToFrontend() {
  router.push('/')
}

// 前往后台仪表盘
const goToDashboard = () => {
  router.push('/admin/dashboard')
}
</script>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.el-container {
  height: 100%;
}

.admin-aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    background-color: #2b3a4b;
    overflow: hidden;

    .logo-img {
      width: 32px;
      height: 32px;
    }

    .logo-text {
      margin-left: 10px;
      margin-right: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      white-space: nowrap;
    }
  }

  .logo-container:hover {
    cursor: pointer;
  }

  .el-menu {
    border-right: none;
  }

  .menu-item-chat {
    position: relative;
  }

  .menu-chat-icon-wrapper {
    position: relative;
  }

  .menu-chat-unread-dot {
    position: absolute;
    top: -5px;
    right: -146px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #f56c6c;
  }

  .el-menu--collapse {
    .menu-chat-unread-dot {
      right: -2px;
    }
  }
}

.admin-main-container {
  background: #f0f2f5;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .collapse-icon {
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #409eff;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      .username {
        font-size: 14px;
        color: #303133;
      }
    }

    .header-right-front-home {
      margin-left: 5px;
      margin-top: 2px;
    }
  }
}

.admin-content {
  padding: 20px;
  overflow-y: auto;

  :deep(.search-form) {
    margin-bottom: 16px;
  }

  :deep(.toolbar) {
    margin-bottom: 12px;
    display: flex;
    gap: 10px;
  }

  :deep(.el-card) {
    border-radius: 12px;
  }

  :deep(.el-table__header-wrapper) {
    background: #fafafa;
  }

  :deep(.pagination) {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

.admin-footer {
  height: 48px !important;
  line-height: 48px;
  text-align: center;
  background: #fff;
  border-top: 1px solid #e6e6e6;
  font-size: 14px;
  color: #606266;
}

// 过渡动画
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
