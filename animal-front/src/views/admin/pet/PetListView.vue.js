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
var pet_1 = require("@/api/pet");
var dict_1 = require("@/api/dict");
var element_plus_1 = require("element-plus");
var format_1 = require("@/utils/format");
var icons_vue_1 = require("@element-plus/icons-vue");
var router = (0, vue_router_1.useRouter)();
var loading = (0, vue_1.ref)(false);
var tableData = (0, vue_1.ref)([]);
var total = (0, vue_1.ref)(0);
var selectedIds = (0, vue_1.ref)([]);
// 字典数据
var dictData = (0, vue_1.ref)({
    petCategories: {},
    adoptionStatuses: {}
});
var queryForm = (0, vue_1.reactive)({
    name: '',
    category: '',
    adoptionStatus: '',
    current: 1,
    size: 10
});
var activeFilters = (0, vue_1.computed)(function () {
    var filters = [];
    if (queryForm.name) {
        filters.push({ key: 'name', label: '关键词', value: queryForm.name });
    }
    if (queryForm.category) {
        filters.push({ key: 'category', label: '类型', value: getCategoryText(queryForm.category) });
    }
    if (queryForm.adoptionStatus) {
        filters.push({ key: 'adoptionStatus', label: '状态', value: getAdoptionStatusText(queryForm.adoptionStatus) });
    }
    return filters;
});
// 加载字典数据
function loadDictData() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, dict_1.getAllDictData)()];
                case 1:
                    res = _a.sent();
                    if (res.code === 200) {
                        dictData.value = res.data;
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('加载字典数据失败:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 获取列表
function fetchList() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, pet_1.getPetList)(queryForm)];
                case 2:
                    res = _a.sent();
                    tableData.value = res.data.records;
                    total.value = res.data.total;
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('获取宠物列表失败:', error_2);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 搜索
function handleSearch() {
    queryForm.current = 1;
    fetchList();
}
// 重置
function handleReset() {
    Object.assign(queryForm, {
        name: '',
        category: '',
        adoptionStatus: '',
        current: 1,
        size: 10
    });
    fetchList();
}
// 添加
function handleAdd() {
    router.push('/admin/pet/add');
}
// 编辑
function handleEdit(row) {
    router.push("/admin/pet/edit/".concat(row.id));
}
// 删除
function handleDelete(row) {
    var _this = this;
    element_plus_1.ElMessageBox.confirm("\u786E\u5B9A\u8981\u5220\u9664\u5BA0\u7269\"".concat(row.name, "\"\u5417?"), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, pet_1.deletePet)(row.id)];
                case 1:
                    _a.sent();
                    element_plus_1.ElMessage.success('删除成功');
                    fetchList();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    element_plus_1.ElMessage.error('删除失败');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })
        .catch(function () { });
}
// 批量删除
function handleBatchDelete() {
    var _this = this;
    element_plus_1.ElMessageBox.confirm("\u786E\u5B9A\u8981\u5220\u9664\u9009\u4E2D\u7684 ".concat(selectedIds.value.length, " \u6761\u8BB0\u5F55\u5417?"), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all(selectedIds.value.map(function (id) { return (0, pet_1.deletePet)(id); }))];
                case 1:
                    _a.sent();
                    element_plus_1.ElMessage.success('删除成功');
                    fetchList();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    element_plus_1.ElMessage.error('删除失败');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })
        .catch(function () { });
}
// 选择变化
function handleSelectionChange(selection) {
    selectedIds.value = selection.map(function (item) { return item.id; });
}
// 分页
function handleSizeChange(size) {
    queryForm.size = size;
    queryForm.current = 1;
    fetchList();
}
function handleCurrentChange(page) {
    queryForm.current = page;
    fetchList();
}
// 辅助函数
// 获取第一张图片
function getFirstImage(row) {
    var images = getImageList(row);
    return images.length > 0 ? images[0] : '';
}
// 获取图片列表
function getImageList(row) {
    if (!row.images)
        return [];
    // 如果是字符串，尝试解析为JSON
    if (typeof row.images === 'string') {
        try {
            var trimmed = row.images.trim();
            // 检查是否是JSON格式
            if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                var parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return parsed.map(function (img) { return processImageUrl(img); });
                }
            }
        }
        catch (e) {
            console.warn('解析图片JSON失败:', e);
        }
        // 如果不是JSON，当作单个URL处理
        return [processImageUrl(row.images)];
    }
    // 如果已经是数组
    if (Array.isArray(row.images)) {
        return row.images.map(function (img) { return processImageUrl(img); });
    }
    return [];
}
// 处理图片URL（移除@前缀，处理相对路径）
function processImageUrl(url) {
    if (!url)
        return '';
    // 移除@前缀
    if (url.startsWith('@')) {
        url = url.substring(1);
    }
    // 如果是相对路径，添加MinIO前缀
    if (!url.startsWith('http')) {
        url = "http://localhost:9000/animal-adopt".concat(url.startsWith('/') ? '' : '/').concat(url);
    }
    return url;
}
function getCategoryText(category) {
    var map = {
        cat: '猫咪',
        dog: '狗狗',
        rabbit: '兔子',
        bird: '鸟类',
        other: '其他'
    };
    return map[category] || category;
}
function getHealthStatusType(status) {
    var map = {
        healthy: 'success',
        sick: 'danger',
        injured: 'danger',
        recovering: 'warning'
    };
    return map[status] || '';
}
function getHealthStatusText(status) {
    var map = {
        healthy: '健康',
        sick: '生病',
        injured: '受伤',
        recovering: '康复中'
    };
    return map[status] || status;
}
function getAdoptionStatusType(status) {
    var map = {
        available: 'success',
        pending: 'warning',
        adopted: 'info'
    };
    return map[status] || '';
}
function getAdoptionStatusText(status) {
    var map = {
        available: '可领养',
        pending: '待审核',
        adopted: '已领养'
    };
    return map[status] || status;
}
(0, vue_1.onMounted)(function () {
    loadDictData();
    fetchList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-pet-list" }));
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
var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.queryForm.name), placeholder: "宠物名称或品种", clearable: true })));
var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.queryForm.name), placeholder: "宠物名称或品种", clearable: true })], __VLS_functionalComponentArgsRest(__VLS_16), false));
var __VLS_19;
var __VLS_20;
var __VLS_21 = ({ keyup: {} },
    { onKeyup: (__VLS_ctx.handleSearch) });
