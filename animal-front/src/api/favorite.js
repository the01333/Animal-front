"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPetFavorite = addPetFavorite;
exports.removePetFavorite = removePetFavorite;
exports.getPetFavoriteCount = getPetFavoriteCount;
exports.isPetFavorited = isPetFavorited;
exports.getUserFavoritePets = getUserFavoritePets;
exports.addArticleFavorite = addArticleFavorite;
exports.removeArticleFavorite = removeArticleFavorite;
exports.isArticleFavorited = isArticleFavorited;
var request_1 = require("@/utils/request");
// 宠物收藏
function addPetFavorite(petId) {
    return (0, request_1.default)({ url: "/favorite/".concat(petId), method: 'post' });
}
function removePetFavorite(petId) {
    return (0, request_1.default)({ url: "/favorite/".concat(petId), method: 'delete' });
}
/**
 * 获取宠物收藏数量（无需认证）
 */
function getPetFavoriteCount(petId) {
    return (0, request_1.default)({ url: "/favorite/count/".concat(petId), method: 'get' });
}
/**
 * 检查是否已收藏（需要认证）
 */
function isPetFavorited(petId) {
    return (0, request_1.default)({ url: "/favorite/check/".concat(petId), method: 'get' });
}
/**
 * 获取用户收藏的宠物列表
 */
function getUserFavoritePets(params) {
    return (0, request_1.default)({ url: '/favorite/my/pets', method: 'get', params: params });
}
// 内容收藏
function addArticleFavorite(category, articleId) {
    return (0, request_1.default)({ url: "/content/".concat(category, "/").concat(articleId, "/favorite"), method: 'post' });
}
function removeArticleFavorite(category, articleId) {
    return (0, request_1.default)({ url: "/content/".concat(category, "/").concat(articleId, "/favorite"), method: 'delete' });
}
function isArticleFavorited(category, articleId) {
    return (0, request_1.default)({ url: "/content/".concat(category, "/").concat(articleId, "/favorite/check"), method: 'get' });
}
