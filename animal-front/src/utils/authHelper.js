"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAuthDialog = openAuthDialog;
exports.handleAuthError = handleAuthError;
exports.isLoggedIn = isLoggedIn;
exports.getToken = getToken;
exports.clearAuth = clearAuth;
exports.redirectToLogin = redirectToLogin;
var element_plus_1 = require("element-plus");
function openAuthDialog(tab) {
    if (tab === void 0) { tab = 'login'; }
    if (typeof window === 'undefined')
        return;
    window.dispatchEvent(new CustomEvent('openAuthDialog', {
        detail: { tab: tab }
    }));
}
function handleAuthError(status, message) {
    if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        var isExpired = (message === null || message === void 0 ? void 0 : message.includes('过期')) || (message === null || message === void 0 ? void 0 : message.includes('已过期'));
        var msg = isExpired ? '当前登录信息已过期，请重新登录' : '当前未登录，请先登录';
        openAuthDialog('login');
        (0, element_plus_1.ElMessage)({
            message: msg,
            type: 'warning',
            duration: 3000
        });
        return true;
    }
    return false;
}
/**
 * 检查用户是否已登录
 */
function isLoggedIn() {
    return !!localStorage.getItem('token');
}
/**
 * 获取当前用户 token
 */
function getToken() {
    return localStorage.getItem('token');
}
/**
 * 清除登录信息
 */
function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
/**
 * 跳转到登录页
 */
function redirectToLogin() {
    openAuthDialog('login');
}