// @ts-ignore
[queryForm, handleSearch,];
var __VLS_18;
var __VLS_13;
var __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "类型",
}));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{
        label: "类型",
    }], __VLS_functionalComponentArgsRest(__VLS_24), false));
var __VLS_27 = __VLS_26.slots.default;
var __VLS_28 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.queryForm.category),
    placeholder: "全部",
    clearable: true,
}));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.category),
        placeholder: "全部",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_29), false));
var __VLS_32 = __VLS_31.slots.default;
// @ts-ignore
[queryForm,];
var __VLS_33 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
ElOption;
// @ts-ignore
var __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    label: "全部",
    value: "",
}));
var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
        label: "全部",
        value: "",
    }], __VLS_functionalComponentArgsRest(__VLS_34), false));
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.dictData.petCategories)); _i < _a.length; _i++) {
    var _b = _a[_i], label = _b[0], value = _b[1];
    // @ts-ignore
    [dictData,];
    var __VLS_38 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
        key: (value),
        label: (label),
        value: (value),
    }));
    var __VLS_40 = __VLS_39.apply(void 0, __spreadArray([{
            key: (value),
            label: (label),
            value: (value),
        }], __VLS_functionalComponentArgsRest(__VLS_39), false));
}
var __VLS_31;
var __VLS_26;
var __VLS_43 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    label: "状态",
}));
var __VLS_45 = __VLS_44.apply(void 0, __spreadArray([{
        label: "状态",
    }], __VLS_functionalComponentArgsRest(__VLS_44), false));
var __VLS_47 = __VLS_46.slots.default;
var __VLS_48 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    modelValue: (__VLS_ctx.queryForm.adoptionStatus),
    placeholder: "全部",
    clearable: true,
}));
var __VLS_50 = __VLS_49.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.adoptionStatus),
        placeholder: "全部",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_49), false));
