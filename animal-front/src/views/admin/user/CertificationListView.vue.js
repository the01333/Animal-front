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
var element_plus_1 = require("element-plus");
var icons_vue_1 = require("@element-plus/icons-vue");
var dayjs_1 = require("dayjs");
var user_1 = require("@/api/user");
var loading = (0, vue_1.ref)(false);
var reviewLoading = (0, vue_1.ref)(false);
var detailVisible = (0, vue_1.ref)(false);
var reviewDialogVisible = (0, vue_1.ref)(false);
var total = (0, vue_1.ref)(0);
var queryForm = (0, vue_1.reactive)({
    keyword: '',
    status: '',
    current: 1,
    size: 10
});
var records = (0, vue_1.ref)([]);
var currentRecord = (0, vue_1.ref)(null);
var reviewForm = (0, vue_1.reactive)({
    id: null,
    status: 'approved',
    rejectReason: ''
});
var statusText = function (status) {
    switch (status) {
        case 'pending':
            return '审核中';
        case 'approved':
            return '已通过';
        case 'rejected':
            return '已拒绝';
        default:
            return '未提交';
    }
};
var statusTagType = function (status) {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'approved':
            return 'success';
        case 'rejected':
            return 'danger';
        default:
            return 'info';
    }
};
var formatDate = function (value) {
    if (!value)
        return '-';
    return (0, dayjs_1.default)(value).format('YYYY-MM-DD HH:mm');
};
var processImageUrl = function (url) {
    if (!url)
        return '';
    var normalized = url.trim();
    if (normalized.startsWith('@')) {
        normalized = normalized.substring(1);
    }
    normalized = normalized.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000');
    if (!normalized.startsWith('http')) {
        normalized = "http://localhost:9000/animal-adopt".concat(normalized.startsWith('/') ? '' : '/').concat(normalized);
    }
    return normalized;
};
var fetchList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loading.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, user_1.getCertificationList)(queryForm)];
            case 2:
                res = _a.sent();
                records.value = res.data.records;
                total.value = res.data.total;
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                element_plus_1.ElMessage.error('获取认证列表失败');
                console.error(error_1);
                return [3 /*break*/, 5];
            case 4:
                loading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleSearch = function () {
    queryForm.current = 1;
    fetchList();
};
var handleReset = function () {
    queryForm.keyword = '';
    queryForm.status = '';
    queryForm.current = 1;
    fetchList();
};
var handlePageChange = function (page) {
    queryForm.current = page;
    fetchList();
};
var handleSizeChange = function (size) {
    queryForm.size = size;
    queryForm.current = 1;
    fetchList();
};
var handleView = function (row) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, user_1.getCertificationDetail)(row.id)];
            case 1:
                res = _a.sent();
                currentRecord.value = res.data;
                detailVisible.value = true;
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                element_plus_1.ElMessage.error('获取认证详情失败');
                console.error(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var handleReview = function (row, status) {
    if (row.status !== 'pending') {
        element_plus_1.ElMessage.warning('仅审核中的记录可以操作');
        return;
    }
    currentRecord.value = row;
    reviewForm.id = row.id;
    reviewForm.status = status;
    reviewForm.rejectReason = '';
    reviewDialogVisible.value = true;
};
var submitReview = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!reviewForm.id)
                    return [2 /*return*/];
                if (reviewForm.status === 'rejected' && !reviewForm.rejectReason) {
                    element_plus_1.ElMessage.warning('请填写拒绝原因');
                    return [2 /*return*/];
                }
                reviewLoading.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, user_1.reviewCertification)(reviewForm.id, {
                        status: reviewForm.status,
                        rejectReason: reviewForm.rejectReason
                    })];
            case 2:
                _a.sent();
                element_plus_1.ElMessage.success('审核成功');
                reviewDialogVisible.value = false;
                fetchList();
                return [3 /*break*/, 5];
            case 3:
                error_3 = _a.sent();
                console.error(error_3);
                element_plus_1.ElMessage.error('审核失败');
                return [3 /*break*/, 5];
            case 4:
                reviewLoading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.onMounted)(function () {
    fetchList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "certification-page" }));
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
{
    var __VLS_5 = __VLS_3.slots.header;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-actions" }));
    var __VLS_6 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6(__assign({ 'onClick': {} }, { loading: (__VLS_ctx.loading), type: "primary" })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { loading: (__VLS_ctx.loading), type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    var __VLS_10 = void 0;
    var __VLS_11 = void 0;
    var __VLS_12 = ({ click: {} },
        { onClick: (__VLS_ctx.fetchList) });
    var __VLS_13 = __VLS_9.slots.default;
    // @ts-ignore
    [loading, fetchList,];
    var __VLS_14 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_15), false));
    var __VLS_18 = __VLS_17.slots.default;
    var __VLS_19 = {}.Refresh;
    /** @type {[typeof __VLS_components.Refresh, ]} */ ;
    // @ts-ignore
    icons_vue_1.Refresh;
    // @ts-ignore
    var __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
    var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_20), false));
    var __VLS_17;
    var __VLS_9;
}
var __VLS_24 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24(__assign(__assign({ labelWidth: "80px" }, { class: "search-form" }), { model: (__VLS_ctx.queryForm) })));
var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign(__assign({ labelWidth: "80px" }, { class: "search-form" }), { model: (__VLS_ctx.queryForm) })], __VLS_functionalComponentArgsRest(__VLS_25), false));
var __VLS_28 = __VLS_27.slots.default;
// @ts-ignore
[queryForm,];
var __VLS_29 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    gutter: (16),
}));
var __VLS_31 = __VLS_30.apply(void 0, __spreadArray([{
        gutter: (16),
    }], __VLS_functionalComponentArgsRest(__VLS_30), false));
