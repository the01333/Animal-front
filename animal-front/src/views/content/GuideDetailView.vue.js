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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var pinia_1 = require("pinia");
var user_1 = require("@/stores/user");
var guide_1 = require("@/api/guide");
var marked_1 = require("marked");
var element_plus_1 = require("element-plus");
var image_1 = require("@/utils/image");
// 路由相关
var route = (0, vue_router_1.useRoute)();
var router = (0, vue_router_1.useRouter)();
var PERSISTENT_QUERY_KEYS = ['from', 'tab', 'category', 'applicationId'];
var buildPersistentQuery = function () {
    var result = {};
    PERSISTENT_QUERY_KEYS.forEach(function (key) {
        var value = route.query[key];
        if (typeof value === 'string' && value) {
            result[key] = value;
        }
    });
    return result;
};
var snapshotCurrentQuery = function () {
    var snapshot = {};
    Object.entries(route.query).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (typeof value === 'string' && value) {
            snapshot[key] = value;
        }
    });
    return snapshot;
};
var encodeQuerySnapshot = function (snapshot) { return encodeURIComponent(JSON.stringify(snapshot)); };
var decodeQuerySnapshot = function (encoded) {
    if (!encoded || typeof encoded !== 'string')
        return {};
    try {
        var parsed = JSON.parse(decodeURIComponent(encoded));
        return Object.entries(parsed).reduce(function (acc, _a) {
            var key = _a[0], value = _a[1];
            if (typeof value === 'string' && value) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }
    catch (error) {
        console.warn('Failed to decode article navigation snapshot', error);
        return {};
    }
};
// 指南数据
var guide = (0, vue_1.ref)(null);
// 当前用户ID
var currentUserId = (0, vue_1.ref)(null);
// 点赞状态
var isLiked = (0, vue_1.ref)(false);
var likeCount = (0, vue_1.ref)(0);
// 收藏状态
var isCollected = (0, vue_1.ref)(false);
var favoriteCount = (0, vue_1.ref)(0);
// 获取用户登录状态和用户信息
var userStore = (0, user_1.useUserStore)();
var _b = (0, pinia_1.storeToRefs)(userStore), isLoggedIn = _b.isLoggedIn, userInfo = _b.userInfo;
// 默认图片
var defaultImage = 'http://localhost:9000/animal-adopt/default.jpg';
var formatCoverImage = function (cover, fallback) {
    if (fallback === void 0) { fallback = ''; }
    var processed = (0, image_1.processImageUrl)(cover);
    return processed || fallback;
};
var guideCoverImage = (0, vue_1.computed)(function () { var _a; return formatCoverImage((_a = guide.value) === null || _a === void 0 ? void 0 : _a.coverImage); });
// 相关指南
var relatedGuides = (0, vue_1.ref)([]);
// 宠物图片池
var petImages = (0, vue_1.ref)([]);
// 渲染后的Markdown内容
var renderedContent = (0, vue_1.computed)(function () {
    if (!guide.value)
        return '';
    return (0, marked_1.marked)(guide.value.content);
});
// 为指南分配随机宠物图片
var assignPetImagesToGuides = function (guides) {
    if (petImages.value.length === 0)
        return guides;
    return guides.map(function (guide) { return (__assign(__assign({}, guide), { image: petImages.value[Math.floor(Math.random() * petImages.value.length)] })); });
};
// 点赞指南
var likeGuideFn = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLoggedIn.value) {
                    element_plus_1.ElMessage.warning('请先登录');
                    return [2 /*return*/];
                }
                if (!guide.value)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (!isLiked.value) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, guide_1.unlikeGuide)(guide.value.id)];
            case 2:
                _a.sent();
                isLiked.value = false;
                likeCount.value = Math.max(likeCount.value - 1, 0);
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, guide_1.likeGuide)(guide.value.id)];
            case 4:
                _a.sent();
                isLiked.value = true;
                likeCount.value += 1;
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error('操作失败:', error_1);
                element_plus_1.ElMessage.error('操作失败，请重试');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// 分享指南
var shareGuide = function () {
    alert('分享功能');
};
// 收藏指南
var handleBack = function () {
    var prevArticleId = route.query.prevArticleId;
    var prevArticleType = route.query.prevArticleType;
    if (prevArticleId && prevArticleType) {
        var prevQuery = decodeQuerySnapshot(route.query.prevArticleQuery);
        router.push({
            name: prevArticleType === 'story' ? 'story-detail' : 'guide-detail',
            params: { id: prevArticleId },
            query: prevQuery
        });
        return;
    }
    if (route.query.from === 'profile') {
        var tab = route.query.tab || 'likes';
        var category = route.query.category;
        router.push({ name: 'profile', query: { tab: tab, category: category } });
        return;
    }
    router.push('/guides');
};
var collectGuide = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLoggedIn.value) {
                    element_plus_1.ElMessage.warning('请先登录');
                    return [2 /*return*/];
                }
                if (!guide.value)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (!isCollected.value) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, guide_1.unfavoriteGuide)(guide.value.id)];
            case 2:
                _a.sent();
                isCollected.value = false;
                favoriteCount.value = Math.max(favoriteCount.value - 1, 0);
                element_plus_1.ElMessage.success('已取消收藏');
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, guide_1.favoriteGuide)(guide.value.id)];
            case 4:
                _a.sent();
                isCollected.value = true;
                favoriteCount.value += 1;
                element_plus_1.ElMessage.success('已收藏');
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error('操作失败:', error_2);
                element_plus_1.ElMessage.error('操作失败，请重试');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// 查看相关指南
