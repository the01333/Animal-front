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
var ChatBox_vue_1 = require("../../components/chat/ChatBox.vue");
var request_1 = require("@/utils/request");
// ChatBox组件引用
var chatBoxRef = (0, vue_1.ref)(null);
// 加载状态
var loading = (0, vue_1.ref)(false);
// 常见问题
var quickQuestions = (0, vue_1.ref)([
    { id: 1, text: '如何申请领养宠物？' },
    { id: 2, text: '领养需要什么条件？' },
    { id: 3, text: '领养后如何照顾宠物？' },
    { id: 4, text: '宠物生病了怎么办？' },
    { id: 5, text: '如何办理宠物证件？' },
    { id: 6, text: '宠物绝育有必要吗？' }
]);
// 处理发送消息
var handleSendMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!message.trim())
                    return [2 /*return*/];
                // 添加用户消息到聊天记录
                (_a = chatBoxRef.value) === null || _a === void 0 ? void 0 : _a.addMessage(message, 'user');
                loading.value = true;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, request_1.default.post('/ai/service/chat', { content: message })];
            case 2:
                res = _e.sent();
                if (res.code === 200) {
                    (_b = chatBoxRef.value) === null || _b === void 0 ? void 0 : _b.addMessage(res.data, 'ai');
                }
                else {
                    (_c = chatBoxRef.value) === null || _c === void 0 ? void 0 : _c.addMessage(res.message || '抱歉，AI客服暂时无法回答。', 'ai');
                }
                return [3 /*break*/, 5];
            case 3:
                error_1 = _e.sent();
                // 添加错误消息到聊天记录
                (_d = chatBoxRef.value) === null || _d === void 0 ? void 0 : _d.addMessage('抱歉，AI客服暂时无法回答您的问题，请稍后重试或联系人工客服。', 'ai');
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 选择快捷问题
var selectQuickQuestion = function (question) {
    handleSendMessage(question.text);
};
(0, vue_1.onMounted)(function () {
    // 添加欢迎消息
    setTimeout(function () {
        var _a;
        (_a = chatBoxRef.value) === null || _a === void 0 ? void 0 : _a.addMessage('您好！我是AI智能客服，可以为您解答关于宠物领养的各种问题。请问有什么可以帮助您的吗？', 'ai');
    }, 500);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-questions']} */ ;
/** @type {__VLS_StyleScopedClasses['question-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['questions-grid']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "ai-chat-container" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-header" }));
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-content" }));
/** @type {[typeof ChatBox, ]} */ ;
// @ts-ignore
var __VLS_0 = __VLS_asFunctionalComponent(ChatBox_vue_1.default, new ChatBox_vue_1.default(__assign({ 'onSendMessage': {} }, { ref: "chatBoxRef", title: "AI智能客服", disabled: (__VLS_ctx.loading) })));
var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign({ 'onSendMessage': {} }, { ref: "chatBoxRef", title: "AI智能客服", disabled: (__VLS_ctx.loading) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
var __VLS_3;
var __VLS_4;
var __VLS_5 = ({ sendMessage: {} },
    { onSendMessage: (__VLS_ctx.handleSendMessage) });
/** @type {typeof __VLS_ctx.chatBoxRef} */ ;
var __VLS_6 = {};
// @ts-ignore
[loading, handleSendMessage, chatBoxRef,];
var __VLS_2;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "quick-questions" }));
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "questions-grid" }));
var _loop_1 = function (question) {
    // @ts-ignore
    [quickQuestions,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.selectQuickQuestion(question);
            // @ts-ignore
            [selectQuickQuestion,];
        } }, { key: (question.id) }), { class: "question-item" }));
    (question.text);
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.quickQuestions)); _i < _a.length; _i++) {
    var question = _a[_i][0];
    _loop_1(question);
}
/** @type {__VLS_StyleScopedClasses['ai-chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-questions']} */ ;
/** @type {__VLS_StyleScopedClasses['questions-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['question-item']} */ ;
// @ts-ignore
var __VLS_7 = __VLS_6;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
