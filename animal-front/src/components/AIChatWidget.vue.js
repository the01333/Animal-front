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
var element_plus_1 = require("element-plus");
var icons_vue_1 = require("@element-plus/icons-vue");
var ai_1 = require("@/api/ai");
var user_1 = require("@/stores/user");
var pinia_1 = require("pinia");
var authHelper_1 = require("@/utils/authHelper");
var isExpanded = (0, vue_1.ref)(false);
var messages = (0, vue_1.ref)([]);
var userInput = (0, vue_1.ref)('');
var isLoading = (0, vue_1.ref)(false);
var messagesContainer = (0, vue_1.ref)();
var unreadCount = (0, vue_1.ref)(0);
var sessionId = (0, vue_1.ref)('');
// 获取用户登录状态
var userStore = (0, user_1.useUserStore)();
var isLoggedIn = (0, pinia_1.storeToRefs)(userStore).isLoggedIn;
// localStorage 键名
var SESSION_ID_KEY = 'ai_chat_session_id';
var MESSAGES_KEY = 'ai_chat_messages';
// 切换聊天窗口
var toggleChat = function () {
    isExpanded.value = !isExpanded.value;
    if (isExpanded.value) {
        unreadCount.value = 0;
        // 如果是第一次打开，添加欢迎消息
        if (messages.value.length === 0) {
            messages.value.push({
                role: 'assistant',
                content: (0, ai_1.getWelcomeMessage)(),
                timestamp: Date.now()
            });
        }
        (0, vue_1.nextTick)(function () {
            scrollToBottom();
        });
    }
};
// 发送消息
var sendMessage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var token, content, aiMessageIndex_1, fullContent_1, newSessionId, token_1, headers, response, result, saveError_1, error_1;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!userInput.value.trim() || isLoading.value)
                    return [2 /*return*/];
                token = localStorage.getItem('token');
                if (!token) {
                    (0, element_plus_1.ElMessage)({
                        message: '当前未登录，请先登录',
                        type: 'warning',
                        duration: 3000
                    });
                    (0, authHelper_1.openAuthDialog)('login');
                    return [2 /*return*/];
                }
                content = userInput.value.trim();
                // 添加用户消息
                messages.value.push({
                    role: 'user',
                    content: content,
                    timestamp: Date.now()
                });
                userInput.value = '';
                isLoading.value = true;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 11, 12, 14]);
                // 滚动到底部
                return [4 /*yield*/, (0, vue_1.nextTick)()];
            case 2:
                // 滚动到底部
                _f.sent();
                scrollToBottom();
                aiMessageIndex_1 = messages.value.length;
                messages.value.push({
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now()
                });
                // 调用流式AI服务（使用会话记忆）
                console.log('📤 发送消息:', content);
                console.log('📋 当前会话ID:', sessionId.value);
                fullContent_1 = '';
                return [4 /*yield*/, (0, ai_1.chatWithAIMemoryStream)(content, sessionId.value, function (chunk) {
                        fullContent_1 += chunk;
                        // 更新AI消息内容
                        if (messages.value[aiMessageIndex_1]) {
                            messages.value[aiMessageIndex_1].content = fullContent_1;
                        }
                        // 滚动到底部
                        scrollToBottom();
                    })
                    // 更新会话ID（后端可能创建了新会话）
                ];
            case 3:
                newSessionId = _f.sent();
                // 更新会话ID（后端可能创建了新会话）
                if (newSessionId && newSessionId !== sessionId.value) {
                    console.log('✅ 更新会话ID:', sessionId.value, '->', newSessionId);
                    sessionId.value = newSessionId;
                }
                // 保存会话到 localStorage
                saveSession();
                console.log('💾 会话已保存到 localStorage, sessionId:', sessionId.value);
                console.log('✅ 流式对话完成:', fullContent_1);
                console.log('📋 会话ID:', sessionId.value);
                console.log('📝 完整内容长度:', fullContent_1.length);
                if (!(sessionId.value && fullContent_1.trim())) return [3 /*break*/, 9];
                _f.label = 4;
            case 4:
                _f.trys.push([4, 7, , 8]);
                console.log('🔄 开始保存AI回复...');
                token_1 = localStorage.getItem('token');
                headers = {
                    'Content-Type': 'application/json'
                };
                if (token_1) {
                    headers['Authorization'] = "Bearer ".concat(token_1);
                }
                return [4 /*yield*/, fetch('/api/ai/service/save-message', {
                        method: 'POST',
                        headers: headers,
                        credentials: 'include',
                        body: JSON.stringify({
                            sessionId: sessionId.value,
                            role: 'assistant',
                            content: fullContent_1
                        })
                    })];
            case 5:
                response = _f.sent();
                return [4 /*yield*/, response.json()];
            case 6:
                result = _f.sent();
                if (result.code === 200) {
                    console.log('💾 AI回复已保存到 Cassandra');
                }
                else {
                    console.warn('⚠️ 保存AI回复失败:', result.message);
                }
                return [3 /*break*/, 8];
            case 7:
                saveError_1 = _f.sent();
                console.error('❌ 保存AI回复错误:', saveError_1);
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 10];
            case 9:
                console.warn('⚠️ 跳过保存: sessionId=', sessionId.value, ', fullContent.length=', fullContent_1.length);
                _f.label = 10;
            case 10: return [3 /*break*/, 14];
            case 11:
                error_1 = _f.sent();
                console.error('❌ AI服务错误:', error_1);
                // 移除不完整的AI消息
                if (((_a = messages.value[messages.value.length - 1]) === null || _a === void 0 ? void 0 : _a.role) === 'assistant') {
                    messages.value.pop();
                }
                // 处理登录过期错误
                if ((_b = error_1.message) === null || _b === void 0 ? void 0 : _b.includes('登录信息已过期')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    (0, element_plus_1.ElMessage)({
                        message: '当前登录信息已过期，请重新登录',
                        type: 'warning',
                        duration: 3000
                    });
                    (0, authHelper_1.openAuthDialog)('login');
                }
                // 处理未登录错误
                else if ((_c = error_1.message) === null || _c === void 0 ? void 0 : _c.includes('未登录')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    (0, element_plus_1.ElMessage)({
                        message: '当前未登录，请先登录',
                        type: 'warning',
                        duration: 3000
                    });
                    (0, authHelper_1.openAuthDialog)('login');
                }
                // 处理限流错误
                else if (((_d = error_1.message) === null || _d === void 0 ? void 0 : _d.includes('429')) || ((_e = error_1.message) === null || _e === void 0 ? void 0 : _e.includes('过于频繁'))) {
                    element_plus_1.ElMessage.warning('请求过于频繁，请稍后再试');
                }
                else {
                    element_plus_1.ElMessage.error('服务暂时不可用，请稍后重试');
                }
                return [3 /*break*/, 14];
            case 12:
                isLoading.value = false;
                return [4 /*yield*/, (0, vue_1.nextTick)()];
            case 13:
                _f.sent();
                scrollToBottom();
                return [7 /*endfinally*/];
            case 14: return [2 /*return*/];
        }
    });
}); };
// 滚动到底部
var scrollToBottom = function () {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};
// 格式化消息（支持换行和基本格式）
var formatMessage = function (content) {
    var result = content;
    // 先处理现有的换行符
    result = result.replace(/\n/g, '<br/>');
    // 处理特殊符号和格式
    result = result.replace(/【(.*?)】/g, '<strong style="color: #ff8c42;">【$1】</strong>');
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/✓/g, '<span style="color: #42b983;">✓</span>');
    return result;
};
// 格式化时间
var formatTime = function (timestamp) {
    if (!timestamp)
        return '';
    var date = new Date(timestamp);
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return "".concat(hours, ":").concat(minutes);
};
// 保存会话到 localStorage
var saveSession = function () {
    if (sessionId.value) {
        localStorage.setItem(SESSION_ID_KEY, sessionId.value);
    }
    if (messages.value.length > 0) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.value));
    }
};
// 从 localStorage 恢复会话
var restoreSession = function () { return __awaiter(void 0, void 0, void 0, function () {
    var savedSessionId, token, headers, response, result, e_1, savedMessages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                savedSessionId = localStorage.getItem(SESSION_ID_KEY);
                if (!savedSessionId) return [3 /*break*/, 5];
                sessionId.value = savedSessionId;
                console.log('✅ 恢复会话ID:', sessionId.value);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                token = localStorage.getItem('token');
                headers = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = "Bearer ".concat(token);
                }
                return [4 /*yield*/, fetch("/api/ai/service/session/".concat(savedSessionId, "/messages"), {
                        method: 'GET',
                        headers: headers,
                        credentials: 'include'
                    })];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                result = _a.sent();
                console.log('📥 后端返回的原始数据:', result.data);
                if (result.code === 200 && result.data) {
                    // 将后端返回的消息转换为前端格式
                    messages.value = result.data.map(function (msg) {
                        // 处理时间戳：后端返回的是格式化字符串如 "2025-11-23 17:40:00"
                        var timestamp = Date.now();
                        if (msg.timestamp) {
                            // 如果是字符串格式的时间戳，需要转换
                            if (typeof msg.timestamp === 'string') {
                                timestamp = new Date(msg.timestamp).getTime();
                            }
                            else if (typeof msg.timestamp === 'number') {
                                // 如果已经是毫秒级时间戳
                                timestamp = msg.timestamp > 10000000000 ? msg.timestamp : msg.timestamp * 1000;
                            }
                        }
                        // 处理内容：后端可能返回了双重转义的JSON字符串
                        var content = msg.content;
                        if (typeof content === 'string' && content.startsWith('"') && content.endsWith('"')) {
                            try {
                                // 尝试解析JSON字符串，恢复原始内容
                                content = JSON.parse(content);
                            }
                            catch (e) {
                                // 如果解析失败，保持原样
                                console.warn('⚠️ 内容解析失败，使用原始内容');
                            }
                        }
                        return {
                            role: msg.role,
                            content: content,
                            timestamp: timestamp
                        };
                    });
                    console.log('✅ 从后端恢复聊天记录:', messages.value.length, '条消息');
                    // 同时保存到 localStorage
                    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.value));
                }
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.error('❌ 从后端恢复聊天记录失败:', e_1);
                savedMessages = localStorage.getItem(MESSAGES_KEY);
                if (savedMessages) {
                    try {
                        messages.value = JSON.parse(savedMessages);
                        console.log('✅ 从本地存储恢复聊天记录:', messages.value.length, '条消息');
                    }
                    catch (parseError) {
                        console.error('❌ 恢复本地聊天记录失败:', parseError);
                    }
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 清空会话（登出时调用，真正删除后端数据）
var clearSession = function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentSessionId, token, headers, response, result, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentSessionId = sessionId.value;
                // 清空前端数据
                sessionId.value = '';
                messages.value = [];
                localStorage.removeItem(SESSION_ID_KEY);
                localStorage.removeItem(MESSAGES_KEY);
                if (!currentSessionId) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                token = localStorage.getItem('token');
                headers = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = "Bearer ".concat(token);
                }
                return [4 /*yield*/, fetch("/api/ai/service/session/".concat(currentSessionId), {
                        method: 'DELETE',
                        headers: headers,
                        credentials: 'include'
                    })];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                result = _a.sent();
                if (result.code === 200) {
                    console.log('🗑️ 会话已从后端删除');
                }
                else {
                    console.warn('⚠️ 后端删除会话失败:', result.message);
                }
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                console.error('❌ 删除后端会话失败:', e_2);
                return [3 /*break*/, 5];
            case 5:
                console.log('🗑️ 会话已清空');
                return [2 /*return*/];
        }
    });
}); };
// 监听登出事件
(0, vue_1.watch)(function () { return isLoggedIn.value; }, function (newVal) {
    if (!newVal) {
        // 用户已登出，清空会话
        clearSession();
    }
});
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLoggedIn.value) return [3 /*break*/, 2];
                return [4 /*yield*/, restoreSession()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                // 如果没有消息，添加欢迎消息
                if (messages.value.length === 0) {
                    messages.value.push({
                        role: 'assistant',
                        content: (0, ai_1.getWelcomeMessage)(),
                        timestamp: Date.now()
                    });
                }
                // 监听来自首页的打开事件
                window.addEventListener('openAIChat', function () {
                    isExpanded.value = true;
                    (0, vue_1.nextTick)(function () {
                        scrollToBottom();
                    });
                });
                return [2 /*return*/];
        }
    });
}); });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['floating-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['floating-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-container']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-container']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-container']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-container']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-text']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['message-text']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
var __VLS_0 = {}.Teleport;
/** @type {[typeof __VLS_components.Teleport, typeof __VLS_components.Teleport, ]} */ ;
// @ts-ignore
Teleport;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "body",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        to: "body",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "ai-chat-widget" }, { class: ({ expanded: __VLS_ctx.isExpanded }) }));
// @ts-ignore
[isExpanded,];
if (__VLS_ctx.isExpanded) {
    // @ts-ignore
    [isExpanded,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-container" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-header" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-content" }));
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "header-icon" }, { viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M891.41 346.29c-46.89-161.32-193.96-272.8-363.47-272.8-166.19 0-312.34 108.65-361.42 265.97-56.86 2.45-102.24 49.18-102.24 106.64v141.34c0 59.03 47.85 106.88 106.88 106.88h35.32c33.43 0 60.53-27.1 60.53-60.53V399.76c0-29.46-21.07-53.96-48.96-59.36 46.65-129.34 170.24-217.45 309.88-217.45 139.96 0 262.38 87.4 309.3 216.28h-19.08c-33.43 0-60.53 27.1-60.53 60.53v234.03c0 29.93 21.78 54.63 50.32 59.5-53.12 85.52-143.18 142.53-243.25 153.88-10.82-27.59-37.53-47.2-68.96-47.2-40.99 0-74.21 33.23-74.21 74.21 0 40.99 33.22 74.21 74.21 74.21 33.07 0 60.76-21.78 70.34-51.66 126.45-12.93 239.52-89.27 298.36-202.97 53.88-5.49 95.91-51 95.91-106.32V446.11c0.01-45.65-28.66-84.51-68.93-99.82z m-673.84 287.5c0 6.11-4.97 11.08-11.08 11.08h-35.32c-31.67 0-57.43-25.76-57.43-57.43V446.11c0-31.67 25.76-57.43 57.43-57.43h35.32c6.11 0 11.08 4.97 11.08 11.08v234.03z m278.17 265.15c-13.65 0-24.76-11.11-24.76-24.76s11.11-24.76 24.76-24.76c13.65 0 24.76 11.11 24.76 24.76s-11.11 24.76-24.76 24.76z m415.16-311.5c0 31.67-25.76 57.43-57.42 57.43h-35.32c-6.11 0-11.08-4.97-11.08-11.08V399.76c0-6.11 4.97-11.08 11.08-11.08h35.32c31.66 0 57.42 25.76 57.42 57.43v141.33z",
        fill: "#ffffff",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M669.84 570.03l-47.55-13.55c-12.88 45.18-54.73 76.74-101.77 76.74-46.52 0-88.24-31.12-101.44-75.66l-47.42 14.07c19.38 65.37 80.6 111.04 148.87 111.04 69-0.01 130.41-46.32 149.31-112.64z",
        fill: "#ffffff",
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "header-title" }));
    var __VLS_5 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5(__assign(__assign({ 'onClick': {} }, { link: true, icon: (__VLS_ctx.Close) }), { class: "close-btn" })));
    var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { link: true, icon: (__VLS_ctx.Close) }), { class: "close-btn" })], __VLS_functionalComponentArgsRest(__VLS_6), false));
    var __VLS_9 = void 0;
    var __VLS_10 = void 0;
    var __VLS_11 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleChat) });
    // @ts-ignore
    [icons_vue_1.Close, toggleChat,];
    var __VLS_8;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "messages-container" }, { ref: "messagesContainer" }));
    /** @type {typeof __VLS_ctx.messagesContainer} */ ;
    // @ts-ignore
    [messagesContainer,];
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.messages)); _i < _a.length; _i++) {
        var _b = _a[_i], msg = _b[0], index = _b[1];
        // @ts-ignore
        [messages,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (index) }, { class: (['message', msg.role]) }));
        if (msg.role === 'assistant') {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-avatar" }));
            __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "ai-avatar-icon" }, { viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24" }));
            __VLS_asFunctionalElement(__VLS_elements.path)({
                d: "M891.41 346.29c-46.89-161.32-193.96-272.8-363.47-272.8-166.19 0-312.34 108.65-361.42 265.97-56.86 2.45-102.24 49.18-102.24 106.64v141.34c0 59.03 47.85 106.88 106.88 106.88h35.32c33.43 0 60.53-27.1 60.53-60.53V399.76c0-29.46-21.07-53.96-48.96-59.36 46.65-129.34 170.24-217.45 309.88-217.45 139.96 0 262.38 87.4 309.3 216.28h-19.08c-33.43 0-60.53 27.1-60.53 60.53v234.03c0 29.93 21.78 54.63 50.32 59.5-53.12 85.52-143.18 142.53-243.25 153.88-10.82-27.59-37.53-47.2-68.96-47.2-40.99 0-74.21 33.23-74.21 74.21 0 40.99 33.22 74.21 74.21 74.21 33.07 0 60.76-21.78 70.34-51.66 126.45-12.93 239.52-89.27 298.36-202.97 53.88-5.49 95.91-51 95.91-106.32V446.11c0.01-45.65-28.66-84.51-68.93-99.82z m-673.84 287.5c0 6.11-4.97 11.08-11.08 11.08h-35.32c-31.67 0-57.43-25.76-57.43-57.43V446.11c0-31.67 25.76-57.43 57.43-57.43h35.32c6.11 0 11.08 4.97 11.08 11.08v234.03z m278.17 265.15c-13.65 0-24.76-11.11-24.76-24.76s11.11-24.76 24.76-24.76c13.65 0 24.76 11.11 24.76 24.76s-11.11 24.76-24.76 24.76z m415.16-311.5c0 31.67-25.76 57.43-57.42 57.43h-35.32c-6.11 0-11.08-4.97-11.08-11.08V399.76c0-6.11 4.97-11.08 11.08-11.08h35.32c31.66 0 57.42 25.76 57.42 57.43v141.33z",
                fill: "#efb336",
            });
            __VLS_asFunctionalElement(__VLS_elements.path)({
                d: "M669.84 570.03l-47.55-13.55c-12.88 45.18-54.73 76.74-101.77 76.74-46.52 0-88.24-31.12-101.44-75.66l-47.42 14.07c19.38 65.37 80.6 111.04 148.87 111.04 69-0.01 130.41-46.32 149.31-112.64z",
                fill: "#efb336",
            });
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-content" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-text" }));
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.formatMessage(msg.content)) }), null, null);
        // @ts-ignore
        [formatMessage,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-time" }));
        (__VLS_ctx.formatTime(msg.timestamp));
        // @ts-ignore
        [formatTime,];
        if (__VLS_ctx.isLoading && msg.role === 'assistant' && index === __VLS_ctx.messages.length - 1) {
            // @ts-ignore
            [messages, isLoading,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "typing-cursor" }));
        }
        if (msg.role === 'user') {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-avatar user" }));
            var __VLS_13 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            ElIcon;
            // @ts-ignore
            var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
            var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_14), false));
            var __VLS_17 = __VLS_16.slots.default;
            var __VLS_18 = {}.User;
            /** @type {[typeof __VLS_components.User, ]} */ ;
            // @ts-ignore
            icons_vue_1.User;
            // @ts-ignore
            var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({}));
            var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_19), false));
            var __VLS_16;
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-input-area" }));
    var __VLS_23 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23(__assign(__assign(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.userInput), type: "textarea", rows: (3), placeholder: "输入您的问题..." }), { class: "chat-input" }), { disabled: (__VLS_ctx.isLoading) })));
    var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.userInput), type: "textarea", rows: (3), placeholder: "输入您的问题..." }), { class: "chat-input" }), { disabled: (__VLS_ctx.isLoading) })], __VLS_functionalComponentArgsRest(__VLS_24), false));
    var __VLS_27 = void 0;
    var __VLS_28 = void 0;
    var __VLS_29 = ({ keyup: {} },
        { onKeyup: (__VLS_ctx.sendMessage) });
    // @ts-ignore
    [isLoading, userInput, sendMessage,];
    var __VLS_26;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "input-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "hint" }));
    var __VLS_31 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.isLoading), disabled: (!__VLS_ctx.userInput.trim() || __VLS_ctx.isLoading) })));
    var __VLS_33 = __VLS_32.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.isLoading), disabled: (!__VLS_ctx.userInput.trim() || __VLS_ctx.isLoading) })], __VLS_functionalComponentArgsRest(__VLS_32), false));
    var __VLS_35 = void 0;
    var __VLS_36 = void 0;
    var __VLS_37 = ({ click: {} },
        { onClick: (__VLS_ctx.sendMessage) });
    var __VLS_38 = __VLS_34.slots.default;
    // @ts-ignore
    [isLoading, isLoading, userInput, sendMessage,];
    var __VLS_34;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-button" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.toggleChat) }, { class: "floating-btn" }), { title: "AI客服助手" }));
    // @ts-ignore
    [toggleChat,];
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "ai-avatar-icon" }, { viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "32", height: "32" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M891.41 346.29c-46.89-161.32-193.96-272.8-363.47-272.8-166.19 0-312.34 108.65-361.42 265.97-56.86 2.45-102.24 49.18-102.24 106.64v141.34c0 59.03 47.85 106.88 106.88 106.88h35.32c33.43 0 60.53-27.1 60.53-60.53V399.76c0-29.46-21.07-53.96-48.96-59.36 46.65-129.34 170.24-217.45 309.88-217.45 139.96 0 262.38 87.4 309.3 216.28h-19.08c-33.43 0-60.53 27.1-60.53 60.53v234.03c0 29.93 21.78 54.63 50.32 59.5-53.12 85.52-143.18 142.53-243.25 153.88-10.82-27.59-37.53-47.2-68.96-47.2-40.99 0-74.21 33.23-74.21 74.21 0 40.99 33.22 74.21 74.21 74.21 33.07 0 60.76-21.78 70.34-51.66 126.45-12.93 239.52-89.27 298.36-202.97 53.88-5.49 95.91-51 95.91-106.32V446.11c0.01-45.65-28.66-84.51-68.93-99.82z m-673.84 287.5c0 6.11-4.97 11.08-11.08 11.08h-35.32c-31.67 0-57.43-25.76-57.43-57.43V446.11c0-31.67 25.76-57.43 57.43-57.43h35.32c6.11 0 11.08 4.97 11.08 11.08v234.03z m278.17 265.15c-13.65 0-24.76-11.11-24.76-24.76s11.11-24.76 24.76-24.76c13.65 0 24.76 11.11 24.76 24.76s-11.11 24.76-24.76 24.76z m415.16-311.5c0 31.67-25.76 57.43-57.42 57.43h-35.32c-6.11 0-11.08-4.97-11.08-11.08V399.76c0-6.11 4.97-11.08 11.08-11.08h35.32c31.66 0 57.42 25.76 57.42 57.43v141.33z",
        fill: "#ffffff",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M669.84 570.03l-47.55-13.55c-12.88 45.18-54.73 76.74-101.77 76.74-46.52 0-88.24-31.12-101.44-75.66l-47.42 14.07c19.38 65.37 80.6 111.04 148.87 111.04 69-0.01 130.41-46.32 149.31-112.64z",
        fill: "#ffffff",
    });
    if (__VLS_ctx.unreadCount > 0) {
        // @ts-ignore
        [unreadCount,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "unread-badge" }));
        (__VLS_ctx.unreadCount);
        // @ts-ignore
        [unreadCount,];
    }
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['ai-chat-widget']} */ ;
/** @type {__VLS_StyleScopedClasses['expanded']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['header-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['messages-container']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-avatar-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['message-text']} */ ;
/** @type {__VLS_StyleScopedClasses['message-time']} */ ;
/** @type {__VLS_StyleScopedClasses['typing-cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['message-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input-area']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['input-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-button']} */ ;
/** @type {__VLS_StyleScopedClasses['floating-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-avatar-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['unread-badge']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
