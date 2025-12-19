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
var sockjs_client_1 = require("sockjs-client");
var stompjs_1 = require("@stomp/stompjs");
var customerService_1 = require("@/api/customerService");
var app_1 = require("@/stores/app");
var user_1 = require("@/stores/user");
var pinia_1 = require("pinia");
var props = (0, vue_1.defineProps)();
var emit = (0, vue_1.defineEmits)();
var isExpanded = (0, vue_1.ref)(false);
var messages = (0, vue_1.ref)([]);
var draft = (0, vue_1.ref)('');
var messageContainer = (0, vue_1.ref)(null);
// 后端会话ID (t_cs_session.id)
var sessionId = (0, vue_1.ref)(null);
var loadingSession = (0, vue_1.ref)(false);
var sending = (0, vue_1.ref)(false);
var stompClient = (0, vue_1.ref)(null);
var wsConnected = (0, vue_1.ref)(false);
var lastMessageId = (0, vue_1.ref)(null);
var pollStopped = false;
var pollRunning = false;
var unreadPollTimer = null;
var refreshingUnread = (0, vue_1.ref)(false);
var sendingReadAck = (0, vue_1.ref)(false);
var agentAvatar = (0, vue_1.computed)(function () { return 'http://localhost:9000/animal-adopt/default.jpg'; });
var appStore = (0, app_1.useAppStore)();
var userStore = (0, user_1.useUserStore)();
var token = (0, pinia_1.storeToRefs)(userStore).token;
var ensureWelcome = function () {
    if (messages.value.length === 0) {
        messages.value.push({
            id: Date.now().toString(),
            sender: 'agent',
            content: '您好，我是人工客服小宠。如果您在领养流程、宠物健康或平台使用上有任何问题，都可以直接在这里告诉我哦~',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }
};
var startUnreadPolling = function () {
    if (typeof window === 'undefined')
        return;
    if (unreadPollTimer) {
        window.clearInterval(unreadPollTimer);
        unreadPollTimer = null;
    }
    unreadPollTimer = window.setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isExpanded.value)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, refreshUnreadFromHttp()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error('轮询刷新客服未读数失败', e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, 15000);
};
var stopUnreadPolling = function () {
    if (typeof window === 'undefined')
        return;
    if (unreadPollTimer) {
        window.clearInterval(unreadPollTimer);
        unreadPollTimer = null;
    }
};
var formatTime = function (iso) {
    if (!iso)
        return '';
    var d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
var scrollToBottom = function () {
    (0, vue_1.nextTick)(function () {
        if (messageContainer.value) {
            messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
    });
};
var startPolling = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, list, _loop_1, _i, list_1, item, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // 队列式长轮询: 始终通过 HTTP 长轮询获取新消息
                if (pollRunning)
                    return [2 /*return*/];
                pollStopped = false;
                pollRunning = true;
                _a.label = 1;
            case 1:
                if (!(!pollStopped && sessionId.value && isExpanded.value)) return [3 /*break*/, 7];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 6]);
                return [4 /*yield*/, (0, customerService_1.longPollManualCsMessages)(sessionId.value, lastMessageId.value == null ? undefined : lastMessageId.value)];
            case 3:
                res = _a.sent();
                if (pollStopped || !isExpanded.value) {
                    return [3 /*break*/, 7];
                }
                list = res.data || [];
                if (list.length > 0) {
                    _loop_1 = function (item) {
                        var serverId = item.id;
                        var idStr = String(serverId);
                        // 避免重复追加已经存在的消息
                        if (messages.value.some(function (m) { return m.serverId === serverId || m.id === idStr; }))
                            return "continue";
                        // 用户端发送的消息可能已在本地回显，长轮询再拉到时应合并而不是追加
                        if (item.senderRole === 'USER') {
                            for (var i = messages.value.length - 1; i >= 0; i--) {
                                var m = messages.value[i];
                                if (m.sender !== 'user')
                                    continue;
                                if (typeof m.serverId === 'number')
                                    continue;
                                if (!m.id.endsWith('-u'))
                                    continue;
                                if (m.content !== item.content)
                                    continue;
                                m.serverId = serverId;
                                m.time = formatTime(item.createTime);
                                break;
                            }
                            // 如果成功合并，本轮无需 push
                            if (messages.value.some(function (m) { return m.serverId === serverId; }))
                                return "continue";
                        }
                        messages.value.push({
                            id: idStr,
                            serverId: serverId,
                            sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
                            content: item.content,
                            time: formatTime(item.createTime)
                        });
                    };
                    for (_i = 0, list_1 = list; _i < list_1.length; _i++) {
                        item = list_1[_i];
                        _loop_1(item);
                    }
                    lastMessageId.value = list[list.length - 1].id;
                    scrollToBottom();
                    if (list.some(function (it) { return it.senderRole === 'AGENT'; })) {
                        ackUserRead();
                    }
                }
                return [3 /*break*/, 6];
            case 4:
                e_2 = _a.sent();
                console.error('长轮询刷新客服消息失败', e_2);
                // 出错时稍作等待，避免空转
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 5:
                // 出错时稍作等待，避免空转
                _a.sent();
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 1];
            case 7:
                pollRunning = false;
                return [2 /*return*/];
        }
    });
}); };
var stopPolling = function () {
    pollStopped = true;
};
var ackUserRead = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tokenValue, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (sendingReadAck.value)
                    return [2 /*return*/];
                tokenValue = token.value || localStorage.getItem('token');
                if (!tokenValue)
                    return [2 /*return*/];
                if (!sessionId.value)
                    return [2 /*return*/];
                sendingReadAck.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, customerService_1.readAckManualCs)(sessionId.value, 'USER')];
            case 2:
                _a.sent();
                appStore.setCsUnreadForUser(0);
                return [3 /*break*/, 5];
            case 3:
                err_1 = _a.sent();
                console.error('发送用户侧已读回执失败:', err_1);
                return [3 /*break*/, 5];
            case 4:
                sendingReadAck.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var refreshUnreadFromHttp = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tokenValue, res, session, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (refreshingUnread.value)
                    return [2 /*return*/];
                tokenValue = token.value || localStorage.getItem('token');
                if (!tokenValue)
                    return [2 /*return*/];
                refreshingUnread.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, customerService_1.openManualCsSession)()];
            case 2:
                res = _a.sent();
                session = res.data;
                if (session && typeof session.id === 'number') {
                    sessionId.value = session.id;
                }
                if (session && typeof session.unreadForUser === 'number') {
                    if (isExpanded.value && sessionId.value && session.unreadForUser > 0) {
                        appStore.setCsUnreadForUser(0);
                        ackUserRead();
                    }
                    else {
                        appStore.setCsUnreadForUser(session.unreadForUser);
                    }
                }
                return [3 /*break*/, 5];
            case 3:
                e_3 = _a.sent();
                console.error('加载客服未读数失败', e_3);
                return [3 /*break*/, 5];
            case 4:
                refreshingUnread.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var getWsUrl = function () {
    // 后端设置了 server.servlet.context-path=/api, WebSocket endpoint 实际为 /api/ws
    // 通过 STOMP CONNECT headers 携带 Authorization, 便于 CONNECT 阶段绑定用户ID
    var base = '/api/ws';
    if (typeof window === 'undefined')
        return base;
    return base;
};
var initWs = function () {
    if (stompClient.value)
        return;
    var socketUrl = getWsUrl();
    var socket = new sockjs_client_1.default(socketUrl);
    var tokenValue = token.value || localStorage.getItem('token');
    var client = new stompjs_1.Client({
        webSocketFactory: function () { return socket; },
        connectHeaders: tokenValue ? { Authorization: "Bearer ".concat(tokenValue) } : {},
        reconnectDelay: 5000,
        debug: function () { }
    });
    client.onConnect = function () {
        wsConnected.value = true;
        // 订阅未读汇总推送, 更新用户侧客服未读数以驱动前台入口红点
        client.subscribe('/user/queue/cs/unread', function (frame) {
            try {
                console.log('[WS] 收到未读汇总原始帧', frame);
                var payload = JSON.parse(frame.body);
                console.log('[WS] 解析后的未读汇总', payload);
                if (typeof payload.unreadForUser === 'number') {
                    if (isExpanded.value && sessionId.value && payload.unreadForUser > 0) {
                        appStore.setCsUnreadForUser(0);
                        ackUserRead();
                        console.log('[WS] 已更新 appStore.csUnreadForUser =', 0);
                    }
                    else {
                        appStore.setCsUnreadForUser(payload.unreadForUser);
                        console.log('[WS] 已更新 appStore.csUnreadForUser =', payload.unreadForUser);
                    }
                }
            }
            catch (e) {
                console.error('解析客服未读汇总失败', e, frame && frame.body);
            }
        });
        // WS 连接成功后主动拉一次未读数，避免用户离线期间错过 push 导致红点不更新
        refreshUnreadFromHttp();
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
(0, vue_1.watch)(function () { return token.value; }, function (val, oldVal) {
    if (val && val !== oldVal) {
        if (stompClient.value) {
            stompClient.value.deactivate();
            stompClient.value = null;
            wsConnected.value = false;
        }
        initWs();
        refreshUnreadFromHttp();
    }
    if (!val && stompClient.value) {
        stompClient.value.deactivate();
        stompClient.value = null;
        wsConnected.value = false;
        appStore.setCsUnreadForUser(0);
    }
}, { immediate: true });
var loadHistory = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, list, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!sessionId.value)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, customerService_1.getManualCsMessages)(sessionId.value)];
            case 2:
                res = _a.sent();
                list = res.data || [];
                if (list.length > 0) {
                    messages.value = list.map(function (item) { return ({
                        id: String(item.id),
                        serverId: item.id,
                        sender: item.senderRole === 'AGENT' ? 'agent' : 'user',
                        content: item.content,
                        time: formatTime(item.createTime)
                    }); });
                    // 记录当前最新消息ID, 供后续长轮询只拉取增量
                    lastMessageId.value = list[list.length - 1].id;
                }
                else {
                    messages.value = [];
                    ensureWelcome();
                    lastMessageId.value = null;
                }
                scrollToBottom();
                // 打开窗口后, 将当前会话的用户侧未读数清零
                return [4 /*yield*/, ackUserRead()];
            case 3:
                // 打开窗口后, 将当前会话的用户侧未读数清零
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error('加载人工客服消息失败:', error_1);
                if (messages.value.length === 0) {
                    ensureWelcome();
                }
                element_plus_1.ElMessage.error('加载客服消息失败，请稍后再试');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var ensureSession = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, session, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (loadingSession.value)
                    return [2 /*return*/];
                loadingSession.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, 6, 7]);
                if (!!sessionId.value) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, customerService_1.openManualCsSession)()];
            case 2:
                res = _a.sent();
                session = res.data;
                sessionId.value = session.id;
                if (session && typeof session.unreadForUser === 'number') {
                    appStore.setCsUnreadForUser(session.unreadForUser);
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, loadHistory()
                // 会话就绪后启动长轮询获取新消息
            ];
            case 4:
                _a.sent();
                // 会话就绪后启动长轮询获取新消息
                startPolling();
                return [3 /*break*/, 7];
            case 5:
                error_2 = _a.sent();
                console.error('打开人工客服会话失败:', error_2);
                if (messages.value.length === 0) {
                    ensureWelcome();
                    scrollToBottom();
                }
                element_plus_1.ElMessage.error('人工客服暂时不可用，请稍后再试');
                return [3 /*break*/, 7];
            case 6:
                loadingSession.value = false;
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
var open = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // 保留方法以兼容外部可能的调用，但当前入口由外层 v-model 控制
                isExpanded.value = true;
                emit('update:visible', true);
                return [4 /*yield*/, ensureSession()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var minimize = function () {
    isExpanded.value = false;
    emit('update:visible', false);
    stopPolling();
    appStore.setCsUnreadForUser(0);
    ackUserRead();
};
var handleSend = function () { return __awaiter(void 0, void 0, void 0, function () {
    var content, now, localId, res, serverMsg, serverId_1, serverIdStr_1, localIdx, dupIdx, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                content = draft.value.trim();
                if (!content || sending.value)
                    return [2 /*return*/];
                if (!!sessionId.value) return [3 /*break*/, 2];
                return [4 /*yield*/, ensureSession()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!sessionId.value)
                    return [2 /*return*/];
                now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                localId = "".concat(Date.now(), "-u");
                // 本地先显示用户消息
                messages.value.push({
                    id: localId,
                    sender: 'user',
                    content: content,
                    time: now
                });
                draft.value = '';
                scrollToBottom();
                sending.value = true;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, 6, 7]);
                return [4 /*yield*/, (0, customerService_1.sendManualCsMessage)(sessionId.value, { content: content, messageType: 'text' })];
            case 4:
                res = _a.sent();
                serverMsg = res.data;
                if (serverMsg && typeof serverMsg.id === 'number') {
                    lastMessageId.value = serverMsg.id;
                    serverId_1 = serverMsg.id;
                    serverIdStr_1 = String(serverId_1);
                    localIdx = messages.value.findIndex(function (m) { return m.id === localId; });
                    dupIdx = messages.value.findIndex(function (m) { return m.serverId === serverId_1 || m.id === serverIdStr_1; });
                    if (localIdx !== -1) {
                        if (dupIdx !== -1 && dupIdx !== localIdx) {
                            messages.value.splice(dupIdx, 1);
                            if (dupIdx < localIdx)
                                localIdx -= 1;
                        }
                        messages.value[localIdx].serverId = serverId_1;
                        messages.value[localIdx].time = formatTime(serverMsg.createTime);
                    }
                }
                return [3 /*break*/, 7];
            case 5:
                error_3 = _a.sent();
                console.error('发送人工客服消息失败:', error_3);
                element_plus_1.ElMessage.error('发送失败，请稍后重试');
                return [3 /*break*/, 7];
            case 6:
                sending.value = false;
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.watch)(function () { return props.visible; }, function (val, oldVal) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(typeof val === 'boolean')) return [3 /*break*/, 3];
                isExpanded.value = val;
                if (!val) return [3 /*break*/, 2];
                return [4 /*yield*/, ensureSession()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                stopPolling();
                if (oldVal) {
                    appStore.setCsUnreadForUser(0);
                    ackUserRead();
                }
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); }, { immediate: true });
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                initWs();
                refreshUnreadFromHttp();
                startUnreadPolling();
                if (!props.visible) return [3 /*break*/, 2];
                return [4 /*yield*/, ensureSession()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
(0, vue_1.onUnmounted)(function () {
    stopPolling();
    stopUnreadPolling();
    if (stompClient.value) {
        stompClient.value.deactivate();
        stompClient.value = null;
        wsConnected.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-root']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-window']} */ ;
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "manual-chat-root" }));
var __VLS_5 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    name: "manual-chat-fade-slide",
}));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{
        name: "manual-chat-fade-slide",
    }], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_9 = __VLS_8.slots.default;
