"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var user_1 = require("@/stores/user");
var app_1 = require("@/stores/app");
var element_plus_1 = require("element-plus");
var AdminAuthDialog_vue_1 = require("@/components/auth/AdminAuthDialog.vue");
var sockjs_client_1 = require("sockjs-client");
var stompjs_1 = require("@stomp/stompjs");
var pinia_1 = require("pinia");
var customerService_1 = require("@/api/customerService");
var route = (0, vue_router_1.useRoute)();
var router = (0, vue_router_1.useRouter)();
var userStore = (0, user_1.useUserStore)();
var appStore = (0, app_1.useAppStore)();
var adminAuthVisible = (0, vue_1.ref)(false);
var token = (0, pinia_1.storeToRefs)(userStore).token;
var adminWsClient = (0, vue_1.ref)(null);
var adminWsConnected = (0, vue_1.ref)(false);
var sidebarWidth = (0, vue_1.computed)(function () { return (appStore.sidebarCollapsed ? '64px' : '200px'); });
var activeMenu = (0, vue_1.computed)(function () { return route.path; });
var isSuperAdmin = (0, vue_1.computed)(function () {
    var _a;
    var role = String(((_a = userStore.userInfo) === null || _a === void 0 ? void 0 : _a.role) || '').toLowerCase();
    return role === 'super_admin';
});
// 客服相关逻辑仅在超级管理员下生效
var isAdminRole = (0, vue_1.computed)(function () { return isSuperAdmin.value; });
var getAdminWsUrl = function () {
    var base = '/api/ws';
    if (typeof window === 'undefined')
        return base;
    return base;
};
var initAdminWs = function () {
    if (adminWsClient.value)
        return;
    var socket = new sockjs_client_1.default(getAdminWsUrl());
    var tokenValue = token.value || localStorage.getItem('token');
    var client = new stompjs_1.Client({
        webSocketFactory: function () { return socket; },
        connectHeaders: tokenValue ? { Authorization: "Bearer ".concat(tokenValue) } : {},
        reconnectDelay: 5000,
        debug: function () { }
    });
    client.onConnect = function () {
        adminWsConnected.value = true;
        client.subscribe('/user/queue/cs/unread', function (frame) {
            try {
                var payload = JSON.parse(frame.body);
                if (typeof payload.unreadForAgent === 'number') {
                    appStore.setCsUnreadForAgent(payload.unreadForAgent);
                }
            }
            catch (e) {
                console.error('解析客服未读汇总失败(后台布局)', e);
            }
        });
    };
    client.onStompError = function () {
        adminWsConnected.value = false;
    };
    client.onWebSocketClose = function () {
        adminWsConnected.value = false;
    };
    client.activate();
    adminWsClient.value = client;
};
var refreshAgentUnreadFromHttp = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, pageData, records, total, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isAdminRole.value)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, customerService_1.pageManualCsSessions)({ current: 1, size: 50 })];
            case 2:
                res = _a.sent();
                pageData = res.data;
                records = (pageData === null || pageData === void 0 ? void 0 : pageData.records) || [];
                total = records.reduce(function (sum, item) { return sum + (item.unreadForAgent || 0); }, 0);
                appStore.setCsUnreadForAgent(total);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error('加载客服未读汇总失败(后台布局)', e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.watch)(function () { return token.value; }, function (val, oldVal) {
    if (val && val !== oldVal) {
        if (adminWsClient.value) {
            adminWsClient.value.deactivate();
            adminWsClient.value = null;
            adminWsConnected.value = false;
        }
        initAdminWs();
        refreshAgentUnreadFromHttp();
    }
    if (!val && adminWsClient.value) {
        adminWsClient.value.deactivate();
        adminWsClient.value = null;
        adminWsConnected.value = false;
        appStore.setCsUnreadForAgent(0);
    }
}, { immediate: true });
// 面包屑导航
var breadcrumbs = (0, vue_1.computed)(function () {
    var matched = route.matched.filter(function (item) { return item.meta && item.meta.title; });
    var breadcrumbList = matched.map(function (item) { return ({
        path: item.path,
        title: item.meta.title
    }); });
    return breadcrumbList;
});
function processImageUrl(url) {
    if (!url)
        return '';
    var normalized = url.trim();
    if (normalized.startsWith('@')) {
        normalized = normalized.substring(1);
    }
    normalized = normalized.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000');
    if (!normalized.startsWith('http')) {
        normalized = "http://localhost:9000/animal-adopt".concat(normalized.startsWith('/') ? '' : '/').concat(normalized);
    }
    return normalized;
}
var userAvatar = (0, vue_1.computed)(function () {
    var _a;
    var avatar = ((_a = userStore.userInfo) === null || _a === void 0 ? void 0 : _a.avatar) || '';
    return avatar ? processImageUrl(avatar) : '';
});
// 上面已定义 isSuperAdmin，这里不再重复定义
var handleGlobalAuthDialog = function () {
    adminAuthVisible.value = true;
};
function handleAdminLoginSuccess() {
    userStore.getUserInfo().catch(function () { });
}
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userStore.getUserInfo()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.warn('获取用户信息失败', error_1);
                return [3 /*break*/, 3];
            case 3:
                if (typeof window !== 'undefined') {
                    window.addEventListener('openAuthDialog', handleGlobalAuthDialog);
                }
                if (userStore.userInfo) {
                    refreshAgentUnreadFromHttp();
                }
                return [2 /*return*/];
        }
    });
}); });
(0, vue_1.onBeforeUnmount)(function () {
    if (typeof window !== 'undefined') {
        window.removeEventListener('openAuthDialog', handleGlobalAuthDialog);
    }
    if (adminWsClient.value) {
        adminWsClient.value.deactivate();
        adminWsClient.value = null;
        adminWsConnected.value = false;
    }
});
// 下拉菜单命令
function handleCommand(command) {
    switch (command) {
        case 'profile':
            router.push('/admin/profile');
            break;
        case 'password':
            router.push('/admin/password');
            break;
        case 'logout':
            handleLogout();
            break;
    }
}
// 退出登录
function handleLogout() {
    element_plus_1.ElMessageBox.confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(function () {
        userStore.logout();
        router.push('/');
        element_plus_1.ElMessage.success('退出成功');
    })
        .catch(function () { });
}
// 前往前台
function goToFrontend() {
    router.push('/');
}
// 前往后台仪表盘
var goToDashboard = function () {
    router.push('/admin/dashboard');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logo-container']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-chat-unread-dot']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-layout" }));
