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
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var user_1 = require("@/stores/user");
var Navbar_vue_1 = require("@/components/layout/Navbar.vue");
var Footer_vue_1 = require("@/components/layout/Footer.vue");
var AIChatWidget_vue_1 = require("@/components/AIChatWidget.vue");
var AuthDialog_vue_1 = require("@/components/auth/AuthDialog.vue");
var ManualChatWidget_vue_1 = require("@/components/ManualChatWidget.vue");
var authDialogVisible = (0, vue_1.ref)(false);
var authDefaultTab = (0, vue_1.ref)('login');
var manualChatVisible = (0, vue_1.ref)(false);
var route = (0, vue_router_1.useRoute)();
var userStore = (0, user_1.useUserStore)();
var handleShowAuthDialog = function (tab) {
    if (tab === void 0) { tab = 'login'; }
    authDefaultTab.value = tab;
    authDialogVisible.value = true;
};
var openManualChat = function () {
    manualChatVisible.value = true;
};
var handleGlobalAuthDialog = function (event) {
    var detail = event.detail || {};
    var tab = detail.tab || 'login';
    authDefaultTab.value = tab;
    authDialogVisible.value = true;
};
var handleAuthSuccess = function () {
    // 登录成功后的处理在 AuthDialog 内部完成（更新用户状态、消散动画等）
    authDialogVisible.value = false;
};
var handleRegisterSuccess = function () {
    // 注册成功后默认切回登录标签，由 AuthDialog 自行处理
};
(0, vue_1.onMounted)(function () {
    if (typeof window !== 'undefined') {
        window.addEventListener('openAuthDialog', handleGlobalAuthDialog);
    }
    var showAuth = route.query.showAuth;
    if (showAuth && !userStore.isLoggedIn) {
        authDefaultTab.value = showAuth || 'login';
        authDialogVisible.value = true;
    }
});
(0, vue_1.onBeforeUnmount)(function () {
    if (typeof window !== 'undefined') {
        window.removeEventListener('openAuthDialog', handleGlobalAuthDialog);
    }
});
(0, vue_1.watch)(function () { return route.query.showAuth; }, function (val) {
    var tab = val || undefined;
    if (tab && !userStore.isLoggedIn) {
        authDefaultTab.value = tab;
        authDialogVisible.value = true;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "front-layout" }));
/** @type {[typeof Navbar, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(Navbar_vue_1.default, new Navbar_vue_1.default(__assign({ 'onShowAuthDialog': {} }, { 'onOpenManualChat': {} })));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onShowAuthDialog': {} }, { 'onOpenManualChat': {} })], __VLS_functionalComponentArgsRest(__VLS_0), false));
var __VLS_3;
var __VLS_4;
var __VLS_5 = ({ showAuthDialog: {} },
    { onShowAuthDialog: (__VLS_ctx.handleShowAuthDialog) });
var __VLS_6 = ({ openManualChat: {} },
    { onOpenManualChat: (__VLS_ctx.openManualChat) });
// @ts-ignore
[handleShowAuthDialog, openManualChat,];
var __VLS_2;
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)(__assign({ class: "main-content" }, { class: ({ 'blurred-background': __VLS_ctx.authDialogVisible }) }));
// @ts-ignore
[authDialogVisible,];
var __VLS_8 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    key: (__VLS_ctx.$route.fullPath),
}));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{
        key: (__VLS_ctx.$route.fullPath),
    }], __VLS_functionalComponentArgsRest(__VLS_9), false));
{
    var __VLS_12 = __VLS_11.slots.default;
    var Component = __VLS_getSlotParameters(__VLS_12)[0].Component;
    // @ts-ignore
    [$route,];
    var __VLS_13 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    Transition;
    // @ts-ignore
    var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        name: "fade",
        mode: "out-in",
    }));
    var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
            name: "fade",
            mode: "out-in",
        }], __VLS_functionalComponentArgsRest(__VLS_14), false));
    var __VLS_17 = __VLS_16.slots.default;
    var __VLS_18 = ((Component));
    // @ts-ignore
    var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        key: (__VLS_ctx.$route.fullPath),
    }));
    var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
            key: (__VLS_ctx.$route.fullPath),
        }], __VLS_functionalComponentArgsRest(__VLS_19), false));
    // @ts-ignore
    [$route,];
    var __VLS_16;
    __VLS_11.slots['' /* empty slot name completion */];
}
var __VLS_11;
/** @type {[typeof Footer, ]} */ ;
// @ts-ignore
var __VLS_23 = __VLS_asFunctionalComponent(Footer_vue_1.default, new Footer_vue_1.default({}));
var __VLS_24 = __VLS_23.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_23), false));
/** @type {[typeof AIChatWidget, ]} */ ;
// @ts-ignore
var __VLS_27 = __VLS_asFunctionalComponent(AIChatWidget_vue_1.default, new AIChatWidget_vue_1.default({}));
var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_27), false));
/** @type {[typeof ManualChatWidget, ]} */ ;
// @ts-ignore
var __VLS_31 = __VLS_asFunctionalComponent(ManualChatWidget_vue_1.default, new ManualChatWidget_vue_1.default({
    visible: (__VLS_ctx.manualChatVisible),
}));
var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([{
        visible: (__VLS_ctx.manualChatVisible),
    }], __VLS_functionalComponentArgsRest(__VLS_31), false));
// @ts-ignore
[manualChatVisible,];
/** @type {[typeof AuthDialog, ]} */ ;
// @ts-ignore
var __VLS_35 = __VLS_asFunctionalComponent(AuthDialog_vue_1.default, new AuthDialog_vue_1.default(__assign(__assign({ 'onLoginSuccess': {} }, { 'onRegisterSuccess': {} }), { modelValue: (__VLS_ctx.authDialogVisible), defaultTab: (__VLS_ctx.authDefaultTab) })));
var __VLS_36 = __VLS_35.apply(void 0, __spreadArray([__assign(__assign({ 'onLoginSuccess': {} }, { 'onRegisterSuccess': {} }), { modelValue: (__VLS_ctx.authDialogVisible), defaultTab: (__VLS_ctx.authDefaultTab) })], __VLS_functionalComponentArgsRest(__VLS_35), false));
var __VLS_38;
var __VLS_39;
var __VLS_40 = ({ loginSuccess: {} },
    { onLoginSuccess: (__VLS_ctx.handleAuthSuccess) });
var __VLS_41 = ({ registerSuccess: {} },
    { onRegisterSuccess: (__VLS_ctx.handleRegisterSuccess) });
// @ts-ignore
[authDialogVisible, authDefaultTab, handleAuthSuccess, handleRegisterSuccess,];
var __VLS_37;
/** @type {__VLS_StyleScopedClasses['front-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['blurred-background']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