var __VLS_33 = __VLS_32.slots.default;
var __VLS_34 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    span: (8),
}));
var __VLS_36 = __VLS_35.apply(void 0, __spreadArray([{
        span: (8),
    }], __VLS_functionalComponentArgsRest(__VLS_35), false));
var __VLS_38 = __VLS_37.slots.default;
var __VLS_39 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "关键词",
}));
var __VLS_41 = __VLS_40.apply(void 0, __spreadArray([{
        label: "关键词",
    }], __VLS_functionalComponentArgsRest(__VLS_40), false));
var __VLS_43 = __VLS_42.slots.default;
var __VLS_44 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.queryForm.keyword),
    placeholder: "身份证号或手机号",
    clearable: true,
}));
var __VLS_46 = __VLS_45.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.keyword),
        placeholder: "身份证号或手机号",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_45), false));
// @ts-ignore
[queryForm,];
var __VLS_42;
var __VLS_37;
var __VLS_49 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    span: (8),
}));
var __VLS_51 = __VLS_50.apply(void 0, __spreadArray([{
        span: (8),
    }], __VLS_functionalComponentArgsRest(__VLS_50), false));
var __VLS_53 = __VLS_52.slots.default;
var __VLS_54 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    label: "状态",
}));
var __VLS_56 = __VLS_55.apply(void 0, __spreadArray([{
        label: "状态",
    }], __VLS_functionalComponentArgsRest(__VLS_55), false));
var __VLS_58 = __VLS_57.slots.default;
var __VLS_59 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.queryForm.status),
    placeholder: "全部",
    clearable: true,
}));
var __VLS_61 = __VLS_60.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.status),
        placeholder: "全部",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_60), false));
var __VLS_63 = __VLS_62.slots.default;
// @ts-ignore
[queryForm,];
var __VLS_64 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
ElOption;
// @ts-ignore
var __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "全部",
    value: "",
}));
var __VLS_66 = __VLS_65.apply(void 0, __spreadArray([{
        label: "全部",
        value: "",
    }], __VLS_functionalComponentArgsRest(__VLS_65), false));