var __VLS_0 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
ElContainer;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
var __VLS_5 = {}.ElAside;
/** @type {[typeof __VLS_components.ElAside, typeof __VLS_components.elAside, typeof __VLS_components.ElAside, typeof __VLS_components.elAside, ]} */ ;
// @ts-ignore
ElAside;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5(__assign({ width: (__VLS_ctx.sidebarWidth) }, { class: "admin-aside" })));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign({ width: (__VLS_ctx.sidebarWidth) }, { class: "admin-aside" })], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_9 = __VLS_8.slots.default;
// @ts-ignore
[sidebarWidth,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: (__VLS_ctx.goToDashboard) }, { class: "logo-container" }));
// @ts-ignore
[goToDashboard,];
__VLS_asFunctionalElement(__VLS_elements.img)(__assign({ src: "http://localhost:9000/animal-adopt/backendIcon.png", alt: "Logo" }, { class: "logo-img" }));
if (!__VLS_ctx.appStore.sidebarCollapsed) {
    // @ts-ignore
    [appStore,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "logo-text" }));
}
var __VLS_10 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
ElMenu;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    defaultActive: (__VLS_ctx.activeMenu),
    collapse: (__VLS_ctx.appStore.sidebarCollapsed),
    uniqueOpened: (true),
    backgroundColor: "#304156",
    textColor: "#bfcbd9",
    activeTextColor: "#409EFF",
    router: true,
}));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([{
        defaultActive: (__VLS_ctx.activeMenu),
        collapse: (__VLS_ctx.appStore.sidebarCollapsed),
        uniqueOpened: (true),
        backgroundColor: "#304156",
        textColor: "#bfcbd9",
        activeTextColor: "#409EFF",
        router: true,
    }], __VLS_functionalComponentArgsRest(__VLS_11), false));
