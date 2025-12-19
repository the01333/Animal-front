"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePet = likePet;
exports.unlikePet = unlikePet;
exports.getPetLikeCount = getPetLikeCount;
exports.isPetLiked = isPetLiked;
exports.getUserLikedPets = getUserLikedPets;
exports.likeArticle = likeArticle;
exports.unlikeArticle = unlikeArticle;
exports.isArticleLiked = isArticleLiked;
var request_1 = require("@/utils/request");
// 宠物点赞
function likePet(petId) {
    return (0, request_1.default)({ url: "/pet/like/".concat(petId), method: 'post' });
}
function unlikePet(petId) {
    return (0, request_1.default)({ url: "/pet/like/".concat(petId), method: 'delete' });
}
/**
 * 获取宠物点赞数量（无需认证）
 */
function getPetLikeCount(petId) {
    return (0, request_1.default)({ url: "/pet/like/count/".concat(petId), method: 'get' });
}
/**
 * 检查是否已点赞（需要认证）
 */
function isPetLiked(petId) {
    return (0, request_1.default)({ url: "/pet/like/check/".concat(petId), method: 'get' });
}
/**
 * 获取用户点赞的宠物列表
 */
function getUserLikedPets(params) {
    return (0, request_1.default)({ url: '/pet/like/my', method: 'get', params: params });
}
// 内容点赞
function likeArticle(category, articleId) {
    return (0, request_1.default)({ url: "/content/".concat(category, "/").concat(articleId, "/like"), method: 'post' });
}
function unlikeArticle(category, articleId) {
    return (0, request_1.default)({ url: "/content/".concat(category, "/").concat(articleId, "/like"), method: 'delete' });
}
function isArticleLiked(category, articleId) {
    return (0, request_1.default)({ url: "/content/".concat(category, "/").concat(articleId, "/like/check"), method: 'get' });
}
