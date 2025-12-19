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
var element_plus_1 = require("element-plus");
var icons_vue_1 = require("@element-plus/icons-vue");
var icons_vue_2 = require("@element-plus/icons-vue");
var pet_1 = require("@/api/pet");
var story_1 = require("@/api/story");
var user_1 = require("@/stores/user");
var router = (0, vue_router_1.useRouter)();
var userStore = (0, user_1.useUserStore)();
var isLoggedIn = (0, pinia_1.storeToRefs)(userStore).isLoggedIn;
var currentSlide = (0, vue_1.ref)(0);
var loading = (0, vue_1.ref)(false);
var featuredPets = (0, vue_1.ref)([]);
// 处理图片URL，移除@前缀（如果存在）
function processImageUrl(url) {
    if (!url)
        return '';
    // 移除@前缀（如果存在）
    return url.startsWith('@') ? url.substring(1) : url;
}
// 加载推荐宠物
function loadFeaturedPets() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, pet_1.getRecommendedPets)(6)];
                case 2:
                    res = _a.sent();
                    console.log(res.data);
                    if (res.code === 200 && res.data) {
                        featuredPets.value = res.data.map(function (pet) {
                            // 处理图片：优先使用coverImage，否则从images数组中取第一张
                            var imageUrl = processImageUrl(pet.coverImage);
                            if (!imageUrl && pet.images) {
                                try {
                                    var images = [];
                                    if (typeof pet.images === 'string') {
                                        // 检查是否是JSON格式（以[或{开头）
                                        var trimmed = pet.images.trim();
                                        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                                            // 是JSON格式，尝试解析
                                            images = JSON.parse(pet.images);
                                        }
                                        else {
                                            // 不是JSON，可能是直接的URL字符串（可能带@前缀）
                                            images = [pet.images];
                                        }
                                    }
                                    else if (Array.isArray(pet.images)) {
                                        images = pet.images;
                                    }
                                    // 取第一张图片并处理@前缀
                                    if (images.length > 0) {
                                        imageUrl = processImageUrl(images[0]);
                                    }
                                }
                                catch (e) {
                                    // JSON解析失败，可能是直接的URL字符串
                                    if (typeof pet.images === 'string') {
                                        imageUrl = processImageUrl(pet.images);
                                    }
                                    console.warn('解析图片失败，使用原始值:', e);
                                }
                            }
                            // 如果没有图片，使用占位图
                            // if (!imageUrl) {
                            //   imageUrl = `http://localhost:9000/animal-adopt/default.jpg`
                            // }
                            return __assign(__assign({}, pet), { image: imageUrl, status: pet.adoptionStatus || 'available', 
                                // 将月数转换为岁数显示（简化处理，1岁=12个月）
                                age: pet.age ? Math.floor(pet.age / 12) || 1 : 1 });
                        });
                        console.log(featuredPets.value);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('加载推荐宠物失败:', error_1);
                    element_plus_1.ElMessage.error('加载推荐宠物失败，请稍后重试');
                    // 失败时使用空数组，避免显示错误
                    featuredPets.value = [];
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 组件挂载时加载数据
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isLoggedIn.value) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userStore.getUserInfo()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('获取用户信息失败:', error_2);
                return [3 /*break*/, 4];
            case 4:
                loadFeaturedPets();
                loadStories();
                return [2 /*return*/];
        }
    });
}); });
// 故事数据
var stories = (0, vue_1.ref)([]);
// 加载故事 - 随机获取两篇
function loadStories() {
    return __awaiter(this, void 0, void 0, function () {
        var res, allStories, shuffled, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, story_1.getStoryList)({ current: 1, size: 20 })];
                case 1:
                    res = _b.sent();
                    allStories = ((_a = res.data) === null || _a === void 0 ? void 0 : _a.records) || [];
                    if (!allStories.length) {
                        stories.value = [];
                        return [2 /*return*/];
                    }
                    shuffled = __spreadArray([], allStories, true).sort(function () { return Math.random() - 0.5; });
                    stories.value = shuffled.slice(0, 2).map(function (story) {
                        var _a, _b;
                        return (__assign(__assign({}, story), { summary: story.summary || ((_a = story.content) === null || _a === void 0 ? void 0 : _a.slice(0, 100)) || '', image: processImageUrl(story.coverImage) || 'http://localhost:9000/animal-adopt/default.jpg', excerpt: story.summary || ((_b = story.content) === null || _b === void 0 ? void 0 : _b.slice(0, 100)) || '' }));
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    console.error('加载故事失败:', error_3);
                    stories.value = [];
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var adoptionSteps = (0, vue_1.ref)([
    {
        title: '了解领养',
        description: '阅读领养指南，了解领养流程和责任'
    },
    {
        title: '选择宠物',
        description: '浏览宠物列表，选择心仪的小伙伴'
    },
    {
        title: '提交申请',
        description: '填写领养申请表，等待审核'
    },
    {
        title: '见面交流',
        description: '与宠物和工作人员见面，确认合适'
    },
    {
        title: '正式领养',
        description: '签署领养协议，带宠物回家'
    }
]);
var timelineColors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'];
var stepIcons = [
    (0, vue_1.markRaw)(icons_vue_2.Reading),
    (0, vue_1.markRaw)(icons_vue_1.Search),
    (0, vue_1.markRaw)(icons_vue_2.Document),
    (0, vue_1.markRaw)(icons_vue_2.UserFilled),
    (0, vue_1.markRaw)(icons_vue_2.CircleCheck)
];
// 轮播图相关方法
var carouselRef = (0, vue_1.ref)();
function goToPetDetail(id) {
    router.push("/pet/".concat(id));
}
function goToSlide(index) {
    currentSlide.value = index;
    if (carouselRef.value) {
        carouselRef.value.setActiveItem(index);
    }
}
function handleCarouselChange(newIndex) {
    currentSlide.value = newIndex;
}
function applyAdopt(id) {
    router.push("/apply/".concat(id));
}
function getStatusTagType(status) {
    var typeMap = {
        available: 'success',
        pending: 'warning',
        adopted: 'info'
    };
    return typeMap[status] || 'info';
}
function getStatusText(status) {
    var textMap = {
        available: '可领养',
        pending: '待审核',
        adopted: '已领养'
    };
    return textMap[status] || status;
}
// 打开AI聊天小窗口
function openAIChatWidget() {
    // 触发全局事件或直接修改状态来打开AI聊天窗口
    var event = new CustomEvent('openAIChat');
    window.dispatchEvent(event);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['hero-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-carousel-image']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['adopt-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['adopt-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['el-carousel__arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['step-card']} */ ;
/** @type {__VLS_StyleScopedClasses['step-content']} */ ;
/** @type {__VLS_StyleScopedClasses['step-content']} */ ;
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['story-content']} */ ;
/** @type {__VLS_StyleScopedClasses['action-content']} */ ;
/** @type {__VLS_StyleScopedClasses['action-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-description']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['action-content']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "home" }));
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "hero" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "hero-background" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "hero-overlay" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "hero-content" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "hero-icon-wrapper" }));
var __VLS_0 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "hero-icon" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "hero-icon" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
var __VLS_5 = {}.Sunny;
/** @type {[typeof __VLS_components.Sunny, ]} */ ;
// @ts-ignore
icons_vue_1.Sunny;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)(__assign({ class: "hero-title" }));
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "hero-description" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "hero-buttons" }));
var __VLS_10 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(__assign(__assign({ 'onClick': {} }, { class: "hero-btn hero-btn-primary" }), { size: "large" })));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "hero-btn hero-btn-primary" }), { size: "large" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
var __VLS_14;
var __VLS_15;
var __VLS_16 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$router.push('/pets');
            // @ts-ignore
            [$router,];
        } });