var __VLS_52 = __VLS_51.slots.default;
// @ts-ignore
[queryForm,];
var __VLS_53 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
ElOption;
// @ts-ignore
var __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    label: "全部",
    value: "",
}));
var __VLS_55 = __VLS_54.apply(void 0, __spreadArray([{
        label: "全部",
        value: "",
    }], __VLS_functionalComponentArgsRest(__VLS_54), false));
for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.dictData.adoptionStatuses)); _c < _d.length; _c++) {
    var _e = _d[_c], label = _e[0], value = _e[1];
    // @ts-ignore
    [dictData,];
    var __VLS_58 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
        key: (value),
        label: (label),
        value: (value),
    }));
    var __VLS_60 = __VLS_59.apply(void 0, __spreadArray([{
            key: (value),
            label: (label),
            value: (value),
        }], __VLS_functionalComponentArgsRest(__VLS_59), false));
}
var __VLS_51;
var __VLS_46;
var __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({}));
var __VLS_65 = __VLS_64.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_64), false));
var __VLS_67 = __VLS_66.slots.default;
var __VLS_68 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68(__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Search) })));
var __VLS_70 = __VLS_69.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Search) })], __VLS_functionalComponentArgsRest(__VLS_69), false));
var __VLS_72;
var __VLS_73;
var __VLS_74 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSearch) });
var __VLS_75 = __VLS_71.slots.default;
// @ts-ignore
[handleSearch, icons_vue_1.Search,];
var __VLS_71;
var __VLS_76 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76(__assign({ 'onClick': {} }, { icon: (__VLS_ctx.RefreshLeft) })));
var __VLS_78 = __VLS_77.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { icon: (__VLS_ctx.RefreshLeft) })], __VLS_functionalComponentArgsRest(__VLS_77), false));
var __VLS_80;
var __VLS_81;
var __VLS_82 = ({ click: {} },
    { onClick: (__VLS_ctx.handleReset) });
var __VLS_83 = __VLS_79.slots.default;
// @ts-ignore
[icons_vue_1.RefreshLeft, handleReset,];
var __VLS_79;
var __VLS_66;
var __VLS_8;
if (__VLS_ctx.activeFilters.length) {
    // @ts-ignore
    [activeFilters,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "active-filters" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "label" }));
    var _loop_1 = function (filter) {
        // @ts-ignore
        [activeFilters,];
        var __VLS_84 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84(__assign({ 'onClose': {} }, { key: (filter.key), closable: true, type: "info", size: "small" })));
        var __VLS_86 = __VLS_85.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { key: (filter.key), closable: true, type: "info", size: "small" })], __VLS_functionalComponentArgsRest(__VLS_85), false));
        var __VLS_88 = void 0;
        var __VLS_89 = void 0;
        var __VLS_90 = ({ close: {} },
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
        var __VLS_91 = __VLS_87.slots.default;
        (filter.label);
        (filter.value);
    };
    var __VLS_87;
    for (var _f = 0, _g = __VLS_getVForSourceType((__VLS_ctx.activeFilters)); _f < _g.length; _f++) {
        var filter = _g[_f][0];
        _loop_1(filter);
    }
    var __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92(__assign({ 'onClick': {} }, { text: true, type: "primary", size: "small" })));
    var __VLS_94 = __VLS_93.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { text: true, type: "primary", size: "small" })], __VLS_functionalComponentArgsRest(__VLS_93), false));
    var __VLS_96 = void 0;
    var __VLS_97 = void 0;
    var __VLS_98 = ({ click: {} },
        { onClick: (__VLS_ctx.handleReset) });
    var __VLS_99 = __VLS_95.slots.default;
    // @ts-ignore
    [handleReset,];
    var __VLS_95;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "toolbar" }));
var __VLS_100 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100(__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Plus) })));
var __VLS_102 = __VLS_101.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.Plus) })], __VLS_functionalComponentArgsRest(__VLS_101), false));
var __VLS_104;
var __VLS_105;
var __VLS_106 = ({ click: {} },
    { onClick: (__VLS_ctx.handleAdd) });