var viewRelatedGuide = function (id) {
    var _a;
    if (!id)
        return;
    var query = __assign({}, buildPersistentQuery());
    if ((_a = guide.value) === null || _a === void 0 ? void 0 : _a.id) {
        query.prevArticleType = 'guide';
        query.prevArticleId = String(guide.value.id);
        query.prevArticleQuery = encodeQuerySnapshot(snapshotCurrentQuery());
    }
    router.push({ name: 'guide-detail', params: { id: id }, query: query });
};
// 获取宠物图片池
var fetchPetImages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, pets, images_1, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getPetList({ current: 1, size: 100 })];
            case 1:
                response = _b.sent();
                pets = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.records) || [];
                images_1 = [];
                pets.forEach(function (pet) {
                    if (pet.coverImage) {
                        images_1.push(pet.coverImage);
                    }
                });
                petImages.value = images_1;
                console.log('✅ 获取宠物图片成功，共', images_1.length, '张');
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('获取宠物图片失败:', error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// 获取指南详情
var fetchGuideDetail = function () { return __awaiter(void 0, void 0, void 0, function () {
    var guideId, response, relatedResponse, error_4;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _k.trys.push([0, 3, , 4]);
                guideId = parseInt(route.params.id);
                return [4 /*yield*/, (0, guide_1.getGuideDetail)(guideId)];
            case 1:
                response = _k.sent();
                guide.value = response.data;
                likeCount.value = (_b = (_a = guide.value) === null || _a === void 0 ? void 0 : _a.likeCount) !== null && _b !== void 0 ? _b : 0;
                favoriteCount.value = (_d = (_c = guide.value) === null || _c === void 0 ? void 0 : _c.favoriteCount) !== null && _d !== void 0 ? _d : 0;
                isLiked.value = (_f = (_e = guide.value) === null || _e === void 0 ? void 0 : _e.liked) !== null && _f !== void 0 ? _f : false;
                isCollected.value = (_h = (_g = guide.value) === null || _g === void 0 ? void 0 : _g.favorited) !== null && _h !== void 0 ? _h : false;
                return [4 /*yield*/, (0, guide_1.getGuideList)({ current: 1, size: 20 })];
            case 2:
                relatedResponse = _k.sent();
                relatedGuides.value = (((_j = relatedResponse.data) === null || _j === void 0 ? void 0 : _j.records) || []).filter(function (g) { var _a; return g.id !== ((_a = guide.value) === null || _a === void 0 ? void 0 : _a.id); });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _k.sent();
                console.error('获取指南详情失败:', error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 更新点赞和收藏状态（仅当登录时）
var updateLikeAndFavoriteStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
    var guideId, likedRes, favoritedRes, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!guide.value)
                    return [2 /*return*/];
                guideId = guide.value.id;
                if (!isLoggedIn.value) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, guide_1.isGuideLiked)(guideId)];
            case 2:
                likedRes = _a.sent();
                isLiked.value = likedRes.data || false;
                return [4 /*yield*/, (0, guide_1.isGuideFavorited)(guideId)];
            case 3:
                favoritedRes = _a.sent();
                isCollected.value = favoritedRes.data || false;
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.error('查询用户状态失败:', e_1);
                isLiked.value = false;
                isCollected.value = false;
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                isLiked.value = false;
                isCollected.value = false;
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.onMounted)(function () {
    fetchPetImages();
    fetchGuideDetail();
    updateLikeAndFavoriteStatus();
});
// 监听路由参数变化，当指南ID变化时重新加载
(0, vue_1.watch)(function () { return route.params.id; }, function () {
    // 滚动到页面顶部
    window.scrollTo(0, 0);
    // 重新加载指南详情
    fetchGuideDetail();
    updateLikeAndFavoriteStatus();
});
// 监听登录状态变化，重新查询点赞和收藏状态
(0, vue_1.watch)(function () { return isLoggedIn.value; }, function (newVal) {
    if (guide.value) {
        updateLikeAndFavoriteStatus();
    }
}, { immediate: false });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['content-image']} */ ;
/** @type {__VLS_StyleScopedClasses['content-text']} */ ;
/** @type {__VLS_StyleScopedClasses['content-text']} */ ;
/** @type {__VLS_StyleScopedClasses['content-text']} */ ;
/** @type {__VLS_StyleScopedClasses['content-text']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-like']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-like']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-share']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-collect']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-collect']} */ ;
/** @type {__VLS_StyleScopedClasses['related-item']} */ ;
/** @type {__VLS_StyleScopedClasses['related-item']} */ ;
/** @type {__VLS_StyleScopedClasses['related-item']} */ ;
/** @type {__VLS_StyleScopedClasses['related-item']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['related-grid']} */ ;
if (__VLS_ctx.guide) {
    // @ts-ignore
    [guide,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-detail-container" }));
    var __VLS_0 = {}.ElPageHeader;
    /** @type {[typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, ]} */ ;
    // @ts-ignore
    ElPageHeader;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ 'onBack': {} }, { class: "page-header" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onBack': {} }, { class: "page-header" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_4 = void 0;
    var __VLS_5 = void 0;
    var __VLS_6 = ({ back: {} },
        { onBack: (__VLS_ctx.handleBack) });
    var __VLS_7 = __VLS_3.slots.default;
    // @ts-ignore
    [handleBack,];
    {
        var __VLS_8 = __VLS_3.slots.content;
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-content" }));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "header-title" }));
    }
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-header" }));
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
    (__VLS_ctx.guide.title);
    // @ts-ignore
    [guide,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-meta" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    (__VLS_ctx.guide.guideCategory || '通用');
    // @ts-ignore
    [guide,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    (__VLS_ctx.guide.publishDate);
    // @ts-ignore
    [guide,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    ((_a = __VLS_ctx.guide.viewCount) !== null && _a !== void 0 ? _a : 0);
    // @ts-ignore
    [guide,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    (__VLS_ctx.likeCount);
    // @ts-ignore
    [likeCount,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "meta-item" }));
    (__VLS_ctx.favoriteCount);
    // @ts-ignore
    [favoriteCount,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-content" }));
    if (__VLS_ctx.guideCoverImage) {
        // @ts-ignore
        [guideCoverImage,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "content-image" }));
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.guideCoverImage),
            alt: (__VLS_ctx.guide.title),
        });
        // @ts-ignore
        [guide, guideCoverImage,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "content-text markdown-body" }));
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.renderedContent) }), null, null);
    // @ts-ignore
    [renderedContent,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.likeGuideFn) }, { class: "btn-like" }), { class: ({ liked: __VLS_ctx.isLiked }) }));
    // @ts-ignore
    [likeGuideFn, isLiked,];
    (__VLS_ctx.isLiked ? '已点赞' : '点赞');
    (__VLS_ctx.likeCount);
    // @ts-ignore
    [likeCount, isLiked,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.collectGuide) }, { class: "btn-collect" }), { class: ({ collected: __VLS_ctx.isCollected }) }));
    // @ts-ignore
    [collectGuide, isCollected,];
    (__VLS_ctx.isCollected ? '已收藏' : '收藏');
    (__VLS_ctx.favoriteCount);
    // @ts-ignore
    [favoriteCount, isCollected,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.shareGuide) }, { class: "btn-share" }));
    // @ts-ignore
    [shareGuide,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "related-guides" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "related-grid" }));
    var _loop_1 = function (related) {
        // @ts-ignore
        [relatedGuides,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.guide))
                    return;
                __VLS_ctx.viewRelatedGuide(related.id);
                // @ts-ignore
                [viewRelatedGuide,];
            } }, { key: (related.id) }), { class: "related-item" }));
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.formatCoverImage(related.coverImage, __VLS_ctx.defaultImage)),
            alt: (related.title),
        });
        // @ts-ignore
        [formatCoverImage, defaultImage,];
        __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
        (related.title);
    };
    for (var _i = 0, _c = __VLS_getVForSourceType((__VLS_ctx.relatedGuides)); _i < _c.length; _i++) {
        var related = _c[_i][0];
        _loop_1(related);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-not-found" }));
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    var __VLS_9 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    var __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9(__assign({ to: "/guides" }, { class: "btn-back" })));
    var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([__assign({ to: "/guides" }, { class: "btn-back" })], __VLS_functionalComponentArgsRest(__VLS_10), false));
    var __VLS_13 = __VLS_12.slots.default;
    var __VLS_12;
}
/** @type {__VLS_StyleScopedClasses['guide-detail-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-header']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-item']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-image']} */ ;
/** @type {__VLS_StyleScopedClasses['content-text']} */ ;
/** @type {__VLS_StyleScopedClasses['markdown-body']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-like']} */ ;
/** @type {__VLS_StyleScopedClasses['liked']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-collect']} */ ;
/** @type {__VLS_StyleScopedClasses['collected']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-share']} */ ;
/** @type {__VLS_StyleScopedClasses['related-guides']} */ ;
/** @type {__VLS_StyleScopedClasses['related-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['related-item']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-back']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