var __VLS_17 = __VLS_13.slots.default;
var __VLS_18 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({}));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_19), false));
var __VLS_22 = __VLS_21.slots.default;
var __VLS_23 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
icons_vue_1.Search;
// @ts-ignore
var __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({}));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_24), false));
var __VLS_21;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
var __VLS_13;
var __VLS_28 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28(__assign(__assign({ 'onClick': {} }, { class: "hero-btn hero-btn-success" }), { size: "large" })));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "hero-btn hero-btn-success" }), { size: "large" })], __VLS_functionalComponentArgsRest(__VLS_29), false));
var __VLS_32;
var __VLS_33;
var __VLS_34 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$router.push('/guides');
            // @ts-ignore
            [$router,];
        } });
var __VLS_35 = __VLS_31.slots.default;
var __VLS_36 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
var __VLS_38 = __VLS_37.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_37), false));
var __VLS_40 = __VLS_39.slots.default;
var __VLS_41 = {}.Reading;
/** @type {[typeof __VLS_components.Reading, ]} */ ;
// @ts-ignore
icons_vue_1.Reading;
// @ts-ignore
var __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
var __VLS_43 = __VLS_42.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_42), false));
var __VLS_39;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
var __VLS_31;
var __VLS_46 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46(__assign(__assign({ 'onClick': {} }, { class: "hero-btn hero-btn-warning" }), { size: "large" })));
var __VLS_48 = __VLS_47.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "hero-btn hero-btn-warning" }), { size: "large" })], __VLS_functionalComponentArgsRest(__VLS_47), false));
var __VLS_50;
var __VLS_51;
var __VLS_52 = ({ click: {} },
    { onClick: (__VLS_ctx.openAIChatWidget) });
