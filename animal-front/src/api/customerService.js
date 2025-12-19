"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.longPollManualCsMessages = longPollManualCsMessages;
exports.openManualCsSession = openManualCsSession;
exports.getManualCsMessages = getManualCsMessages;
exports.pageManualCsSessions = pageManualCsSessions;
exports.sendManualCsMessage = sendManualCsMessage;
exports.readAckManualCs = readAckManualCs;
var request_1 = require("@/utils/request");
/**
 * 长轮询获取指定会话中的新消息
 */
function longPollManualCsMessages(sessionId, lastMessageId) {
    return (0, request_1.default)({
        url: "/cs/sessions/".concat(sessionId, "/lp-messages"),
        method: 'get',
        params: lastMessageId ? { lastMessageId: lastMessageId } : undefined
    });
}
/**
 * 前台用户: 获取或创建当前用户的人工客服会话
 */
function openManualCsSession() {
    return (0, request_1.default)({
        url: '/cs/session/open',
        method: 'post'
    });
}
/**
 * 获取指定会话的历史消息
 */
function getManualCsMessages(sessionId) {
    return (0, request_1.default)({
        url: "/cs/sessions/".concat(sessionId, "/messages"),
        method: 'get'
    });
}
/**
 * 后台客服: 分页查询会话列表
 */
function pageManualCsSessions(params) {
    return (0, request_1.default)({
        url: '/cs/sessions',
        method: 'get',
        params: params
    });
}
/**
 * 发送人工客服消息
 */
function sendManualCsMessage(sessionId, data) {
    return (0, request_1.default)({
        url: "/cs/sessions/".concat(sessionId, "/messages"),
        method: 'post',
        data: data
    });
}
/**
 * 已读回执: 将会话的未读数清零
 */
function readAckManualCs(sessionId, readSide) {
    return (0, request_1.default)({
        url: "/cs/sessions/".concat(sessionId, "/read-ack"),
        method: 'post',
        params: { readSide: readSide }
    });
}
