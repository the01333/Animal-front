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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var application_1 = require("@/api/application");
var element_plus_1 = require("element-plus");
var format_1 = require("@/utils/format");
var icons_vue_1 = require("@element-plus/icons-vue");
var props = defineProps();
var loading = (0, vue_1.ref)(false);
var applications = (0, vue_1.ref)([]);
var total = (0, vue_1.ref)(0);
var dialogVisible = (0, vue_1.ref)(false);
var dialogTitle = (0, vue_1.ref)('');
var currentRow = (0, vue_1.ref)(null);
var detailVisible = (0, vue_1.ref)(false);
var detailLoading = (0, vue_1.ref)(false);
var detailData = (0, vue_1.ref)(null);
var defaultPetImage = 'http://localhost:9000/animal-adopt/default.jpg';
var statusLocked = (0, vue_1.computed)(function () { return !!props.lockStatusFilter; });
var queryForm = (0, vue_1.reactive)({
    keyword: '',
    status: props.defaultStatus || '',
    current: 1,
    size: 12
});
var activeFilters = (0, vue_1.computed)(function () {
    var filters = [];
    if (queryForm.keyword) {
        filters.push({ key: 'keyword', label: '关键词', value: queryForm.keyword });
    }
    if (queryForm.status && !statusLocked.value) {
        filters.push({ key: 'status', label: '状态', value: getStatusText(queryForm.status) });
    }
    return filters;
});
var reviewForm = (0, vue_1.reactive)({
    status: '',
    reviewComment: ''
});
function fetchList() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, application_1.getAllApplications)(queryForm)];
                case 2:
                    res = _a.sent();
                    applications.value = res.data.records;
                    total.value = res.data.total;
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('获取申请列表失败:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handleSearch() {
    queryForm.current = 1;
    fetchList();
}
function handleReset() {
    Object.assign(queryForm, {
        keyword: '',
        status: statusLocked.value ? (props.defaultStatus || '') : '',
        current: 1,
        size: 12
    });
    fetchList();
}
function handleRemoveFilter(key) {
    if (key === 'status') {
        if (statusLocked.value)
            return;
        queryForm.status = '';
    }
    else {
        queryForm.keyword = '';
    }
    fetchList();
}
function handleView(row) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    detailVisible.value = true;
                    detailLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, application_1.getApplicationDetail)(row.id)];
                case 2:
                    res = _a.sent();
                    detailData.value = res.data;
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('获取申请详情失败:', error_2);
                    element_plus_1.ElMessage.error('获取详情失败');
                    detailVisible.value = false;
                    return [3 /*break*/, 5];
                case 4:
                    detailLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handleApprove(row) {
    currentRow.value = row;
    dialogTitle.value = '通过申请';
    reviewForm.status = 'APPROVED';
    reviewForm.reviewComment = '';
    dialogVisible.value = true;
}
function handleReject(row) {
    currentRow.value = row;
    dialogTitle.value = '拒绝申请';
    reviewForm.status = 'REJECTED';
    reviewForm.reviewComment = '';
    dialogVisible.value = true;
}
function confirmReview() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentRow.value)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, application_1.reviewApplication)(currentRow.value.id, reviewForm)];
                case 2:
                    _a.sent();
                    element_plus_1.ElMessage.success('审核成功');
                    dialogVisible.value = false;
                    detailVisible.value = false;
                    fetchList();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    element_plus_1.ElMessage.error('审核失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getStatusType(status) {
    var map = {
        PENDING: 'warning',
        APPROVED: 'success',
        REJECTED: 'danger',
        CANCELLED: 'info'
    };
    return map[status] || '';
}
function getStatusText(status) {
    var map = {
        PENDING: '待审核',
        APPROVED: '已通过',
        REJECTED: '已拒绝',
        CANCELLED: '已取消'
    };
    return map[status] || status;
}
function getPetCategoryText(category) {
    if (!category)
        return '未知';
    var map = {
        dog: '狗狗',
        cat: '猫咪',
        rabbit: '兔兔',
        bird: '鸟类',
        other: '其他'
    };
    return map[category.toLowerCase()] || category;
}
function getPetAdoptionStatusText(status) {
    if (!status)
        return '未知';
    var map = {
        available: '可领养',
        adopted: '已领养',
        pending: '待审核',
        reserved: '已预订'
    };
    return map[status.toLowerCase()] || status;
}
(0, vue_1.onMounted)(function () {
    fetchList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['drawer-header']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card__body']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-name']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card__body']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-name']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-actions']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-application-list" }));
