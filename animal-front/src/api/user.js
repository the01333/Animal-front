"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.getUserInfo = getUserInfo;
exports.verifyToken = verifyToken;
exports.refreshToken = refreshToken;
exports.updateUserInfo = updateUserInfo;
exports.uploadUserAvatar = uploadUserAvatar;
exports.changePassword = changePassword;
exports.loginByEmailCode = loginByEmailCode;
exports.loginByPhoneCode = loginByPhoneCode;
exports.sendEmailVerificationCode = sendEmailVerificationCode;
exports.sendPhoneVerificationCode = sendPhoneVerificationCode;
exports.getUserList = getUserList;
exports.deleteUser = deleteUser;
exports.updateUserStatus = updateUserStatus;
exports.updateAdminUser = updateAdminUser;
exports.getCertificationInfo = getCertificationInfo;
exports.submitCertification = submitCertification;
exports.getCertificationList = getCertificationList;
exports.getCertificationDetail = getCertificationDetail;
exports.reviewCertification = reviewCertification;
var request_1 = require("@/utils/request");
/**
 * 用户登录
 */
function login(data) {
    return (0, request_1.default)({
        url: '/user/login',
        method: 'post',
        data: data
    });
}
/**
 * 用户注册
 */
function register(data) {
    return (0, request_1.default)({
        url: '/user/register',
        method: 'post',
        data: data
    });
}
/**
 * 获取当前用户信息
 */
function getUserInfo() {
    return (0, request_1.default)({
        url: '/user/info',
        method: 'get'
    });
}
/**
 * 验证Token是否有效
 * 前端可以定期调用此接口检查Token是否过期
 */
function verifyToken() {
    return (0, request_1.default)({
        url: '/user/verify-token',
        method: 'get'
    });
}
/**
 * Token续约接口
 * 用户在线时调用此接口，自动续约Token的活跃时间
 * 类似Redisson的分布式锁续约机制
 */
function refreshToken() {
    return (0, request_1.default)({
        url: '/user/refresh-token',
        method: 'post'
    });
}
/**
 * 更新用户信息
 */
function updateUserInfo(data) {
    return (0, request_1.default)({
        url: '/user/update',
        method: 'put',
        data: data
    });
}
/**
 * 上传用户头像
 */
function uploadUserAvatar(file) {
    var formData = new FormData();
    formData.append('avatar', file);
    return (0, request_1.default)({
        url: '/user/avatar/upload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
/**
 * 修改密码
 */
function changePassword(data) {
    return (0, request_1.default)({
        url: '/user/password',
        method: 'put',
        data: data
    });
}
// 验证码登录
function loginByEmailCode(email, code) {
    return (0, request_1.default)({ url: '/user/login/email-code', method: 'post', data: { email: email, code: code } });
}
function loginByPhoneCode(phone, code) {
    return (0, request_1.default)({ url: '/user/login/phone-code', method: 'post', data: { phone: phone, code: code } });
}
function sendEmailVerificationCode(email, purpose) {
    if (purpose === void 0) { purpose = 'login'; }
    return (0, request_1.default)({ url: '/verification/email/send', method: 'post', data: { email: email, purpose: purpose } });
}
function sendPhoneVerificationCode(phone, purpose) {
    if (purpose === void 0) { purpose = 'login'; }
    return (0, request_1.default)({ url: '/verification/phone/send', method: 'post', data: { phone: phone, purpose: purpose } });
}
/**
 * 获取用户列表（管理员）
 */
function getUserList(params) {
    return (0, request_1.default)({
        url: '/user/list',
        method: 'get',
        params: params
    });
}
/**
 * 删除用户（管理员）
 */
function deleteUser(id) {
    return (0, request_1.default)({
        url: "/user/".concat(id),
        method: 'delete'
    });
}
/**
 * 更新用户状态（管理员）
 */
function updateUserStatus(id, status) {
    return (0, request_1.default)({
        url: "/user/".concat(id, "/status"),
        method: 'put',
        data: { status: status }
    });
}
/**
 * 管理员编辑用户信息/角色/状态
 */
function updateAdminUser(id, data) {
    return (0, request_1.default)({
        url: "/user/".concat(id, "/admin"),
        method: 'put',
        data: data
    });
}
/**
 * 获取用户认证信息
 */
function getCertificationInfo() {
    return (0, request_1.default)({
        url: '/user/certification/info',
        method: 'get'
    });
}
/**
 * 提交用户认证
 */
function submitCertification(data) {
    return (0, request_1.default)({
        url: '/user/certification/submit',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
function getCertificationList(params) {
    return (0, request_1.default)({
        url: '/user/certification/admin/list',
        method: 'get',
        params: params
    });
}
function getCertificationDetail(id) {
    return (0, request_1.default)({
        url: "/user/certification/admin/".concat(id),
        method: 'get'
    });
}
function reviewCertification(id, data) {
    return (0, request_1.default)({
        url: "/user/certification/admin/".concat(id, "/review"),
        method: 'put',
        data: data
    });
}