var __VLS_14 = __VLS_13.slots.default;
// @ts-ignore
[appStore, activeMenu,];
var __VLS_15 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    index: "/admin/dashboard",
}));
var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
        index: "/admin/dashboard",
    }], __VLS_functionalComponentArgsRest(__VLS_16), false));
var __VLS_19 = __VLS_18.slots.default;
var __VLS_20 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_21), false));
var __VLS_24 = __VLS_23.slots.default;
var __VLS_25 = {}.DataAnalysis;
/** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
// @ts-ignore
DataAnalysis;
// @ts-ignore
var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_26), false));
var __VLS_23;
{
    var __VLS_30 = __VLS_18.slots.title;
}
var __VLS_18;
var __VLS_31 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
ElSubMenu;
// @ts-ignore
var __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    index: "pet",
}));
var __VLS_33 = __VLS_32.apply(void 0, __spreadArray([{
        index: "pet",
    }], __VLS_functionalComponentArgsRest(__VLS_32), false));
var __VLS_35 = __VLS_34.slots.default;
{
    var __VLS_36 = __VLS_34.slots.title;
    var __VLS_37 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
    var __VLS_39 = __VLS_38.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_38), false));
    var __VLS_41 = __VLS_40.slots.default;
    var __VLS_42 = {}.House;
    /** @type {[typeof __VLS_components.House, ]} */ ;
    // @ts-ignore
    House;
    // @ts-ignore
    var __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({}));
    var __VLS_44 = __VLS_43.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_43), false));
    var __VLS_40;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
var __VLS_47 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    index: "/admin/pet/list",
}));
var __VLS_49 = __VLS_48.apply(void 0, __spreadArray([{
        index: "/admin/pet/list",
    }], __VLS_functionalComponentArgsRest(__VLS_48), false));
var __VLS_51 = __VLS_50.slots.default;
var __VLS_50;
var __VLS_52 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    index: "/admin/pet/add",
}));
var __VLS_54 = __VLS_53.apply(void 0, __spreadArray([{
        index: "/admin/pet/add",
    }], __VLS_functionalComponentArgsRest(__VLS_53), false));
var __VLS_56 = __VLS_55.slots.default;
var __VLS_55;
var __VLS_34;
var __VLS_57 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
ElSubMenu;
// @ts-ignore
var __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    index: "application",
}));
var __VLS_59 = __VLS_58.apply(void 0, __spreadArray([{
        index: "application",
    }], __VLS_functionalComponentArgsRest(__VLS_58), false));
var __VLS_61 = __VLS_60.slots.default;
{
    var __VLS_62 = __VLS_60.slots.title;
    var __VLS_63 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({}));
    var __VLS_65 = __VLS_64.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_64), false));
    var __VLS_67 = __VLS_66.slots.default;
    var __VLS_68 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    Document;
    // @ts-ignore
    var __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
    var __VLS_70 = __VLS_69.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_69), false));
    var __VLS_66;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
var __VLS_73 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    index: "/admin/application/list",
}));
var __VLS_75 = __VLS_74.apply(void 0, __spreadArray([{
        index: "/admin/application/list",
    }], __VLS_functionalComponentArgsRest(__VLS_74), false));
var __VLS_77 = __VLS_76.slots.default;
var __VLS_76;
var __VLS_78 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    index: "/admin/application/pending",
}));
var __VLS_80 = __VLS_79.apply(void 0, __spreadArray([{
        index: "/admin/application/pending",
    }], __VLS_functionalComponentArgsRest(__VLS_79), false));
var __VLS_82 = __VLS_81.slots.default;
var __VLS_81;
var __VLS_60;
var __VLS_83 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
ElSubMenu;
// @ts-ignore
var __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    index: "user",
}));
var __VLS_85 = __VLS_84.apply(void 0, __spreadArray([{
        index: "user",
    }], __VLS_functionalComponentArgsRest(__VLS_84), false));
var __VLS_87 = __VLS_86.slots.default;
{
    var __VLS_88 = __VLS_86.slots.title;
    var __VLS_89 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({}));
    var __VLS_91 = __VLS_90.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_90), false));
    var __VLS_93 = __VLS_92.slots.default;
    var __VLS_94 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    User;
    // @ts-ignore
    var __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({}));
    var __VLS_96 = __VLS_95.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_95), false));
    var __VLS_92;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
