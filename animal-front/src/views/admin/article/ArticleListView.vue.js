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
var article_1 = require("@/api/article");
var element_plus_1 = require("element-plus");
var format_1 = require("@/utils/format");
var icons_vue_1 = require("@element-plus/icons-vue");
var router = (0, vue_router_1.useRouter)();
var loading = (0, vue_1.ref)(false);
var tableData = (0, vue_1.ref)([]);
var total = (0, vue_1.ref)(0);
var categoryOptions = (0, vue_1.ref)([]);
var queryForm = (0, vue_1.reactive)({
    keyword: '',
    category: '',
    current: 1,
    size: 10
});
var categoryMap = (0, vue_1.computed)(function () {
    return categoryOptions.value.reduce(function (acc, cur) {
        acc[cur.value] = cur.label;
        return acc;
    }, {});
});
var activeFilters = (0, vue_1.computed)(function () {
    var filters = [];
    if (queryForm.keyword) {
        filters.push({ key: 'keyword', label: '关键词', value: queryForm.keyword });
    }
    if (queryForm.category) {
        filters.push({ key: 'category', label: '分类', value: getCategoryText(queryForm.category) });
    }
    return filters;
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
                    return [4 /*yield*/, (0, article_1.getArticleList)(queryForm)];
                case 2:
                    res = _a.sent();
                    tableData.value = res.data.records.map(function (item, index) { return (__assign(__assign({}, item), { serialNumber: (queryForm.current - 1) * queryForm.size + index + 1 })); });
                    total.value = res.data.total;
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('获取文章列表失败:', error_1);
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
    Object.assign(queryForm, { keyword: '', category: '', current: 1, size: 10 });
    fetchList();
}
function handleRemoveFilter(key) {
    if (key === 'category') {
        queryForm.category = '';
    }
    else {
        queryForm.keyword = '';
    }
    queryForm.current = 1;
    fetchList();
}
function handlePageChange(page) {
    queryForm.current = page;
    fetchList();
}
function handleSizeChange(size) {
    queryForm.size = size;
    queryForm.current = 1;
    fetchList();
}
function handleAdd() {
    router.push('/admin/article/add');
}
function handleEdit(row) {
    router.push({
        path: "/admin/article/edit/".concat(row.id),
        query: { category: row.category }
    });
}
function handleDelete(row) {
    var _this = this;
    element_plus_1.ElMessageBox.confirm("\u786E\u5B9A\u8981\u5220\u9664\u6587\u7AE0\"".concat(row.title, "\"\u5417?"), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, article_1.deleteArticle)(row.category, row.id)];
                case 1:
                    _a.sent();
                    element_plus_1.ElMessage.success('删除成功');
                    fetchList();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    element_plus_1.ElMessage.error('删除失败');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })
        .catch(function () { });
}
function getCategoryText(category) {
    return categoryMap.value[category] || category;
}
function getCategoryTagType(category) {
    var keys = Object.keys(categoryMap.value);
    var index = keys.indexOf(category);
    var palette = ['success', 'warning', 'danger', 'info'];
    if (index === -1) {
        return 'info';
    }
    return palette[index % palette.length];
}
(0, vue_1.onMounted)(function () {
    Promise.all([fetchList(), loadCategories()]);
});
function loadCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, article_1.getArticleCategories)()];
                case 1:
                    res = _a.sent();
                    categoryOptions.value = res.data || [];
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    categoryOptions.value = [
                        { value: 'GUIDE', label: '领养指南' },
                        { value: 'STORY', label: '领养故事' }
                    ];
                    console.warn('获取文章分类失败，使用默认分类', error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-article-list" }));
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
    placeholder: "标题",
    clearable: true,
}));
var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.keyword),
        placeholder: "标题",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_16), false));
// @ts-ignore
[queryForm,];
var __VLS_13;
var __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "分类",
}));
var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{
        label: "分类",
    }], __VLS_functionalComponentArgsRest(__VLS_21), false));
var __VLS_24 = __VLS_23.slots.default;
var __VLS_25 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.queryForm.category),
    placeholder: "全部",
    clearable: true,
}));
var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.category),
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
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.categoryOptions)); _i < _a.length; _i++) {
    var option = _a[_i][0];
    // @ts-ignore
    [categoryOptions,];
    var __VLS_35 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        key: (option.value),
        label: (option.label),
        value: (option.value),
    }));
    var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([{
            key: (option.value),
            label: (option.label),
            value: (option.value),
        }], __VLS_functionalComponentArgsRest(__VLS_36), false));
}
var __VLS_28;
var __VLS_23;
var __VLS_40 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_41), false));
var __VLS_44 = __VLS_43.slots.default;
var __VLS_45 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45(__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Search) })));
var __VLS_47 = __VLS_46.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Search) })], __VLS_functionalComponentArgsRest(__VLS_46), false));
var __VLS_49;
var __VLS_50;
var __VLS_51 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSearch) });
var __VLS_52 = __VLS_48.slots.default;
// @ts-ignore
[icons_vue_1.Search, handleSearch,];
var __VLS_48;
var __VLS_53 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53(__assign({ 'onClick': {} }, { icon: (__VLS_ctx.RefreshLeft) })));
var __VLS_55 = __VLS_54.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { icon: (__VLS_ctx.RefreshLeft) })], __VLS_functionalComponentArgsRest(__VLS_54), false));
var __VLS_57;
var __VLS_58;
var __VLS_59 = ({ click: {} },
    { onClick: (__VLS_ctx.handleReset) });
