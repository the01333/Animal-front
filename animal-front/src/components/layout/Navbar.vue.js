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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var pinia_1 = require("pinia");
var user_1 = require("@/stores/user");
var authHelper_1 = require("@/utils/authHelper");
var app_1 = require("@/stores/app");
var router = (0, vue_router_1.useRouter)();
var route = (0, vue_router_1.useRoute)();
var userStore = (0, user_1.useUserStore)();
var appStore = (0, app_1.useAppStore)();
var _a = (0, pinia_1.storeToRefs)(userStore), isLoggedIn = _a.isLoggedIn, userInfo = _a.userInfo;
var csUnreadForUser = (0, pinia_1.storeToRefs)(appStore).csUnreadForUser;
var emit = defineEmits();
var isProfilePage = (0, vue_1.computed)(function () { return route.path.startsWith('/profile'); });
var activeMenu = (0, vue_1.computed)(function () {
    if (isProfilePage.value) {
        return '';
    }
    var path = route.path;
    // 根据路由路径判断应该高亮哪个菜单
    if (path === '/')
        return '/';
    if (path.startsWith('/pets') || path.startsWith('/pet/') || path.startsWith('/apply/'))
        return '/pets';
    if (path.startsWith('/guides') || path.startsWith('/guide/'))
        return '/guides';
    if (path.startsWith('/stories') || path.startsWith('/story/'))
        return '/stories';
    return path;
});
// 处理图片URL（移除@前缀，处理IP地址替换）
function processImageUrl(url) {
    if (!url)
        return '';
    // 移除@前缀
    if (url.startsWith('@')) {
        url = url.substring(1);
    }
    // 将IP地址替换为localhost
    url = url.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000');
    // 如果是相对路径，添加MinIO前缀
    if (!url.startsWith('http')) {
        url = "http://localhost:9000/animal-adopt".concat(url.startsWith('/') ? '' : '/').concat(url);
    }
    return url;
}
var userAvatar = (0, vue_1.computed)(function () {
    var _a, _b;
    var avatar = (_b = (_a = userInfo.value) === null || _a === void 0 ? void 0 : _a.avatar) === null || _b === void 0 ? void 0 : _b.trim();
    return avatar ? processImageUrl(avatar) : 'http://localhost:9000/animal-adopt/default.jpg';
});
var displayName = (0, vue_1.computed)(function () {
    var _a, _b;
    return ((_a = userInfo.value) === null || _a === void 0 ? void 0 : _a.username) || ((_b = userInfo.value) === null || _b === void 0 ? void 0 : _b.email) || '用户';
});
(0, vue_1.onMounted)(function () {
    userStore.restoreFromStorage();
});
var handleUserCommand = function (command) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (command === 'profile') {
                    router.push('/profile');
                    return [2 /*return*/];
                }
                // 退出登录
                userStore.logout();
                if (!isProfilePage.value) return [3 /*break*/, 2];
                return [4 /*yield*/, router.push('/')];
            case 1:
                _a.sent();
                emitShowAuthDialog('login');
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var emitShowAuthDialog = function (tab) {
    if (tab === void 0) { tab = 'login'; }
    emit('show-auth-dialog', tab);
    (0, authHelper_1.openAuthDialog)(tab);
};
var emitOpenManualChat = function () {
    emit('open-manual-chat');
};
// 计算滑块位置（百分比）
function getSliderPosition() {
    var positions = {
        '/': 0,
        '/pets': 25,
        '/guides': 50,
        '/stories': 75
    };
    return positions[activeMenu.value] || 0;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-capsule']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['push-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['user-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['user-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['el-dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['user-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-container']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['push-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "navbar-wrapper" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "nav-container" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/');
        // @ts-ignore
        [$router,];
    } }, { class: "logo-item" }));
var __VLS_0 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "logo-icon" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "logo-icon" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
var __VLS_5 = {}.House;
/** @type {[typeof __VLS_components.House, ]} */ ;
// @ts-ignore
House;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "logo-text" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "nav-center" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "nav-capsule" }, { class: ({ 'profile-mode': __VLS_ctx.isProfilePage }) }));
// @ts-ignore
[isProfilePage,];
if (!__VLS_ctx.isProfilePage) {
    // @ts-ignore
    [isProfilePage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "nav-slider" }, { style: ({ left: "".concat(__VLS_ctx.getSliderPosition(), "%") }) }));
    // @ts-ignore
    [getSliderPosition,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/');
        // @ts-ignore
        [$router,];
    } }, { class: "nav-link-item" }), { class: ({ active: !__VLS_ctx.isProfilePage && __VLS_ctx.activeMenu === '/', 'profile-mode': __VLS_ctx.isProfilePage }) }));
// @ts-ignore
[isProfilePage, isProfilePage, activeMenu,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/pets');
        // @ts-ignore
        [$router,];
    } }, { class: "nav-link-item" }), { class: ({ active: !__VLS_ctx.isProfilePage && __VLS_ctx.activeMenu === '/pets', 'profile-mode': __VLS_ctx.isProfilePage }) }));
// @ts-ignore
[isProfilePage, isProfilePage, activeMenu,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/guides');
        // @ts-ignore
        [$router,];
    } }, { class: "nav-link-item" }), { class: ({ active: !__VLS_ctx.isProfilePage && __VLS_ctx.activeMenu === '/guides', 'profile-mode': __VLS_ctx.isProfilePage }) }));
