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
exports.startTokenCheck = startTokenCheck;
exports.stopTokenCheck = stopTokenCheck;
exports.manualCheckToken = manualCheckToken;
exports.refreshTokenActivity = refreshTokenActivity;
var element_plus_1 = require("element-plus");
var user_1 = require("@/api/user");
var user_2 = require("@/stores/user");
/**
 * Token管理器
 * 负责定期检查Token有效性，自动处理过期和刷新
 */
var tokenCheckInterval = null;
var isCheckingToken = false;
/**
 * 启动Token检查定时器
 * 每5分钟检查一次Token是否有效
 *
 * 注意：不在启动时立即检查，只在定时器触发时检查
 * 这样可以避免用户刚登录就被检查出过期的问题
 */
function startTokenCheck() {
    // 避免重复启动
    if (tokenCheckInterval !== null) {
        return;
    }
    // 不立即检查，等待5分钟后第一次检查
    // 这样给续约机制充足的时间来续约Token
    tokenCheckInterval = window.setInterval(function () {
        checkToken();
    }, 5 * 60 * 1000);
    console.log('✅ Token检查定时器已启动，每5分钟检查一次（不立即检查）');
}
/**
 * 停止Token检查定时器
 */
function stopTokenCheck() {
    if (tokenCheckInterval !== null) {
        clearInterval(tokenCheckInterval);
        tokenCheckInterval = null;
        console.log('⏹️ Token检查定时器已停止');
    }
}
/**
 * 检查Token是否有效
 *
 * 工作原理：
 * 1. 定期检查Token是否有效
 * 2. 如果Token有效，继续使用
 * 3. 如果Token无效，清除登录信息（但不跳转）
 * 4. 下次用户操作时，会被重定向到登录页
 *
 * 这样可以避免在用户操作中途突然跳转
 */
function checkToken() {
    return __awaiter(this, void 0, void 0, function () {
        var userStore, response, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // 避免并发检查
                    if (isCheckingToken) {
                        return [2 /*return*/];
                    }
                    userStore = (0, user_2.useUserStore)();
                    // 如果没有登录，不需要检查
                    if (!userStore.isLoggedIn) {
                        return [2 /*return*/];
                    }
                    isCheckingToken = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, user_1.verifyToken)()];
                case 2:
                    response = _b.sent();
                    if (response.code === 200 && response.data.valid) {
                        // Token有效，继续使用
                        console.log('✅ Token有效');
                        return [2 /*return*/];
                    }
                    else {
                        // Token无效或过期，清除登录信息
                        console.warn('⚠️ Token已过期，清除登录信息');
                        handleTokenExpired();
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _b.sent();
                    console.warn('⚠️ Token检查失败:', error_1);
                    // 如果检查失败（比如网络错误），不立即处理，等待下次检查
                    // 但如果是401错误，则清除登录信息
                    if (((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                        console.warn('⚠️ Token验证返回401，清除登录信息');
                        handleTokenExpired();
                    }
                    return [3 /*break*/, 5];
                case 4:
                    isCheckingToken = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * 处理Token过期
 *
 * 工作原理：
 * 1. 清除登录信息
 * 2. 显示提示信息（不自动跳转）
 * 3. 用户可以继续查看内容
 * 4. 下次用户尝试操作（需要登录）时，会被重定向到登录页
 *
 * 这样可以避免在用户操作中途突然跳转
 */
function handleTokenExpired() {
    var userStore = (0, user_2.useUserStore)();
    console.warn('⚠️ Token已过期，清除登录信息');
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
 * 手动检查Token（用于特殊场景）
 */
function manualCheckToken() {
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
                    return [4 /*yield*/, (0, user_1.verifyToken)()];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.code === 200 && response.data.valid];
                case 3:
                    error_2 = _a.sent();
                    console.error('Token检查失败:', error_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * 在用户操作时刷新Token活跃时间
 * Sa-Token的active-timeout会在用户有操作时自动刷新
 */
function refreshTokenActivity() {
    // Sa-Token会自动处理，我们这里只需要确保请求被发送
    // 实际上每次API请求都会刷新Token的活跃时间
    console.debug('Token活跃时间已刷新');
}
