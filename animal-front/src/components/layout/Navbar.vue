<template>
  <div class="navbar-wrapper">
    <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" background-color="#409EFF"
      text-color="#fff" active-text-color="#ffd04b" router>
      <div class="nav-container">
        <div class="nav-left">
          <el-menu-item index="/" class="logo-item">
            <el-icon class="logo-icon">
              <House />
            </el-icon>
            <span class="logo-text">i宠园</span>
          </el-menu-item>

          <el-menu-item index="/">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span>首页</span>
          </el-menu-item>

          <el-menu-item index="/pets">
            <el-icon>
              <Grid />
            </el-icon>
            <span>宠物列表</span>
          </el-menu-item>

          <el-menu-item index="/guides">
            <el-icon>
              <Reading />
            </el-icon>
            <span>领养指南</span>
          </el-menu-item>

          <el-menu-item index="/stories">
            <el-icon>
              <ChatLineSquare />
            </el-icon>
            <span>领养故事</span>
          </el-menu-item>

          <el-menu-item index="/ai-chat">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>AI客服</span>
          </el-menu-item>
        </div>

        <div class="nav-right">
          <template v-if="isLoggedIn">
            <el-dropdown trigger="hover" @command="handleUserCommand">
              <span class="user-entry">
                <el-avatar :size="36" :src="userAvatar">
                  <UserFilled />
                </el-avatar>
                <span class="user-name">{{ displayName }}</span>
                <el-icon class="caret-icon">
                  <ArrowDown />
                </el-icon>
              </span>
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
          </template>

          <template v-else>
            <div class="auth-btn">
              <el-button type="primary" size="small" @click="$router.push('/login')">
                <el-icon>
                  <User />
                </el-icon>
                <span>登录 / 注册</span>
              </el-button>
            </div>
          </template>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)

const activeMenu = computed(() => route.path)

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
  return avatar ? processImageUrl(avatar) : ''
})

const displayName = computed(() => {
  return userInfo.value?.username || userInfo.value?.email || '用户'
})

onMounted(() => {
  userStore.restoreFromStorage()
})

const handleUserCommand = (command: 'profile' | 'logout') => {
  if (command === 'profile') {
    router.push('/profile')
    return
  }

  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar-wrapper {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  flex: 1;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-item {
  font-size: 20px;
  font-weight: bold;
  margin-right: 30px;
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.logo-text {
  background: linear-gradient(45deg, #ffd04b, #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logout-btn,
.auth-btn {
  padding: 0 15px;
}

.auth-btn .el-button {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #42b983 0%, #35a572 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
  transition: all 0.3s ease;
}

.auth-btn .el-button:hover {
  background: linear-gradient(135deg, #35a572 0%, #2d8f61 100%) !important;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
  transform: translateY(-2px);
}

.user-entry {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  cursor: pointer;
  color: #fff;
  font-weight: 500;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caret-icon {
  font-size: 14px;
}

:deep(.el-menu-item) {
  transition: all 0.3s;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

@media (max-width: 1200px) {
  .nav-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-left,
  .nav-right {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
