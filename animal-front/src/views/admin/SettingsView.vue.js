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
var dict_1 = require("@/api/dict");
var stats_1 = require("@/api/stats");
var tabOptions = [
    { label: '宠物类型', value: 'pet_category' },
    { label: '领养状态', value: 'adoption_status' },
    { label: '健康状态', value: 'health_status' },
    { label: '文章分类', value: 'article_category' }
];
var activeSection = (0, vue_1.ref)('dict');
var activeTab = (0, vue_1.ref)('pet_category');
var tableData = (0, vue_1.ref)([]);
var loading = (0, vue_1.ref)(false);
var refreshing = (0, vue_1.ref)(false);
var syncing = (0, vue_1.ref)(false);
var dialogVisible = (0, vue_1.ref)(false);
var isEdit = (0, vue_1.ref)(false);
var formRef = (0, vue_1.ref)();
var form = (0, vue_1.reactive)({
    id: undefined,
    dictType: 'pet_category',
    dictKey: '',
    dictLabel: '',
    sortOrder: 0,
    status: 1,
    remark: ''
});
var formStatus = (0, vue_1.computed)({
    get: function () { var _a; return (_a = form.status) !== null && _a !== void 0 ? _a : 1; },
    set: function (val) {
        form.status = val;
    }
});
var rules = {
    dictType: [{ required: true, message: '请选择字典类型', trigger: 'change' }],
    dictKey: [{ required: true, message: '请输入编码', trigger: 'blur' }],
    dictLabel: [{ required: true, message: '请输入显示名称', trigger: 'blur' }]
};
function loadData() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, dict_1.listDictItems)(activeTab.value)];
                case 2:
                    res = _a.sent();
                    tableData.value = res.data || [];
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    element_plus_1.ElMessage.error('加载字典数据失败');
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function resetForm(type) {
    var _a;
    form.id = undefined;
    form.dictType = type;
    form.dictKey = '';
    form.dictLabel = '';
    form.sortOrder = (((_a = tableData.value) === null || _a === void 0 ? void 0 : _a.length) || 0) + 1;
    form.status = 1;
    form.remark = '';
}
function handleCreate() {
    isEdit.value = false;
    resetForm(activeTab.value);
    dialogVisible.value = true;
}
function handleEdit(row) {
    isEdit.value = true;
    form.id = row.id;
    form.dictType = row.dictType;
    form.dictKey = row.dictKey;
    form.dictLabel = row.dictLabel;
    form.sortOrder = row.sortOrder;
    form.status = row.status;
    form.remark = row.remark;
    dialogVisible.value = true;
}
function handleDelete(row) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, element_plus_1.ElMessageBox.confirm("\u786E\u8BA4\u5220\u9664\u3010".concat(row.dictLabel, "\u3011\u5417\uFF1F"), '提示', {
                            type: 'warning'
                        })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, dict_1.deleteDictItem)(row.id)];
                case 2:
                    _b.sent();
                    element_plus_1.ElMessage.success('删除成功');
                    loadData();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function handleSubmit() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!formRef.value)
                        return [2 /*return*/];
                    return [4 /*yield*/, formRef.value.validate(function (valid) { return __awaiter(_this, void 0, void 0, function () {
                            var payload, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!valid)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 6, , 7]);
                                        payload = {
                                            dictType: form.dictType,
                                            dictKey: form.dictKey,
                                            dictLabel: form.dictLabel,
                                            sortOrder: form.sortOrder,
                                            status: form.status,
                                            remark: form.remark
                                        };
                                        if (!(isEdit.value && form.id)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, dict_1.updateDictItem)(form.id, payload)];
                                    case 2:
                                        _a.sent();
                                        element_plus_1.ElMessage.success('更新成功');
                                        return [3 /*break*/, 5];
                                    case 3: return [4 /*yield*/, (0, dict_1.createDictItem)(payload)];
                                    case 4:
                                        _a.sent();
                                        element_plus_1.ElMessage.success('创建成功');
                                        _a.label = 5;
                                    case 5:
                                        dialogVisible.value = false;
                                        loadData();
                                        return [3 /*break*/, 7];
                                    case 6:
                                        error_2 = _a.sent();
                                        element_plus_1.ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
                                        return [3 /*break*/, 7];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleRefreshDictCache() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, element_plus_1.ElMessageBox.confirm('确认刷新所有字典缓存吗？\n通常在修改字典配置后使用。', '提示', {
                            type: 'warning'
                        })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 3:
                    refreshing.value = true;
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, 7, 8]);
                    return [4 /*yield*/, (0, dict_1.refreshDictCache)()];
                case 5:
                    _b.sent();
                    element_plus_1.ElMessage.success('字典缓存已刷新');
                    return [3 /*break*/, 8];
                case 6:
                    error_3 = _b.sent();
                    element_plus_1.ElMessage.error('刷新字典缓存失败');
                    return [3 /*break*/, 8];
                case 7:
                    refreshing.value = false;
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function handleManualSyncViewCount() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, element_plus_1.ElMessageBox.confirm('确认立即同步浏览统计数据到数据库吗？', '提示', {
                            type: 'warning'
                        })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 3:
                    syncing.value = true;
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, 7, 8]);
                    return [4 /*yield*/, (0, stats_1.manualSyncViewCount)()];
                case 5:
                    _b.sent();
                    element_plus_1.ElMessage.success('浏览统计同步任务已执行');
                    return [3 /*break*/, 8];
                case 6:
                    error_4 = _b.sent();
                    element_plus_1.ElMessage.error('执行浏览统计同步失败');
                    return [3 /*break*/, 8];
                case 7:
                    syncing.value = false;
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
(0, vue_1.onMounted)(function () {
    loadData();
});
(0, vue_1.watch)(activeTab, function () {
    loadData();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['settings-header']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__nav-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['dict-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__header']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "settings-view" }));
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
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "settings-header" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "title" }));
    var __VLS_6 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    ElTabs;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6(__assign(__assign({ modelValue: (__VLS_ctx.activeSection) }, { class: "settings-section-tabs" }), { type: "card" })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign(__assign({ modelValue: (__VLS_ctx.activeSection) }, { class: "settings-section-tabs" }), { type: "card" })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    var __VLS_10 = __VLS_9.slots.default;
    // @ts-ignore
    [activeSection,];
    var __VLS_11 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
        label: "下拉选项管理",
        name: "dict",
    }));
    var __VLS_13 = __VLS_12.apply(void 0, __spreadArray([{
            label: "下拉选项管理",
            name: "dict",
        }], __VLS_functionalComponentArgsRest(__VLS_12), false));
    var __VLS_16 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        label: "系统工具",
        name: "tools",
    }));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{
            label: "系统工具",
            name: "tools",
        }], __VLS_functionalComponentArgsRest(__VLS_17), false));
    var __VLS_9;
}
if (__VLS_ctx.activeSection === 'dict') {
    // @ts-ignore
    [activeSection,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    var __VLS_21 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    ElTabs;
    // @ts-ignore
    var __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21(__assign({ modelValue: (__VLS_ctx.activeTab) }, { class: "dict-tabs" })));
    var __VLS_23 = __VLS_22.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.activeTab) }, { class: "dict-tabs" })], __VLS_functionalComponentArgsRest(__VLS_22), false));
    var __VLS_25 = __VLS_24.slots.default;
    // @ts-ignore
    [activeTab,];
    var __VLS_26 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        label: "宠物类型",
        name: "pet_category",
    }));
    var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([{
            label: "宠物类型",
            name: "pet_category",
        }], __VLS_functionalComponentArgsRest(__VLS_27), false));
    var __VLS_31 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        label: "领养状态",
        name: "adoption_status",
    }));
    var __VLS_33 = __VLS_32.apply(void 0, __spreadArray([{
            label: "领养状态",
            name: "adoption_status",
        }], __VLS_functionalComponentArgsRest(__VLS_32), false));
    var __VLS_36 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        label: "健康状态",
        name: "health_status",
    }));
    var __VLS_38 = __VLS_37.apply(void 0, __spreadArray([{
            label: "健康状态",
            name: "health_status",
        }], __VLS_functionalComponentArgsRest(__VLS_37), false));
    var __VLS_41 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        label: "文章分类",
        name: "article_category",
    }));
    var __VLS_43 = __VLS_42.apply(void 0, __spreadArray([{
            label: "文章分类",
            name: "article_category",
        }], __VLS_functionalComponentArgsRest(__VLS_42), false));
    var __VLS_24;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "toolbar" }));
    var __VLS_46 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46(__assign({ 'onClick': {} }, { type: "primary" })));
    var __VLS_48 = __VLS_47.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_47), false));
    var __VLS_50 = void 0;
    var __VLS_51 = void 0;
    var __VLS_52 = ({ click: {} },
        { onClick: (__VLS_ctx.handleCreate) });
    var __VLS_53 = __VLS_49.slots.default;
    // @ts-ignore
    [handleCreate,];
    var __VLS_49;
    var __VLS_54 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    ElTable;
    // @ts-ignore
    var __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54(__assign({ data: (__VLS_ctx.tableData), border: true }, { style: {} })));
    var __VLS_56 = __VLS_55.apply(void 0, __spreadArray([__assign({ data: (__VLS_ctx.tableData), border: true }, { style: {} })], __VLS_functionalComponentArgsRest(__VLS_55), false));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.loading) }), null, null);
    var __VLS_58 = __VLS_57.slots.default;
    // @ts-ignore
    [tableData, vLoading, loading,];
    var __VLS_59 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    ElTableColumn;
    // @ts-ignore
    var __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        prop: "dictKey",
        label: "编码",
        minWidth: "160",
    }));
    var __VLS_61 = __VLS_60.apply(void 0, __spreadArray([{
            prop: "dictKey",
            label: "编码",
            minWidth: "160",
        }], __VLS_functionalComponentArgsRest(__VLS_60), false));
    var __VLS_64 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    ElTableColumn;
    // @ts-ignore
    var __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        prop: "dictLabel",
        label: "显示名称",
        minWidth: "180",
    }));
    var __VLS_66 = __VLS_65.apply(void 0, __spreadArray([{
            prop: "dictLabel",
            label: "显示名称",
            minWidth: "180",
        }], __VLS_functionalComponentArgsRest(__VLS_65), false));
    var __VLS_69 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    ElTableColumn;
    // @ts-ignore
    var __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        prop: "sortOrder",
        label: "排序",
        width: "80",
    }));
    var __VLS_71 = __VLS_70.apply(void 0, __spreadArray([{
            prop: "sortOrder",
            label: "排序",
            width: "80",
        }], __VLS_functionalComponentArgsRest(__VLS_70), false));
    var __VLS_74 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    ElTableColumn;
    // @ts-ignore
    var __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
        prop: "status",
        label: "状态",
        width: "80",
    }));
    var __VLS_76 = __VLS_75.apply(void 0, __spreadArray([{
            prop: "status",
            label: "状态",
            width: "80",
        }], __VLS_functionalComponentArgsRest(__VLS_75), false));
    var __VLS_78 = __VLS_77.slots.default;
    {
        var __VLS_79 = __VLS_77.slots.default;
        var row = __VLS_getSlotParameters(__VLS_79)[0].row;
        var __VLS_80 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        ElTag;
        // @ts-ignore
        var __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            type: (row.status === 1 ? 'success' : 'info'),
        }));
        var __VLS_82 = __VLS_81.apply(void 0, __spreadArray([{
                type: (row.status === 1 ? 'success' : 'info'),
            }], __VLS_functionalComponentArgsRest(__VLS_81), false));
        var __VLS_84 = __VLS_83.slots.default;
        (row.status === 1 ? '启用' : '禁用');
        var __VLS_83;
    }
    var __VLS_77;
    var __VLS_85 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    ElTableColumn;
    // @ts-ignore
    var __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        prop: "remark",
        label: "备注",
        minWidth: "200",
        showOverflowTooltip: true,
    }));
    var __VLS_87 = __VLS_86.apply(void 0, __spreadArray([{
            prop: "remark",
            label: "备注",
            minWidth: "200",
            showOverflowTooltip: true,
        }], __VLS_functionalComponentArgsRest(__VLS_86), false));
    var __VLS_90 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    ElTableColumn;
    // @ts-ignore
    var __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        label: "操作",
        width: "160",
        fixed: "right",
        headerAlign: "center",
    }));
    var __VLS_92 = __VLS_91.apply(void 0, __spreadArray([{
            label: "操作",
            width: "160",
            fixed: "right",
            headerAlign: "center",
        }], __VLS_functionalComponentArgsRest(__VLS_91), false));
    var __VLS_94 = __VLS_93.slots.default;
    {
        var __VLS_95 = __VLS_93.slots.default;
        var row_1 = __VLS_getSlotParameters(__VLS_95)[0].row;
        var __VLS_96 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96(__assign({ 'onClick': {} }, { type: "primary", text: true })));
        var __VLS_98 = __VLS_97.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", text: true })], __VLS_functionalComponentArgsRest(__VLS_97), false));
        var __VLS_100 = void 0;
        var __VLS_101 = void 0;
        var __VLS_102 = ({ click: {} },
            { onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.activeSection === 'dict'))
                        return;
                    __VLS_ctx.handleEdit(row_1);
                    // @ts-ignore
                    [handleEdit,];
                } });
        var __VLS_103 = __VLS_99.slots.default;
        var __VLS_99;
        var __VLS_104 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104(__assign({ 'onClick': {} }, { type: "danger", text: true })));
        var __VLS_106 = __VLS_105.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", text: true })], __VLS_functionalComponentArgsRest(__VLS_105), false));
        var __VLS_108 = void 0;
        var __VLS_109 = void 0;
        var __VLS_110 = ({ click: {} },
            { onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.activeSection === 'dict'))
                        return;
                    __VLS_ctx.handleDelete(row_1);
                    // @ts-ignore
                    [handleDelete,];
                } });
        var __VLS_111 = __VLS_107.slots.default;
        var __VLS_107;
    }
    var __VLS_93;
    var __VLS_57;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "tools-placeholder" }));
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "tools-tip" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "tools-actions" }));
    var __VLS_112 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.refreshing) })));
    var __VLS_114 = __VLS_113.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.refreshing) })], __VLS_functionalComponentArgsRest(__VLS_113), false));
    var __VLS_116 = void 0;
    var __VLS_117 = void 0;
    var __VLS_118 = ({ click: {} },
        { onClick: (__VLS_ctx.handleRefreshDictCache) });
    var __VLS_119 = __VLS_115.slots.default;
    // @ts-ignore
    [refreshing, handleRefreshDictCache,];
    var __VLS_115;
    var __VLS_120 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120(__assign({ 'onClick': {} }, { type: "warning", loading: (__VLS_ctx.syncing) })));
    var __VLS_122 = __VLS_121.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "warning", loading: (__VLS_ctx.syncing) })], __VLS_functionalComponentArgsRest(__VLS_121), false));
    var __VLS_124 = void 0;
    var __VLS_125 = void 0;
    var __VLS_126 = ({ click: {} },
        { onClick: (__VLS_ctx.handleManualSyncViewCount) });
    var __VLS_127 = __VLS_123.slots.default;
    // @ts-ignore
    [syncing, handleManualSyncViewCount,];
    var __VLS_123;
}
var __VLS_3;
var __VLS_128 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
ElDialog;
// @ts-ignore
var __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑字典项' : '新增字典项'),
    width: "480px",
}));
var __VLS_130 = __VLS_129.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.dialogVisible),
        title: (__VLS_ctx.isEdit ? '编辑字典项' : '新增字典项'),
        width: "480px",
    }], __VLS_functionalComponentArgsRest(__VLS_129), false));