var __VLS_53 = __VLS_49.slots.default;
// @ts-ignore
[openAIChatWidget,];
var __VLS_54 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
var __VLS_56 = __VLS_55.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_55), false));
var __VLS_58 = __VLS_57.slots.default;
var __VLS_59 = {}.ChatDotRound;
/** @type {[typeof __VLS_components.ChatDotRound, ]} */ ;
// @ts-ignore
icons_vue_1.ChatDotRound;
// @ts-ignore
var __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({}));
var __VLS_61 = __VLS_60.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_60), false));
var __VLS_57;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
var __VLS_49;
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "featured-pets" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "section-header" }));
var __VLS_64 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64(__assign({ class: "section-icon" })));
var __VLS_66 = __VLS_65.apply(void 0, __spreadArray([__assign({ class: "section-icon" })], __VLS_functionalComponentArgsRest(__VLS_65), false));
var __VLS_68 = __VLS_67.slots.default;
var __VLS_69 = {}.Star;
/** @type {[typeof __VLS_components.Star, ]} */ ;
// @ts-ignore
icons_vue_1.Star;
// @ts-ignore
var __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
var __VLS_71 = __VLS_70.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_70), false));
var __VLS_67;
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
var __VLS_74 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
ElDivider;
// @ts-ignore
var __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({}));
var __VLS_76 = __VLS_75.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_75), false));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "carousel-container" }));
if (!__VLS_ctx.loading && __VLS_ctx.featuredPets.length > 0) {
    // @ts-ignore
    [loading, featuredPets,];
    var __VLS_79 = {}.ElCarousel;
    /** @type {[typeof __VLS_components.ElCarousel, typeof __VLS_components.elCarousel, typeof __VLS_components.ElCarousel, typeof __VLS_components.elCarousel, ]} */ ;
    // @ts-ignore
    ElCarousel;
    // @ts-ignore
    var __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79(__assign({ 'onChange': {} }, { ref: "carouselRef", interval: (4000), type: "card", height: "450px", arrow: "always", indicatorPosition: "none" })));
    var __VLS_81 = __VLS_80.apply(void 0, __spreadArray([__assign({ 'onChange': {} }, { ref: "carouselRef", interval: (4000), type: "card", height: "450px", arrow: "always", indicatorPosition: "none" })], __VLS_functionalComponentArgsRest(__VLS_80), false));
    var __VLS_83 = void 0;
    var __VLS_84 = void 0;
    var __VLS_85 = ({ change: {} },
        { onChange: (__VLS_ctx.handleCarouselChange) });
    /** @type {typeof __VLS_ctx.carouselRef} */ ;
    var __VLS_86 = {};
    var __VLS_88 = __VLS_82.slots.default;
    // @ts-ignore
    [handleCarouselChange, carouselRef,];
    var _loop_1 = function (pet) {
        // @ts-ignore
        [featuredPets,];
        var __VLS_89 = {}.ElCarouselItem;
        /** @type {[typeof __VLS_components.ElCarouselItem, typeof __VLS_components.elCarouselItem, typeof __VLS_components.ElCarouselItem, typeof __VLS_components.elCarouselItem, ]} */ ;
        // @ts-ignore
        ElCarouselItem;
        // @ts-ignore
        var __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
            key: (pet.id),
        }));
        var __VLS_91 = __VLS_90.apply(void 0, __spreadArray([{
                key: (pet.id),
            }], __VLS_functionalComponentArgsRest(__VLS_90), false));
        var __VLS_93 = __VLS_92.slots.default;
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(!__VLS_ctx.loading && __VLS_ctx.featuredPets.length > 0))
                    return;
                __VLS_ctx.goToPetDetail(pet.id);
                // @ts-ignore
                [goToPetDetail,];
            } }, { class: "carousel-pet-card" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-image-box" }));
        __VLS_asFunctionalElement(__VLS_elements.img)(__assign({ src: (pet.image), alt: "pet.name" }, { class: "pet-carousel-image" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-status-overlay" }));
        var __VLS_94 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
            type: (__VLS_ctx.getStatusTagType(pet.status)),
            size: "large",
            effect: "dark",
            round: true,
        }));
        var __VLS_96 = __VLS_95.apply(void 0, __spreadArray([{
                type: (__VLS_ctx.getStatusTagType(pet.status)),
                size: "large",
                effect: "dark",
                round: true,
            }], __VLS_functionalComponentArgsRest(__VLS_95), false));
        var __VLS_98 = __VLS_97.slots.default;
        // @ts-ignore
        [getStatusTagType,];
        (__VLS_ctx.getStatusText(pet.status));
        // @ts-ignore
        [getStatusText,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-card-info" }));
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)(__assign({ class: "pet-card-name" }));
        var __VLS_99 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99(__assign({ class: "name-icon" })));
        var __VLS_101 = __VLS_100.apply(void 0, __spreadArray([__assign({ class: "name-icon" })], __VLS_functionalComponentArgsRest(__VLS_100), false));
        var __VLS_103 = __VLS_102.slots.default;
        var __VLS_104 = {}.Star;
        /** @type {[typeof __VLS_components.Star, ]} */ ;
        // @ts-ignore
        icons_vue_1.Star;
        // @ts-ignore
        var __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
        var __VLS_106 = __VLS_105.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_105), false));
        (pet.name);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-card-details" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "detail-item" }));
        var __VLS_109 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({}));
        var __VLS_111 = __VLS_110.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_110), false));
        var __VLS_113 = __VLS_112.slots.default;
        var __VLS_114 = {}.Orange;
        /** @type {[typeof __VLS_components.Orange, ]} */ ;
        // @ts-ignore
        icons_vue_1.Orange;
        // @ts-ignore
        var __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({}));
        var __VLS_116 = __VLS_115.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_115), false));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (pet.breed || '未知品种');
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "detail-item" }));
        var __VLS_119 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({}));
        var __VLS_121 = __VLS_120.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_120), false));
        var __VLS_123 = __VLS_122.slots.default;
        var __VLS_124 = {}.Calendar;
        /** @type {[typeof __VLS_components.Calendar, ]} */ ;
        // @ts-ignore
        icons_vue_1.Calendar;
        // @ts-ignore
        var __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
        var __VLS_126 = __VLS_125.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_125), false));
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (pet.age);
        var __VLS_129 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129(__assign(__assign({ 'onClick': {} }, { type: "primary", size: "large", round: true }), { class: "adopt-btn" })));
        var __VLS_131 = __VLS_130.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", size: "large", round: true }), { class: "adopt-btn" })], __VLS_functionalComponentArgsRest(__VLS_130), false));
        var __VLS_133 = void 0;
        var __VLS_134 = void 0;
        var __VLS_135 = ({ click: {} },
            { onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(!__VLS_ctx.loading && __VLS_ctx.featuredPets.length > 0))
                        return;
                    __VLS_ctx.applyAdopt(pet.id);
                    // @ts-ignore
                    [applyAdopt,];
                } });
        var __VLS_136 = __VLS_132.slots.default;
        var __VLS_137 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({}));
        var __VLS_139 = __VLS_138.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_138), false));
        var __VLS_141 = __VLS_140.slots.default;
        var __VLS_142 = {}.CircleCheckFilled;
        /** @type {[typeof __VLS_components.CircleCheckFilled, ]} */ ;
        // @ts-ignore
        icons_vue_2.CircleCheckFilled;
        // @ts-ignore
        var __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({}));
        var __VLS_144 = __VLS_143.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_143), false));
    };
    var __VLS_97, __VLS_102, __VLS_112, __VLS_122, __VLS_140, __VLS_132, __VLS_92;
    for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.featuredPets)); _i < _b.length; _i++) {
        var pet = _b[_i][0];
        _loop_1(pet);
    }
    var __VLS_82;
}
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "loading-container" }));
    var __VLS_147 = {}.ElSkeleton;
    /** @type {[typeof __VLS_components.ElSkeleton, typeof __VLS_components.elSkeleton, ]} */ ;
    // @ts-ignore
    ElSkeleton;
    // @ts-ignore
    var __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
        rows: (5),
        animated: true,
    }));
    var __VLS_149 = __VLS_148.apply(void 0, __spreadArray([{
            rows: (5),
            animated: true,
        }], __VLS_functionalComponentArgsRest(__VLS_148), false));
}
if (!__VLS_ctx.loading && __VLS_ctx.featuredPets.length === 0) {
    // @ts-ignore
    [loading, featuredPets,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "empty-container" }));
    var __VLS_152 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    ElEmpty;
    // @ts-ignore
    var __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        description: "暂无推荐宠物",
    }));
    var __VLS_154 = __VLS_153.apply(void 0, __spreadArray([{
            description: "暂无推荐宠物",
        }], __VLS_functionalComponentArgsRest(__VLS_153), false));
}
if (!__VLS_ctx.loading && __VLS_ctx.featuredPets.length > 0) {
    // @ts-ignore
    [loading, featuredPets,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "custom-indicators" }));
    var _loop_2 = function (pet, index) {
        // @ts-ignore
        [featuredPets,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(!__VLS_ctx.loading && __VLS_ctx.featuredPets.length > 0))
                    return;
                __VLS_ctx.goToSlide(index);
                // @ts-ignore
                [goToSlide,];
            } }, { onMouseenter: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(!__VLS_ctx.loading && __VLS_ctx.featuredPets.length > 0))
                    return;
                __VLS_ctx.goToSlide(index);
                // @ts-ignore
                [goToSlide,];
            } }), { key: (index) }), { class: (['indicator-dot', { 'is-active': __VLS_ctx.currentSlide === index }]) }));
        // @ts-ignore
        [currentSlide,];
    };
    for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.featuredPets)); _c < _d.length; _c++) {
        var _e = _d[_c], pet = _e[0], index = _e[1];
        _loop_2(pet, index);
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "view-all" }));
var __VLS_157 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157(__assign({ 'onClick': {} }, { type: "primary", size: "large", plain: true, icon: (__VLS_ctx.ArrowRight) })));
var __VLS_159 = __VLS_158.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", size: "large", plain: true, icon: (__VLS_ctx.ArrowRight) })], __VLS_functionalComponentArgsRest(__VLS_158), false));
var __VLS_161;
var __VLS_162;
var __VLS_163 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$router.push('/pets');
            // @ts-ignore
            [$router, icons_vue_1.ArrowRight,];
        } });