if (__VLS_ctx.isSuperAdmin) {
    // @ts-ignore
    [isSuperAdmin,];
    var __VLS_99 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    ElMenuItem;
    // @ts-ignore
    var __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
        index: "/admin/user/list",
    }));
    var __VLS_101 = __VLS_100.apply(void 0, __spreadArray([{
            index: "/admin/user/list",
        }], __VLS_functionalComponentArgsRest(__VLS_100), false));
    var __VLS_103 = __VLS_102.slots.default;
    var __VLS_102;
}
var __VLS_104 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    index: "/admin/user/certification",
}));
var __VLS_106 = __VLS_105.apply(void 0, __spreadArray([{
        index: "/admin/user/certification",
    }], __VLS_functionalComponentArgsRest(__VLS_105), false));
var __VLS_108 = __VLS_107.slots.default;
var __VLS_107;
var __VLS_86;
var __VLS_109 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
ElSubMenu;
// @ts-ignore
var __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    index: "content",
}));
var __VLS_111 = __VLS_110.apply(void 0, __spreadArray([{
        index: "content",
    }], __VLS_functionalComponentArgsRest(__VLS_110), false));
var __VLS_113 = __VLS_112.slots.default;
{
    var __VLS_114 = __VLS_112.slots.title;
    var __VLS_115 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({}));
    var __VLS_117 = __VLS_116.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_116), false));
    var __VLS_119 = __VLS_118.slots.default;
    var __VLS_120 = {}.Reading;
    /** @type {[typeof __VLS_components.Reading, ]} */ ;
    // @ts-ignore
    Reading;
    // @ts-ignore
    var __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
    var __VLS_122 = __VLS_121.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_121), false));
    var __VLS_118;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
var __VLS_125 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    index: "/admin/article/list",
}));
var __VLS_127 = __VLS_126.apply(void 0, __spreadArray([{
        index: "/admin/article/list",
    }], __VLS_functionalComponentArgsRest(__VLS_126), false));
var __VLS_129 = __VLS_128.slots.default;
var __VLS_128;
var __VLS_130 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    index: "/admin/article/add",
}));
var __VLS_132 = __VLS_131.apply(void 0, __spreadArray([{
        index: "/admin/article/add",
    }], __VLS_functionalComponentArgsRest(__VLS_131), false));
var __VLS_134 = __VLS_133.slots.default;
var __VLS_133;
var __VLS_112;
if (__VLS_ctx.isSuperAdmin) {
    // @ts-ignore
    [isSuperAdmin,];
    var __VLS_135 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    ElMenuItem;
    // @ts-ignore
    var __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135(__assign({ index: "/admin/chat" }, { class: "menu-item-chat" })));
    var __VLS_137 = __VLS_136.apply(void 0, __spreadArray([__assign({ index: "/admin/chat" }, { class: "menu-item-chat" })], __VLS_functionalComponentArgsRest(__VLS_136), false));
    var __VLS_139 = __VLS_138.slots.default;
    var __VLS_140 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140(__assign({ class: "menu-chat-icon-wrapper" })));
    var __VLS_142 = __VLS_141.apply(void 0, __spreadArray([__assign({ class: "menu-chat-icon-wrapper" })], __VLS_functionalComponentArgsRest(__VLS_141), false));
    var __VLS_144 = __VLS_143.slots.default;
    var __VLS_145 = {}.ChatDotRound;
    /** @type {[typeof __VLS_components.ChatDotRound, ]} */ ;
    // @ts-ignore
    ChatDotRound;
    // @ts-ignore
    var __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({}));
    var __VLS_147 = __VLS_146.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_146), false));
    if (__VLS_ctx.appStore.csUnreadForAgent > 0) {
        // @ts-ignore
        [appStore,];
        __VLS_asFunctionalElement(__VLS_elements.span)(__assign({ class: "menu-chat-unread-dot" }));
    }
    var __VLS_143;
    {
        var __VLS_150 = __VLS_138.slots.title;
    }
    var __VLS_138;
}
var __VLS_151 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
ElMenuItem;
// @ts-ignore
var __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    index: "/admin/settings",
}));
var __VLS_153 = __VLS_152.apply(void 0, __spreadArray([{
        index: "/admin/settings",
    }], __VLS_functionalComponentArgsRest(__VLS_152), false));