var __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        shadow: "never",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
var __VLS_5 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5(__assign({ inline: (true), model: (__VLS_ctx.queryForm) }, { class: "search-form" })));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign({ inline: (true), model: (__VLS_ctx.queryForm) }, { class: "search-form" })], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_9 = __VLS_8.slots.default;
// @ts-ignore
[queryForm,];
var __VLS_10 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    label: "关键词",
}));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([{
        label: "关键词",
    }], __VLS_functionalComponentArgsRest(__VLS_11), false));
var __VLS_14 = __VLS_13.slots.default;
var __VLS_15 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.queryForm.keyword),
    placeholder: "申请人/申请编号/联系方式",
    clearable: true,
}));
var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.keyword),
        placeholder: "申请人/申请编号/联系方式",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_16), false));
// @ts-ignore
[queryForm,];
var __VLS_13;
if (!__VLS_ctx.statusLocked) {
    // @ts-ignore
    [statusLocked,];
    var __VLS_20 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        label: "状态",
    }));
    var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{
            label: "状态",
        }], __VLS_functionalComponentArgsRest(__VLS_21), false));
    var __VLS_24 = __VLS_23.slots.default;
    var __VLS_25 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    ElSelect;
    // @ts-ignore
    var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        modelValue: (__VLS_ctx.queryForm.status),
        placeholder: "全部",
        clearable: true,
    }));
    var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.queryForm.status),
            placeholder: "全部",
            clearable: true,
        }], __VLS_functionalComponentArgsRest(__VLS_26), false));
    var __VLS_29 = __VLS_28.slots.default;
    // @ts-ignore
    [queryForm,];
    var __VLS_30 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        label: "全部",
        value: "",
    }));
    var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([{
            label: "全部",
            value: "",
        }], __VLS_functionalComponentArgsRest(__VLS_31), false));
    var __VLS_35 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        label: "待审核",
        value: "PENDING",
    }));
    var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([{
            label: "待审核",
            value: "PENDING",
        }], __VLS_functionalComponentArgsRest(__VLS_36), false));
    var __VLS_40 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "已通过",
        value: "APPROVED",
    }));
    var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{
            label: "已通过",
            value: "APPROVED",
        }], __VLS_functionalComponentArgsRest(__VLS_41), false));
    var __VLS_45 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        label: "已拒绝",
        value: "REJECTED",
    }));
    var __VLS_47 = __VLS_46.apply(void 0, __spreadArray([{
            label: "已拒绝",
            value: "REJECTED",
        }], __VLS_functionalComponentArgsRest(__VLS_46), false));
    var __VLS_50 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        label: "已取消",
        value: "CANCELLED",
    }));
    var __VLS_52 = __VLS_51.apply(void 0, __spreadArray([{
            label: "已取消",
            value: "CANCELLED",
        }], __VLS_functionalComponentArgsRest(__VLS_51), false));
    var __VLS_28;
    var __VLS_23;
}
var __VLS_55 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({}));
var __VLS_57 = __VLS_56.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_56), false));
var __VLS_59 = __VLS_58.slots.default;
var __VLS_60 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60(__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Search) })));
var __VLS_62 = __VLS_61.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Search) })], __VLS_functionalComponentArgsRest(__VLS_61), false));
var __VLS_64;
var __VLS_65;
var __VLS_66 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSearch) });
var __VLS_67 = __VLS_63.slots.default;
// @ts-ignore
[icons_vue_1.Search, handleSearch,];
var __VLS_63;
var __VLS_68 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68(__assign({ 'onClick': {} }, { icon: (__VLS_ctx.RefreshLeft) })));
var __VLS_70 = __VLS_69.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { icon: (__VLS_ctx.RefreshLeft) })], __VLS_functionalComponentArgsRest(__VLS_69), false));
var __VLS_72;
var __VLS_73;
var __VLS_74 = ({ click: {} },
    { onClick: (__VLS_ctx.handleReset) });
