"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTokenRefresh = startTokenRefresh;
exports.stopTokenRefresh = stopTokenRefresh;
exports.triggerRefreshOnOperation = triggerRefreshOnOperation;
exports.manualRefreshToken = manualRefreshToken;
exports.getRefreshConfig = getRefreshConfig;
exports.setRefreshInterval = setRefreshInterval;
exports.getLastRefreshTime = getLastRefreshTime;
exports.getRefreshStatus = getRefreshStatus;
var element_plus_1 = require("element-plus");
var user_1 = require("@/api/user");
var user_2 = require("@/stores/user");
/**
 * Token续约管理器
 * 类似Redisson的分布式锁续约机制
 *
 * 工作原理：
 * 1. 用户登录时启动续约定时器
 * 2. 定时器每30秒自动续约一次Token
 * 3. 用户操作时也会触发续约
 * 4. 确保用户在线时Token永不过期
 * 5. 用户离线（未点击续约）时Token会过期
 */
var refreshInterval = null;
var lastRefreshTime = 0;
var isRefreshing = false;
// 续约配置
var REFRESH_CONFIG = {
    // 定时续约间隔（毫秒）
    INTERVAL: 30 * 1000, // 30秒
    // 操作触发续约的最小间隔（毫秒）
    // 避免频繁续约
    MIN_OPERATION_INTERVAL: 5 * 1000, // 5秒
    // 续约超时时间（毫秒）
    TIMEOUT: 5000, // 5秒
};
/**
 * 启动Token续约定时器
 * 用户登录时调用此函数
 */
function startTokenRefresh() {
    // 避免重复启动
    if (refreshInterval !== null) {
        console.warn('⚠️ Token续约定时器已启动，不需要重复启动');
        return;
    }
    // 立即续约一次
    performRefresh();
    // 每30秒自动续约一次
    refreshInterval = window.setInterval(function () {
        performRefresh();
    }, REFRESH_CONFIG.INTERVAL);
    console.log('✅ Token续约定时器已启动，每30秒自动续约一次');
}
/**
 * 停止Token续约定时器
 * 用户登出时调用此函数
 */
function stopTokenRefresh() {
    if (refreshInterval !== null) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        lastRefreshTime = 0;
        console.log('⏹️ Token续约定时器已停止');
    }
}
/**
 * 执行Token续约
 * 内部函数，不应该直接调用
 */
function performRefresh() {
    return __awaiter(this, void 0, void 0, function () {
        var userStore, response, tokenTimeout, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // 避免并发续约
                    if (isRefreshing) {
                        return [2 /*return*/];
                    }
                    userStore = (0, user_2.useUserStore)();
                    // 如果没有登录，不需要续约
                    if (!userStore.isLoggedIn) {
                        return [2 /*return*/];
                    }
                    isRefreshing = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, user_1.refreshToken)()];
                case 2:
                    response = _b.sent();
                    if (response.code === 200 && response.data.success) {
                        tokenTimeout = response.data.tokenTimeout;
                        console.log("\u2705 Token\u5DF2\u7EED\u7EA6\uFF0C\u5269\u4F59\u6709\u6548\u671F: ".concat(tokenTimeout, "\u79D2"));
                        lastRefreshTime = Date.now();
                        return [2 /*return*/];
                    }
                    else {
                        console.warn('⚠️ Token续约失败:', response.message);
                        handleRefreshFailed();
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _b.sent();
                    console.warn('⚠️ Token续约请求失败:', error_1);
                    // 如果是401错误，说明Token已过期
                    if (((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                        handleTokenExpired();
                    }
                    return [3 /*break*/, 5];
                case 4:
                    isRefreshing = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * 用户操作时触发续约
 * 在请求拦截器中调用
 */
function triggerRefreshOnOperation() {
    var userStore = (0, user_2.useUserStore)();
    // 如果没有登录，不需要续约
    if (!userStore.isLoggedIn) {
        return;
    }
    // 检查距离上次续约的时间
    var timeSinceLastRefresh = Date.now() - lastRefreshTime;
    // 如果距离上次续约不足5秒，则不续约（避免频繁续约）
    if (timeSinceLastRefresh < REFRESH_CONFIG.MIN_OPERATION_INTERVAL) {
        return;
    }
    // 异步执行续约，不阻塞主流程
    performRefresh().catch(function (error) {
        console.error('操作触发的Token续约失败:', error);
    });
}
/**
 * 手动续约Token
 * 用于特殊场景，比如用户长时间未操作后重新操作
 */
function manualRefreshToken() {
    return __awaiter(this, void 0, void 0, function () {
        var userStore, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userStore = (0, user_2.useUserStore)();
                    if (!userStore.isLoggedIn) {
                        return [2 /*return*/, false];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, user_1.refreshToken)()];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.code === 200 && response.data.success];
                case 3:
                    error_2 = _a.sent();
                    console.error('手动Token续约失败:', error_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * 处理续约失败
 */
function handleRefreshFailed() {
    console.warn('⚠️ Token续约失败，可能Token已过期');
    // 尝试验证Token是否还有效
    (0, user_1.verifyToken)()
        .then(function (response) {
        if (response.code !== 200 || !response.data.valid) {
            handleTokenExpired();
        }
    })
        .catch(function () {
        handleTokenExpired();
    });
}
/**
 * 处理Token过期
 *
 * 工作原理：
 * 1. 停止续约定时器
 * 2. 清除登录信息
 * 3. 显示提示信息（不自动跳转）
 * 4. 下次用户操作时，会被重定向到登录页
 */
function handleTokenExpired() {
    var userStore = (0, user_2.useUserStore)();
    console.warn('⚠️ Token已过期，清除登录信息');
    // 停止续约定时器
    stopTokenRefresh();
    // 清除登录信息
    userStore.logout();
    // 显示提示信息（不自动跳转）
    (0, element_plus_1.ElMessage)({
        message: '登录信息已过期，请重新登录后继续操作',
        type: 'warning',
        duration: 5000
    });
    if (window.location.hash !== '#/') {
        window.location.hash = '#/';
    }
    // 不立即跳转，让用户继续查看内容
    // 下次用户尝试操作时，会被重定向到登录页
}
/**
 * 获取续约配置
 */
function getRefreshConfig() {
    return {
        interval: REFRESH_CONFIG.INTERVAL,
        minOperationInterval: REFRESH_CONFIG.MIN_OPERATION_INTERVAL,
        timeout: REFRESH_CONFIG.TIMEOUT,
    };
}
/**
 * 修改续约间隔
 * @param interval 新的续约间隔（毫秒）
 */
function setRefreshInterval(interval) {
    if (interval < 10000) {
        console.warn('⚠️ 续约间隔不能小于10秒');
        return;
    }
    REFRESH_CONFIG.INTERVAL = interval;
    // 重启定时器
    if (refreshInterval !== null) {
        stopTokenRefresh();
        startTokenRefresh();
        console.log("\u2705 Token\u7EED\u7EA6\u95F4\u9694\u5DF2\u4FEE\u6539\u4E3A".concat(interval, "\u6BEB\u79D2"));
    }
}
/**
 * 获取上次续约时间
 */
function getLastRefreshTime() {
    return lastRefreshTime;
}
/**
 * 获取续约状态
 */
function getRefreshStatus() {
    return {
        isRunning: refreshInterval !== null,
        lastRefreshTime: lastRefreshTime,
        isRefreshing: isRefreshing,
    };
}
