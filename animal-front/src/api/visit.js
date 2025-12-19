"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackVisit = trackVisit;
var request_1 = require("@/utils/request");
/**
 * 记录当天 UV（登录后调用，幂等）
 */
function trackVisit() {
    return (0, request_1.default)({
        url: '/visit/track',
        method: 'get'
    });
}
