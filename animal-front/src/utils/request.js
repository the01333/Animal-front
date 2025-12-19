"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var element_plus_1 = require("element-plus");
var nprogress_1 = require("nprogress");
require("nprogress/nprogress.css");
var tokenRefreshManager_1 = require("./tokenRefreshManager");
var tokenExpiredHandler_1 = require("./tokenExpiredHandler");
// NProgress 配置
nprogress_1.default.configure({ showSpinner: false });
// 创建axios实例
var service = axios_1.default.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});
// 请求拦截器
service.interceptors.request.use(function (config) {
    nprogress_1.default.start();
    // 获取token
    var token = localStorage.getItem('token');
    if (token) {
        // 从 header 中 的 Authorization 获取 token
        // 默认带 'Bearer ' 前缀
        config.headers['Authorization'] = "Bearer ".concat(token);
        // 触发Token续约（用户有操作时自动续约）
        // 这样即使用户没有显式调用续约接口，也能通过操作来续约Token
        (0, tokenRefreshManager_1.triggerRefreshOnOperation)();
    }
    return config;
}, function (error) {
    nprogress_1.default.done();
    console.error('请求错误:', error);
    return Promise.reject(error);
});
// 响应拦截器
service.interceptors.response.use(function (response) {
    nprogress_1.default.done();
    var _a = response.data, code = _a.code, message = _a.message, data = _a.data;
    console.log('🔍 响应拦截器 - 原始响应:', response.data);
    // 根据业务状态码统一处理
    if (code === 200 || code === 0) {
        // 统一返回整个 Result 对象（ApiResponse<T>）
        // 这样现有代码中的 res.code / res.data 都可以正常工作
        console.log('✅ 响应成功，返回数据:', response.data);
        return response.data;
    }
    else if (code === 401) {
        console.warn('⚠️ Token已过期或无效:', message);
        handleTokenExpired(message);
        return Promise.reject(new Error(message || '未授权'));
    }
    else {
        console.error('❌ 业务错误:', message);
        element_plus_1.ElMessage.error(message || '请求失败');
        return Promise.reject(new Error(message || '请求失败'));
    }
}, function (error) {
    nprogress_1.default.done();
    console.error('响应错误:', error);
    if (error.response) {
        var _a = error.response, status_1 = _a.status, data = _a.data;
        switch (status_1) {
            case 400:
                element_plus_1.ElMessage.error('请求参数错误');
                break;
            case 401:
                console.warn('⚠️ HTTP 401 - Token已过期或无效');
                handleTokenExpired((data === null || data === void 0 ? void 0 : data.message) || '登录信息已过期');
                break;
            case 403:
                element_plus_1.ElMessage.error('拒绝访问');
                break;
            case 404:
                element_plus_1.ElMessage.error('请求资源不存在');
                break;
            case 500:
                element_plus_1.ElMessage.error('服务器错误');
                break;
            default:
                element_plus_1.ElMessage.error('网络请求失败');
        }
    }
    else {
        element_plus_1.ElMessage.error('网络连接失败');
    }
    return Promise.reject(error);
});
/**
 * 处理Token过期
 */
function handleTokenExpired(message) {
    (0, tokenExpiredHandler_1.handleGlobalTokenExpired)(message);
}
exports.default = service;