var __VLS_155 = __VLS_154.slots.default;
var __VLS_156 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
var __VLS_158 = __VLS_157.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_157), false));
var __VLS_160 = __VLS_159.slots.default;
var __VLS_161 = {}.Setting;
/** @type {[typeof __VLS_components.Setting, ]} */ ;
// @ts-ignore
Setting;
// @ts-ignore
var __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({}));
var __VLS_163 = __VLS_162.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_162), false));
var __VLS_159;
{
    var __VLS_166 = __VLS_154.slots.title;
}
var __VLS_154;
var __VLS_13;
var __VLS_8;
var __VLS_167 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
ElContainer;
// @ts-ignore
var __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167(__assign({ class: "admin-main-container" })));
var __VLS_169 = __VLS_168.apply(void 0, __spreadArray([__assign({ class: "admin-main-container" })], __VLS_functionalComponentArgsRest(__VLS_168), false));
var __VLS_171 = __VLS_170.slots.default;
var __VLS_172 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
ElHeader;
// @ts-ignore
var __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172(__assign({ class: "admin-header" })));
var __VLS_174 = __VLS_173.apply(void 0, __spreadArray([__assign({ class: "admin-header" })], __VLS_functionalComponentArgsRest(__VLS_173), false));
var __VLS_176 = __VLS_175.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-left" }));
var __VLS_177 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177(__assign({ 'onClick': {} }, { class: "collapse-icon" })));
var __VLS_179 = __VLS_178.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { class: "collapse-icon" })], __VLS_functionalComponentArgsRest(__VLS_178), false));
var __VLS_181;
var __VLS_182;
var __VLS_183 = ({ click: {} },
    { onClick: (__VLS_ctx.appStore.toggleSidebar) });
var __VLS_184 = __VLS_180.slots.default;
// @ts-ignore
[appStore,];
if (__VLS_ctx.appStore.sidebarCollapsed) {
    // @ts-ignore
    [appStore,];
    var __VLS_185 = {}.Expand;
    /** @type {[typeof __VLS_components.Expand, ]} */ ;
    // @ts-ignore
    Expand;
    // @ts-ignore
    var __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({}));
    var __VLS_187 = __VLS_186.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_186), false));
}
else {
    var __VLS_190 = {}.Fold;
    /** @type {[typeof __VLS_components.Fold, ]} */ ;
    // @ts-ignore
    Fold;
    // @ts-ignore
    var __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({}));
    var __VLS_192 = __VLS_191.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_191), false));
}
var __VLS_180;
var __VLS_195 = {}.ElBreadcrumb;
/** @type {[typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, ]} */ ;
// @ts-ignore
ElBreadcrumb;
// @ts-ignore
var __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
    separator: "/",
}));
var __VLS_197 = __VLS_196.apply(void 0, __spreadArray([{
        separator: "/",
    }], __VLS_functionalComponentArgsRest(__VLS_196), false));