// @ts-ignore
[isProfilePage, isProfilePage, activeMenu,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/stories');
        // @ts-ignore
        [$router,];
    } }, { class: "nav-link-item" }), { class: ({ active: !__VLS_ctx.isProfilePage && __VLS_ctx.activeMenu === '/stories', 'profile-mode': __VLS_ctx.isProfilePage }) }));
// @ts-ignore
[isProfilePage, isProfilePage, activeMenu,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "nav-right" }));
if (__VLS_ctx.isLoggedIn) {
    // @ts-ignore
    [isLoggedIn,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "nav-right-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.emitOpenManualChat) }, { class: "manual-chat-entry" }), { type: "button" }));
    // @ts-ignore
    [emitOpenManualChat,];
    if (__VLS_ctx.csUnreadForUser > 0) {
        // @ts-ignore
        [csUnreadForUser,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "manual-chat-unread-dot" }));
    }
    var __VLS_10 = {}.ElDropdown;
    /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
    // @ts-ignore
    ElDropdown;
    // @ts-ignore
    var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(__assign({ 'onCommand': {} }, { trigger: "hover" })));
    var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ 'onCommand': {} }, { trigger: "hover" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
    var __VLS_14 = void 0;
    var __VLS_15 = void 0;
    var __VLS_16 = ({ command: {} },
        { onCommand: (__VLS_ctx.handleUserCommand) });
    var __VLS_17 = __VLS_13.slots.default;
    // @ts-ignore
    [handleUserCommand,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-entry" }));
    var __VLS_18 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    ElAvatar;
    // @ts-ignore
    var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        size: (32),
        src: (__VLS_ctx.userAvatar),
    }));
    var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
            size: (32),
            src: (__VLS_ctx.userAvatar),
        }], __VLS_functionalComponentArgsRest(__VLS_19), false));
    var __VLS_22 = __VLS_21.slots.default;
    // @ts-ignore
    [userAvatar,];
    var __VLS_23 = {}.UserFilled;
    /** @type {[typeof __VLS_components.UserFilled, ]} */ ;
    // @ts-ignore
    UserFilled;
    // @ts-ignore
    var __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({}));
    var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_24), false));
    var __VLS_21;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "user-name" }));
    (__VLS_ctx.displayName);
    // @ts-ignore
    [displayName,];
    {
        var __VLS_28 = __VLS_13.slots.dropdown;
        var __VLS_29 = {}.ElDropdownMenu;
        /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
        // @ts-ignore
        ElDropdownMenu;
        // @ts-ignore
        var __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
        var __VLS_31 = __VLS_30.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_30), false));
        var __VLS_33 = __VLS_32.slots.default;
        var __VLS_34 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        ElDropdownItem;
        // @ts-ignore
        var __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
            command: "profile",
        }));
        var __VLS_36 = __VLS_35.apply(void 0, __spreadArray([{
                command: "profile",
            }], __VLS_functionalComponentArgsRest(__VLS_35), false));
        var __VLS_38 = __VLS_37.slots.default;
        var __VLS_39 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({}));
        var __VLS_41 = __VLS_40.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_40), false));
        var __VLS_43 = __VLS_42.slots.default;
        var __VLS_44 = {}.User;
        /** @type {[typeof __VLS_components.User, ]} */ ;
        // @ts-ignore
        User;
        // @ts-ignore
        var __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
        var __VLS_46 = __VLS_45.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_45), false));
        var __VLS_42;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        var __VLS_37;
        var __VLS_49 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        ElDropdownItem;
        // @ts-ignore
        var __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
            divided: true,
            command: "logout",
        }));
        var __VLS_51 = __VLS_50.apply(void 0, __spreadArray([{
                divided: true,
                command: "logout",
            }], __VLS_functionalComponentArgsRest(__VLS_50), false));
        var __VLS_53 = __VLS_52.slots.default;
        var __VLS_54 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
        var __VLS_56 = __VLS_55.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_55), false));
        var __VLS_58 = __VLS_57.slots.default;
        var __VLS_59 = {}.SwitchButton;
        /** @type {[typeof __VLS_components.SwitchButton, ]} */ ;
        // @ts-ignore
        SwitchButton;
        // @ts-ignore
        var __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({}));
        var __VLS_61 = __VLS_60.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_60), false));
        var __VLS_57;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        var __VLS_52;
        var __VLS_32;
    }
    var __VLS_13;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "auth-btn" }));
    var __VLS_64 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64(__assign({ 'onClick': {} }, { class: "login-btn" })));
    var __VLS_66 = __VLS_65.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { class: "login-btn" })], __VLS_functionalComponentArgsRest(__VLS_65), false));
    var __VLS_68 = void 0;
    var __VLS_69 = void 0;
    var __VLS_70 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.isLoggedIn))
                    return;
                __VLS_ctx.emitShowAuthDialog('login');
                // @ts-ignore
                [emitShowAuthDialog,];
            } });
    var __VLS_71 = __VLS_67.slots.default;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    var __VLS_67;
}
/** @type {__VLS_StyleScopedClasses['navbar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-container']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-item']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-center']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-capsule']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-right']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-right-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-unread-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['user-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
});
exports.default = {};