var __VLS_164 = __VLS_160.slots.default;
var __VLS_160;
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "adoption-guide" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "section-header" }));
var __VLS_165 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165(__assign({ class: "section-icon" })));
var __VLS_167 = __VLS_166.apply(void 0, __spreadArray([__assign({ class: "section-icon" })], __VLS_functionalComponentArgsRest(__VLS_166), false));
var __VLS_169 = __VLS_168.slots.default;
var __VLS_170 = {}.List;
/** @type {[typeof __VLS_components.List, ]} */ ;
// @ts-ignore
icons_vue_1.List;
// @ts-ignore
var __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({}));
var __VLS_172 = __VLS_171.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_171), false));
var __VLS_168;
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
var __VLS_175 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
ElDivider;
// @ts-ignore
var __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({}));
var __VLS_177 = __VLS_176.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_176), false));
var __VLS_180 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    gutter: (30),
}));
var __VLS_182 = __VLS_181.apply(void 0, __spreadArray([{
        gutter: (30),
    }], __VLS_functionalComponentArgsRest(__VLS_181), false));
var __VLS_184 = __VLS_183.slots.default;
var __VLS_185 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    xs: (24),
    md: (12),
}));
var __VLS_187 = __VLS_186.apply(void 0, __spreadArray([{
        xs: (24),
        md: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_186), false));
var __VLS_189 = __VLS_188.slots.default;
var __VLS_190 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
ElTimeline;
// @ts-ignore
var __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({}));
var __VLS_192 = __VLS_191.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_191), false));
var __VLS_194 = __VLS_193.slots.default;
for (var _f = 0, _g = __VLS_getVForSourceType((__VLS_ctx.adoptionSteps)); _f < _g.length; _f++) {
    var _h = _g[_f], step = _h[0], index = _h[1];
    // @ts-ignore
    [adoptionSteps,];
    var __VLS_195 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    ElTimelineItem;
    // @ts-ignore
    var __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
        key: (index),
        timestamp: (step.title),
        placement: "top",
        color: (__VLS_ctx.timelineColors[index]),
        icon: (__VLS_ctx.stepIcons[index]),
        size: "large",
    }));
    var __VLS_197 = __VLS_196.apply(void 0, __spreadArray([{
            key: (index),
            timestamp: (step.title),
            placement: "top",
            color: (__VLS_ctx.timelineColors[index]),
            icon: (__VLS_ctx.stepIcons[index]),
            size: "large",
        }], __VLS_functionalComponentArgsRest(__VLS_196), false));
    var __VLS_199 = __VLS_198.slots.default;
    // @ts-ignore
    [timelineColors, stepIcons,];
    var __VLS_200 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    ElCard;
    // @ts-ignore
    var __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200(__assign({ shadow: "hover" }, { class: "step-card" })));
    var __VLS_202 = __VLS_201.apply(void 0, __spreadArray([__assign({ shadow: "hover" }, { class: "step-card" })], __VLS_functionalComponentArgsRest(__VLS_201), false));
    var __VLS_204 = __VLS_203.slots.default;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-content" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-number" }));
    (index + 1);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    (step.title);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (step.description);
    var __VLS_203;
    var __VLS_198;
}
var __VLS_193;
var __VLS_188;
var __VLS_205 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    xs: (24),
    md: (12),
}));
var __VLS_207 = __VLS_206.apply(void 0, __spreadArray([{
        xs: (24),
        md: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_206), false));
var __VLS_209 = __VLS_208.slots.default;
var __VLS_210 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210(__assign({ class: "guide-image-card" }, { shadow: "hover" })));
var __VLS_212 = __VLS_211.apply(void 0, __spreadArray([__assign({ class: "guide-image-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_211), false));
var __VLS_214 = __VLS_213.slots.default;
var __VLS_215 = {}.ElImage;
/** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
// @ts-ignore
ElImage;
// @ts-ignore
var __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215(__assign({ src: "http://localhost:9000/animal-adopt/family.png", fit: "cover" }, { class: "guide-image" })));
var __VLS_217 = __VLS_216.apply(void 0, __spreadArray([__assign({ src: "http://localhost:9000/animal-adopt/family.png", fit: "cover" }, { class: "guide-image" })], __VLS_functionalComponentArgsRest(__VLS_216), false));
var __VLS_219 = __VLS_218.slots.default;
{
    var __VLS_220 = __VLS_218.slots.placeholder;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-slot" }));
    var __VLS_221 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221(__assign({ class: "is-loading" })));
    var __VLS_223 = __VLS_222.apply(void 0, __spreadArray([__assign({ class: "is-loading" })], __VLS_functionalComponentArgsRest(__VLS_222), false));
    var __VLS_225 = __VLS_224.slots.default;
    var __VLS_226 = {}.Loading;
    /** @type {[typeof __VLS_components.Loading, ]} */ ;
    // @ts-ignore
    Loading;
    // @ts-ignore
    var __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({}));
    var __VLS_228 = __VLS_227.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_227), false));
    var __VLS_224;
}
var __VLS_218;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "guide-stats" }));
var __VLS_231 = {}.ElStatistic;
/** @type {[typeof __VLS_components.ElStatistic, typeof __VLS_components.elStatistic, typeof __VLS_components.ElStatistic, typeof __VLS_components.elStatistic, ]} */ ;
// @ts-ignore
ElStatistic;
// @ts-ignore
var __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
    title: "成功领养",
    value: (1268),
    suffix: "只",
}));
var __VLS_233 = __VLS_232.apply(void 0, __spreadArray([{
        title: "成功领养",
        value: (1268),
        suffix: "只",
    }], __VLS_functionalComponentArgsRest(__VLS_232), false));