var __VLS_132 = __VLS_131.slots.default;
// @ts-ignore
[dialogVisible, isEdit,];
var __VLS_133 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "90px",
}));
var __VLS_135 = __VLS_134.apply(void 0, __spreadArray([{
        ref: "formRef",
        model: (__VLS_ctx.form),
        rules: (__VLS_ctx.rules),
        labelWidth: "90px",
    }], __VLS_functionalComponentArgsRest(__VLS_134), false));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_137 = {};
var __VLS_139 = __VLS_136.slots.default;
// @ts-ignore
[form, rules, formRef,];
var __VLS_140 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    label: "字典类型",
    prop: "dictType",
}));
var __VLS_142 = __VLS_141.apply(void 0, __spreadArray([{
        label: "字典类型",
        prop: "dictType",
    }], __VLS_functionalComponentArgsRest(__VLS_141), false));
var __VLS_144 = __VLS_143.slots.default;
var __VLS_145 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    modelValue: (__VLS_ctx.form.dictType),
    placeholder: "请选择字典类型",
    disabled: (__VLS_ctx.isEdit),
}));
var __VLS_147 = __VLS_146.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.dictType),
        placeholder: "请选择字典类型",
        disabled: (__VLS_ctx.isEdit),
    }], __VLS_functionalComponentArgsRest(__VLS_146), false));