var __VLS_75 = __VLS_71.slots.default;
// @ts-ignore
[icons_vue_1.RefreshLeft, handleReset,];
var __VLS_71;
var __VLS_58;
var __VLS_8;
if (__VLS_ctx.activeFilters.length) {
    // @ts-ignore
    [activeFilters,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "active-filters" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "label" }));
    var _loop_1 = function (filter) {
        // @ts-ignore
        [activeFilters,];
        var __VLS_76 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76(__assign({ 'onClose': {} }, { key: (filter.key), closable: true, type: "info", size: "small" })));
        var __VLS_78 = __VLS_77.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { key: (filter.key), closable: true, type: "info", size: "small" })], __VLS_functionalComponentArgsRest(__VLS_77), false));
        var __VLS_80 = void 0;
        var __VLS_81 = void 0;
        var __VLS_82 = ({ close: {} },
            { onClose: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.activeFilters.length))
                        return;
                    __VLS_ctx.handleRemoveFilter(filter.key);
                    // @ts-ignore
                    [handleRemoveFilter,];
                } });
        var __VLS_83 = __VLS_79.slots.default;
        (filter.label);
        (filter.value);
    };
    var __VLS_79;
    for (var _i = 0, _8 = __VLS_getVForSourceType((__VLS_ctx.activeFilters)); _i < _8.length; _i++) {
        var filter = _8[_i][0];
        _loop_1(filter);
    }
    var __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84(__assign({ 'onClick': {} }, { text: true, type: "primary", size: "small" })));
    var __VLS_86 = __VLS_85.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { text: true, type: "primary", size: "small" })], __VLS_functionalComponentArgsRest(__VLS_85), false));
    var __VLS_88 = void 0;
    var __VLS_89 = void 0;
    var __VLS_90 = ({ click: {} },
        { onClick: (__VLS_ctx.handleReset) });
    var __VLS_91 = __VLS_87.slots.default;
    // @ts-ignore
    [handleReset,];
    var __VLS_87;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-list" }));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.loading) }), null, null);