var __VLS_235 = __VLS_234.slots.default;
{
    var __VLS_236 = __VLS_234.slots.prefix;
    var __VLS_237 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({}));
    var __VLS_239 = __VLS_238.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_238), false));
    var __VLS_241 = __VLS_240.slots.default;
    var __VLS_242 = {}.TrophyBase;
    /** @type {[typeof __VLS_components.TrophyBase, ]} */ ;
    // @ts-ignore
    TrophyBase;
    // @ts-ignore
    var __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({}));
    var __VLS_244 = __VLS_243.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_243), false));
    var __VLS_240;
}
var __VLS_234;
var __VLS_247 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
ElDivider;
// @ts-ignore
var __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({
    direction: "vertical",
}));
var __VLS_249 = __VLS_248.apply(void 0, __spreadArray([{
        direction: "vertical",
    }], __VLS_functionalComponentArgsRest(__VLS_248), false));
var __VLS_252 = {}.ElStatistic;
/** @type {[typeof __VLS_components.ElStatistic, typeof __VLS_components.elStatistic, typeof __VLS_components.ElStatistic, typeof __VLS_components.elStatistic, ]} */ ;
// @ts-ignore
ElStatistic;
// @ts-ignore
var __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    title: "爱心家庭",
    value: (856),
    suffix: "个",
}));
var __VLS_254 = __VLS_253.apply(void 0, __spreadArray([{
        title: "爱心家庭",
        value: (856),
        suffix: "个",
    }], __VLS_functionalComponentArgsRest(__VLS_253), false));
