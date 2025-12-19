"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitApplication = submitApplication;
exports.getMyApplications = getMyApplications;
exports.getApplicationDetail = getApplicationDetail;
exports.cancelApplication = cancelApplication;
exports.getAllApplications = getAllApplications;
exports.reviewApplication = reviewApplication;
var request_1 = require("@/utils/request");
/**
 * 提交领养申请
 */
function submitApplication(data) {
    return (0, request_1.default)({
        url: '/application',
        method: 'post',
        data: data
    });
}
/**
 * 获取我的申请列表
 */
function getMyApplications(params) {
    return (0, request_1.default)({
        url: '/application/my',
        method: 'get',
        params: params
    });
}
/**
 * 获取申请详情
 */
function getApplicationDetail(id) {
    return (0, request_1.default)({
        url: "/application/".concat(id),
        method: 'get'
    });
}
/**
 * 取消申请
 */
function cancelApplication(id) {
    return (0, request_1.default)({
        url: "/application/".concat(id, "/cancel"),
        method: 'put'
    });
}
/**
 * 获取所有申请列表（管理员）
 */
function getAllApplications(params) {
    return (0, request_1.default)({
        url: '/application/list',
        method: 'get',
        params: params
    });
}
/**
 * 审核申请（管理员）
 */
function reviewApplication(id, data) {
    return (0, request_1.default)({
        url: "/application/".concat(id, "/review"),
        method: 'put',
        data: data
    });
}
