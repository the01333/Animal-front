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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var element_plus_1 = require("element-plus");
var application_1 = require("@/api/application");
var image_1 = require("@/utils/image");
var route = (0, vue_router_1.useRoute)();
var router = (0, vue_router_1.useRouter)();
var loading = (0, vue_1.ref)(true);
var detail = (0, vue_1.ref)(null);
var canceling = (0, vue_1.ref)(false);
var defaultPetCover = 'http://localhost:9000/animal-adopt/default.jpg';
var normalizeStatus = function (status) { return String(status || '').toLowerCase(); };
var statusText = (0, vue_1.computed)(function () { var _a; return ((_a = detail.value) === null || _a === void 0 ? void 0 : _a.statusText) || '未知状态'; });
var statusClass = (0, vue_1.computed)(function () { var _a; return "status-".concat(normalizeStatus((_a = detail.value) === null || _a === void 0 ? void 0 : _a.status)); });
var isPending = (0, vue_1.computed)(function () { var _a; return normalizeStatus((_a = detail.value) === null || _a === void 0 ? void 0 : _a.status) === 'pending'; });
var petCover = (0, vue_1.computed)(function () { var _a; return (0, image_1.processImageUrl)((_a = detail.value) === null || _a === void 0 ? void 0 : _a.petCoverImage) || defaultPetCover; });
var formatDateTime = function (value) {
    if (!value)
        return '—';
    var date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return value;
    return date.toLocaleString('zh-CN', { hour12: false });
};
var formatPetCategory = function (category) {
    if (!category)
        return '宠物';
    var map = { dog: '狗狗', cat: '猫咪' };
    return map[category.toLowerCase()] || category;
};
var formatPetStatus = function (status) {
    if (!status)
        return '未知';
    var map = {
        available: '可领养',
        pending: '审核中',
        adopted: '已领养'
    };
    return map[status.toLowerCase()] || status;
};
var fetchDetail = function () { return __awaiter(void 0, void 0, void 0, function () {
    var id, res, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = Number(route.params.id);
                if (!id) {
                    loading.value = false;
                    detail.value = null;
                    return [2 /*return*/];
                }
                loading.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, application_1.getApplicationDetail)(id)];
            case 2:
                res = _a.sent();
                detail.value = res.data;
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.error('获取申请详情失败:', error_1);
                detail.value = null;
                element_plus_1.ElMessage.error('无法获取申请详情');
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleCancel = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!detail.value || canceling.value)
                    return [2 /*return*/];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, element_plus_1.ElMessageBox.confirm('确定要撤销此领养申请吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                return [2 /*return*/];
            case 4:
                canceling.value = true;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, 9, 10]);
                return [4 /*yield*/, (0, application_1.cancelApplication)(detail.value.id)];
            case 6:
                _b.sent();
                element_plus_1.ElMessage.success('申请已撤销');
                return [4 /*yield*/, fetchDetail()];
            case 7:
                _b.sent();
                return [3 /*break*/, 10];
            case 8:
                error_2 = _b.sent();
                console.error('撤销申请失败:', error_2);
                element_plus_1.ElMessage.error('撤销失败，请稍后重试');
                return [3 /*break*/, 10];
            case 9:
                canceling.value = false;
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
var goBack = function () {
    router.push({ name: 'profile', query: { tab: 'applications' } });
};
var viewPetDetail = function () {
    var _a;
    if (!((_a = detail.value) === null || _a === void 0 ? void 0 : _a.petId))
        return;
    router.push({
        name: 'pet-detail',
        params: { id: detail.value.petId },
        query: {
            from: 'application-detail',
            applicationId: detail.value.id ? String(detail.value.id) : undefined
        }
    });
};
(0, vue_1.onMounted)(fetchDetail);
(0, vue_1.watch)(function () { return route.params.id; }, function () {
    fetchDetail();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view-pet']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info']} */ ;
