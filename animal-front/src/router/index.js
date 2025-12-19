"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_router_1 = require("vue-router");
var user_1 = require("@/stores/user");
var element_plus_1 = require("element-plus");
var FrontLayout_vue_1 = require("@/layouts/FrontLayout.vue");
var AdminLayout_vue_1 = require("@/layouts/AdminLayout.vue");
var tokenManager_1 = require("@/utils/tokenManager");
var tokenRefreshManager_1 = require("@/utils/tokenRefreshManager");
var authHelper_1 = require("@/utils/authHelper");
// 前台路由
var frontRoutes = [
    {
        path: '/',
        component: FrontLayout_vue_1.default,
        children: [
            {
                path: '',
                name: 'home',
                component: function () { return Promise.resolve().then(function () { return require('@/views/HomeView.vue'); }); },
                meta: { title: '首页' }
            },
            {
                path: 'about',
                name: 'about',
                component: function () { return Promise.resolve().then(function () { return require('@/views/AboutView.vue'); }); },
                meta: { title: '关于我们' }
            },
            {
                path: 'pets',
                name: 'pets',
                component: function () { return Promise.resolve().then(function () { return require('@/views/pet/PetListView.vue'); }); },
                meta: { title: '宠物列表' }
            },
            {
                path: 'pet/:id',
                name: 'pet-detail',
                component: function () { return Promise.resolve().then(function () { return require('@/views/pet/PetDetailView.vue'); }); },
                meta: { title: '宠物详情' }
            },
            {
                path: 'apply/:petId',
                name: 'apply',
                component: function () { return Promise.resolve().then(function () { return require('@/views/application/ApplyView.vue'); }); },
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
                component: function () { return Promise.resolve().then(function () { return require('@/views/application/ApplicationDetailView.vue'); }); },
                meta: { title: '申请详情', requireAuth: true }
            },
            {
                path: 'profile',
                name: 'profile',
                component: function () { return Promise.resolve().then(function () { return require('@/views/user/ProfileView.vue'); }); },
                meta: { title: '个人中心', requireAuth: true }
            },
            {
                path: 'ai-chat',
                name: 'ai-chat',
                component: function () { return Promise.resolve().then(function () { return require('@/views/chat/AIChatView.vue'); }); },
                meta: { title: 'AI客服' }
            },
            {
                path: 'guides',
                name: 'guides',
                component: function () { return Promise.resolve().then(function () { return require('@/views/content/GuideListView.vue'); }); },
                meta: { title: '领养指南' }
            },
            {
                path: 'guide/:id',
                name: 'guide-detail',
                component: function () { return Promise.resolve().then(function () { return require('@/views/content/GuideDetailView.vue'); }); },
                meta: { title: '指南详情' }
            },
            {
                path: 'stories',
                name: 'stories',
                component: function () { return Promise.resolve().then(function () { return require('@/views/content/StoryListView.vue'); }); },
                meta: { title: '领养故事' }
            },
            {
                path: 'story/:id',
                name: 'story-detail',
                component: function () { return Promise.resolve().then(function () { return require('@/views/content/StoryDetailView.vue'); }); },
                meta: { title: '故事详情' }
            },
            {
                path: 'reset-password',
                name: 'reset-password',
                component: function () { return Promise.resolve().then(function () { return require('@/views/auth/ResetPasswordView.vue'); }); },
                meta: { title: '重置密码' }
            }
        ]
    }
];
// 后台管理路由
var adminRoutes = [
    {
        path: '/admin',
        component: AdminLayout_vue_1.default,
        meta: { requireAuth: true, requireAdmin: true },
        children: [
            {
                path: '',
                redirect: '/admin/dashboard'
            },
            {
                path: 'dashboard',
                name: 'admin-dashboard',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/DashboardView.vue'); }); },
                meta: { title: '仪表盘' }
            },
            // 宠物管理
            {
                path: 'pet/list',
                name: 'admin-pet-list',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/pet/PetListView.vue'); }); },
                meta: { title: '宠物列表' }
            },
            {
                path: 'pet/add',
                name: 'admin-pet-add',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/pet/PetFormView.vue'); }); },
                meta: { title: '添加宠物' }
            },
            {
                path: 'pet/edit/:id',
                name: 'admin-pet-edit',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/pet/PetFormView.vue'); }); },
                meta: { title: '编辑宠物' }
            },
            // 申请管理
            {
                path: 'application/list',
                name: 'admin-application-list',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/application/ApplicationListView.vue'); }); },
                meta: { title: '申请列表' }
            },
            {
                path: 'application/pending',
                name: 'admin-application-pending',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/application/PendingApplicationView.vue'); }); },
                meta: { title: '待审核申请' }
            },
            // 用户管理
            {
                path: 'user/list',
                name: 'admin-user-list',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/user/UserListView.vue'); }); },
                meta: { title: '用户列表' }
            },
            {
                path: 'user/certification',
                name: 'admin-user-certification',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/user/CertificationListView.vue'); }); },
                meta: { title: '认证审核' }
            },
            // 文章管理
            {
                path: 'article/list',
                name: 'admin-article-list',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/article/ArticleListView.vue'); }); },
                meta: { title: '文章列表' }
            },
            {
                path: 'article/add',
                name: 'admin-article-add',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/article/ArticleFormView.vue'); }); },
                meta: { title: '发布文章' }
            },
            {
                path: 'article/edit/:id',
                name: 'admin-article-edit',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/article/ArticleFormView.vue'); }); },
                meta: { title: '编辑文章' }
            },
            // 客服管理
            {
                path: 'chat',
                name: 'admin-chat',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/ChatManageView.vue'); }); },
                meta: { title: '客服管理' }
            },
            // 系统设置
            {
                path: 'settings',
                name: 'admin-settings',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/SettingsView.vue'); }); },
                meta: { title: '系统设置' }
            },
            // 个人中心
            {
                path: 'profile',
                name: 'admin-profile',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/ProfileView.vue'); }); },
                meta: { title: '个人中心' }
            },
            // 修改密码
            {
                path: 'password',
                name: 'admin-password',
                component: function () { return Promise.resolve().then(function () { return require('@/views/admin/PasswordView.vue'); }); },
                meta: { title: '修改密码' }
            }
        ]
    }
];
// 独立页面路由
var standaloneRoutes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: function () { return Promise.resolve().then(function () { return require('@/views/NotFoundView.vue'); }); },
        meta: { title: '页面不存在' }
    }
];
var router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHashHistory)(import.meta.env.BASE_URL),
    routes: __spreadArray(__spreadArray(__spreadArray([], frontRoutes, true), adminRoutes, true), standaloneRoutes, true),
    scrollBehavior: function (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    }
});
// 路由守卫
router.beforeEach(function (to, from, next) {
    var userStore = (0, user_1.useUserStore)();
    if (to.meta.title) {
        document.title = "".concat(to.meta.title, " - i\u5BA0\u56ED");
    }
    if (to.meta.requireAuth && !userStore.isLoggedIn) {
        element_plus_1.ElMessage.warning('请先登录');
        (0, authHelper_1.openAuthDialog)('login');
        if (!from.name) {
            next({ name: 'home', query: { showAuth: 'login', redirect: to.fullPath } });
        }
        else {
            next(false);
        }
        return;
    }
    if (to.meta.requireAdmin && !userStore.isManager) {
        element_plus_1.ElMessage.error('您没有权限访问该页面');
        next({ name: 'home' });
        return;
    }
    next();
});
router.afterEach(function () {
    var userStore = (0, user_1.useUserStore)();
    if (userStore.isLoggedIn) {
        (0, tokenManager_1.startTokenCheck)();
        (0, tokenRefreshManager_1.startTokenRefresh)();
    }
    else {
        (0, tokenManager_1.stopTokenCheck)();
        (0, tokenRefreshManager_1.stopTokenRefresh)();
    }
});
exports.default = router;