var __VLS_256 = __VLS_255.slots.default;
{
    var __VLS_257 = __VLS_255.slots.prefix;
    var __VLS_258 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({}));
    var __VLS_260 = __VLS_259.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_259), false));
    var __VLS_262 = __VLS_261.slots.default;
    var __VLS_263 = {}.House;
    /** @type {[typeof __VLS_components.House, ]} */ ;
    // @ts-ignore
    House;
    // @ts-ignore
    var __VLS_264 = __VLS_asFunctionalComponent(__VLS_263, new __VLS_263({}));
    var __VLS_265 = __VLS_264.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_264), false));
    var __VLS_261;
}
var __VLS_255;
var __VLS_213;
var __VLS_208;
var __VLS_183;
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "adoption-stories" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "section-header" }));
var __VLS_268 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268(__assign({ class: "section-icon" })));
var __VLS_270 = __VLS_269.apply(void 0, __spreadArray([__assign({ class: "section-icon" })], __VLS_functionalComponentArgsRest(__VLS_269), false));
var __VLS_272 = __VLS_271.slots.default;
var __VLS_273 = {}.ChatLineSquare;
/** @type {[typeof __VLS_components.ChatLineSquare, ]} */ ;
// @ts-ignore
ChatLineSquare;
// @ts-ignore
var __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({}));
var __VLS_275 = __VLS_274.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_274), false));
var __VLS_271;
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
var __VLS_278 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
ElDivider;
// @ts-ignore
var __VLS_279 = __VLS_asFunctionalComponent(__VLS_278, new __VLS_278({}));
var __VLS_280 = __VLS_279.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_279), false));
var __VLS_283 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_284 = __VLS_asFunctionalComponent(__VLS_283, new __VLS_283({
    gutter: (20),
}));
var __VLS_285 = __VLS_284.apply(void 0, __spreadArray([{
        gutter: (20),
    }], __VLS_functionalComponentArgsRest(__VLS_284), false));
