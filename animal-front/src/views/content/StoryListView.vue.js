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
var story_1 = require("@/api/story");
var element_plus_1 = require("element-plus");
// 故事分类
var categories = (0, vue_1.ref)([]);
// 过滤条件
var filters = (0, vue_1.ref)({
    category: '',
    keyword: ''
});
// 分页数据
var currentPage = (0, vue_1.ref)(1);
var itemsPerPage = (0, vue_1.ref)(6);
var totalItems = (0, vue_1.ref)(0);
// 默认图片
var defaultImage = 'http://localhost:9000/animal-adopt/default.jpg';
// 当前用户ID
var currentUserId = (0, vue_1.ref)(null);
// 故事数据
var stories = (0, vue_1.ref)([]);
var loading = (0, vue_1.ref)(false);
// 防抖定时器
var debounceTimer = null;
// 加载故事分类
var loadCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, categoryList, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, story_1.getStoryCategories)()];
            case 1:
                response = _a.sent();
                categoryList = response.data || [];
                console.log('获取到的故事分类:', categoryList);
                categories.value = categoryList.map(function (cat, index) { return ({
                    id: "cat_".concat(index),
                    name: cat
                }); });
                console.log('处理后的分类选项:', categories.value);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('加载故事分类失败:', error_1);
                categories.value = [];
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var buildKeyword = function () {
    var keywords = [];
    // 只有当分类不为空时才添加
    if (filters.value.category && filters.value.category.trim()) {
        keywords.push(filters.value.category.trim());
    }
    // 只有当搜索关键词不为空时才添加
    if (filters.value.keyword && filters.value.keyword.trim()) {
        keywords.push(filters.value.keyword.trim());
    }
    return keywords.length > 0 ? keywords.join(' ') : '';
};
// 加载故事列表
var loadStories = function () { return __awaiter(void 0, void 0, void 0, function () {
    var keyword, response, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                loading.value = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, 4, 5]);
                keyword = buildKeyword();
                console.log('加载故事，关键词:', keyword || '(全部)');
                return [4 /*yield*/, (0, story_1.getStoryList)({
                        current: currentPage.value,
                        size: itemsPerPage.value,
                        keyword: keyword || undefined
                    })];
            case 2:
                response = _c.sent();
                stories.value = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.records) || [];
                totalItems.value = ((_b = response.data) === null || _b === void 0 ? void 0 : _b.total) || 0;
                console.log('加载成功，共', stories.value.length, '条');
                return [3 /*break*/, 5];
            case 3:
                error_2 = _c.sent();
                console.error('加载故事列表失败:', error_2);
                element_plus_1.ElMessage.error('加载故事列表失败');
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 重置过滤器
var resetFilters = function () {
    filters.value = {
        category: '',
        keyword: ''
    };
    currentPage.value = 1;
    loadStories();
};
// 监听过滤条件变化，重新加载（带防抖）
var handleFilterChange = function () {
    currentPage.value = 1;
    // 清除之前的定时器
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    // 设置新的定时器，延迟500ms后执行搜索
    debounceTimer = setTimeout(function () {
        loadStories();
        debounceTimer = null;
    }, 500);
};
var handlePageChange = function (page) {
    currentPage.value = page;
    loadStories();
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
    loadStories();
});
(0, vue_1.onActivated)(function () {
    loadStories();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['story-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-reset']} */ ;
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['story-image']} */ ;
/** @type {__VLS_StyleScopedClasses['story-content']} */ ;
/** @type {__VLS_StyleScopedClasses['story-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['story-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-row']} */ ;
/** @type {__VLS_StyleScopedClasses['story-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-read-more']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['stories-filter']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['stories-grid']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "story-list-container" }));
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "subtitle" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stories-filter" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "category",
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)(__assign({ onChange: (__VLS_ctx.handleFilterChange) }, { id: "category", value: (__VLS_ctx.filters.category) }));
// @ts-ignore
[handleFilterChange, filters,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
});
for (var _i = 0, _d = __VLS_getVForSourceType((__VLS_ctx.categories)); _i < _d.length; _i++) {
    var category = _d[_i][0];
    // @ts-ignore
    [categories,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (category.id),
        value: (category.name),
    });
    (category.name);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "filter-group" }));
__VLS_asFunctionalElement(__VLS_elements.input)(__assign(__assign({ onInput: (__VLS_ctx.handleFilterChange) }, { type: "text", value: (__VLS_ctx.filters.keyword), placeholder: "搜索故事标题..." }), { class: "search-input" }));
// @ts-ignore
[handleFilterChange, filters,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.resetFilters) }, { class: "btn-reset" }));
// @ts-ignore
[resetFilters,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stories-grid" }));
for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.stories)); _e < _f.length; _e++) {
    var story = _f[_e][0];
    // @ts-ignore
    [stories,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (story.id) }, { class: "story-card" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "story-image" }));
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (story.coverImage || __VLS_ctx.defaultImage),
        alt: (story.title),
    });
    // @ts-ignore
    [defaultImage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "story-content" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "story-tags" }));
    for (var _g = 0, _h = __VLS_getVForSourceType((story.tags || [])); _g < _h.length; _g++) {
        var tag = _h[_g][0];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ key: (tag) }, { class: "tag" }));
        (tag);
    }
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    (story.title);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "story-excerpt" }));
    (story.summary);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "story-meta" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "meta-row" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    (story.author);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    (story.publishDate);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-footer" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "footer-stats" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    ((_a = story.viewCount) !== null && _a !== void 0 ? _a : 0);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    ((_b = story.likeCount) !== null && _b !== void 0 ? _b : 0);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    ((_c = story.favoriteCount) !== null && _c !== void 0 ? _c : 0);
    var __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ to: ("/story/".concat(story.id)) }, { class: "btn-read-more" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ to: ("/story/".concat(story.id)) }, { class: "btn-read-more" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_4 = __VLS_3.slots.default;
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pagination" }));
var __VLS_5 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
ElPagination;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5(__assign({ 'onCurrentChange': {} }, { background: true, layout: "prev, pager, next", total: (__VLS_ctx.totalItems), pageSize: (__VLS_ctx.itemsPerPage), currentPage: (__VLS_ctx.currentPage) })));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign({ 'onCurrentChange': {} }, { background: true, layout: "prev, pager, next", total: (__VLS_ctx.totalItems), pageSize: (__VLS_ctx.itemsPerPage), currentPage: (__VLS_ctx.currentPage) })], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_9;
var __VLS_10;
var __VLS_11 = ({ currentChange: {} },
    { onCurrentChange: (__VLS_ctx.handlePageChange) });
// @ts-ignore
[totalItems, itemsPerPage, currentPage, handlePageChange,];
var __VLS_8;
/** @type {__VLS_StyleScopedClasses['story-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['stories-filter']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-reset']} */ ;
/** @type {__VLS_StyleScopedClasses['stories-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['story-image']} */ ;
/** @type {__VLS_StyleScopedClasses['story-content']} */ ;
/** @type {__VLS_StyleScopedClasses['story-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['story-excerpt']} */ ;
/** @type {__VLS_StyleScopedClasses['story-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-row']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-read-more']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
