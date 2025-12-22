import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import FrontLayout from '@/layouts/FrontLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { startTokenCheck, stopTokenCheck } from '@/utils/tokenManager'
import { startTokenRefresh, stopTokenRefresh } from '@/utils/tokenRefreshManager'
import { openAuthDialog } from '@/utils/authHelper'

// 前台路由
const frontRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: FrontLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
        meta: { title: '关于我们' }
      },
      {
        path: 'pets',
        name: 'pets',
        component: () => import('@/views/pet/PetListView.vue'),
        meta: { title: '宠物列表' }
      },
      {
        path: 'pet/:id',
        name: 'pet-detail',
        component: () => import('@/views/pet/PetDetailView.vue'),
        meta: { title: '宠物详情' }
      },
      {
        path: 'apply/:petId',
        name: 'apply',
        component: () => import('@/views/application/ApplyView.vue'),
        meta: { title: '申请领养', requireAuth: true }
      },
      {
        path: 'applications',
        name: 'applications',
        redirect: { name: 'profile', query: { tab: 'applications' } },
        meta: { title: '我的申请', requireAuth: true }
      },
      {
        path: 'application/:id',
        name: 'application-detail',
        component: () => import('@/views/application/ApplicationDetailView.vue'),
        meta: { title: '申请详情', requireAuth: true }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/user/ProfileView.vue'),
        meta: { title: '个人中心', requireAuth: true }
      },
      {
        path: 'ai-chat',
        name: 'ai-chat',
        component: () => import('@/views/chat/AIChatView.vue'),
        meta: { title: 'AI客服' }
      },
      {
        path: 'guides',
        name: 'guides',
        component: () => import('@/views/content/GuideListView.vue'),
        meta: { title: '领养指南' }
      },
      {
        path: 'guide/:id',
        name: 'guide-detail',
        component: () => import('@/views/content/GuideDetailView.vue'),
        meta: { title: '指南详情' }
      },
      {
        path: 'stories',
        name: 'stories',
        component: () => import('@/views/content/StoryListView.vue'),
        meta: { title: '领养故事' }
      },
      {
        path: 'story/:id',
        name: 'story-detail',
        component: () => import('@/views/content/StoryDetailView.vue'),
        meta: { title: '故事详情' }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/views/auth/ResetPasswordView.vue'),
        meta: { title: '重置密码' }
      }
    ]
  }
]

// 后台管理路由
const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requireAuth: true, requireAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { title: '仪表盘' }
      },
      // 宠物管理
      {
        path: 'pet/list',
        name: 'admin-pet-list',
        component: () => import('@/views/admin/pet/PetListView.vue'),
        meta: { title: '宠物列表' }
      },
      {
        path: 'pet/add',
        name: 'admin-pet-add',
        component: () => import('@/views/admin/pet/PetFormView.vue'),
        meta: { title: '添加宠物' }
      },
      {
        path: 'pet/edit/:id',
        name: 'admin-pet-edit',
        component: () => import('@/views/admin/pet/PetFormView.vue'),
        meta: { title: '编辑宠物' }
      },
      // 申请管理
      {
        path: 'application/list',
        name: 'admin-application-list',
        component: () => import('@/views/admin/application/ApplicationListView.vue'),
        meta: { title: '申请列表' }
      },
      {
        path: 'application/pending',
        name: 'admin-application-pending',
        component: () => import('@/views/admin/application/PendingApplicationView.vue'),
        meta: { title: '待审核申请' }
      },
      // 用户管理
      {
        path: 'user/list',
        name: 'admin-user-list',
        component: () => import('@/views/admin/user/UserListView.vue'),
        meta: { title: '用户列表' }
      },
      {
        path: 'user/certification',
        name: 'admin-user-certification',
        component: () => import('@/views/admin/user/CertificationListView.vue'),
        meta: { title: '认证审核', requireSuperAdmin: true }
      },
      // 文章管理
      {
        path: 'article/list',
        name: 'admin-article-list',
        component: () => import('@/views/admin/article/ArticleListView.vue'),
        meta: { title: '文章列表' }
      },
      {
        path: 'article/add',
        name: 'admin-article-add',
        component: () => import('@/views/admin/article/ArticleFormView.vue'),
        meta: { title: '发布文章' }
      },
      {
        path: 'article/edit/:id',
        name: 'admin-article-edit',
        component: () => import('@/views/admin/article/ArticleFormView.vue'),
        meta: { title: '编辑文章' }
      },
      // 客服管理
      {
        path: 'chat',
        name: 'admin-chat',
        component: () => import('@/views/admin/ChatManageView.vue'),
        meta: { title: '客服管理' }
      },
      // 系统设置
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/views/admin/SettingsView.vue'),
        meta: { title: '系统设置', requireSuperAdmin: true }
      },
      // 个人中心
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('@/views/admin/ProfileView.vue'),
        meta: { title: '个人中心' }
      },
      // 修改密码
      {
        path: 'password',
        name: 'admin-password',
        component: () => import('@/views/admin/PasswordView.vue'),
        meta: { title: '修改密码' }
      }
    ]
  }
]

// 独立页面路由
const standaloneRoutes: RouteRecordRaw[] = [
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@/views/NoPermissionView.vue'),
    meta: { title: '无权限访问' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...frontRoutes, ...adminRoutes, ...standaloneRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.title) {
    document.title = `${to.meta.title} - i宠园`
  }

  if (to.meta.requireAuth && !userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    openAuthDialog('login')

    if (!from.name) {
      next({ name: 'home', query: { showAuth: 'login', redirect: to.fullPath } })
    } else {
      next(false)
    }
    return
  }

  const role = String(userStore.userInfo?.role || '').toLowerCase()
  const isSuperAdmin = role === 'super_admin'

  if (to.meta.requireAdmin && !userStore.isManager) {
    ElMessage.error('您没有权限访问该页面')
    next({ name: 'forbidden' })
    return
  }

  if (to.meta.requireSuperAdmin && !isSuperAdmin) {
    ElMessage.error('您没有权限访问该页面')
    next({ name: 'forbidden' })
    return
  }

  next()
})

router.afterEach(() => {
  const userStore = useUserStore()

  if (userStore.isLoggedIn) {
    startTokenCheck()
    startTokenRefresh()
  } else {
    stopTokenCheck()
    stopTokenRefresh()
  }
})

export default router
