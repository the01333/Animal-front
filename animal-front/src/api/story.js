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
exports.getStoryList = getStoryList;
exports.getStoryDetail = getStoryDetail;
exports.likeStory = likeStory;
exports.unlikeStory = unlikeStory;
exports.favoriteStory = favoriteStory;
exports.unfavoriteStory = unfavoriteStory;
exports.isStoryLiked = isStoryLiked;
exports.isStoryFavorited = isStoryFavorited;
exports.getStoryCategories = getStoryCategories;
var request_1 = require("@/utils/request");
var STORY = 'STORY';
function getStoryList(params) {
    var _a, _b;
    return (0, request_1.default)({
        url: '/content/page',
        method: 'get',
        params: __assign(__assign({}, params), { category: STORY, current: (_a = params.current) !== null && _a !== void 0 ? _a : 1, size: (_b = params.size) !== null && _b !== void 0 ? _b : 10 })
    });
}
function getStoryDetail(id) {
    return (0, request_1.default)({
        url: "/content/".concat(STORY, "/").concat(id),
        method: 'get'
    });
}
function likeStory(id) {
    return (0, request_1.default)({ url: "/content/".concat(STORY, "/").concat(id, "/like"), method: 'post' });
}
function unlikeStory(id) {
    return (0, request_1.default)({ url: "/content/".concat(STORY, "/").concat(id, "/like"), method: 'delete' });
}
function favoriteStory(id) {
    return (0, request_1.default)({ url: "/content/".concat(STORY, "/").concat(id, "/favorite"), method: 'post' });
}
function unfavoriteStory(id) {
    return (0, request_1.default)({ url: "/content/".concat(STORY, "/").concat(id, "/favorite"), method: 'delete' });
}
function isStoryLiked(id) {
    return (0, request_1.default)({ url: "/content/".concat(STORY, "/").concat(id, "/like/check"), method: 'get' });
}
function isStoryFavorited(id) {
    return (0, request_1.default)({ url: "/content/".concat(STORY, "/").concat(id, "/favorite/check"), method: 'get' });
}
function getStoryCategories() {
    return (0, request_1.default)({ url: '/story/categories/list', method: 'get' });
}
