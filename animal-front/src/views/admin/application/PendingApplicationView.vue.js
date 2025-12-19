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
var ApplicationListView_vue_1 = require("./ApplicationListView.vue");
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pending-application-view" }));
/** @type {[typeof ApplicationListView, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(ApplicationListView_vue_1.default, new ApplicationListView_vue_1.default({
    defaultStatus: "PENDING",
    lockStatusFilter: true,
}));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([{
        defaultStatus: "PENDING",
        lockStatusFilter: true,
    }], __VLS_functionalComponentArgsRest(__VLS_0), false));
/** @type {__VLS_StyleScopedClasses['pending-application-view']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
