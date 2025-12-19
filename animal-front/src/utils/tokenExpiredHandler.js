"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGlobalTokenExpired = handleGlobalTokenExpired;
var element_plus_1 = require("element-plus");
var authHelper_1 = require("./authHelper");
var user_1 = require("@/stores/user");
var isNotifying = false;
var resetTimer = null;
/**
 * 全局 Token 失效处理，避免重复弹 Toast，并自动唤起登录弹窗。
 */
function handleGlobalTokenExpired(message) {
    var userStore = (0, user_1.useUserStore)();
    userStore.logout();
    // 始终唤起登录弹窗，方便用户立即重新登录
    (0, authHelper_1.openAuthDialog)('login');
    if (isNotifying) {
        return;
    }
    isNotifying = true;
    (0, element_plus_1.ElMessage)({
        message: message || '登录状态已过期，请重新登录',
        type: 'warning',
        duration: 3000
    });
    if (resetTimer) {
        clearTimeout(resetTimer);
    }
    resetTimer = window.setTimeout(function () {
        isNotifying = false;
        resetTimer = null;
    }, 3000);
}