/** @type {__VLS_StyleScopedClasses['applicant-card']} */ ;
/** @type {__VLS_StyleScopedClasses['applicant-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['content-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-detail-page" }));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.loading) }), null, null);
// @ts-ignore
[vLoading, loading,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "detail-header" }));
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.goBack) }, { class: "btn-back" }), { type: "button" }));
// @ts-ignore
[goBack,];
if (__VLS_ctx.detail) {
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "detail-header__info" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "application-no" }));
    (__VLS_ctx.detail.applicationNo || '—');
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: (['status-chip', __VLS_ctx.statusClass]) }));
    // @ts-ignore
    [statusClass,];
    (__VLS_ctx.detail.statusText || __VLS_ctx.statusText);
    // @ts-ignore
    [detail, statusText,];
}
if (!__VLS_ctx.loading && !__VLS_ctx.detail) {
    // @ts-ignore
    [loading, detail,];
    var __VLS_0 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    ElEmpty;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        description: "未找到申请记录",
    }));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
            description: "未找到申请记录",
        }], __VLS_functionalComponentArgsRest(__VLS_1), false));
}
else if (__VLS_ctx.detail) {
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "detail-content" }));
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "summary-card" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "summary-text" }));
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
    (__VLS_ctx.detail.petName || '领养申请详情');
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.formatDateTime(__VLS_ctx.detail.createTime));
    // @ts-ignore
    [detail, formatDateTime,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.formatDateTime(__VLS_ctx.detail.updateTime));
    // @ts-ignore
    [detail, formatDateTime,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "summary-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.viewPetDetail) }, { type: "button" }), { class: "btn-view-pet" }));
    // @ts-ignore
    [viewPetDetail,];
    if (__VLS_ctx.isPending) {
        // @ts-ignore
        [isPending,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.handleCancel) }, { class: "btn-cancel" }), { disabled: (__VLS_ctx.canceling) }));
        // @ts-ignore
        [handleCancel, canceling,];
        (__VLS_ctx.canceling ? '撤销中…' : '撤销申请');
        // @ts-ignore
        [canceling,];
    }
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "content-grid" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card pet-card" }));
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.petCover),
        alt: (__VLS_ctx.detail.petName || '宠物图片'),
    });
    // @ts-ignore
    [detail, petCover,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-info" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    (__VLS_ctx.detail.petName || '未匹配宠物');
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.detail.petCategoryText || __VLS_ctx.formatPetCategory(__VLS_ctx.detail.petCategory));
    // @ts-ignore
    [detail, detail, formatPetCategory,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.detail.petAdoptionStatusText || __VLS_ctx.formatPetStatus(__VLS_ctx.detail.petAdoptionStatus));
    // @ts-ignore
    [detail, detail, formatPetStatus,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card applicant-card" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.detail.applicantNickname || __VLS_ctx.detail.applicantUsername || '—');
    // @ts-ignore
    [detail, detail,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.detail.contactPhone || __VLS_ctx.detail.applicantPhone || '—');
    // @ts-ignore
    [detail, detail,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.detail.applicantEmail || '—');
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.detail.contactAddress || __VLS_ctx.detail.applicantAddress || '—');
    // @ts-ignore
    [detail, detail,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.detail.applicantHasExperience ? '有' : '暂无');
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "card info-card" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-row" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.detail.reason || '未填写');
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-row" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.detail.familyInfo || '未填写');
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-row" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.detail.careplan || '未填写');
    // @ts-ignore
    [detail,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-row" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.detail.additionalInfo || '未填写');
    // @ts-ignore
    [detail,];
    if (__VLS_ctx.detail.reviewComment || __VLS_ctx.detail.reviewTime) {
        // @ts-ignore
        [detail, detail,];
        __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "card review-card" }));
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "review-meta" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (__VLS_ctx.detail.reviewerName || '系统');
        // @ts-ignore
        [detail,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (__VLS_ctx.formatDateTime(__VLS_ctx.detail.reviewTime));
        // @ts-ignore
        [detail, formatDateTime,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "review-comment" }));
        (__VLS_ctx.detail.reviewComment || '暂无审核意见');
        // @ts-ignore
        [detail,];
    }
}
/** @type {__VLS_StyleScopedClasses['application-detail-page']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-back']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header__info']} */ ;
/** @type {__VLS_StyleScopedClasses['application-no']} */ ;
/** @type {__VLS_StyleScopedClasses['status-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-content']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-card']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view-pet']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['content-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['applicant-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['review-card']} */ ;
/** @type {__VLS_StyleScopedClasses['review-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['review-comment']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
