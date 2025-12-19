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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var props = defineProps();
var emit = defineEmits();
var messages = (0, vue_1.ref)([]);
var newMessage = (0, vue_1.ref)('');
var messagesContainer = (0, vue_1.ref)(null);
// 发送消息
var sendMessage = function () {
    if (newMessage.value.trim() && !props.disabled) {
        emit('send-message', newMessage.value.trim());
        newMessage.value = '';
    }
};
// 添加消息到聊天记录
var addMessage = function (content, sender) {
    var message = {
        id: Date.now().toString(),
        content: content,
        sender: sender,
        timestamp: new Date()
    };
    messages.value.push(message);
    scrollToBottom();
};
// 格式化时间
var formatTime = function (date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
// 滚动到底部
var scrollToBottom = function () {
    (0, vue_1.nextTick)(function () {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};
// 暴露方法给父组件
var __VLS_exposed = {
    addMessage: addMessage
};
defineExpose(__VLS_exposed);
(0, vue_1.onMounted)(function () {
    // 初始化示例消息
    messages.value.push({
        id: '1',
        content: '您好！欢迎使用我们的服务，请问有什么可以帮助您的吗？',
        sender: 'ai',
        timestamp: new Date()
    });
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['message-sent']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['message-received']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-container" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-header" }));
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
(__VLS_ctx.title);
// @ts-ignore
[title,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-messages" }, { ref: "messagesContainer" }));
/** @type {typeof __VLS_ctx.messagesContainer} */ ;
// @ts-ignore
[messagesContainer,];
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.messages)); _i < _a.length; _i++) {
    var message = _a[_i][0];
    // @ts-ignore
    [messages,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ key: (message.id) }, { class: "message" }), { class: ({ 'message-sent': message.sender === 'user', 'message-received': message.sender !== 'user' }) }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-content" }));
    (message.content);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "message-time" }));
    (__VLS_ctx.formatTime(message.timestamp));
    // @ts-ignore
    [formatTime,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "chat-input" }));
__VLS_asFunctionalElement(__VLS_elements.input)(__assign({ onKeyup: (__VLS_ctx.sendMessage) }, { placeholder: "输入消息...", disabled: (__VLS_ctx.disabled) }));
(__VLS_ctx.newMessage);
// @ts-ignore
[sendMessage, disabled, newMessage,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.sendMessage) }, { disabled: (__VLS_ctx.disabled || !__VLS_ctx.newMessage.trim()) }));
// @ts-ignore
[sendMessage, disabled, newMessage,];
/** @type {__VLS_StyleScopedClasses['chat-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-messages']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['message-sent']} */ ;
/** @type {__VLS_StyleScopedClasses['message-received']} */ ;
/** @type {__VLS_StyleScopedClasses['message-content']} */ ;
/** @type {__VLS_StyleScopedClasses['message-time']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-input']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () { return (__VLS_exposed); },
    __typeEmits: {},
    __typeProps: {},
});
exports.default = {};
