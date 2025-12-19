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
exports.chatWithAIStream = chatWithAIStream;
exports.chatWithAIMemoryStream = chatWithAIMemoryStream;
exports.getWelcomeMessage = getWelcomeMessage;
/**
 * 流式发送消息到AI客服
 * @param content 用户输入的消息内容
 * @param onChunk 每次接收到数据块时的回调函数
 * @returns Promise
 */
function chatWithAIStream(content, onChunk) {
    return __awaiter(this, void 0, void 0, function () {
        var token, headers, response, reader, decoder, buffer, _a, done, value, lines, i, line, jsonStr, data, jsonStr, data;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    token = localStorage.getItem('token');
                    headers = {
                        'Content-Type': 'application/json',
                    };
                    if (token) {
                        headers['Authorization'] = token;
                    }
                    return [4 /*yield*/, fetch('/api/ai/service/chat-stream', {
                            method: 'POST',
                            headers: headers,
                            credentials: 'include',
                            body: JSON.stringify({ content: content })
                        })];
                case 1:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    reader = (_b = response.body) === null || _b === void 0 ? void 0 : _b.getReader();
                    if (!reader) {
                        throw new Error('Response body is not readable');
                    }
                    decoder = new TextDecoder();
                    buffer = '';
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 6, 7]);
                    _c.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, reader.read()];
                case 4:
                    _a = _c.sent(), done = _a.done, value = _a.value;
                    if (done)
                        return [3 /*break*/, 5];
                    buffer += decoder.decode(value, { stream: true });
                    lines = buffer.split('\n');
                    // 保留最后一个不完整的行
                    buffer = lines[lines.length - 1];
                    // 处理完整的行
                    for (i = 0; i < lines.length - 1; i++) {
                        line = lines[i].trim();
                        if (line.startsWith('data:')) {
                            jsonStr = line.substring(5).trim();
                            if (jsonStr) {
                                try {
                                    data = JSON.parse(jsonStr);
                                    onChunk(data);
                                }
                                catch (e) {
                                    console.warn('Failed to parse JSON:', jsonStr, e);
                                }
                            }
                        }
                    }
                    return [3 /*break*/, 3];
                case 5:
                    // 处理最后的缓冲区
                    if (buffer.trim().startsWith('data:')) {
                        jsonStr = buffer.trim().substring(5).trim();
                        if (jsonStr) {
                            try {
                                data = JSON.parse(jsonStr);
                                onChunk(data);
                            }
                            catch (e) {
                                console.warn('Failed to parse final JSON:', jsonStr, e);
                            }
                        }
                    }
                    return [3 /*break*/, 7];
                case 6:
                    reader.releaseLock();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * 流式多轮对话（使用会话记忆）
 * @param content 用户输入的消息内容
 * @param sessionId 会话ID
 * @param onChunk 每次接收到数据块时的回调函数
 * @returns Promise
 */
function chatWithAIMemoryStream(content, sessionId, onChunk) {
    return __awaiter(this, void 0, void 0, function () {
        var token, headers, response, errorMessage, errorData, e_1, reader, decoder, buffer, sessionIdFromResponse, _a, done, value, lines, i, line, jsonStr, data, jsonStr, data, sessionIdFromHeader;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    token = localStorage.getItem('token');
                    headers = {
                        'Content-Type': 'application/json',
                    };
                    if (token) {
                        headers['Authorization'] = "Bearer ".concat(token);
                    }
                    return [4 /*yield*/, fetch('/api/ai/service/chat-with-memory-stream', {
                            method: 'POST',
                            headers: headers,
                            credentials: 'include',
                            body: JSON.stringify({
                                content: content,
                                sessionId: sessionId || ''
                            })
                        })
                        // 处理 401 未授权错误（登录过期或未登录）
                    ];
                case 1:
                    response = _c.sent();
                    if (!(response.status === 401)) return [3 /*break*/, 6];
                    console.warn('登录验证失败: 401');
                    errorMessage = '登录信息已过期，请重新登录';
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _c.sent();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _c.sent();
                    return [3 /*break*/, 5];
                case 5: 
                // 抛出错误，让调用者处理
                throw new Error(errorMessage);
                case 6:
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    reader = (_b = response.body) === null || _b === void 0 ? void 0 : _b.getReader();
                    if (!reader) {
                        throw new Error('Response body is not readable');
                    }
                    decoder = new TextDecoder();
                    buffer = '';
                    sessionIdFromResponse = sessionId || '';
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, , 11, 12]);
                    _c.label = 8;
                case 8:
                    if (!true) return [3 /*break*/, 10];
                    return [4 /*yield*/, reader.read()];
                case 9:
                    _a = _c.sent(), done = _a.done, value = _a.value;
                    if (done)
                        return [3 /*break*/, 10];
                    buffer += decoder.decode(value, { stream: true });
                    lines = buffer.split('\n');
                    // 保留最后一个不完整的行
                    buffer = lines[lines.length - 1];
                    // 处理完整的行
                    for (i = 0; i < lines.length - 1; i++) {
                        line = lines[i].trim();
                        if (line.startsWith('data:')) {
                            jsonStr = line.substring(5).trim();
                            if (jsonStr) {
                                try {
                                    data = JSON.parse(jsonStr);
                                    // data 现在是解析后的字符串，可以直接使用
                                    onChunk(data);
                                }
                                catch (e) {
                                    console.warn('Failed to parse JSON:', jsonStr, e);
                                }
                            }
                        }
                    }
                    return [3 /*break*/, 8];
                case 10:
                    // 处理最后的缓冲区
                    if (buffer.trim().startsWith('data:')) {
                        jsonStr = buffer.trim().substring(5).trim();
                        if (jsonStr) {
                            try {
                                data = JSON.parse(jsonStr);
                                onChunk(data);
                            }
                            catch (e) {
                                console.warn('Failed to parse final JSON:', jsonStr, e);
                            }
                        }
                    }
                    return [3 /*break*/, 12];
                case 11:
                    reader.releaseLock();
                    return [7 /*endfinally*/];
                case 12:
                    // 如果没有 sessionId，从响应头中获取
                    if (!sessionIdFromResponse) {
                        sessionIdFromHeader = response.headers.get('X-Session-Id');
                        if (sessionIdFromHeader) {
                            sessionIdFromResponse = sessionIdFromHeader;
                        }
                    }
                    console.log('📤 返回的 sessionId:', sessionIdFromResponse);
                    return [2 /*return*/, sessionIdFromResponse];
            }
        });
    });
}
/**
 * 获取AI客服的欢迎语
 */