var __VLS_60 = __VLS_56.slots.default;
// @ts-ignore
[icons_vue_1.RefreshLeft, handleReset,];
var __VLS_56;
var __VLS_43;
var __VLS_8;
if (__VLS_ctx.activeFilters.length) {
    // @ts-ignore
    [activeFilters,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "active-filters" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "label" }));
    var _loop_1 = function (filter) {
        // @ts-ignore
        [activeFilters,];
        var __VLS_61 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61(__assign({ 'onClose': {} }, { key: (filter.key), closable: true, type: "info", size: "small" })));
        var __VLS_63 = __VLS_62.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { key: (filter.key), closable: true, type: "info", size: "small" })], __VLS_functionalComponentArgsRest(__VLS_62), false));
        var __VLS_65 = void 0;
        var __VLS_66 = void 0;
        var __VLS_67 = ({ close: {} },
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
        var __VLS_68 = __VLS_64.slots.default;
        (filter.label);
        (filter.value);
    };
    var __VLS_64;
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.activeFilters)); _b < _c.length; _b++) {
        var filter = _c[_b][0];
        _loop_1(filter);
    }
    var __VLS_69 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69(__assign({ 'onClick': {} }, { text: true, type: "primary", size: "small" })));
    var __VLS_71 = __VLS_70.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { text: true, type: "primary", size: "small" })], __VLS_functionalComponentArgsRest(__VLS_70), false));
    var __VLS_73 = void 0;
    var __VLS_74 = void 0;
    var __VLS_75 = ({ click: {} },
        { onClick: (__VLS_ctx.handleReset) });
    var __VLS_76 = __VLS_72.slots.default;
    // @ts-ignore
    [handleReset,];
    var __VLS_72;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "toolbar" }));
var __VLS_77 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77(__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Plus) })));
var __VLS_79 = __VLS_78.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Plus) })], __VLS_functionalComponentArgsRest(__VLS_78), false));
var __VLS_81;
var __VLS_82;
var __VLS_83 = ({ click: {} },
    { onClick: (__VLS_ctx.handleAdd) });
var __VLS_84 = __VLS_80.slots.default;
// @ts-ignore
[icons_vue_1.Plus, handleAdd,];
var __VLS_80;
var __VLS_85 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
ElTable;
// @ts-ignore
var __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    data: (__VLS_ctx.tableData),
    stripe: true,
}));
var __VLS_87 = __VLS_86.apply(void 0, __spreadArray([{
        data: (__VLS_ctx.tableData),
        stripe: true,
    }], __VLS_functionalComponentArgsRest(__VLS_86), false));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.loading) }), null, null);
var __VLS_89 = __VLS_88.slots.default;
// @ts-ignore
[tableData, vLoading, loading,];
var __VLS_90 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    label: "序号",
    width: "80",
}));
var __VLS_92 = __VLS_91.apply(void 0, __spreadArray([{
        label: "序号",
        width: "80",
    }], __VLS_functionalComponentArgsRest(__VLS_91), false));
var __VLS_94 = __VLS_93.slots.default;
{
    var __VLS_95 = __VLS_93.slots.default;
    var row = __VLS_getSlotParameters(__VLS_95)[0].row;
    (row.serialNumber);
}
var __VLS_93;
var __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "title",
    label: "标题",
    minWidth: "200",
}));
var __VLS_98 = __VLS_97.apply(void 0, __spreadArray([{
        prop: "title",
        label: "标题",
        minWidth: "200",
    }], __VLS_functionalComponentArgsRest(__VLS_97), false));
var __VLS_101 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    label: "分类",
    width: "100",
}));
var __VLS_103 = __VLS_102.apply(void 0, __spreadArray([{
        label: "分类",
        width: "100",
    }], __VLS_functionalComponentArgsRest(__VLS_102), false));