// @ts-ignore
[vLoading, loading,];
if (!__VLS_ctx.applications.length && !__VLS_ctx.loading) {
    // @ts-ignore
    [loading, applications,];
    var __VLS_92 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    ElEmpty;
    // @ts-ignore
    var __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        description: "暂无申请数据",
    }));
    var __VLS_94 = __VLS_93.apply(void 0, __spreadArray([{
            description: "暂无申请数据",
        }], __VLS_functionalComponentArgsRest(__VLS_93), false));
}
else {
    var __VLS_97 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    ElRow;
    // @ts-ignore
    var __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
        gutter: (20),
    }));
    var __VLS_99 = __VLS_98.apply(void 0, __spreadArray([{
            gutter: (20),
        }], __VLS_functionalComponentArgsRest(__VLS_98), false));
    var __VLS_101 = __VLS_100.slots.default;
    var _loop_2 = function (item) {
        // @ts-ignore
        [applications,];
        var __VLS_102 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        ElCol;
        // @ts-ignore
        var __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
            key: (item.id),
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
        }));
        var __VLS_104 = __VLS_103.apply(void 0, __spreadArray([{
                key: (item.id),
                xs: (24),
                sm: (12),
                md: (12),
                lg: (8),
                xl: (6),
            }], __VLS_functionalComponentArgsRest(__VLS_103), false));
        var __VLS_106 = __VLS_105.slots.default;
        var __VLS_107 = {}.ElCard;
        /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
        // @ts-ignore
        ElCard;
        // @ts-ignore
        var __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107(__assign({ shadow: "hover" }, { class: "application-card" })));
        var __VLS_109 = __VLS_108.apply(void 0, __spreadArray([__assign({ shadow: "hover" }, { class: "application-card" })], __VLS_functionalComponentArgsRest(__VLS_108), false));
        var __VLS_111 = __VLS_110.slots.default;
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header__info" }));
        var __VLS_112 = {}.ElAvatar;
        /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
        // @ts-ignore
        ElAvatar;
        // @ts-ignore
        var __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            size: (60),
            src: (item.petCoverImage || __VLS_ctx.defaultPetImage),
        }));
        var __VLS_114 = __VLS_113.apply(void 0, __spreadArray([{
                size: (60),
                src: (item.petCoverImage || __VLS_ctx.defaultPetImage),
            }], __VLS_functionalComponentArgsRest(__VLS_113), false));
        // @ts-ignore
        [defaultPetImage,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header__text" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-name" }));
        (item.petName || '未匹配宠物');
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-no" }));
        (item.applicationNo || '-');
        var __VLS_117 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
            type: (__VLS_ctx.getStatusType(item.status)),
        }));
        var __VLS_119 = __VLS_118.apply(void 0, __spreadArray([{
                type: (__VLS_ctx.getStatusType(item.status)),
            }], __VLS_functionalComponentArgsRest(__VLS_118), false));
        var __VLS_121 = __VLS_120.slots.default;
        // @ts-ignore
        [getStatusType,];
        (__VLS_ctx.getStatusText(item.status));
        // @ts-ignore
        [getStatusText,];
        var __VLS_122 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        ElDescriptions;
        // @ts-ignore
        var __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122(__assign({ column: (1), size: "small" }, { class: "card-descriptions" })));
        var __VLS_124 = __VLS_123.apply(void 0, __spreadArray([__assign({ column: (1), size: "small" }, { class: "card-descriptions" })], __VLS_functionalComponentArgsRest(__VLS_123), false));
        var __VLS_126 = __VLS_125.slots.default;
        var __VLS_127 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        ElDescriptionsItem;
        // @ts-ignore
        var __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
            label: "申请人",
        }));
        var __VLS_129 = __VLS_128.apply(void 0, __spreadArray([{
                label: "申请人",
            }], __VLS_functionalComponentArgsRest(__VLS_128), false));
        var __VLS_131 = __VLS_130.slots.default;
        (item.applicantNickname || item.applicantUsername || '匿名用户');
        if (item.applicantCertified) {
            var __VLS_132 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            ElTag;
            // @ts-ignore
            var __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132(__assign({ size: "small", type: "success" }, { style: {} })));
            var __VLS_134 = __VLS_133.apply(void 0, __spreadArray([__assign({ size: "small", type: "success" }, { style: {} })], __VLS_functionalComponentArgsRest(__VLS_133), false));
            var __VLS_136 = __VLS_135.slots.default;
        }
        var __VLS_137 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        ElDescriptionsItem;
        // @ts-ignore
        var __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
            label: "联系方式",
        }));
        var __VLS_139 = __VLS_138.apply(void 0, __spreadArray([{
                label: "联系方式",
            }], __VLS_functionalComponentArgsRest(__VLS_138), false));
        var __VLS_141 = __VLS_140.slots.default;
        (item.contactPhone || item.applicantPhone || '-');
        var __VLS_142 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        ElDescriptionsItem;
        // @ts-ignore
        var __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
            label: "联系地址",
        }));
        var __VLS_144 = __VLS_143.apply(void 0, __spreadArray([{
                label: "联系地址",
            }], __VLS_functionalComponentArgsRest(__VLS_143), false));
        var __VLS_146 = __VLS_145.slots.default;
        (item.contactAddress || item.applicantAddress || '未填写');
        var __VLS_147 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        ElDescriptionsItem;
        // @ts-ignore
        var __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
            label: "提交时间",
        }));
        var __VLS_149 = __VLS_148.apply(void 0, __spreadArray([{
                label: "提交时间",
            }], __VLS_functionalComponentArgsRest(__VLS_148), false));
        var __VLS_151 = __VLS_150.slots.default;
        (__VLS_ctx.formatDate(item.createTime));
        // @ts-ignore
        [format_1.formatDate,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-actions" }));
        var __VLS_152 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152(__assign({ 'onClick': {} }, { type: "primary", text: true, icon: (__VLS_ctx.View) })));
        var __VLS_154 = __VLS_153.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", text: true, icon: (__VLS_ctx.View) })], __VLS_functionalComponentArgsRest(__VLS_153), false));
        var __VLS_156 = void 0;
        var __VLS_157 = void 0;
        var __VLS_158 = ({ click: {} },
            { onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!!(!__VLS_ctx.applications.length && !__VLS_ctx.loading))
                        return;
                    __VLS_ctx.handleView(item);
                    // @ts-ignore
                    [icons_vue_1.View, handleView,];
                } });
        var __VLS_159 = __VLS_155.slots.default;
        if (item.status === 'PENDING') {
            var __VLS_160 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            ElButton;
            // @ts-ignore
            var __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160(__assign({ 'onClick': {} }, { type: "success", text: true, icon: (__VLS_ctx.Select) })));
            var __VLS_162 = __VLS_161.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "success", text: true, icon: (__VLS_ctx.Select) })], __VLS_functionalComponentArgsRest(__VLS_161), false));
            var __VLS_164 = void 0;
            var __VLS_165 = void 0;
            var __VLS_166 = ({ click: {} },
                { onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!!(!__VLS_ctx.applications.length && !__VLS_ctx.loading))
                            return;
                        if (!(item.status === 'PENDING'))
                            return;
                        __VLS_ctx.handleApprove(item);
                        // @ts-ignore
                        [icons_vue_1.Select, handleApprove,];
                    } });
            var __VLS_167 = __VLS_163.slots.default;
        }
        if (item.status === 'PENDING') {
            var __VLS_168 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            ElButton;
            // @ts-ignore
            var __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168(__assign({ 'onClick': {} }, { type: "danger", text: true, icon: (__VLS_ctx.CloseBold) })));
            var __VLS_170 = __VLS_169.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", text: true, icon: (__VLS_ctx.CloseBold) })], __VLS_functionalComponentArgsRest(__VLS_169), false));
            var __VLS_172 = void 0;
            var __VLS_173 = void 0;
            var __VLS_174 = ({ click: {} },
                { onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!!(!__VLS_ctx.applications.length && !__VLS_ctx.loading))
                            return;
                        if (!(item.status === 'PENDING'))
                            return;
                        __VLS_ctx.handleReject(item);
                        // @ts-ignore
                        [icons_vue_1.CloseBold, handleReject,];
                    } });
            var __VLS_175 = __VLS_171.slots.default;
        }
    };
    var __VLS_120, __VLS_135, __VLS_130, __VLS_140, __VLS_145, __VLS_150, __VLS_125, __VLS_155, __VLS_163, __VLS_171, __VLS_110, __VLS_105;
    for (var _9 = 0, _10 = __VLS_getVForSourceType((__VLS_ctx.applications)); _9 < _10.length; _9++) {
        var item = _10[_9][0];
        _loop_2(item);
    }
    var __VLS_100;
}
if (__VLS_ctx.total > 0) {
    // @ts-ignore
    [total,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pagination" }));
    var __VLS_176 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    ElPagination;
    // @ts-ignore
    var __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176(__assign(__assign({ 'onSizeChange': {} }, { 'onCurrentChange': {} }), { currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([6, 12, 24, 48]), total: (__VLS_ctx.total), layout: "total, sizes, prev, pager, next, jumper", background: true })));
    var __VLS_178 = __VLS_177.apply(void 0, __spreadArray([__assign(__assign({ 'onSizeChange': {} }, { 'onCurrentChange': {} }), { currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([6, 12, 24, 48]), total: (__VLS_ctx.total), layout: "total, sizes, prev, pager, next, jumper", background: true })], __VLS_functionalComponentArgsRest(__VLS_177), false));
    var __VLS_180 = void 0;
    var __VLS_181 = void 0;
    var __VLS_182 = ({ sizeChange: {} },
        { onSizeChange: (__VLS_ctx.fetchList) });
    var __VLS_183 = ({ currentChange: {} },
        { onCurrentChange: (__VLS_ctx.fetchList) });
    // @ts-ignore
    [queryForm, queryForm, total, fetchList, fetchList,];
    var __VLS_179;
}
var __VLS_3;
var __VLS_185 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
ElDrawer;
// @ts-ignore
var __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185(__assign({ modelValue: (__VLS_ctx.detailVisible), size: "55%", destroyOnClose: (true) }, { class: "application-detail-drawer" })));
var __VLS_187 = __VLS_186.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.detailVisible), size: "55%", destroyOnClose: (true) }, { class: "application-detail-drawer" })], __VLS_functionalComponentArgsRest(__VLS_186), false));
var __VLS_189 = __VLS_188.slots.default;
// @ts-ignore
[detailVisible,];
{
    var __VLS_190 = __VLS_188.slots.header;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "drawer-header" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "drawer-eyebrow" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    (((_a = __VLS_ctx.detailData) === null || _a === void 0 ? void 0 : _a.petName) || '领养申请');
    // @ts-ignore
    [detailData,];
    var __VLS_191 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191(__assign({ class: "drawer-tag" }, { type: (__VLS_ctx.getStatusType((_b = __VLS_ctx.detailData) === null || _b === void 0 ? void 0 : _b.status)) })));
    var __VLS_193 = __VLS_192.apply(void 0, __spreadArray([__assign({ class: "drawer-tag" }, { type: (__VLS_ctx.getStatusType((_c = __VLS_ctx.detailData) === null || _c === void 0 ? void 0 : _c.status)) })], __VLS_functionalComponentArgsRest(__VLS_192), false));
    var __VLS_195 = __VLS_194.slots.default;
    // @ts-ignore
    [getStatusType, detailData,];
    (__VLS_ctx.getStatusText((_d = __VLS_ctx.detailData) === null || _d === void 0 ? void 0 : _d.status));
    // @ts-ignore
    [getStatusText, detailData,];
    var __VLS_194;
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "drawer-subtext" }));
    (((_e = __VLS_ctx.detailData) === null || _e === void 0 ? void 0 : _e.applicationNo) || '-');
    (__VLS_ctx.formatDate((_f = __VLS_ctx.detailData) === null || _f === void 0 ? void 0 : _f.createTime));
    // @ts-ignore
    [format_1.formatDate, detailData, detailData,];
}
if (__VLS_ctx.detailLoading) {
    // @ts-ignore
    [detailLoading,];
    var __VLS_196 = {}.ElSkeleton;
    /** @type {[typeof __VLS_components.ElSkeleton, typeof __VLS_components.elSkeleton, ]} */ ;
    // @ts-ignore
    ElSkeleton;
    // @ts-ignore
    var __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        rows: (6),
        animated: true,
    }));
    var __VLS_198 = __VLS_197.apply(void 0, __spreadArray([{
            rows: (6),
            animated: true,
        }], __VLS_functionalComponentArgsRest(__VLS_197), false));
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "drawer-body" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-grid" }));
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "info-card" }));
    __VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    (((_g = __VLS_ctx.detailData) === null || _g === void 0 ? void 0 : _g.applicantNickname) || ((_h = __VLS_ctx.detailData) === null || _h === void 0 ? void 0 : _h.applicantUsername) || '-');
    // @ts-ignore
    [detailData, detailData,];
    if ((_j = __VLS_ctx.detailData) === null || _j === void 0 ? void 0 : _j.applicantCertified) {
        // @ts-ignore
        [detailData,];
        var __VLS_201 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201(__assign({ size: "small", type: "success", effect: "plain" }, { style: {} })));
        var __VLS_203 = __VLS_202.apply(void 0, __spreadArray([__assign({ size: "small", type: "success", effect: "plain" }, { style: {} })], __VLS_functionalComponentArgsRest(__VLS_202), false));
        var __VLS_205 = __VLS_204.slots.default;
        var __VLS_204;
    }
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    (((_k = __VLS_ctx.detailData) === null || _k === void 0 ? void 0 : _k.contactPhone) || ((_l = __VLS_ctx.detailData) === null || _l === void 0 ? void 0 : _l.applicantPhone) || '—');
    // @ts-ignore
    [detailData, detailData,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    (((_m = __VLS_ctx.detailData) === null || _m === void 0 ? void 0 : _m.applicantEmail) || '未填写');
    // @ts-ignore
    [detailData,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    (((_o = __VLS_ctx.detailData) === null || _o === void 0 ? void 0 : _o.contactAddress) || ((_p = __VLS_ctx.detailData) === null || _p === void 0 ? void 0 : _p.applicantAddress) || '未填写');
    // @ts-ignore
    [detailData, detailData,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    var __VLS_206 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
        type: (((_q = __VLS_ctx.detailData) === null || _q === void 0 ? void 0 : _q.applicantHasExperience) ? 'success' : 'info'),
        size: "small",
    }));
    var __VLS_208 = __VLS_207.apply(void 0, __spreadArray([{
            type: (((_r = __VLS_ctx.detailData) === null || _r === void 0 ? void 0 : _r.applicantHasExperience) ? 'success' : 'info'),
            size: "small",
        }], __VLS_functionalComponentArgsRest(__VLS_207), false));
    var __VLS_210 = __VLS_209.slots.default;
    // @ts-ignore
    [detailData,];
    (((_s = __VLS_ctx.detailData) === null || _s === void 0 ? void 0 : _s.applicantHasExperience) ? '有经验' : '暂无');
    // @ts-ignore
    [detailData,];
    var __VLS_209;
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "info-card pet-card" }));
    __VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-card__body" }));
    var __VLS_211 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    ElAvatar;
    // @ts-ignore
    var __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
        size: (80),
        src: (((_t = __VLS_ctx.detailData) === null || _t === void 0 ? void 0 : _t.petCoverImage) || __VLS_ctx.defaultPetImage),
    }));
    var __VLS_213 = __VLS_212.apply(void 0, __spreadArray([{
            size: (80),
            src: (((_u = __VLS_ctx.detailData) === null || _u === void 0 ? void 0 : _u.petCoverImage) || __VLS_ctx.defaultPetImage),
        }], __VLS_functionalComponentArgsRest(__VLS_212), false));
    // @ts-ignore
    [defaultPetImage, detailData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "pet-name" }));
    (((_v = __VLS_ctx.detailData) === null || _v === void 0 ? void 0 : _v.petName) || '未匹配宠物');
    // @ts-ignore
    [detailData,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "pet-meta" }));
    (__VLS_ctx.getPetCategoryText((_w = __VLS_ctx.detailData) === null || _w === void 0 ? void 0 : _w.petCategory));
    // @ts-ignore
    [detailData, getPetCategoryText,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "pet-meta" }));
    (__VLS_ctx.getPetAdoptionStatusText((_x = __VLS_ctx.detailData) === null || _x === void 0 ? void 0 : _x.petAdoptionStatus));
    // @ts-ignore
    [detailData, getPetAdoptionStatusText,];
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "info-card" }));
    __VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-row" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (((_y = __VLS_ctx.detailData) === null || _y === void 0 ? void 0 : _y.reason) || '未填写');
    // @ts-ignore
    [detailData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-row" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (((_z = __VLS_ctx.detailData) === null || _z === void 0 ? void 0 : _z.familyInfo) || '未填写');
    // @ts-ignore
    [detailData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-row" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (((_0 = __VLS_ctx.detailData) === null || _0 === void 0 ? void 0 : _0.careplan) || '未填写');
    // @ts-ignore
    [detailData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-row" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (((_1 = __VLS_ctx.detailData) === null || _1 === void 0 ? void 0 : _1.additionalInfo) || '未填写');
    // @ts-ignore
    [detailData,];
    if ((_2 = __VLS_ctx.detailData) === null || _2 === void 0 ? void 0 : _2.reviewComment) {
        // @ts-ignore
        [detailData,];
        __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)(__assign({ class: "info-card" }));
        __VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({});
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "review-meta" }));
        (((_3 = __VLS_ctx.detailData) === null || _3 === void 0 ? void 0 : _3.reviewerName) || '系统');
        (__VLS_ctx.formatDate((_4 = __VLS_ctx.detailData) === null || _4 === void 0 ? void 0 : _4.reviewTime));
        // @ts-ignore
        [format_1.formatDate, detailData, detailData,];
        var __VLS_216 = {}.ElAlert;
        /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
        // @ts-ignore
        ElAlert;
        // @ts-ignore
        var __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            closable: (false),
            description: ((_5 = __VLS_ctx.detailData) === null || _5 === void 0 ? void 0 : _5.reviewComment),
            type: "info",
        }));
        var __VLS_218 = __VLS_217.apply(void 0, __spreadArray([{
                closable: (false),
                description: ((_6 = __VLS_ctx.detailData) === null || _6 === void 0 ? void 0 : _6.reviewComment),
                type: "info",
            }], __VLS_functionalComponentArgsRest(__VLS_217), false));
        // @ts-ignore
        [detailData,];
    }
    if (((_7 = __VLS_ctx.detailData) === null || _7 === void 0 ? void 0 : _7.status) === 'PENDING') {
        // @ts-ignore
        [detailData,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "detail-actions" }));
        var __VLS_221 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221(__assign({ 'onClick': {} }, { type: "success", icon: (__VLS_ctx.Select) })));
        var __VLS_223 = __VLS_222.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "success", icon: (__VLS_ctx.Select) })], __VLS_functionalComponentArgsRest(__VLS_222), false));
        var __VLS_225 = void 0;
        var __VLS_226 = void 0;
        var __VLS_227 = ({ click: {} },
            { onClick: function () {
                    var _a;
                    var _b = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _b[_i] = arguments[_i];
                    }
                    var $event = _b[0];
                    if (!!(__VLS_ctx.detailLoading))
                        return;
                    if (!(((_a = __VLS_ctx.detailData) === null || _a === void 0 ? void 0 : _a.status) === 'PENDING'))
                        return;
                    __VLS_ctx.handleApprove(__VLS_ctx.detailData);
                    // @ts-ignore
                    [icons_vue_1.Select, handleApprove, detailData,];
                } });
        var __VLS_228 = __VLS_224.slots.default;
        var __VLS_224;
        var __VLS_229 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229(__assign({ 'onClick': {} }, { type: "danger", icon: (__VLS_ctx.CloseBold) })));
        var __VLS_231 = __VLS_230.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", icon: (__VLS_ctx.CloseBold) })], __VLS_functionalComponentArgsRest(__VLS_230), false));
        var __VLS_233 = void 0;
        var __VLS_234 = void 0;
        var __VLS_235 = ({ click: {} },
            { onClick: function () {
                    var _a;
                    var _b = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _b[_i] = arguments[_i];
                    }
                    var $event = _b[0];
                    if (!!(__VLS_ctx.detailLoading))
                        return;
                    if (!(((_a = __VLS_ctx.detailData) === null || _a === void 0 ? void 0 : _a.status) === 'PENDING'))
                        return;
                    __VLS_ctx.handleReject(__VLS_ctx.detailData);
                    // @ts-ignore
                    [icons_vue_1.CloseBold, handleReject, detailData,];
                } });
        var __VLS_236 = __VLS_232.slots.default;
        var __VLS_232;
    }
}
var __VLS_188;
var __VLS_237 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
ElDialog;
// @ts-ignore
var __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogTitle),
    width: "500px",
}));
var __VLS_239 = __VLS_238.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.dialogVisible),
        title: (__VLS_ctx.dialogTitle),
        width: "500px",
    }], __VLS_functionalComponentArgsRest(__VLS_238), false));
