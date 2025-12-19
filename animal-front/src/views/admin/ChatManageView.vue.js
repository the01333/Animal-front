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
var sockjs_client_1 = require("sockjs-client");
var stompjs_1 = require("@stomp/stompjs");
var app_1 = require("@/stores/app");
var user_1 = require("@/stores/user");
var customerService_1 = require("@/api/customerService");
var image_1 = require("@/utils/image");
var appStore = (0, app_1.useAppStore)();
var userStore = (0, user_1.useUserStore)();
var searchKeyword = (0, vue_1.ref)('');
var sessions = (0, vue_1.ref)([]);
var messagesMap = (0, vue_1.ref)({});
var agentAvatar = (0, vue_1.computed)(function () {
    var _a;
    var avatar = ((_a = userStore.userInfo) === null || _a === void 0 ? void 0 : _a.avatar) || '';
    return avatar ? (0, image_1.processImageUrl)(avatar) : 'http://localhost:9000/animal-adopt/default.jpg';
});
var quickReplies = (0, vue_1.ref)([
    { id: 'q1', text: '您好，这里是 i宠园客服，请问有什么可以帮您？' },
    { id: 'q2', text: '当前这只宠物还在基地，可预约本周到访进行线下了解。' },
    { id: 'q3', text: '领养需要提交基本资料并通过简单的资质审核。' },
    { id: 'q4', text: '好的，我们已为您记录需求，如有合适的宠物会第一时间联系您。' }
]);
// 当前选中的会话ID, 默认不选中任何会话
var activeSessionId = (0, vue_1.ref)(null);
var draft = (0, vue_1.ref)('');
var sideCollapsed = (0, vue_1.ref)(false);
var messageContainer = (0, vue_1.ref)(null);
var loadingSessions = (0, vue_1.ref)(false);
var loadingMessages = (0, vue_1.ref)(false);
var sending = (0, vue_1.ref)(false);
var stompClient = (0, vue_1.ref)(null);
var wsConnected = (0, vue_1.ref)(false);
var sessionsPollTimer = null;
var messagesPollTimer = null;
var getWsUrl = function () {
    // 后端设置了 server.servlet.context-path=/api, WebSocket endpoint 实际为 /api/ws
    // 通过 STOMP CONNECT headers 携带 Authorization, 便于 CONNECT 阶段绑定用户ID
    var base = '/api/ws';
    if (typeof window === 'undefined')
        return base;
    return base;
};
var formatTime = function (iso) {
    if (!iso)
        return '';
    var d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
var filteredSessions = (0, vue_1.computed)(function () {
    var keyword = searchKeyword.value.trim().toLowerCase();
    if (!keyword)
        return sessions.value;
    return sessions.value.filter(function (s) {
        return s.name.toLowerCase().includes(keyword) || s.lastMessage.toLowerCase().includes(keyword);
    });
});
var currentSession = (0, vue_1.computed)(function () {
    if (!activeSessionId.value)
        return null;
    return sessions.value.find(function (s) { return s.id === activeSessionId.value; }) || null;
});
var currentMessages = (0, vue_1.computed)(function () {
    if (!activeSessionId.value)
        return [];
    return messagesMap.value[activeSessionId.value] || [];
});
var loadSessions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, pageData, records, totalUnread, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loadingSessions.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, customerService_1.pageManualCsSessions)({ current: 1, size: 50 })];
            case 2:
                res = _a.sent();
                pageData = res.data;
                records = (pageData === null || pageData === void 0 ? void 0 : pageData.records) || [];
                sessions.value = records.map(function (item) { return ({
                    id: item.id,
                    userId: item.userId,
                    name: item.userUsername || item.userNickname || "\u7528\u6237#".concat(item.userId),
                    avatar: item.userAvatar ? (0, image_1.processImageUrl)(item.userAvatar) : 'http://localhost:9000/animal-adopt/default.jpg',
                    lastMessage: item.lastMessage || '',
                    lastTime: item.lastTime ? formatTime(item.lastTime) : '',
                    unread: item.unreadForAgent || 0,
                    online: !!item.online,
                    preference: '',
                    orders: ''
                }); });
                totalUnread = sessions.value.reduce(function (sum, s) { return sum + (s.unread || 0); }, 0);
                appStore.setCsUnreadForAgent(totalUnread);
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.error('加载客服会话列表失败:', error_1);
                element_plus_1.ElMessage.error('加载客服会话列表失败，请稍后重试');
                return [3 /*break*/, 5];
            case 4:
                loadingSessions.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var loadMessages = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var res, list, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loadingMessages.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, customerService_1.getManualCsMessages)(sessionId)];
            case 2:
                res = _a.sent();
                list = res.data || [];
                messagesMap.value[sessionId] = list.map(function (item) { return ({
                    id: String(item.id),
                    sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
                    content: item.content,
                    time: item.createTime ? formatTime(item.createTime) : ''
                }); });
                scrollToBottom();
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                console.error('加载会话消息失败:', error_2);
                element_plus_1.ElMessage.error('加载会话消息失败，请稍后重试');
                return [3 /*break*/, 5];
            case 4:
                loadingMessages.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var ackingSessionIds = new Set();