var __VLS_105 = __VLS_104.slots.default;
{
    var __VLS_106 = __VLS_104.slots.default;
    var row = __VLS_getSlotParameters(__VLS_106)[0].row;
    var __VLS_107 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
        type: (__VLS_ctx.getCategoryTagType(row.category)),
        effect: "light",
    }));
    var __VLS_109 = __VLS_108.apply(void 0, __spreadArray([{
            type: (__VLS_ctx.getCategoryTagType(row.category)),
            effect: "light",
        }], __VLS_functionalComponentArgsRest(__VLS_108), false));
    var __VLS_111 = __VLS_110.slots.default;
    // @ts-ignore
    [getCategoryTagType,];
    (__VLS_ctx.getCategoryText(row.category));
    // @ts-ignore
    [getCategoryText,];
    var __VLS_110;
}
var __VLS_104;
var __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "author",
    label: "作者",
    width: "120",
}));
var __VLS_114 = __VLS_113.apply(void 0, __spreadArray([{
        prop: "author",
        label: "作者",
        width: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_113), false));
var __VLS_117 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    prop: "viewCount",
    label: "浏览量",
    width: "100",
}));
var __VLS_119 = __VLS_118.apply(void 0, __spreadArray([{
        prop: "viewCount",
        label: "浏览量",
        width: "100",
    }], __VLS_functionalComponentArgsRest(__VLS_118), false));
var __VLS_122 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    prop: "likeCount",
    label: "点赞",
    width: "90",
}));
var __VLS_124 = __VLS_123.apply(void 0, __spreadArray([{
        prop: "likeCount",
        label: "点赞",
        width: "90",
    }], __VLS_functionalComponentArgsRest(__VLS_123), false));
var __VLS_127 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    prop: "favoriteCount",
    label: "收藏",
    width: "90",
}));
var __VLS_129 = __VLS_128.apply(void 0, __spreadArray([{
        prop: "favoriteCount",
        label: "收藏",
        width: "90",
    }], __VLS_functionalComponentArgsRest(__VLS_128), false));
var __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "创建时间",
    width: "180",
}));
var __VLS_134 = __VLS_133.apply(void 0, __spreadArray([{
        label: "创建时间",
        width: "180",
    }], __VLS_functionalComponentArgsRest(__VLS_133), false));
var __VLS_136 = __VLS_135.slots.default;
{
    var __VLS_137 = __VLS_135.slots.default;
    var row = __VLS_getSlotParameters(__VLS_137)[0].row;
    (__VLS_ctx.formatDate(row.createdTime));
    // @ts-ignore
    [format_1.formatDate,];
}
var __VLS_135;
var __VLS_138 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    label: "操作",
    width: "150",
    fixed: "right",
}));
var __VLS_140 = __VLS_139.apply(void 0, __spreadArray([{
        label: "操作",
        width: "150",
        fixed: "right",
    }], __VLS_functionalComponentArgsRest(__VLS_139), false));
var __VLS_142 = __VLS_141.slots.default;
{
    var __VLS_143 = __VLS_141.slots.default;
    var row_1 = __VLS_getSlotParameters(__VLS_143)[0].row;
    var __VLS_144 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144(__assign({ 'onClick': {} }, { type: "primary", link: true, icon: (__VLS_ctx.Edit) })));
    var __VLS_146 = __VLS_145.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", link: true, icon: (__VLS_ctx.Edit) })], __VLS_functionalComponentArgsRest(__VLS_145), false));
    var __VLS_148 = void 0;
    var __VLS_149 = void 0;
    var __VLS_150 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleEdit(row_1);
                // @ts-ignore
                [icons_vue_1.Edit, handleEdit,];
            } });
    var __VLS_151 = __VLS_147.slots.default;
    var __VLS_147;
    var __VLS_152 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152(__assign({ 'onClick': {} }, { type: "danger", link: true, icon: (__VLS_ctx.Delete) })));
    var __VLS_154 = __VLS_153.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", link: true, icon: (__VLS_ctx.Delete) })], __VLS_functionalComponentArgsRest(__VLS_153), false));
    var __VLS_156 = void 0;
    var __VLS_157 = void 0;
    var __VLS_158 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleDelete(row_1);
                // @ts-ignore
                [icons_vue_1.Delete, handleDelete,];
            } });
    var __VLS_159 = __VLS_155.slots.default;
    var __VLS_155;
}
var __VLS_141;
var __VLS_88;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pagination" }));
var __VLS_160 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
ElPagination;
// @ts-ignore
var __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160(__assign(__assign({ 'onSizeChange': {} }, { 'onCurrentChange': {} }), { currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([10, 20, 50]), total: (__VLS_ctx.total), layout: "total, sizes, prev, pager, next, jumper", background: true })));
var __VLS_162 = __VLS_161.apply(void 0, __spreadArray([__assign(__assign({ 'onSizeChange': {} }, { 'onCurrentChange': {} }), { currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([10, 20, 50]), total: (__VLS_ctx.total), layout: "total, sizes, prev, pager, next, jumper", background: true })], __VLS_functionalComponentArgsRest(__VLS_161), false));
var __VLS_164;
var __VLS_165;
var __VLS_166 = ({ sizeChange: {} },
    { onSizeChange: (__VLS_ctx.handleSizeChange) });
var __VLS_167 = ({ currentChange: {} },
    { onCurrentChange: (__VLS_ctx.handlePageChange) });
// @ts-ignore
[queryForm, queryForm, total, handleSizeChange, handlePageChange,];
var __VLS_163;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['admin-article-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['active-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