var __VLS_69 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
ElOption;
// @ts-ignore
var __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    label: "未提交",
    value: "not_submitted",
}));
var __VLS_71 = __VLS_70.apply(void 0, __spreadArray([{
        label: "未提交",
        value: "not_submitted",
    }], __VLS_functionalComponentArgsRest(__VLS_70), false));
var __VLS_74 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
ElOption;
// @ts-ignore
var __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    label: "审核中",
    value: "pending",
}));
var __VLS_76 = __VLS_75.apply(void 0, __spreadArray([{
        label: "审核中",
        value: "pending",
    }], __VLS_functionalComponentArgsRest(__VLS_75), false));
var __VLS_79 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
ElOption;
// @ts-ignore
var __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "已通过",
    value: "approved",
}));
var __VLS_81 = __VLS_80.apply(void 0, __spreadArray([{
        label: "已通过",
        value: "approved",
    }], __VLS_functionalComponentArgsRest(__VLS_80), false));
var __VLS_84 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
ElOption;
// @ts-ignore
var __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "已拒绝",
    value: "rejected",
}));
var __VLS_86 = __VLS_85.apply(void 0, __spreadArray([{
        label: "已拒绝",
        value: "rejected",
    }], __VLS_functionalComponentArgsRest(__VLS_85), false));
var __VLS_62;
var __VLS_57;
var __VLS_52;
var __VLS_89 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89(__assign({ span: (8) }, { class: "search-actions" })));
var __VLS_91 = __VLS_90.apply(void 0, __spreadArray([__assign({ span: (8) }, { class: "search-actions" })], __VLS_functionalComponentArgsRest(__VLS_90), false));
var __VLS_93 = __VLS_92.slots.default;
var __VLS_94 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94(__assign({ 'onClick': {} }, { type: "primary" })));
var __VLS_96 = __VLS_95.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_95), false));
var __VLS_98;
var __VLS_99;
var __VLS_100 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSearch) });
var __VLS_101 = __VLS_97.slots.default;
// @ts-ignore
[handleSearch,];
var __VLS_102 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({}));
var __VLS_104 = __VLS_103.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_103), false));
var __VLS_106 = __VLS_105.slots.default;
var __VLS_107 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
icons_vue_1.Search;
// @ts-ignore
var __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({}));
var __VLS_109 = __VLS_108.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_108), false));
var __VLS_105;
var __VLS_97;
var __VLS_112 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112(__assign({ 'onClick': {} })));
var __VLS_114 = __VLS_113.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_113), false));
var __VLS_116;
var __VLS_117;
var __VLS_118 = ({ click: {} },
    { onClick: (__VLS_ctx.handleReset) });
var __VLS_119 = __VLS_115.slots.default;
// @ts-ignore
[handleReset,];
var __VLS_120 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
var __VLS_122 = __VLS_121.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_121), false));
var __VLS_124 = __VLS_123.slots.default;
var __VLS_125 = {}.RefreshLeft;
/** @type {[typeof __VLS_components.RefreshLeft, ]} */ ;
// @ts-ignore
icons_vue_1.RefreshLeft;
// @ts-ignore
var __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({}));
var __VLS_127 = __VLS_126.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_126), false));
var __VLS_123;
var __VLS_115;
var __VLS_92;
var __VLS_32;
var __VLS_27;
var __VLS_130 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
ElTable;
// @ts-ignore
var __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    data: (__VLS_ctx.records),
    border: true,
    stripe: true,
}));
var __VLS_132 = __VLS_131.apply(void 0, __spreadArray([{
        data: (__VLS_ctx.records),
        border: true,
        stripe: true,
    }], __VLS_functionalComponentArgsRest(__VLS_131), false));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.loading) }), null, null);