function getWelcomeMessage() {
    return "\uD83D\uDC4B \u6B22\u8FCE\u6765\u5230i\u5BA0\u56EDAI\u5BA2\u670D\uFF01\n\n\u6211\u662F\u60A8\u7684\u5BA0\u7269\u9886\u517B\u987E\u95EE\uFF0C\u5F88\u9AD8\u5174\u4E3A\u60A8\u670D\u52A1\u3002\u6211\u53EF\u4EE5\u5E2E\u52A9\u60A8\uFF1A\n\n\uD83D\uDC31 **\u5BA0\u7269\u63A8\u8350** - \u6839\u636E\u60A8\u7684\u9700\u6C42\u63A8\u8350\u5408\u9002\u7684\u5BA0\u7269\n  \u4F8B\u5982\uFF1A\"\u6709\u4EC0\u4E48\u63A8\u8350\u7684\u5BA0\u7269\u5417\uFF1F\"\n  \u4F8B\u5982\uFF1A\"\u6211\u60F3\u8981\u4E00\u53EA\u6D3B\u6CFC\u7684\u5C0F\u72D7\"\n\n\uD83D\uDC64 **\u6027\u683C\u5339\u914D** - \u6839\u636E\u60A8\u7684\u6027\u683C\u63A8\u8350\u5BA0\u7269\n  \u4F8B\u5982\uFF1A\"\u6211\u6027\u683C\u5185\u5411\uFF0C\u9002\u5408\u517B\u4EC0\u4E48\u5BA0\u7269\uFF1F\"\n  \u4F8B\u5982\uFF1A\"\u6211\u662F\u4E2A\u5F88\u5FD9\u7684\u4E0A\u73ED\u65CF\"\n\n\uD83C\uDFE0 **\u751F\u6D3B\u65B9\u5F0F** - \u6839\u636E\u60A8\u7684\u751F\u6D3B\u73AF\u5883\u63A8\u8350\u5BA0\u7269\n  \u4F8B\u5982\uFF1A\"\u6211\u4F4F\u5728\u516C\u5BD3\u91CC\uFF0C\u6709\u4EC0\u4E48\u63A8\u8350\u5417\uFF1F\"\n  \u4F8B\u5982\uFF1A\"\u6211\u6709\u4E00\u4E2A\u5C0F\u5B69\uFF0C\u60F3\u517B\u4E00\u53EA\u5BA0\u7269\"\n\n\uD83D\uDCDA **\u62A4\u7406\u6307\u5357** - \u63D0\u4F9B\u5BA0\u7269\u62A4\u7406\u5EFA\u8BAE\n  \u4F8B\u5982\uFF1A\"\u600E\u6837\u7167\u987E\u5C0F\u732B\uFF1F\"\n  \u4F8B\u5982\uFF1A\"\u65B0\u624B\u517B\u72D7\u8981\u6CE8\u610F\u4EC0\u4E48\uFF1F\"\n\n\u2753 **\u5176\u4ED6\u95EE\u9898** - \u56DE\u7B54\u5173\u4E8E\u5BA0\u7269\u7684\u5404\u79CD\u95EE\u9898\n  \u4F8B\u5982\uFF1A\"\u5BA0\u7269\u9700\u8981\u6253\u75AB\u82D7\u5417\uFF1F\"\n  \u4F8B\u5982\uFF1A\"\u5BA0\u7269\u751F\u75C5\u4E86\u600E\u4E48\u529E\uFF1F\"\n\n\u8BF7\u544A\u8BC9\u6211\u60A8\u7684\u9700\u6C42\uFF0C\u6211\u4F1A\u4E3A\u60A8\u63D0\u4F9B\u6700\u597D\u7684\u5EFA\u8BAE\uFF01";
}