var __VLS_149 = __VLS_148.slots.default;
// @ts-ignore
[isEdit, form,];
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.tabOptions)); _i < _a.length; _i++) {
    var item = _a[_i][0];
    // @ts-ignore
    [tabOptions,];
    var __VLS_150 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    var __VLS_152 = __VLS_151.apply(void 0, __spreadArray([{
            key: (item.value),
            label: (item.label),
            value: (item.value),
        }], __VLS_functionalComponentArgsRest(__VLS_151), false));
}
var __VLS_148;
var __VLS_143;
var __VLS_155 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    label: "编码",
    prop: "dictKey",
}));
var __VLS_157 = __VLS_156.apply(void 0, __spreadArray([{
        label: "编码",
        prop: "dictKey",
    }], __VLS_functionalComponentArgsRest(__VLS_156), false));
var __VLS_159 = __VLS_158.slots.default;
var __VLS_160 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    modelValue: (__VLS_ctx.form.dictKey),
}));
var __VLS_162 = __VLS_161.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.dictKey),
    }], __VLS_functionalComponentArgsRest(__VLS_161), false));
// @ts-ignore
[form,];
var __VLS_158;
var __VLS_165 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    label: "显示名称",
    prop: "dictLabel",
}));
var __VLS_167 = __VLS_166.apply(void 0, __spreadArray([{
        label: "显示名称",
        prop: "dictLabel",
    }], __VLS_functionalComponentArgsRest(__VLS_166), false));
