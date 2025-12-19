"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticleList = getArticleList;
exports.getArticleDetail = getArticleDetail;
exports.createArticle = createArticle;
exports.updateArticle = updateArticle;
exports.deleteArticle = deleteArticle;
exports.getArticleCategories = getArticleCategories;
exports.uploadArticleCover = uploadArticleCover;
exports.getUserLikedArticles = getUserLikedArticles;
exports.getUserFavoritedArticles = getUserFavoritedArticles;
exports.getGuideCategoriesList = getGuideCategoriesList;
exports.getStoryCategoriesList = getStoryCategoriesList;
var request_1 = require("@/utils/request");
var guide_1 = require("./guide");
var story_1 = require("./story");
/**
 * 获取文章列表（分页）
 * 统一使用 /page 接口
 */
function getArticleList(params) {
    return (0, request_1.default)({
        url: '/content/page',
        method: 'get',
        params: params
    });
}
/**
 * 获取文章详情
 */
function getArticleDetail(category, id) {
    return (0, request_1.default)({
        url: "/content/".concat(category, "/").concat(id),
        method: 'get'
    });
}
/**
 * 创建文章（管理员）
 */
function createArticle(data) {
    return (0, request_1.default)({
        url: '/content',
        method: 'post',
        data: data
    });
}
/**
 * 更新文章（管理员）
 */
function updateArticle(category, id, data) {
    return (0, request_1.default)({
        url: "/content/".concat(category, "/").concat(id),
        method: 'put',
        data: data
    });
}
/**
 * 删除文章（管理员）
 */
function deleteArticle(category, id) {
    return (0, request_1.default)({
        url: "/content/".concat(category, "/").concat(id),
        method: 'delete'
    });
}
/**
 * 获取文章分类
 */
function getArticleCategories() {
    return (0, request_1.default)({
        url: '/content/categories',
        method: 'get'
    });
}
function uploadArticleCover(formData) {
    return (0, request_1.default)({
        url: '/file/upload/image',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
function getUserLikedArticles(params) {
    return (0, request_1.default)({
        url: '/content/like/my',
        method: 'get',
        params: params
    });
}
function getUserFavoritedArticles(params) {
    return (0, request_1.default)({
        url: '/content/favorite/my',
        method: 'get',
        params: params
    });
}
/**
 * 获取指南分类列表
 */
function getGuideCategoriesList() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, guide_1.getGuideCategories)()];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.data || []];
                case 2:
                    error_1 = _a.sent();
                    console.error('获取指南分类失败:', error_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * 获取故事分类列表
 */
function getStoryCategoriesList() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, story_1.getStoryCategories)()];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.data || []];
                case 2:
                    error_2 = _a.sent();
                    console.error('获取故事分类失败:', error_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