if (__VLS_ctx.isExpanded) {
    // @ts-ignore
    [isExpanded,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "manual-chat-window" }));
    __VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)(__assign({ class: "manual-chat-header" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-left" }));
    __VLS_asFunctionalElement(__VLS_elements.img)(__assign({ class: "agent-avatar" }, { src: (__VLS_ctx.agentAvatar), alt: "客服" }));
    // @ts-ignore
    [agentAvatar,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agent-info" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agent-name" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agent-status" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.minimize) }, { class: "icon-btn" }));
    // @ts-ignore
    [minimize,];
    __VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)(__assign({ class: "manual-chat-body" }, { ref: "messageContainer" }));
    /** @type {typeof __VLS_ctx.messageContainer} */ ;
    // @ts-ignore
    [messageContainer,];
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.messages)); _i < _a.length; _i++) {
        var msg = _a[_i][0];
        // @ts-ignore
        [messages,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ key: (msg.id) }, { class: "message-row" }), { class: (msg.sender) }));
        if (msg.sender === 'agent') {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bubble agent-bubble" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bubble-content" }));
            __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (msg.content) }), null, null);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bubble-time" }));
            (msg.time);
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bubble user-bubble" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bubble-content" }));
            __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (msg.content) }), null, null);
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "bubble-time" }));
            (msg.time);
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.footer, __VLS_elements.footer)(__assign({ class: "manual-chat-footer" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "toolbar" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ class: "icon-btn" }, { type: "button" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ class: "icon-btn" }, { type: "button" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "input-row" }));
    __VLS_asFunctionalElement(__VLS_elements.textarea)(__assign(__assign(__assign(__assign({ onKeydown: (__VLS_ctx.handleSend) }, { onKeydown: function () { } }), { value: (__VLS_ctx.draft) }), { class: "chat-input" }), { placeholder: "请输入您的问题...", rows: "2" }));
    // @ts-ignore
    [handleSend, draft,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.handleSend) }, { class: "send-btn" }), { type: "button", disabled: (!__VLS_ctx.draft.trim()) }));
    // @ts-ignore
    [handleSend, draft,];
}
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['manual-chat-root']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-window']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-info']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-name']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-status']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-body']} */ ;
/** @type {__VLS_StyleScopedClasses['message-row']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble-content']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble-time']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['user-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble-content']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble-time']} */ ;
/** @type {__VLS_StyleScopedClasses['manual-chat-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['input-row']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
exports.default = {};
