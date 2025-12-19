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
exports.getGuideList = getGuideList;
exports.getGuideDetail = getGuideDetail;
exports.likeGuide = likeGuide;
exports.unlikeGuide = unlikeGuide;
exports.favoriteGuide = favoriteGuide;
exports.unfavoriteGuide = unfavoriteGuide;
exports.isGuideLiked = isGuideLiked;
exports.isGuideFavorited = isGuideFavorited;
exports.getGuideCategories = getGuideCategories;
var request_1 = require("@/utils/request");
var GUIDE = 'GUIDE';
function getGuideList(params) {
    var _a, _b;
    return (0, request_1.default)({
        url: '/content/page',
        method: 'get',
        params: __assign(__assign({}, params), { category: GUIDE, current: (_a = params.current) !== null && _a !== void 0 ? _a : 1, size: (_b = params.size) !== null && _b !== void 0 ? _b : 10 })
    });
}
function getGuideDetail(id) {
    return (0, request_1.default)({
        url: "/content/".concat(GUIDE, "/").concat(id),
        method: 'get'
    });
}
function likeGuide(id) {
    return (0, request_1.default)({ url: "/content/".concat(GUIDE, "/").concat(id, "/like"), method: 'post' });
}
function unlikeGuide(id) {
    return (0, request_1.default)({ url: "/content/".concat(GUIDE, "/").concat(id, "/like"), method: 'delete' });
}
function favoriteGuide(id) {
    return (0, request_1.default)({ url: "/content/".concat(GUIDE, "/").concat(id, "/favorite"), method: 'post' });
}
function unfavoriteGuide(id) {
    return (0, request_1.default)({ url: "/content/".concat(GUIDE, "/").concat(id, "/favorite"), method: 'delete' });
}
function isGuideLiked(id) {
    return (0, request_1.default)({ url: "/content/".concat(GUIDE, "/").concat(id, "/like/check"), method: 'get' });
}
function isGuideFavorited(id) {
    return (0, request_1.default)({ url: "/content/".concat(GUIDE, "/").concat(id, "/favorite/check"), method: 'get' });
}
function getGuideCategories() {
    return (0, request_1.default)({ url: '/guide/categories/list', method: 'get' });
}
