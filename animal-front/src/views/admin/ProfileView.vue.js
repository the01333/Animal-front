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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("@/stores/user");
var userStore = (0, user_1.useUserStore)();
function getRoleText(role) {
    var map = {
        ADMIN: '管理员',
        MANAGER: '经理',
        USER: '用户'
    };
    return role ? map[role] || role : '-';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-profile-view" }));
var __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        shadow: "never",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
{
    var __VLS_5 = __VLS_3.slots.header;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
var __VLS_6 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
ElDescriptions;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    column: (2),
    border: true,
}));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{
        column: (2),
        border: true,
    }], __VLS_functionalComponentArgsRest(__VLS_7), false));
var __VLS_10 = __VLS_9.slots.default;
var __VLS_11 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
ElDescriptionsItem;
// @ts-ignore
var __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    label: "用户名",
}));
var __VLS_13 = __VLS_12.apply(void 0, __spreadArray([{
        label: "用户名",
    }], __VLS_functionalComponentArgsRest(__VLS_12), false));
var __VLS_15 = __VLS_14.slots.default;
((_a = __VLS_ctx.userStore.userInfo) === null || _a === void 0 ? void 0 : _a.username);
// @ts-ignore
[userStore,];
var __VLS_14;
var __VLS_16 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
ElDescriptionsItem;
// @ts-ignore
var __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "邮箱",
}));
var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{
        label: "邮箱",
    }], __VLS_functionalComponentArgsRest(__VLS_17), false));
var __VLS_20 = __VLS_19.slots.default;
((_b = __VLS_ctx.userStore.userInfo) === null || _b === void 0 ? void 0 : _b.email);
// @ts-ignore
[userStore,];
var __VLS_19;
var __VLS_21 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
ElDescriptionsItem;
// @ts-ignore
var __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    label: "角色",
}));
var __VLS_23 = __VLS_22.apply(void 0, __spreadArray([{
        label: "角色",
    }], __VLS_functionalComponentArgsRest(__VLS_22), false));
var __VLS_25 = __VLS_24.slots.default;
(__VLS_ctx.getRoleText((_c = __VLS_ctx.userStore.userInfo) === null || _c === void 0 ? void 0 : _c.role));
// @ts-ignore
[userStore, getRoleText,];
var __VLS_24;
var __VLS_26 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
ElDescriptionsItem;
// @ts-ignore
var __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    label: "手机号",
}));
var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([{
        label: "手机号",
    }], __VLS_functionalComponentArgsRest(__VLS_27), false));
var __VLS_30 = __VLS_29.slots.default;
(((_d = __VLS_ctx.userStore.userInfo) === null || _d === void 0 ? void 0 : _d.phone) || '-');
// @ts-ignore
[userStore,];
var __VLS_29;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['admin-profile-view']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
