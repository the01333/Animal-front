"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPetList = getPetList;
exports.getPetDetail = getPetDetail;
exports.createPet = createPet;
exports.updatePet = updatePet;
exports.deletePet = deletePet;
exports.getRecommendedPets = getRecommendedPets;
exports.getRandomPetImages = getRandomPetImages;
var request_1 = require("@/utils/request");
/**
 * 获取宠物列表（分页）
 * 统一使用 /page 接口
 */
function getPetList(params) {
    return (0, request_1.default)({
        url: '/pet/page',
        method: 'get',
        params: params
    });
}
/**
 * 获取宠物详情
 */
function getPetDetail(id) {
    return (0, request_1.default)({
        url: "/pet/".concat(id),
        method: 'get'
    });
}
/**
 * 创建宠物（管理员）
 */
function createPet(data) {
    return (0, request_1.default)({
        url: '/pet',
        method: 'post',
        data: data
    });
}
/**
 * 更新宠物（管理员）
 */
function updatePet(id, data) {
    return (0, request_1.default)({
        url: "/pet/".concat(id),
        method: 'put',
        data: data
    });
}
/**
 * 删除宠物（管理员）
 */
function deletePet(id) {
    return (0, request_1.default)({
        url: "/pet/".concat(id),
        method: 'delete'
    });
}
/**
 * 获取推荐宠物
 */
function getRecommendedPets(limit) {
    if (limit === void 0) { limit = 6; }
    return (0, request_1.default)({
        url: '/pet/recommended',
        method: 'get',
        params: { limit: limit }
    });
}
/**
 * 获取随机宠物图片列表（后端已随机处理）
 */
function getRandomPetImages(limit) {
    if (limit === void 0) { limit = 6; }
    return (0, request_1.default)({
        url: '/pet/images/random',
        method: 'get',
        params: { limit: limit }
    });
}