var __VLS_287 = __VLS_286.slots.default;
var _loop_3 = function (story) {
    // @ts-ignore
    [stories,];
    var __VLS_288 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    ElCol;
    // @ts-ignore
    var __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        key: (story.id),
        xs: (24),
        sm: (12),
        md: (12),
    }));
    var __VLS_290 = __VLS_289.apply(void 0, __spreadArray([{
            key: (story.id),
            xs: (24),
            sm: (12),
            md: (12),
        }], __VLS_functionalComponentArgsRest(__VLS_289), false));
    var __VLS_292 = __VLS_291.slots.default;
    var __VLS_293 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    ElCard;
    // @ts-ignore
    var __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293(__assign({ class: "story-card" }, { shadow: "hover" })));
    var __VLS_295 = __VLS_294.apply(void 0, __spreadArray([__assign({ class: "story-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_294), false));
    var __VLS_297 = __VLS_296.slots.default;
    var __VLS_298 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    ElImage;
    // @ts-ignore
    var __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298(__assign({ src: (story.image), alt: (story.title), fit: "cover" }, { class: "story-image" })));
    var __VLS_300 = __VLS_299.apply(void 0, __spreadArray([__assign({ src: (story.image), alt: (story.title), fit: "cover" }, { class: "story-image" })], __VLS_functionalComponentArgsRest(__VLS_299), false));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "story-content" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    (story.title);
    var __VLS_303 = {}.ElText;
    /** @type {[typeof __VLS_components.ElText, typeof __VLS_components.elText, typeof __VLS_components.ElText, typeof __VLS_components.elText, ]} */ ;
    // @ts-ignore
    ElText;
    // @ts-ignore
    var __VLS_304 = __VLS_asFunctionalComponent(__VLS_303, new __VLS_303({
        type: "info",
        lineClamp: "2",
    }));
    var __VLS_305 = __VLS_304.apply(void 0, __spreadArray([{
            type: "info",
            lineClamp: "2",
        }], __VLS_functionalComponentArgsRest(__VLS_304), false));
    var __VLS_307 = __VLS_306.slots.default;
    (story.excerpt);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "story-footer" }));
    var __VLS_308 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308(__assign({ 'onClick': {} }, { type: "primary", link: true, icon: (__VLS_ctx.View) })));
    var __VLS_310 = __VLS_309.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", link: true, icon: (__VLS_ctx.View) })], __VLS_functionalComponentArgsRest(__VLS_309), false));
    var __VLS_312 = void 0;
    var __VLS_313 = void 0;
    var __VLS_314 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.$router.push("/story/".concat(story.id));
                // @ts-ignore
                [$router, icons_vue_1.View,];
            } });
    var __VLS_315 = __VLS_311.slots.default;
    var __VLS_316 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
        type: "info",
        effect: "light",
        size: "small",
    }));
    var __VLS_318 = __VLS_317.apply(void 0, __spreadArray([{
            type: "info",
            effect: "light",
            size: "small",
        }], __VLS_functionalComponentArgsRest(__VLS_317), false));
    var __VLS_320 = __VLS_319.slots.default;
    ((_a = story.viewCount) !== null && _a !== void 0 ? _a : 0);
};
var __VLS_306, __VLS_311, __VLS_319, __VLS_296, __VLS_291;
for (var _j = 0, _k = __VLS_getVForSourceType((__VLS_ctx.stories)); _j < _k.length; _j++) {
    var story = _k[_j][0];
    _loop_3(story);
}
var __VLS_286;
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "quick-actions" }));
var __VLS_321 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_322 = __VLS_asFunctionalComponent(__VLS_321, new __VLS_321(__assign({ shadow: "always" }, { class: "action-card" })));
var __VLS_323 = __VLS_322.apply(void 0, __spreadArray([__assign({ shadow: "always" }, { class: "action-card" })], __VLS_functionalComponentArgsRest(__VLS_322), false));
var __VLS_325 = __VLS_324.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "action-content" }));
var __VLS_326 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326(__assign({ class: "action-icon" })));
var __VLS_328 = __VLS_327.apply(void 0, __spreadArray([__assign({ class: "action-icon" })], __VLS_functionalComponentArgsRest(__VLS_327), false));
var __VLS_330 = __VLS_329.slots.default;
var __VLS_331 = {}.Promotion;
/** @type {[typeof __VLS_components.Promotion, ]} */ ;
// @ts-ignore
Promotion;
// @ts-ignore
var __VLS_332 = __VLS_asFunctionalComponent(__VLS_331, new __VLS_331({}));
var __VLS_333 = __VLS_332.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_332), false));
var __VLS_329;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
var __VLS_336 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336(__assign({ 'onClick': {} }, { type: "primary", size: "large", round: true, icon: (__VLS_ctx.ArrowRight) })));
var __VLS_338 = __VLS_337.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", size: "large", round: true, icon: (__VLS_ctx.ArrowRight) })], __VLS_functionalComponentArgsRest(__VLS_337), false));
var __VLS_340;
var __VLS_341;
var __VLS_342 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$router.push('/pets');
            // @ts-ignore
            [$router, icons_vue_1.ArrowRight,];
        } });