var __VLS_169 = __VLS_168.slots.default;
var __VLS_170 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
    modelValue: (__VLS_ctx.form.dictLabel),
}));
var __VLS_172 = __VLS_171.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.dictLabel),
    }], __VLS_functionalComponentArgsRest(__VLS_171), false));
// @ts-ignore
[form,];
var __VLS_168;
var __VLS_175 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    label: "排序",
    prop: "sortOrder",
}));
var __VLS_177 = __VLS_176.apply(void 0, __spreadArray([{
        label: "排序",
        prop: "sortOrder",
    }], __VLS_functionalComponentArgsRest(__VLS_176), false));
var __VLS_179 = __VLS_178.slots.default;
var __VLS_180 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
ElInputNumber;
// @ts-ignore
var __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.form.sortOrder),
    min: (0),
}));
var __VLS_182 = __VLS_181.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.sortOrder),
        min: (0),
    }], __VLS_functionalComponentArgsRest(__VLS_181), false));
// @ts-ignore
[form,];
var __VLS_178;
var __VLS_185 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    label: "状态",
    prop: "status",
}));
var __VLS_187 = __VLS_186.apply(void 0, __spreadArray([{
        label: "状态",
        prop: "status",
    }], __VLS_functionalComponentArgsRest(__VLS_186), false));