var pendingAckSessionIds = new Set();
var ackAgentRead = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var target, totalUnread, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!sessionId || sessionId <= 0)
                    return [2 /*return*/];
                if (ackingSessionIds.has(sessionId)) {
                    pendingAckSessionIds.add(sessionId);
                    return [2 /*return*/];
                }
                ackingSessionIds.add(sessionId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, 7, 8]);
                _a.label = 2;
            case 2:
                pendingAckSessionIds.delete(sessionId);
                return [4 /*yield*/, (0, customerService_1.readAckManualCs)(sessionId, 'AGENT')];
            case 3:
                _a.sent();
                target = sessions.value.find(function (s) { return s.id === sessionId; });
                if (target) {
                    target.unread = 0;
                }
                totalUnread = sessions.value.reduce(function (sum, s) { return sum + (s.unread || 0); }, 0);
                appStore.setCsUnreadForAgent(totalUnread);
                _a.label = 4;
            case 4:
                if (pendingAckSessionIds.has(sessionId)) return [3 /*break*/, 2];
                _a.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                error_3 = _a.sent();
                console.error('更新客服侧未读状态失败:', error_3);
                return [3 /*break*/, 8];
            case 7:
                ackingSessionIds.delete(sessionId);
                pendingAckSessionIds.delete(sessionId);
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
var selectSession = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                activeSessionId.value = id;
                return [4 /*yield*/, loadMessages(id)];
            case 1:
                _a.sent();
                startMessagesPolling(id);
                // 点击会话后, 将客服侧未读数清零
                return [4 /*yield*/, ackAgentRead(id)];
            case 2:
                // 点击会话后, 将客服侧未读数清零
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var scrollToBottom = function () {
    (0, vue_1.nextTick)(function () {
        if (!messageContainer.value)
            return;
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    });
};
var startSessionsPolling = function () {
    // 只有在 WS 未连接时才使用轮询作为降级方案
    if (sessionsPollTimer) {
        window.clearInterval(sessionsPollTimer);
        sessionsPollTimer = null;
    }
    sessionsPollTimer = window.setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (wsConnected.value)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadSessions()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error('轮询刷新会话列表失败', e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, 15000);
};
var startMessagesPolling = function (sessionId) {
    // 只有在 WS 未连接时才使用轮询作为降级方案
    if (messagesPollTimer) {
        window.clearInterval(messagesPollTimer);
        messagesPollTimer = null;
    }
    messagesPollTimer = window.setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (wsConnected.value)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadMessages(sessionId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    console.error('轮询刷新会话消息失败', e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, 10000);
};
var stopAllPolling = function () {
    if (sessionsPollTimer) {
        window.clearInterval(sessionsPollTimer);
        sessionsPollTimer = null;
    }
    if (messagesPollTimer) {
        window.clearInterval(messagesPollTimer);
        messagesPollTimer = null;
    }
};
var initWs = function () {
    if (stompClient.value)
        return;
    var socketUrl = getWsUrl();
    var socket = new sockjs_client_1.default(socketUrl);
    var tokenValue = localStorage.getItem('token');
    var client = new stompjs_1.Client({
        webSocketFactory: function () { return socket; },
        connectHeaders: tokenValue ? { Authorization: "Bearer ".concat(tokenValue) } : {},
        reconnectDelay: 5000,
        debug: function () { }
    });
    client.onConnect = function () {
        wsConnected.value = true;
        client.subscribe('/user/queue/cs/chat', function (frame) {
            try {
                var payload = JSON.parse(frame.body);
                var sid_1 = payload.sessionId;
                var msgId_1 = String(payload.id);
                var list = messagesMap.value[sid_1] || [];
                // WS 断线重连/重复订阅时可能会收到重复帧，这里按消息ID去重，避免重复渲染 & 重复累加未读
                if (list.some(function (m) { return m.id === msgId_1; })) {
                    return;
                }
                list.push({
                    id: msgId_1,
                    sender: payload.senderRole === 'AGENT' ? 'agent' : 'user',
                    content: payload.content,
                    time: payload.createTime ? formatTime(payload.createTime) : ''
                });
                messagesMap.value[sid_1] = list;
                var s = sessions.value.find(function (it) { return it.id === sid_1; });
                if (s) {
                    s.lastMessage = payload.content;
                    s.lastTime = payload.createTime
                        ? formatTime(payload.createTime)
                        : s.lastTime;
                    if (payload.senderRole === 'USER') {
                        if (activeSessionId.value === sid_1) {
                            ackAgentRead(sid_1);
                        }
                        else {
                            s.unread = (s.unread || 0) + 1;
                        }
                    }
                }
                if (activeSessionId.value === sid_1) {
                    scrollToBottom();
                }
            }
            catch (e) {
                console.error('解析客服WS消息失败', e);
            }
        });
        // 订阅未读汇总推送, 更新全局客服未读数以驱动左侧导航红点
        client.subscribe('/user/queue/cs/unread', function (frame) {
            try {
                var payload = JSON.parse(frame.body);
                if (typeof payload.unreadForAgent === 'number') {
                    appStore.setCsUnreadForAgent(payload.unreadForAgent);
                }
            }
            catch (e) {
                console.error('解析客服未读汇总失败', e);
            }
        });
        // 订阅用户在线状态变更，实时更新会话列表中的 online 状态
        client.subscribe('/topic/cs/presence', function (frame) {
            try {
                var payload_1 = JSON.parse(frame.body);
                if (!payload_1 || typeof payload_1.userId !== 'number')
                    return;
                var target = sessions.value.find(function (s) { return s.userId === payload_1.userId; });
                if (target) {
                    target.online = !!payload_1.online;
                }
            }
            catch (e) {
                console.error('解析客服在线状态推送失败', e);
            }
        });
        // WS 重连/首次连接后主动拉一次会话列表，确保在线状态与未读汇总是最新快照
        loadSessions();
    };
    client.onStompError = function () {
        wsConnected.value = false;
    };
    client.onWebSocketClose = function () {
        wsConnected.value = false;
    };
    client.activate();
    stompClient.value = client;
};
var sendMessage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var content, time, msg, list, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                content = draft.value.trim();
                if (!content)
                    return [2 /*return*/];
                if (!currentSession.value || !activeSessionId.value) {
                    element_plus_1.ElMessage.warning('请选择一个会话');
                    return [2 /*return*/];
                }
                if (sending.value)
                    return [2 /*return*/];
                time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                msg = {
                    id: "".concat(Date.now()),
                    sender: 'agent',
                    content: content,
                    time: time
                };
                list = messagesMap.value[activeSessionId.value] || [];
                list.push(msg);
                messagesMap.value[activeSessionId.value] = list;
                draft.value = '';
                scrollToBottom();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                sending.value = true;
                // 统一通过 HTTP 接口发送消息，由后端负责写入数据库并通过 WebSocket 推送给双方
                return [4 /*yield*/, (0, customerService_1.sendManualCsMessage)(activeSessionId.value, { content: content, messageType: 'text' })];
            case 2:
                // 统一通过 HTTP 接口发送消息，由后端负责写入数据库并通过 WebSocket 推送给双方
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_4 = _a.sent();
                console.error('发送客服消息失败:', error_4);
                element_plus_1.ElMessage.error('发送失败，请稍后重试');
                return [3 /*break*/, 5];
            case 4:
                sending.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var appendQuickReply = function (text) {
    if (!text)
        return;
    if (!draft.value) {
        draft.value = text;
    }
    else {
        draft.value = "".concat(draft.value, "\n").concat(text);
    }
};
var toggleSide = function () {
    sideCollapsed.value = !sideCollapsed.value;
};
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadSessions()];
            case 1:
                _a.sent();
                initWs();
                startSessionsPolling();
                return [2 /*return*/];
        }
    });
}); });
(0, vue_1.onUnmounted)(function () {
    stopAllPolling();
    if (stompClient.value) {
        stompClient.value.deactivate();
        stompClient.value = null;
        wsConnected.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['agent']} */ ;
/** @type {__VLS_StyleScopedClasses['side-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['side-section']} */ ;
/** @type {__VLS_StyleScopedClasses['side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-reply-item']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input-actions']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-manage-view" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-container" }));
__VLS_asFunctionalElement(__VLS_elements.aside, __VLS_elements.aside)(__assign({ class: "conversation-pane" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "conversation-header" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "conversation-title" }));
var __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜索用户...",
    prefixIcon: (__VLS_ctx.Search),
    clearable: true,
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.searchKeyword),
        placeholder: "搜索用户...",
        prefixIcon: (__VLS_ctx.Search),
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
// @ts-ignore
[searchKeyword, icons_vue_1.Search,];
var __VLS_5 = {}.ElScrollbar;
/** @type {[typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, typeof __VLS_components.ElScrollbar, typeof __VLS_components.elScrollbar, ]} */ ;
// @ts-ignore
ElScrollbar;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5(__assign({ class: "conversation-list" })));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign({ class: "conversation-list" })], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_9 = __VLS_8.slots.default;
var _loop_1 = function (session) {
    // @ts-ignore
    [filteredSessions,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.selectSession(session.id);
            // @ts-ignore
            [selectSession,];
        } }, { key: (session.id) }), { class: "conversation-item" }), { class: ({ active: session.id === __VLS_ctx.activeSessionId }) }));
    // @ts-ignore
    [activeSessionId,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "conversation-avatar-wrapper" }));
    var __VLS_10 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    ElAvatar;
    // @ts-ignore
    var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        size: (40),
        src: (session.avatar),
    }));
    var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([{
            size: (40),
            src: (session.avatar),
        }], __VLS_functionalComponentArgsRest(__VLS_11), false));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "conversation-main" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "conversation-top" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "conversation-name" }));
    (session.name);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "conversation-time" }));
    (session.lastTime);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "conversation-bottom" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "conversation-preview" }));
    (session.lastMessage);
    if (session.unread > 0) {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "conversation-unread" }));
        (session.unread);
    }
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.filteredSessions)); _i < _a.length; _i++) {
    var session = _a[_i][0];
    _loop_1(session);
}
var __VLS_8;
if (__VLS_ctx.currentSession) {
    // @ts-ignore
    [currentSession,];
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "chat-main" }));
    __VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)(__assign({ class: "chat-header" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-header-left" }));
    var __VLS_15 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    ElAvatar;
    // @ts-ignore
    var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        size: (40),
        src: (__VLS_ctx.currentSession.avatar),
    }));
    var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
            size: (40),
            src: (__VLS_ctx.currentSession.avatar),
        }], __VLS_functionalComponentArgsRest(__VLS_16), false));
    // @ts-ignore
    [currentSession,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-user-info" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-user-name" }));
    (__VLS_ctx.currentSession.name);
    // @ts-ignore
    [currentSession,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-user-status" }));
    __VLS_asFunctionalElement(__VLS_elements.span)(__assign({ class: "status-dot" }, { class: ({ online: __VLS_ctx.currentSession.online }) }));
    // @ts-ignore
    [currentSession,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.currentSession.online ? '在线' : '离线');
    // @ts-ignore
    [currentSession,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-header-actions" }));
    var __VLS_20 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        text: true,
    }));
    var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{
            text: true,
        }], __VLS_functionalComponentArgsRest(__VLS_21), false));
    var __VLS_24 = __VLS_23.slots.default;
    var __VLS_23;
    var __VLS_25 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        text: true,
        type: "danger",
    }));
    var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{
            text: true,
            type: "danger",
        }], __VLS_functionalComponentArgsRest(__VLS_26), false));
    var __VLS_29 = __VLS_28.slots.default;
    var __VLS_28;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-body" }));
    __VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)(__assign({ class: "message-pane" }, { ref: "messageContainer" }));
    /** @type {typeof __VLS_ctx.messageContainer} */ ;
    // @ts-ignore
    [messageContainer,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-scroll" }));
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.currentMessages)); _b < _c.length; _b++) {
        var msg = _c[_b][0];
        // @ts-ignore
        [currentMessages,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ key: (msg.id) }, { class: "message-row" }), { class: (msg.sender) }));
        if (msg.sender === 'user') {
            var __VLS_30 = {}.ElAvatar;
            /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
            // @ts-ignore
            ElAvatar;
            // @ts-ignore
            var __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30(__assign({ size: (34), src: (__VLS_ctx.currentSession.avatar) }, { class: "message-avatar" })));
            var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([__assign({ size: (34), src: (__VLS_ctx.currentSession.avatar) }, { class: "message-avatar" })], __VLS_functionalComponentArgsRest(__VLS_31), false));
            // @ts-ignore
            [currentSession,];
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-bubble" }, { class: (msg.sender) }));
        __VLS_asFunctionalElement(__VLS_elements.div)(__assign({ class: "message-content" }));
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (msg.content) }), null, null);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-time" }));
        (msg.time);
        if (msg.sender === 'agent') {
            var __VLS_35 = {}.ElAvatar;
            /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
            // @ts-ignore
            ElAvatar;
            // @ts-ignore
            var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35(__assign({ size: (34), src: (__VLS_ctx.agentAvatar) }, { class: "message-avatar" })));
            var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([__assign({ size: (34), src: (__VLS_ctx.agentAvatar) }, { class: "message-avatar" })], __VLS_functionalComponentArgsRest(__VLS_36), false));
            // @ts-ignore
            [agentAvatar,];
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div)(__assign({ class: "message-bottom-spacer" }));
    __VLS_asFunctionalElement(__VLS_elements.aside, __VLS_elements.aside)(__assign({ class: "side-pane" }, { class: ({ collapsed: __VLS_ctx.sideCollapsed }) }));
    // @ts-ignore
    [sideCollapsed,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: (__VLS_ctx.toggleSide) }, { class: "side-toggle" }));
    // @ts-ignore
    [toggleSide,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.sideCollapsed ? '‹' : '›');
    // @ts-ignore
    [sideCollapsed,];
    if (!__VLS_ctx.sideCollapsed) {
        // @ts-ignore
        [sideCollapsed,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "side-content" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "side-section" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "side-title" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "side-item" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (__VLS_ctx.currentSession.name);
        // @ts-ignore
        [currentSession,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "side-item" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (__VLS_ctx.currentSession.preference);
        // @ts-ignore
        [currentSession,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "side-item" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (__VLS_ctx.currentSession.orders);
        // @ts-ignore
        [currentSession,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "side-section" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "side-title" }));
        var _loop_2 = function (item) {
            // @ts-ignore
            [quickReplies,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.currentSession))
                        return;
                    if (!(!__VLS_ctx.sideCollapsed))
                        return;
                    __VLS_ctx.appendQuickReply(item.text);
                    // @ts-ignore
                    [appendQuickReply,];
                } }, { key: (item.id) }), { class: "quick-reply-item" }));
            (item.text);
        };
        for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.quickReplies)); _d < _e.length; _d++) {
            var item = _e[_d][0];
            _loop_2(item);
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.footer, __VLS_elements.footer)(__assign({ class: "chat-input" }));
    var __VLS_40 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40(__assign({ 'onKeydown': {} }, { modelValue: (__VLS_ctx.draft), type: "textarea", rows: (3), placeholder: "在此输入回复内容..." })));
    var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([__assign({ 'onKeydown': {} }, { modelValue: (__VLS_ctx.draft), type: "textarea", rows: (3), placeholder: "在此输入回复内容..." })], __VLS_functionalComponentArgsRest(__VLS_41), false));
    var __VLS_44 = void 0;
    var __VLS_45 = void 0;
    var __VLS_46 = ({ keydown: {} },
        { onKeydown: (__VLS_ctx.sendMessage) });
    // @ts-ignore
    [draft, sendMessage,];
    var __VLS_43;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-input-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "hint" }));
    var __VLS_48 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48(__assign({ 'onClick': {} }, { type: "primary", size: "medium", disabled: (!__VLS_ctx.draft.trim()) })));
    var __VLS_50 = __VLS_49.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", size: "medium", disabled: (!__VLS_ctx.draft.trim()) })], __VLS_functionalComponentArgsRest(__VLS_49), false));
    var __VLS_52 = void 0;
    var __VLS_53 = void 0;
    var __VLS_54 = ({ click: {} },
        { onClick: (__VLS_ctx.sendMessage) });
    var __VLS_55 = __VLS_51.slots.default;
    // @ts-ignore
    [draft, sendMessage,];
    var __VLS_51;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "chat-main-empty" }));
    var __VLS_56 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    ElEmpty;
    // @ts-ignore
    var __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        description: "请选择左侧的用户会话开始聊天",
    }));
    var __VLS_58 = __VLS_57.apply(void 0, __spreadArray([{
            description: "请选择左侧的用户会话开始聊天",
        }], __VLS_functionalComponentArgsRest(__VLS_57), false));
}
/** @type {__VLS_StyleScopedClasses['chat-manage-view']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-header']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-title']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-list']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-main']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-top']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-name']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-time']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['conversation-unread']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-main']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-user-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['online']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-body']} */ ;
/** @type {__VLS_StyleScopedClasses['message-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['message-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['message-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['message-time']} */ ;
/** @type {__VLS_StyleScopedClasses['message-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['message-bottom-spacer']} */ ;
/** @type {__VLS_StyleScopedClasses['side-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['collapsed']} */ ;
/** @type {__VLS_StyleScopedClasses['side-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['side-content']} */ ;
/** @type {__VLS_StyleScopedClasses['side-section']} */ ;
/** @type {__VLS_StyleScopedClasses['side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['side-section']} */ ;
/** @type {__VLS_StyleScopedClasses['side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-reply-item']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-main-empty']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