var __VLS_134 = __VLS_133.slots.default;
// @ts-ignore
[loading, records, vLoading,];
var __VLS_135 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    prop: "id",
    label: "ID",
    width: "80",
}));
var __VLS_137 = __VLS_136.apply(void 0, __spreadArray([{
        prop: "id",
        label: "ID",
        width: "80",
    }], __VLS_functionalComponentArgsRest(__VLS_136), false));
var __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    prop: "username",
    label: "用户名",
    width: "140",
}));
var __VLS_142 = __VLS_141.apply(void 0, __spreadArray([{
        prop: "username",
        label: "用户名",
        width: "140",
    }], __VLS_functionalComponentArgsRest(__VLS_141), false));
var __VLS_145 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    prop: "nickname",
    label: "昵称",
    width: "140",
}));
var __VLS_147 = __VLS_146.apply(void 0, __spreadArray([{
        prop: "nickname",
        label: "昵称",
        width: "140",
    }], __VLS_functionalComponentArgsRest(__VLS_146), false));
var __VLS_150 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    prop: "phone",
    label: "手机号",
    width: "150",
}));
var __VLS_152 = __VLS_151.apply(void 0, __spreadArray([{
        prop: "phone",
        label: "手机号",
        width: "150",
    }], __VLS_functionalComponentArgsRest(__VLS_151), false));
var __VLS_155 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    prop: "email",
    label: "邮箱",
    minWidth: "200",
    showOverflowTooltip: true,
}));
var __VLS_157 = __VLS_156.apply(void 0, __spreadArray([{
        prop: "email",
        label: "邮箱",
        minWidth: "200",
        showOverflowTooltip: true,
    }], __VLS_functionalComponentArgsRest(__VLS_156), false));
var __VLS_160 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    prop: "idCard",
    label: "身份证号",
    minWidth: "200",
    showOverflowTooltip: true,
}));
var __VLS_162 = __VLS_161.apply(void 0, __spreadArray([{
        prop: "idCard",
        label: "身份证号",
        minWidth: "200",
        showOverflowTooltip: true,
    }], __VLS_functionalComponentArgsRest(__VLS_161), false));
var __VLS_165 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    label: "状态",
    width: "120",
}));
var __VLS_167 = __VLS_166.apply(void 0, __spreadArray([{
        label: "状态",
        width: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_166), false));
var __VLS_169 = __VLS_168.slots.default;
{
    var __VLS_170 = __VLS_168.slots.default;
    var row = __VLS_getSlotParameters(__VLS_170)[0].row;
    var __VLS_171 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
        type: (__VLS_ctx.statusTagType(row.status)),
    }));
    var __VLS_173 = __VLS_172.apply(void 0, __spreadArray([{
            type: (__VLS_ctx.statusTagType(row.status)),
        }], __VLS_functionalComponentArgsRest(__VLS_172), false));
    var __VLS_175 = __VLS_174.slots.default;
    // @ts-ignore
    [statusTagType,];
    (__VLS_ctx.statusText(row.status));
    // @ts-ignore
    [statusText,];
    var __VLS_174;
}
var __VLS_168;
var __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "提交时间",
    width: "180",
}));
var __VLS_178 = __VLS_177.apply(void 0, __spreadArray([{
        label: "提交时间",
        width: "180",
    }], __VLS_functionalComponentArgsRest(__VLS_177), false));
var __VLS_180 = __VLS_179.slots.default;
{
    var __VLS_181 = __VLS_179.slots.default;
    var row = __VLS_getSlotParameters(__VLS_181)[0].row;
    (__VLS_ctx.formatDate(row.createTime));
    // @ts-ignore
    [formatDate,];
}
var __VLS_179;
var __VLS_182 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
    label: "操作",
    width: "220",
    fixed: "right",
}));
var __VLS_184 = __VLS_183.apply(void 0, __spreadArray([{
        label: "操作",
        width: "220",
        fixed: "right",
    }], __VLS_functionalComponentArgsRest(__VLS_183), false));