var __VLS_241 = __VLS_240.slots.default;
// @ts-ignore
[dialogVisible, dialogTitle,];
var __VLS_242 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({
    model: (__VLS_ctx.reviewForm),
    labelWidth: "80px",
}));
var __VLS_244 = __VLS_243.apply(void 0, __spreadArray([{
        model: (__VLS_ctx.reviewForm),
        labelWidth: "80px",
    }], __VLS_functionalComponentArgsRest(__VLS_243), false));
var __VLS_246 = __VLS_245.slots.default;
// @ts-ignore
[reviewForm,];
var __VLS_247 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({
    label: "审核意见",
}));
var __VLS_249 = __VLS_248.apply(void 0, __spreadArray([{
        label: "审核意见",
    }], __VLS_functionalComponentArgsRest(__VLS_248), false));
var __VLS_251 = __VLS_250.slots.default;
var __VLS_252 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    modelValue: (__VLS_ctx.reviewForm.reviewComment),
    type: "textarea",
    rows: (4),
    placeholder: "请输入审核意见（选填）",
}));
var __VLS_254 = __VLS_253.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.reviewForm.reviewComment),
        type: "textarea",
        rows: (4),
        placeholder: "请输入审核意见（选填）",
    }], __VLS_functionalComponentArgsRest(__VLS_253), false));