var __VLS_189 = __VLS_188.slots.default;
var __VLS_190 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
ElSwitch;
// @ts-ignore
var __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
    modelValue: (__VLS_ctx.formStatus),
    activeValue: (1),
    inactiveValue: (0),
}));
var __VLS_192 = __VLS_191.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.formStatus),
        activeValue: (1),
        inactiveValue: (0),
    }], __VLS_functionalComponentArgsRest(__VLS_191), false));
// @ts-ignore
[formStatus,];
var __VLS_188;
var __VLS_195 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
    label: "备注",
    prop: "remark",
}));
var __VLS_197 = __VLS_196.apply(void 0, __spreadArray([{
        label: "备注",
        prop: "remark",
    }], __VLS_functionalComponentArgsRest(__VLS_196), false));
var __VLS_199 = __VLS_198.slots.default;
var __VLS_200 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: (2),
}));
var __VLS_202 = __VLS_201.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.remark),
        type: "textarea",
        rows: (2),
    }], __VLS_functionalComponentArgsRest(__VLS_201), false));
// @ts-ignore
[form,];
var __VLS_198;
var __VLS_136;
{
    var __VLS_205 = __VLS_131.slots.footer;
    var __VLS_206 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206(__assign({ 'onClick': {} })));
    var __VLS_208 = __VLS_207.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_207), false));
    var __VLS_210 = void 0;
    var __VLS_211 = void 0;
    var __VLS_212 = ({ click: {} },
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
    var __VLS_213 = __VLS_209.slots.default;
    var __VLS_209;
    var __VLS_214 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214(__assign({ 'onClick': {} }, { type: "primary" })));
    var __VLS_216 = __VLS_215.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_215), false));
    var __VLS_218 = void 0;
    var __VLS_219 = void 0;
    var __VLS_220 = ({ click: {} },
        { onClick: (__VLS_ctx.handleSubmit) });
    var __VLS_221 = __VLS_217.slots.default;
    // @ts-ignore
    [handleSubmit,];
    var __VLS_217;
}
var __VLS_131;
/** @type {__VLS_StyleScopedClasses['settings-view']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-header']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['dict-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['tools-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['tools-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tools-actions']} */ ;
// @ts-ignore
var __VLS_138 = __VLS_137;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