var __VLS_199 = __VLS_198.slots.default;
for (var _i = 0, _d = __VLS_getVForSourceType((__VLS_ctx.breadcrumbs)); _i < _d.length; _i++) {
    var _e = _d[_i], item = _e[0], index = _e[1];
    // @ts-ignore
    [breadcrumbs,];
    var __VLS_200 = {}.ElBreadcrumbItem;
    /** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
    // @ts-ignore
    ElBreadcrumbItem;
    // @ts-ignore
    var __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        key: (index),
        to: (item.path),
    }));
    var __VLS_202 = __VLS_201.apply(void 0, __spreadArray([{
            key: (index),
            to: (item.path),
        }], __VLS_functionalComponentArgsRest(__VLS_201), false));
    var __VLS_204 = __VLS_203.slots.default;
    (item.title);
    var __VLS_203;
}
var __VLS_198;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-right" }));
var __VLS_205 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205(__assign({ 'onClick': {} }, { text: true })));
var __VLS_207 = __VLS_206.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { text: true })], __VLS_functionalComponentArgsRest(__VLS_206), false));
var __VLS_209;
var __VLS_210;
var __VLS_211 = ({ click: {} },
    { onClick: (__VLS_ctx.goToFrontend) });
var __VLS_212 = __VLS_208.slots.default;
// @ts-ignore
[goToFrontend,];
var __VLS_213 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({}));
var __VLS_215 = __VLS_214.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_214), false));
var __VLS_217 = __VLS_216.slots.default;
var __VLS_218 = {}.House;
/** @type {[typeof __VLS_components.House, ]} */ ;
// @ts-ignore
House;
// @ts-ignore
var __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({}));
var __VLS_220 = __VLS_219.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_219), false));
var __VLS_216;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-right-front-home" }));
var __VLS_208;
var __VLS_223 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
ElDropdown;
// @ts-ignore
var __VLS_224 = __VLS_asFunctionalComponent(__VLS_223, new __VLS_223(__assign({ 'onCommand': {} })));
var __VLS_225 = __VLS_224.apply(void 0, __spreadArray([__assign({ 'onCommand': {} })], __VLS_functionalComponentArgsRest(__VLS_224), false));
var __VLS_227;
var __VLS_228;
var __VLS_229 = ({ command: {} },
    { onCommand: (__VLS_ctx.handleCommand) });
var __VLS_230 = __VLS_226.slots.default;
// @ts-ignore
[handleCommand,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info" }));
var __VLS_231 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
// @ts-ignore
ElAvatar;
// @ts-ignore
var __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
    size: (32),
    src: (__VLS_ctx.userAvatar),
}));
var __VLS_233 = __VLS_232.apply(void 0, __spreadArray([{
        size: (32),
        src: (__VLS_ctx.userAvatar),
    }], __VLS_functionalComponentArgsRest(__VLS_232), false));