var __VLS_186 = __VLS_185.slots.default;
{
    var __VLS_187 = __VLS_185.slots.default;
    var row_1 = __VLS_getSlotParameters(__VLS_187)[0].row;
    var __VLS_188 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188(__assign({ 'onClick': {} }, { type: "primary", link: true })));
    var __VLS_190 = __VLS_189.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", link: true })], __VLS_functionalComponentArgsRest(__VLS_189), false));
    var __VLS_192 = void 0;
    var __VLS_193 = void 0;
    var __VLS_194 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleView(row_1);
                // @ts-ignore
                [handleView,];
            } });
    var __VLS_195 = __VLS_191.slots.default;
    var __VLS_191;
    var __VLS_196 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196(__assign({ 'onClick': {} }, { type: "success", link: true, disabled: (row_1.status !== 'pending') })));
    var __VLS_198 = __VLS_197.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "success", link: true, disabled: (row_1.status !== 'pending') })], __VLS_functionalComponentArgsRest(__VLS_197), false));
    var __VLS_200 = void 0;
    var __VLS_201 = void 0;
    var __VLS_202 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleReview(row_1, 'approved');
                // @ts-ignore
                [handleReview,];
            } });
    var __VLS_203 = __VLS_199.slots.default;
    var __VLS_199;
    var __VLS_204 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204(__assign({ 'onClick': {} }, { type: "danger", link: true, disabled: (row_1.status !== 'pending') })));
    var __VLS_206 = __VLS_205.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", link: true, disabled: (row_1.status !== 'pending') })], __VLS_functionalComponentArgsRest(__VLS_205), false));
    var __VLS_208 = void 0;
    var __VLS_209 = void 0;
    var __VLS_210 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleReview(row_1, 'rejected');
                // @ts-ignore
                [handleReview,];
            } });
    var __VLS_211 = __VLS_207.slots.default;
    var __VLS_207;
}
var __VLS_185;
var __VLS_133;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pagination" }));
var __VLS_212 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
ElPagination;
// @ts-ignore
var __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212(__assign(__assign({ 'onCurrentChange': {} }, { 'onSizeChange': {} }), { background: true, layout: "total, sizes, prev, pager, next, jumper", currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([10, 20, 30, 50]), total: (__VLS_ctx.total) })));
var __VLS_214 = __VLS_213.apply(void 0, __spreadArray([__assign(__assign({ 'onCurrentChange': {} }, { 'onSizeChange': {} }), { background: true, layout: "total, sizes, prev, pager, next, jumper", currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([10, 20, 30, 50]), total: (__VLS_ctx.total) })], __VLS_functionalComponentArgsRest(__VLS_213), false));
var __VLS_216;
var __VLS_217;
var __VLS_218 = ({ currentChange: {} },
    { onCurrentChange: (__VLS_ctx.handlePageChange) });
var __VLS_219 = ({ sizeChange: {} },
    { onSizeChange: (__VLS_ctx.handleSizeChange) });
// @ts-ignore
[queryForm, queryForm, total, handlePageChange, handleSizeChange,];
var __VLS_215;
var __VLS_3;
var __VLS_221 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
ElDrawer;
// @ts-ignore
var __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    modelValue: (__VLS_ctx.detailVisible),
    title: "认证详情",
    size: "40%",
    destroyOnClose: true,
}));
var __VLS_223 = __VLS_222.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.detailVisible),
        title: "认证详情",
        size: "40%",
        destroyOnClose: true,
    }], __VLS_functionalComponentArgsRest(__VLS_222), false));