// @ts-ignore
[reviewForm,];
var __VLS_250;
var __VLS_245;
{
    var __VLS_257 = __VLS_240.slots.footer;
    var __VLS_258 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258(__assign({ 'onClick': {} })));
    var __VLS_260 = __VLS_259.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_259), false));
    var __VLS_262 = void 0;
    var __VLS_263 = void 0;
    var __VLS_264 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.dialogVisible = false;
                // @ts-ignore
                [dialogVisible,];
            } });
    var __VLS_265 = __VLS_261.slots.default;
    var __VLS_261;
    var __VLS_266 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266(__assign({ 'onClick': {} }, { type: "primary" })));
    var __VLS_268 = __VLS_267.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_267), false));
    var __VLS_270 = void 0;
    var __VLS_271 = void 0;
    var __VLS_272 = ({ click: {} },
        { onClick: (__VLS_ctx.confirmReview) });
    var __VLS_273 = __VLS_269.slots.default;
    // @ts-ignore
    [confirmReview,];
    var __VLS_269;
}
var __VLS_240;
/** @type {__VLS_StyleScopedClasses['admin-application-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['active-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['card-list']} */ ;
/** @type {__VLS_StyleScopedClasses['application-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header__info']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header__text']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-name']} */ ;
/** @type {__VLS_StyleScopedClasses['application-no']} */ ;
/** @type {__VLS_StyleScopedClasses['card-descriptions']} */ ;
/** @type {__VLS_StyleScopedClasses['card-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['application-detail-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-header']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-subtext']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-body']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card__body']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-name']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['review-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-actions']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
