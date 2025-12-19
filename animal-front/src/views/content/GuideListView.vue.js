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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var guide_1 = require("@/api/guide");
var element_plus_1 = require("element-plus");
// 指南分类
var categories = (0, vue_1.ref)([
    { id: 'all', name: '全部' }
]);
// 激活的分类
var activeCategory = (0, vue_1.ref)('all');
// 监听分类变化，重置分页
var handleCategoryChange = function (categoryId) {
    activeCategory.value = categoryId;
    currentPage.value = 1;
    loadGuides();
};
// 分页数据
var currentPage = (0, vue_1.ref)(1);
var itemsPerPage = (0, vue_1.ref)(6);
var totalItems = (0, vue_1.ref)(0);
// 默认图片
var defaultImage = 'http://localhost:9000/animal-adopt/default.jpg';
// 当前用户ID
var currentUserId = (0, vue_1.ref)(null);
// 指南数据
var guides = (0, vue_1.ref)([]);
var loading = (0, vue_1.ref)(false);
// 路由
var router = (0, vue_router_1.useRouter)();
var buildGuideKeyword = function () {
    var _a;
    var categoryName = (_a = categories.value.find(function (c) { return c.id === activeCategory.value; })) === null || _a === void 0 ? void 0 : _a.name;
    return activeCategory.value !== 'all' ? categoryName : '';
};
// 加载指南分类
var loadCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, categoryList, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, guide_1.getGuideCategories)()];
            case 1:
                response = _a.sent();
                categoryList = response.data || [];
                // 添加分类到列表（保留"全部"）
                categories.value = __spreadArray([
                    { id: 'all', name: '全部' }
                ], categoryList.map(function (cat, index) { return ({
                    id: "cat_".concat(index),
                    name: cat
                }); }), true);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('加载指南分类失败:', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// 加载指南列表
var loadGuides = function () { return __awaiter(void 0, void 0, void 0, function () {
    var keywords, categoryKeyword, response, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                loading.value = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, 4, 5]);
                keywords = [];
                categoryKeyword = buildGuideKeyword();
                if (categoryKeyword)
                    keywords.push(categoryKeyword);
                return [4 /*yield*/, (0, guide_1.getGuideList)({
                        current: currentPage.value,
                        size: itemsPerPage.value,
                        keyword: keywords.join(' ').trim() || undefined
                    })];
            case 2:
                response = _c.sent();
                guides.value = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.records) || [];
                totalItems.value = ((_b = response.data) === null || _b === void 0 ? void 0 : _b.total) || 0;
                return [3 /*break*/, 5];
            case 3:
                error_2 = _c.sent();
                console.error('加载指南列表失败:', error_2);
                element_plus_1.ElMessage.error('加载指南列表失败');
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 查看指南详情
var viewGuide = function (id) {
    router.push("/guide/".concat(id));
};
var handlePageChange = function (page) {
    currentPage.value = page;
    loadGuides();
};
var initUserInfo = function () {
    if (currentUserId.value)
        return;
    var userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            var user = JSON.parse(userInfo);
            currentUserId.value = user.id || user.userId;
        }
        catch (e) {
            console.error('解析用户信息失败:', e);
        }
    }
};
(0, vue_1.onMounted)(function () {
    initUserInfo();
    loadCategories();
    loadGuides();
});
(0, vue_1.onActivated)(function () {
    loadGuides();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['guide-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['category-item']} */ ;
/** @type {__VLS_StyleScopedClasses['category-item']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-card']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-image']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-content']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-content']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['guides-grid']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-list-container" }));
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-categories" }));
var _loop_1 = function (category) {
    // @ts-ignore
    [categories,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.handleCategoryChange(category.id);
            // @ts-ignore
            [handleCategoryChange,];
        } }, { key: (category.id) }), { class: "category-item" }), { class: ({ active: __VLS_ctx.activeCategory === category.id }) }));
    // @ts-ignore
    [activeCategory,];
    (category.name);
};
for (var _i = 0, _d = __VLS_getVForSourceType((__VLS_ctx.categories)); _i < _d.length; _i++) {
    var category = _d[_i][0];
    _loop_1(category);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guides-grid" }));
var _loop_2 = function (guide) {
    // @ts-ignore
    [guides,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.viewGuide(guide.id);
            // @ts-ignore
            [viewGuide,];
        } }, { key: (guide.id) }), { class: "guide-card" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-image" }));
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (guide.coverImage || __VLS_ctx.defaultImage),
        alt: (guide.title),
    });
    // @ts-ignore
    [defaultImage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-content" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    (guide.title);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (guide.summary);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-meta" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    (guide.guideCategory || '通用');
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    (guide.publishDate);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    ((_a = guide.viewCount) !== null && _a !== void 0 ? _a : 0);
    __VLS_asFunctionalElement(__VLS_elements.br)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    ((_b = guide.likeCount) !== null && _b !== void 0 ? _b : 0);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    ((_c = guide.favoriteCount) !== null && _c !== void 0 ? _c : 0);
};
for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.guides)); _e < _f.length; _e++) {
    var guide = _f[_e][0];
    _loop_2(guide);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pagination" }));
var __VLS_0 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
ElPagination;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ 'onCurrentChange': {} }, { background: true, layout: "prev, pager, next", total: (__VLS_ctx.totalItems), pageSize: (__VLS_ctx.itemsPerPage), currentPage: (__VLS_ctx.currentPage) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onCurrentChange': {} }, { background: true, layout: "prev, pager, next", total: (__VLS_ctx.totalItems), pageSize: (__VLS_ctx.itemsPerPage), currentPage: (__VLS_ctx.currentPage) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4;
var __VLS_5;
var __VLS_6 = ({ currentChange: {} },
    { onCurrentChange: (__VLS_ctx.handlePageChange) });
// @ts-ignore
[totalItems, itemsPerPage, currentPage, handlePageChange,];
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['guide-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-categories']} */ ;
/** @type {__VLS_StyleScopedClasses['category-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['guides-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-card']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-image']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-content']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