var __VLS_225 = __VLS_224.slots.default;
// @ts-ignore
[detailVisible,];
if (__VLS_ctx.currentRecord) {
    // @ts-ignore
    [currentRecord,];
    var __VLS_226 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    ElDescriptions;
    // @ts-ignore
    var __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
        column: (2),
        border: true,
    }));
    var __VLS_228 = __VLS_227.apply(void 0, __spreadArray([{
            column: (2),
            border: true,
        }], __VLS_functionalComponentArgsRest(__VLS_227), false));
    var __VLS_230 = __VLS_229.slots.default;
    var __VLS_231 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
        label: "用户名",
    }));
    var __VLS_233 = __VLS_232.apply(void 0, __spreadArray([{
            label: "用户名",
        }], __VLS_functionalComponentArgsRest(__VLS_232), false));
    var __VLS_235 = __VLS_234.slots.default;
    (__VLS_ctx.currentRecord.username);
    // @ts-ignore
    [currentRecord,];
    var __VLS_234;
    var __VLS_236 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        label: "昵称",
    }));
    var __VLS_238 = __VLS_237.apply(void 0, __spreadArray([{
            label: "昵称",
        }], __VLS_functionalComponentArgsRest(__VLS_237), false));
    var __VLS_240 = __VLS_239.slots.default;
    (__VLS_ctx.currentRecord.nickname || '-');
    // @ts-ignore
    [currentRecord,];
    var __VLS_239;
    var __VLS_241 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        label: "手机号",
    }));
    var __VLS_243 = __VLS_242.apply(void 0, __spreadArray([{
            label: "手机号",
        }], __VLS_functionalComponentArgsRest(__VLS_242), false));
    var __VLS_245 = __VLS_244.slots.default;
    (__VLS_ctx.currentRecord.phone || '-');
    // @ts-ignore
    [currentRecord,];
    var __VLS_244;
    var __VLS_246 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
        label: "邮箱",
    }));
    var __VLS_248 = __VLS_247.apply(void 0, __spreadArray([{
            label: "邮箱",
        }], __VLS_functionalComponentArgsRest(__VLS_247), false));
    var __VLS_250 = __VLS_249.slots.default;
    (__VLS_ctx.currentRecord.email || '-');
    // @ts-ignore
    [currentRecord,];
    var __VLS_249;
    var __VLS_251 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({
        label: "身份证号",
        span: (2),
    }));
    var __VLS_253 = __VLS_252.apply(void 0, __spreadArray([{
            label: "身份证号",
            span: (2),
        }], __VLS_functionalComponentArgsRest(__VLS_252), false));
    var __VLS_255 = __VLS_254.slots.default;
    (__VLS_ctx.currentRecord.idCard || '-');
    // @ts-ignore
    [currentRecord,];
    var __VLS_254;
    var __VLS_256 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        label: "当前状态",
    }));
    var __VLS_258 = __VLS_257.apply(void 0, __spreadArray([{
            label: "当前状态",
        }], __VLS_functionalComponentArgsRest(__VLS_257), false));
    var __VLS_260 = __VLS_259.slots.default;
    (__VLS_ctx.statusText(__VLS_ctx.currentRecord.status));
    // @ts-ignore
    [statusText, currentRecord,];
    var __VLS_259;
    var __VLS_261 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
        label: "是否已认证",
    }));
    var __VLS_263 = __VLS_262.apply(void 0, __spreadArray([{
            label: "是否已认证",
        }], __VLS_functionalComponentArgsRest(__VLS_262), false));
    var __VLS_265 = __VLS_264.slots.default;
    var __VLS_266 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({
        type: (__VLS_ctx.currentRecord.certified ? 'success' : 'info'),
    }));
    var __VLS_268 = __VLS_267.apply(void 0, __spreadArray([{
            type: (__VLS_ctx.currentRecord.certified ? 'success' : 'info'),
        }], __VLS_functionalComponentArgsRest(__VLS_267), false));
    var __VLS_270 = __VLS_269.slots.default;
    // @ts-ignore
    [currentRecord,];
    (__VLS_ctx.currentRecord.certified ? '已认证' : '未认证');
    // @ts-ignore
    [currentRecord,];
    var __VLS_269;
    var __VLS_264;
    var __VLS_271 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({
        label: "审核人",
    }));
    var __VLS_273 = __VLS_272.apply(void 0, __spreadArray([{
            label: "审核人",
        }], __VLS_functionalComponentArgsRest(__VLS_272), false));
    var __VLS_275 = __VLS_274.slots.default;
    (__VLS_ctx.currentRecord.reviewerName || '-');
    // @ts-ignore
    [currentRecord,];
    var __VLS_274;
    var __VLS_276 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        label: "审核时间",
    }));
    var __VLS_278 = __VLS_277.apply(void 0, __spreadArray([{
            label: "审核时间",
        }], __VLS_functionalComponentArgsRest(__VLS_277), false));
    var __VLS_280 = __VLS_279.slots.default;
    (__VLS_ctx.formatDate(__VLS_ctx.currentRecord.reviewTime));
    // @ts-ignore
    [formatDate, currentRecord,];
    var __VLS_279;
    var __VLS_281 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
        label: "拒绝原因",
        span: (2),
    }));
    var __VLS_283 = __VLS_282.apply(void 0, __spreadArray([{
            label: "拒绝原因",
            span: (2),
        }], __VLS_functionalComponentArgsRest(__VLS_282), false));
    var __VLS_285 = __VLS_284.slots.default;
    (__VLS_ctx.currentRecord.rejectReason || '-');
    // @ts-ignore
    [currentRecord,];
    var __VLS_284;
    var __VLS_229;
}
if (__VLS_ctx.currentRecord) {
    // @ts-ignore
    [currentRecord,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-group" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-item" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "label" }));
    if (__VLS_ctx.currentRecord.idCardFrontUrl) {
        // @ts-ignore
        [currentRecord,];
        var __VLS_286 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        ElImage;
        // @ts-ignore
        var __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
            src: (__VLS_ctx.processImageUrl(__VLS_ctx.currentRecord.idCardFrontUrl)),
            fit: "cover",
            previewSrcList: ([__VLS_ctx.processImageUrl(__VLS_ctx.currentRecord.idCardFrontUrl)]),
        }));
        var __VLS_288 = __VLS_287.apply(void 0, __spreadArray([{
                src: (__VLS_ctx.processImageUrl(__VLS_ctx.currentRecord.idCardFrontUrl)),
                fit: "cover",
                previewSrcList: ([__VLS_ctx.processImageUrl(__VLS_ctx.currentRecord.idCardFrontUrl)]),
            }], __VLS_functionalComponentArgsRest(__VLS_287), false));
        // @ts-ignore
        [currentRecord, currentRecord, processImageUrl, processImageUrl,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "placeholder" }));
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-item" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "label" }));
    if (__VLS_ctx.currentRecord.idCardBackUrl) {
        // @ts-ignore
        [currentRecord,];
        var __VLS_291 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        ElImage;
        // @ts-ignore
        var __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
            src: (__VLS_ctx.processImageUrl(__VLS_ctx.currentRecord.idCardBackUrl)),
            fit: "cover",
            previewSrcList: ([__VLS_ctx.processImageUrl(__VLS_ctx.currentRecord.idCardBackUrl)]),
        }));
        var __VLS_293 = __VLS_292.apply(void 0, __spreadArray([{
                src: (__VLS_ctx.processImageUrl(__VLS_ctx.currentRecord.idCardBackUrl)),
                fit: "cover",
                previewSrcList: ([__VLS_ctx.processImageUrl(__VLS_ctx.currentRecord.idCardBackUrl)]),
            }], __VLS_functionalComponentArgsRest(__VLS_292), false));
        // @ts-ignore
        [currentRecord, currentRecord, processImageUrl, processImageUrl,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "placeholder" }));
    }
}
var __VLS_224;
var __VLS_296 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
ElDialog;
// @ts-ignore
var __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    modelValue: (__VLS_ctx.reviewDialogVisible),
    title: (__VLS_ctx.reviewForm.status === 'approved' ? '通过认证' : '拒绝认证'),
    width: "420px",
}));
var __VLS_298 = __VLS_297.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.reviewDialogVisible),
        title: (__VLS_ctx.reviewForm.status === 'approved' ? '通过认证' : '拒绝认证'),
        width: "420px",
    }], __VLS_functionalComponentArgsRest(__VLS_297), false));