var __VLS_107 = __VLS_103.slots.default;
// @ts-ignore
[icons_vue_1.Plus, handleAdd,];
var __VLS_103;
var __VLS_108 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108(__assign({ 'onClick': {} }, { type: "danger", icon: (__VLS_ctx.Delete), disabled: (__VLS_ctx.selectedIds.length === 0) })));
var __VLS_110 = __VLS_109.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", icon: (__VLS_ctx.Delete), disabled: (__VLS_ctx.selectedIds.length === 0) })], __VLS_functionalComponentArgsRest(__VLS_109), false));
var __VLS_112;
var __VLS_113;
var __VLS_114 = ({ click: {} },
    { onClick: (__VLS_ctx.handleBatchDelete) });
var __VLS_115 = __VLS_111.slots.default;
// @ts-ignore
[icons_vue_1.Delete, selectedIds, handleBatchDelete,];
var __VLS_111;
var __VLS_116 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
ElTable;
// @ts-ignore
var __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116(__assign({ 'onSelectionChange': {} }, { data: (__VLS_ctx.tableData), stripe: true })));
var __VLS_118 = __VLS_117.apply(void 0, __spreadArray([__assign({ 'onSelectionChange': {} }, { data: (__VLS_ctx.tableData), stripe: true })], __VLS_functionalComponentArgsRest(__VLS_117), false));
var __VLS_120;
var __VLS_121;
var __VLS_122 = ({ selectionChange: {} },
    { onSelectionChange: (__VLS_ctx.handleSelectionChange) });
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.loading) }), null, null);
var __VLS_123 = __VLS_119.slots.default;
// @ts-ignore
[tableData, handleSelectionChange, vLoading, loading,];
var __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    type: "selection",
    width: "55",
}));
var __VLS_126 = __VLS_125.apply(void 0, __spreadArray([{
        type: "selection",
        width: "55",
    }], __VLS_functionalComponentArgsRest(__VLS_125), false));
var __VLS_129 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    prop: "id",
    label: "ID",
    width: "80",
}));
var __VLS_131 = __VLS_130.apply(void 0, __spreadArray([{
        prop: "id",
        label: "ID",
        width: "80",
    }], __VLS_functionalComponentArgsRest(__VLS_130), false));
var __VLS_134 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    label: "图片",
    width: "100",
}));
var __VLS_136 = __VLS_135.apply(void 0, __spreadArray([{
        label: "图片",
        width: "100",
    }], __VLS_functionalComponentArgsRest(__VLS_135), false));
var __VLS_138 = __VLS_137.slots.default;
{
    var __VLS_139 = __VLS_137.slots.default;
    var row = __VLS_getSlotParameters(__VLS_139)[0].row;
    var __VLS_140 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    ElImage;
    // @ts-ignore
    var __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140(__assign(__assign({ src: (__VLS_ctx.getFirstImage(row) || '/placeholder.png'), fit: "cover" }, { style: {} }), { previewSrcList: (__VLS_ctx.getImageList(row)) })));
    var __VLS_142 = __VLS_141.apply(void 0, __spreadArray([__assign(__assign({ src: (__VLS_ctx.getFirstImage(row) || '/placeholder.png'), fit: "cover" }, { style: {} }), { previewSrcList: (__VLS_ctx.getImageList(row)) })], __VLS_functionalComponentArgsRest(__VLS_141), false));
    // @ts-ignore
    [getFirstImage, getImageList,];
}
var __VLS_137;
var __VLS_145 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    prop: "name",
    label: "名称",
    minWidth: "120",
}));
var __VLS_147 = __VLS_146.apply(void 0, __spreadArray([{
        prop: "name",
        label: "名称",
        minWidth: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_146), false));
var __VLS_150 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    label: "类型",
    width: "100",
}));
var __VLS_152 = __VLS_151.apply(void 0, __spreadArray([{
        label: "类型",
        width: "100",
    }], __VLS_functionalComponentArgsRest(__VLS_151), false));