var __VLS_343 = __VLS_339.slots.default;
var __VLS_339;
var __VLS_324;
/** @type {__VLS_StyleScopedClasses['home']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-background']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-icon-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-description']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['featured-pets']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-container']} */ ;
/** @type {__VLS_StyleScopedClasses['carousel-pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-image-box']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-carousel-image']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-status-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card-info']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card-name']} */ ;
/** @type {__VLS_StyleScopedClasses['name-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card-details']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['adopt-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-container']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-indicators']} */ ;
/** @type {__VLS_StyleScopedClasses['indicator-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['view-all']} */ ;
/** @type {__VLS_StyleScopedClasses['adoption-guide']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['step-card']} */ ;
/** @type {__VLS_StyleScopedClasses['step-content']} */ ;
/** @type {__VLS_StyleScopedClasses['step-number']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-image-card']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-image']} */ ;
/** @type {__VLS_StyleScopedClasses['image-slot']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['guide-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['adoption-stories']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['story-card']} */ ;
/** @type {__VLS_StyleScopedClasses['story-image']} */ ;
/** @type {__VLS_StyleScopedClasses['story-content']} */ ;
/** @type {__VLS_StyleScopedClasses['story-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-card']} */ ;
/** @type {__VLS_StyleScopedClasses['action-content']} */ ;
/** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
// @ts-ignore
var __VLS_87 = __VLS_86;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