var __VLS_300 = __VLS_299.slots.default;
// @ts-ignore
[reviewDialogVisible, reviewForm,];
var __VLS_301 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
    model: (__VLS_ctx.reviewForm),
    labelWidth: "80px",
}));
var __VLS_303 = __VLS_302.apply(void 0, __spreadArray([{
        model: (__VLS_ctx.reviewForm),
        labelWidth: "80px",
    }], __VLS_functionalComponentArgsRest(__VLS_302), false));
var __VLS_305 = __VLS_304.slots.default;
// @ts-ignore
[reviewForm,];
if (__VLS_ctx.reviewForm.status === 'rejected') {
    // @ts-ignore
    [reviewForm,];
    var __VLS_306 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
        label: "拒绝原因",
    }));
    var __VLS_308 = __VLS_307.apply(void 0, __spreadArray([{
            label: "拒绝原因",
        }], __VLS_functionalComponentArgsRest(__VLS_307), false));
    var __VLS_310 = __VLS_309.slots.default;
    var __VLS_311 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_312 = __VLS_asFunctionalComponent(__VLS_311, new __VLS_311({
        modelValue: (__VLS_ctx.reviewForm.rejectReason),
        type: "textarea",
        rows: "4",
        placeholder: "请输入拒绝原因",
    }));
    var __VLS_313 = __VLS_312.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.reviewForm.rejectReason),
            type: "textarea",
            rows: "4",
            placeholder: "请输入拒绝原因",
        }], __VLS_functionalComponentArgsRest(__VLS_312), false));
    // @ts-ignore
    [reviewForm,];
    var __VLS_309;
}
else {
    var __VLS_316 = {}.ElAlert;
    /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
    // @ts-ignore
    ElAlert;
    // @ts-ignore
    var __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
        type: "success",
        showIcon: true,
        closable: (false),
        title: "确认通过该用户的认证申请吗？",
    }));
    var __VLS_318 = __VLS_317.apply(void 0, __spreadArray([{
            type: "success",
            showIcon: true,
            closable: (false),
            title: "确认通过该用户的认证申请吗？",
        }], __VLS_functionalComponentArgsRest(__VLS_317), false));
}
var __VLS_304;
{
    var __VLS_321 = __VLS_299.slots.footer;
    var __VLS_322 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322(__assign({ 'onClick': {} })));
    var __VLS_324 = __VLS_323.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_323), false));
    var __VLS_326 = void 0;
    var __VLS_327 = void 0;
    var __VLS_328 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.reviewDialogVisible = false;
                // @ts-ignore
                [reviewDialogVisible,];
            } });
    var __VLS_329 = __VLS_325.slots.default;
    var __VLS_325;
    var __VLS_330 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.reviewLoading) })));
    var __VLS_332 = __VLS_331.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.reviewLoading) })], __VLS_functionalComponentArgsRest(__VLS_331), false));
    var __VLS_334 = void 0;
    var __VLS_335 = void 0;
    var __VLS_336 = ({ click: {} },
        { onClick: (__VLS_ctx.submitReview) });
    var __VLS_337 = __VLS_333.slots.default;
    // @ts-ignore
    [reviewLoading, submitReview,];
    var __VLS_333;
}
var __VLS_299;
/** @type {__VLS_StyleScopedClasses['certification-page']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['search-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['image-group']} */ ;
/** @type {__VLS_StyleScopedClasses['image-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['image-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