var __VLS_235 = __VLS_234.slots.default;
// @ts-ignore
[userAvatar,];
((_b = (_a = __VLS_ctx.userStore.userInfo) === null || _a === void 0 ? void 0 : _a.username) === null || _b === void 0 ? void 0 : _b.charAt(0));
// @ts-ignore
[userStore,];
var __VLS_234;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "username" }));
((_c = __VLS_ctx.userStore.userInfo) === null || _c === void 0 ? void 0 : _c.username);
// @ts-ignore
[userStore,];
var __VLS_236 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({}));
var __VLS_238 = __VLS_237.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_237), false));
var __VLS_240 = __VLS_239.slots.default;
var __VLS_241 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
// @ts-ignore
ArrowDown;
// @ts-ignore
var __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({}));
var __VLS_243 = __VLS_242.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_242), false));
var __VLS_239;
{
    var __VLS_246 = __VLS_226.slots.dropdown;
    var __VLS_247 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    ElDropdownMenu;
    // @ts-ignore
    var __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({}));
    var __VLS_249 = __VLS_248.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_248), false));
    var __VLS_251 = __VLS_250.slots.default;
    var __VLS_252 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    ElDropdownItem;
    // @ts-ignore
    var __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        command: "profile",
    }));
    var __VLS_254 = __VLS_253.apply(void 0, __spreadArray([{
            command: "profile",
        }], __VLS_functionalComponentArgsRest(__VLS_253), false));
    var __VLS_256 = __VLS_255.slots.default;
    var __VLS_257 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({}));
    var __VLS_259 = __VLS_258.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_258), false));
    var __VLS_261 = __VLS_260.slots.default;
    var __VLS_262 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    User;
    // @ts-ignore
    var __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({}));
    var __VLS_264 = __VLS_263.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_263), false));
    var __VLS_260;
    var __VLS_255;
    var __VLS_267 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    ElDropdownItem;
    // @ts-ignore
    var __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
        command: "password",
    }));
    var __VLS_269 = __VLS_268.apply(void 0, __spreadArray([{
            command: "password",
        }], __VLS_functionalComponentArgsRest(__VLS_268), false));
    var __VLS_271 = __VLS_270.slots.default;
    var __VLS_272 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({}));
    var __VLS_274 = __VLS_273.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_273), false));
    var __VLS_276 = __VLS_275.slots.default;
    var __VLS_277 = {}.Lock;
    /** @type {[typeof __VLS_components.Lock, ]} */ ;
    // @ts-ignore
    Lock;
    // @ts-ignore
    var __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({}));
    var __VLS_279 = __VLS_278.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_278), false));
    var __VLS_275;
    var __VLS_270;
    var __VLS_282 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    ElDropdownItem;
    // @ts-ignore
    var __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
        divided: true,
        command: "logout",
    }));
    var __VLS_284 = __VLS_283.apply(void 0, __spreadArray([{
            divided: true,
            command: "logout",
        }], __VLS_functionalComponentArgsRest(__VLS_283), false));
    var __VLS_286 = __VLS_285.slots.default;
    var __VLS_287 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({}));
    var __VLS_289 = __VLS_288.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_288), false));
    var __VLS_291 = __VLS_290.slots.default;
    var __VLS_292 = {}.SwitchButton;
    /** @type {[typeof __VLS_components.SwitchButton, ]} */ ;
    // @ts-ignore
    SwitchButton;
    // @ts-ignore
    var __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({}));
    var __VLS_294 = __VLS_293.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_293), false));
    var __VLS_290;
    var __VLS_285;
    var __VLS_250;
}
var __VLS_226;
var __VLS_175;
var __VLS_297 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
ElMain;
// @ts-ignore
var __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297(__assign({ class: "admin-content" })));
var __VLS_299 = __VLS_298.apply(void 0, __spreadArray([__assign({ class: "admin-content" })], __VLS_functionalComponentArgsRest(__VLS_298), false));
var __VLS_301 = __VLS_300.slots.default;
var __VLS_302 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
var __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({}));
var __VLS_304 = __VLS_303.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_303), false));
{
    var __VLS_306 = __VLS_305.slots.default;
    var Component = __VLS_getSlotParameters(__VLS_306)[0].Component;
    var __VLS_307 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    Transition;
    // @ts-ignore
    var __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
        name: "fade-transform",
        mode: "out-in",
    }));
    var __VLS_309 = __VLS_308.apply(void 0, __spreadArray([{
            name: "fade-transform",
            mode: "out-in",
        }], __VLS_functionalComponentArgsRest(__VLS_308), false));
    var __VLS_311 = __VLS_310.slots.default;
    var __VLS_312 = ((Component));
    // @ts-ignore
    var __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({}));
    var __VLS_314 = __VLS_313.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_313), false));
    var __VLS_310;
    __VLS_305.slots['' /* empty slot name completion */];
}
var __VLS_305;
var __VLS_300;
var __VLS_317 = {}.ElFooter;
/** @type {[typeof __VLS_components.ElFooter, typeof __VLS_components.elFooter, typeof __VLS_components.ElFooter, typeof __VLS_components.elFooter, ]} */ ;
// @ts-ignore
ElFooter;
// @ts-ignore
var __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317(__assign({ class: "admin-footer" })));
var __VLS_319 = __VLS_318.apply(void 0, __spreadArray([__assign({ class: "admin-footer" })], __VLS_functionalComponentArgsRest(__VLS_318), false));
var __VLS_321 = __VLS_320.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
var __VLS_320;
/** @type {[typeof AdminAuthDialog, ]} */ ;
// @ts-ignore
var __VLS_322 = __VLS_asFunctionalComponent(AdminAuthDialog_vue_1.default, new AdminAuthDialog_vue_1.default(__assign({ 'onLoginSuccess': {} }, { modelValue: (__VLS_ctx.adminAuthVisible) })));
var __VLS_323 = __VLS_322.apply(void 0, __spreadArray([__assign({ 'onLoginSuccess': {} }, { modelValue: (__VLS_ctx.adminAuthVisible) })], __VLS_functionalComponentArgsRest(__VLS_322), false));
var __VLS_325;
var __VLS_326;
var __VLS_327 = ({ loginSuccess: {} },
    { onLoginSuccess: (__VLS_ctx.handleAdminLoginSuccess) });
// @ts-ignore
[adminAuthVisible, handleAdminLoginSuccess,];
var __VLS_324;
var __VLS_170;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['admin-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-aside']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-container']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-img']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item-chat']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-chat-icon-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-chat-unread-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-main-container']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right-front-home']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-content']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-footer']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