var __VLS_154 = __VLS_153.slots.default;
{
    var __VLS_155 = __VLS_153.slots.default;
    var row = __VLS_getSlotParameters(__VLS_155)[0].row;
    var __VLS_156 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
    var __VLS_158 = __VLS_157.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_157), false));
    var __VLS_160 = __VLS_159.slots.default;
    (__VLS_ctx.getCategoryText(row.category));
    // @ts-ignore
    [getCategoryText,];
    var __VLS_159;
}
var __VLS_153;
var __VLS_161 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    prop: "breed",
    label: "品种",
    minWidth: "120",
}));
var __VLS_163 = __VLS_162.apply(void 0, __spreadArray([{
        prop: "breed",
        label: "品种",
        minWidth: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_162), false));
var __VLS_166 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
    label: "性别",
    width: "80",
}));
var __VLS_168 = __VLS_167.apply(void 0, __spreadArray([{
        label: "性别",
        width: "80",
    }], __VLS_functionalComponentArgsRest(__VLS_167), false));
var __VLS_170 = __VLS_169.slots.default;
{
    var __VLS_171 = __VLS_169.slots.default;
    var row = __VLS_getSlotParameters(__VLS_171)[0].row;
    if (row.gender === 1) {
        var __VLS_172 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            type: "primary",
        }));
        var __VLS_174 = __VLS_173.apply(void 0, __spreadArray([{
                type: "primary",
            }], __VLS_functionalComponentArgsRest(__VLS_173), false));
        var __VLS_176 = __VLS_175.slots.default;
        var __VLS_175;
    }
    else if (row.gender === 2) {
        var __VLS_177 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
            type: "danger",
        }));
        var __VLS_179 = __VLS_178.apply(void 0, __spreadArray([{
                type: "danger",
            }], __VLS_functionalComponentArgsRest(__VLS_178), false));
        var __VLS_181 = __VLS_180.slots.default;
        var __VLS_180;
    }
    else {
        var __VLS_182 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
            type: "info",
        }));
        var __VLS_184 = __VLS_183.apply(void 0, __spreadArray([{
                type: "info",
            }], __VLS_functionalComponentArgsRest(__VLS_183), false));
        var __VLS_186 = __VLS_185.slots.default;
        var __VLS_185;
    }
}
var __VLS_169;
var __VLS_187 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    prop: "age",
    label: "年龄",
    width: "80",
}));
var __VLS_189 = __VLS_188.apply(void 0, __spreadArray([{
        prop: "age",
        label: "年龄",
        width: "80",
    }], __VLS_functionalComponentArgsRest(__VLS_188), false));
var __VLS_191 = __VLS_190.slots.default;
{
    var __VLS_192 = __VLS_190.slots.default;
    var row = __VLS_getSlotParameters(__VLS_192)[0].row;
    (row.age);
}
var __VLS_190;
var __VLS_193 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    label: "健康状态",
    width: "120",
}));
var __VLS_195 = __VLS_194.apply(void 0, __spreadArray([{
        label: "健康状态",
        width: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_194), false));
var __VLS_197 = __VLS_196.slots.default;
{
    var __VLS_198 = __VLS_196.slots.default;
    var row = __VLS_getSlotParameters(__VLS_198)[0].row;
    var __VLS_199 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
        type: (__VLS_ctx.getHealthStatusType(row.healthStatus)),
    }));
    var __VLS_201 = __VLS_200.apply(void 0, __spreadArray([{
            type: (__VLS_ctx.getHealthStatusType(row.healthStatus)),
        }], __VLS_functionalComponentArgsRest(__VLS_200), false));
    var __VLS_203 = __VLS_202.slots.default;
    // @ts-ignore
    [getHealthStatusType,];
    (__VLS_ctx.getHealthStatusText(row.healthStatus));
    // @ts-ignore
    [getHealthStatusText,];
    var __VLS_202;
}
var __VLS_196;
var __VLS_204 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "领养状态",
    width: "120",
}));
var __VLS_206 = __VLS_205.apply(void 0, __spreadArray([{
        label: "领养状态",
        width: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_205), false));
var __VLS_208 = __VLS_207.slots.default;
{
    var __VLS_209 = __VLS_207.slots.default;
    var row = __VLS_getSlotParameters(__VLS_209)[0].row;
    var __VLS_210 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
        type: (__VLS_ctx.getAdoptionStatusType(row.adoptionStatus)),
    }));
    var __VLS_212 = __VLS_211.apply(void 0, __spreadArray([{
            type: (__VLS_ctx.getAdoptionStatusType(row.adoptionStatus)),
        }], __VLS_functionalComponentArgsRest(__VLS_211), false));
    var __VLS_214 = __VLS_213.slots.default;
    // @ts-ignore
    [getAdoptionStatusType,];
    (__VLS_ctx.getAdoptionStatusText(row.adoptionStatus));
    // @ts-ignore
    [getAdoptionStatusText,];
    var __VLS_213;
}
var __VLS_207;
var __VLS_215 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
    label: "创建时间",
    width: "120",
}));
var __VLS_217 = __VLS_216.apply(void 0, __spreadArray([{
        label: "创建时间",
        width: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_216), false));
var __VLS_219 = __VLS_218.slots.default;
{
    var __VLS_220 = __VLS_218.slots.default;
    var row = __VLS_getSlotParameters(__VLS_220)[0].row;
    (__VLS_ctx.formatDate(row.createTime, 'YYYY-MM-DD'));
    // @ts-ignore
    [format_1.formatDate,];
}
var __VLS_218;
var __VLS_221 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    label: "操作",
    width: "180",
    fixed: "right",
}));
var __VLS_223 = __VLS_222.apply(void 0, __spreadArray([{
        label: "操作",
        width: "180",
        fixed: "right",
    }], __VLS_functionalComponentArgsRest(__VLS_222), false));
