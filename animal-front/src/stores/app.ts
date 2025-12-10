import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    // 侧边栏折叠状态
    const sidebarCollapsed = ref(false)

    // 设备类型
    const device = ref<'desktop' | 'mobile'>('desktop')

    // 主题
    const theme = ref<'light' | 'dark'>('light')

    // 客服未读总数（客服端），用于后台左侧导航红点提示
    const csUnreadForAgent = ref(0)

    // 客服未读总数（用户端），用于前台人工客服入口红点提示
    const csUnreadForUser = ref(0)

    // 切换侧边栏
    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // 设置设备类型
    function setDevice(type: 'desktop' | 'mobile') {
      device.value = type
    }

    // 切换主题
    function toggleTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    // 设置客服未读总数（客服端）
    function setCsUnreadForAgent(count: number) {
      csUnreadForAgent.value = count > 0 ? count : 0
    }

    // 设置客服未读总数（用户端）
    function setCsUnreadForUser(count: number) {
      csUnreadForUser.value = count > 0 ? count : 0
    }

    return {
      sidebarCollapsed,
      device,
      theme,
      csUnreadForAgent,
      csUnreadForUser,
      toggleSidebar,
      setDevice,
      toggleTheme,
      setCsUnreadForAgent,
      setCsUnreadForUser
    }
  },
  {
    persist: true
  }
)