var __VLS_225 = __VLS_224.slots.default;
{
    var __VLS_226 = __VLS_224.slots.default;
    var row_1 = __VLS_getSlotParameters(__VLS_226)[0].row;
    var __VLS_227 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227(__assign({ 'onClick': {} }, { type: "primary", link: true, icon: (__VLS_ctx.Edit) })));
    var __VLS_229 = __VLS_228.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", link: true, icon: (__VLS_ctx.Edit) })], __VLS_functionalComponentArgsRest(__VLS_228), false));
    var __VLS_231 = void 0;
    var __VLS_232 = void 0;
    var __VLS_233 = ({ click: {} },
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
    var __VLS_234 = __VLS_230.slots.default;
    var __VLS_230;
    var __VLS_235 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235(__assign({ 'onClick': {} }, { type: "danger", link: true, icon: (__VLS_ctx.Delete) })));
    var __VLS_237 = __VLS_236.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", link: true, icon: (__VLS_ctx.Delete) })], __VLS_functionalComponentArgsRest(__VLS_236), false));
    var __VLS_239 = void 0;
    var __VLS_240 = void 0;
    var __VLS_241 = ({ click: {} },
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
    var __VLS_242 = __VLS_238.slots.default;
    var __VLS_238;
}
var __VLS_224;
var __VLS_119;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pagination" }));
var __VLS_243 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
ElPagination;
// @ts-ignore
var __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243(__assign(__assign({ 'onSizeChange': {} }, { 'onCurrentChange': {} }), { currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([10, 20, 50, 100]), total: (__VLS_ctx.total), layout: "total, sizes, prev, pager, next, jumper", background: true })));
var __VLS_245 = __VLS_244.apply(void 0, __spreadArray([__assign(__assign({ 'onSizeChange': {} }, { 'onCurrentChange': {} }), { currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([10, 20, 50, 100]), total: (__VLS_ctx.total), layout: "total, sizes, prev, pager, next, jumper", background: true })], __VLS_functionalComponentArgsRest(__VLS_244), false));
var __VLS_247;
var __VLS_248;
var __VLS_249 = ({ sizeChange: {} },
    { onSizeChange: (__VLS_ctx.handleSizeChange) });
var __VLS_250 = ({ currentChange: {} },
    { onCurrentChange: (__VLS_ctx.handleCurrentChange) });
// @ts-ignore
[queryForm, queryForm, total, handleSizeChange, handleCurrentChange,];
var __VLS_246;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['admin-pet-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['active-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
