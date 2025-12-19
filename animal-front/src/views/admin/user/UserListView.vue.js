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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var user_1 = require("@/api/user");
var element_plus_1 = require("element-plus");
var format_1 = require("@/utils/format");
var icons_vue_1 = require("@element-plus/icons-vue");
var loading = (0, vue_1.ref)(false);
var tableData = (0, vue_1.ref)([]);
var total = (0, vue_1.ref)(0);
var queryForm = (0, vue_1.reactive)({
    keyword: '',
    role: '',
    current: 1,
    size: 10
});
var roleOptions = [
    { label: '普通用户', value: 'user' },
    { label: '管理员', value: 'admin' },
    { label: '超级管理员', value: 'super_admin' }
];
var activeFilters = (0, vue_1.computed)(function () {
    var filters = [];
    if (queryForm.keyword) {
        filters.push({ key: 'keyword', label: '关键词', value: queryForm.keyword });
    }
    if (queryForm.role) {
        filters.push({ key: 'role', label: '角色', value: getRoleText(queryForm.role) });
    }
    return filters;
});
// 处理图片URL（移除@前缀，处理IP地址替换）
function processImageUrl(url) {
    if (!url)
        return '';
    // 移除@前缀
    if (url.startsWith('@')) {
        url = url.substring(1);
    }
    // 将IP地址替换为localhost
    url = url.replace(/https?:\/\/\d+\.\d+\.\d+\.\d+:9000/, 'http://localhost:9000');
    // 如果是相对路径，添加MinIO前缀
    if (!url.startsWith('http')) {
        url = "http://localhost:9000/animal-adopt".concat(url.startsWith('/') ? '' : '/').concat(url);
    }
    return url;
}
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
                    return [4 /*yield*/, (0, user_1.getUserList)(queryForm)];
                case 2:
                    res = _a.sent();
                    tableData.value = res.data.records;
                    total.value = res.data.total;
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('获取用户列表失败:', error_1);
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
    Object.assign(queryForm, { keyword: '', role: '', current: 1, size: 10 });
    fetchList();
}
function handleRemoveFilter(key) {
    if (key === 'role') {
        queryForm.role = '';
    }
    else {
        queryForm.keyword = '';
    }
    fetchList();
}
function handleEdit(row) {
    editVisible.value = true;
    saving.value = false;
    Object.assign(editForm, {
        id: row.id,
        username: row.username,
        nickname: row.nickname,
        phone: row.phone,
        email: row.email,
        avatar: row.avatar,
        role: row.role,
        status: row.status
    });
}
function handleStatusChange(row) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, user_1.updateUserStatus)(row.id, row.status)];
                case 1:
                    _a.sent();
                    element_plus_1.ElMessage.success('状态更新成功');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    row.status = row.status === 1 ? 0 : 1;
                    element_plus_1.ElMessage.error('状态更新失败');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function handleDelete(row) {
    var _this = this;
    element_plus_1.ElMessageBox.confirm("\u786E\u5B9A\u8981\u5220\u9664\u7528\u6237\"".concat(row.username, "\"\u5417?"), '提示', {
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
                    return [4 /*yield*/, (0, user_1.deleteUser)(row.id)];
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
function getRoleType(role) {
    var map = {
        super_admin: 'danger',
        admin: 'warning',
        application_auditor: 'info',
        housekeeper: 'success',
        user: 'success',
        ADMIN: 'warning',
        USER: 'success'
    };
    return map[role] || '';
}
function getRoleText(role) {
    var map = {
        super_admin: '超级管理员',
        admin: '管理员',
        application_auditor: '审核员',
        housekeeper: '管家',
        user: '用户',
        ADMIN: '管理员',
        USER: '用户'
    };
    return map[role] || role;
}
var editVisible = (0, vue_1.ref)(false);
var editFormRef = (0, vue_1.ref)();
var saving = (0, vue_1.ref)(false);
var editForm = (0, vue_1.reactive)({
    id: 0,
    username: '',
    nickname: '',
    phone: '',
    email: '',
    avatar: '',
    role: '',
    status: 1
});
var editRules = {
    role: [{ required: true, message: '请选择角色', trigger: 'change' }]
};
function handleCancel() {
    editVisible.value = false;
}
function handleSubmit() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editFormRef.value)
                        return [2 /*return*/];
                    return [4 /*yield*/, editFormRef.value.validate(function (valid) { return __awaiter(_this, void 0, void 0, function () {
                            var error_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!valid)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, 4, 5]);
                                        saving.value = true;
                                        return [4 /*yield*/, (0, user_1.updateAdminUser)(editForm.id, {
                                                role: editForm.role || undefined,
                                                status: editForm.status
                                            })];
                                    case 2:
                                        _a.sent();
                                        element_plus_1.ElMessage.success('保存成功');
                                        editVisible.value = false;
                                        fetchList();
                                        return [3 /*break*/, 5];
                                    case 3:
                                        error_4 = _a.sent();
                                        element_plus_1.ElMessage.error('保存失败');
                                        return [3 /*break*/, 5];
                                    case 4:
                                        saving.value = false;
                                        return [7 /*endfinally*/];
                                    case 5: return [2 /*return*/];
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
(0, vue_1.onMounted)(function () {
    fetchList();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['user-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-user-list']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-user-list" }));
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
    placeholder: "用户名/邮箱/手机",
    clearable: true,
}));
var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.keyword),
        placeholder: "用户名/邮箱/手机",
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
    label: "角色",
}));
var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{
        label: "角色",
    }], __VLS_functionalComponentArgsRest(__VLS_21), false));
var __VLS_24 = __VLS_23.slots.default;
var __VLS_25 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.queryForm.role),
    placeholder: "全部",
    clearable: true,
}));
var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.queryForm.role),
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
for (var _i = 0, _c = __VLS_getVForSourceType((__VLS_ctx.roleOptions)); _i < _c.length; _i++) {
    var item = _c[_i][0];
    // @ts-ignore
    [roleOptions,];
    var __VLS_35 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([{
            key: (item.value),
            label: (item.label),
            value: (item.value),
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
    for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.activeFilters)); _d < _e.length; _d++) {
        var filter = _e[_d][0];
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
var __VLS_77 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
ElTable;
// @ts-ignore
var __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    data: (__VLS_ctx.tableData),
    stripe: true,
}));
var __VLS_79 = __VLS_78.apply(void 0, __spreadArray([{
        data: (__VLS_ctx.tableData),
        stripe: true,
    }], __VLS_functionalComponentArgsRest(__VLS_78), false));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (__VLS_ctx.loading) }), null, null);
var __VLS_81 = __VLS_80.slots.default;
// @ts-ignore
[tableData, vLoading, loading,];
var __VLS_82 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    prop: "id",
    label: "ID",
    width: "80",
}));
var __VLS_84 = __VLS_83.apply(void 0, __spreadArray([{
        prop: "id",
        label: "ID",
        width: "80",
    }], __VLS_functionalComponentArgsRest(__VLS_83), false));
var __VLS_87 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "头像",
    width: "80",
}));
var __VLS_89 = __VLS_88.apply(void 0, __spreadArray([{
        label: "头像",
        width: "80",
    }], __VLS_functionalComponentArgsRest(__VLS_88), false));
var __VLS_91 = __VLS_90.slots.default;
{
    var __VLS_92 = __VLS_90.slots.default;
    var row = __VLS_getSlotParameters(__VLS_92)[0].row;
    var __VLS_93 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    ElAvatar;
    // @ts-ignore
    var __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        size: (40),
        src: (__VLS_ctx.processImageUrl(row.avatar) || 'http://localhost:9000/animal-adopt/default.jpg'),
    }));
    var __VLS_95 = __VLS_94.apply(void 0, __spreadArray([{
            size: (40),
            src: (__VLS_ctx.processImageUrl(row.avatar) || 'http://localhost:9000/animal-adopt/default.jpg'),
        }], __VLS_functionalComponentArgsRest(__VLS_94), false));
    var __VLS_97 = __VLS_96.slots.default;
    // @ts-ignore
    [processImageUrl,];
    ((_a = row.username) === null || _a === void 0 ? void 0 : _a.charAt(0));
    var __VLS_96;
}
var __VLS_90;
var __VLS_98 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    prop: "username",
    label: "用户名",
    minWidth: "120",
}));
var __VLS_100 = __VLS_99.apply(void 0, __spreadArray([{
        prop: "username",
        label: "用户名",
        minWidth: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_99), false));
var __VLS_103 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    prop: "email",
    label: "邮箱",
    minWidth: "150",
}));
var __VLS_105 = __VLS_104.apply(void 0, __spreadArray([{
        prop: "email",
        label: "邮箱",
        minWidth: "150",
    }], __VLS_functionalComponentArgsRest(__VLS_104), false));
var __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "phone",
    label: "手机号",
    width: "120",
}));
var __VLS_110 = __VLS_109.apply(void 0, __spreadArray([{
        prop: "phone",
        label: "手机号",
        width: "120",
    }], __VLS_functionalComponentArgsRest(__VLS_109), false));
var __VLS_113 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    label: "角色",
    width: "100",
}));
var __VLS_115 = __VLS_114.apply(void 0, __spreadArray([{
        label: "角色",
        width: "100",
    }], __VLS_functionalComponentArgsRest(__VLS_114), false));
var __VLS_117 = __VLS_116.slots.default;
{
    var __VLS_118 = __VLS_116.slots.default;
    var row = __VLS_getSlotParameters(__VLS_118)[0].row;
    var __VLS_119 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
        type: (__VLS_ctx.getRoleType(row.role)),
    }));
    var __VLS_121 = __VLS_120.apply(void 0, __spreadArray([{
            type: (__VLS_ctx.getRoleType(row.role)),
        }], __VLS_functionalComponentArgsRest(__VLS_120), false));
    var __VLS_123 = __VLS_122.slots.default;
    // @ts-ignore
    [getRoleType,];
    (__VLS_ctx.getRoleText(row.role));
    // @ts-ignore
    [getRoleText,];
    var __VLS_122;
}
var __VLS_116;
var __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "状态",
    width: "100",
}));
var __VLS_126 = __VLS_125.apply(void 0, __spreadArray([{
        label: "状态",
        width: "100",
    }], __VLS_functionalComponentArgsRest(__VLS_125), false));
var __VLS_128 = __VLS_127.slots.default;
{
    var __VLS_129 = __VLS_127.slots.default;
    var row_1 = __VLS_getSlotParameters(__VLS_129)[0].row;
    var __VLS_130 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    ElSwitch;
    // @ts-ignore
    var __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130(__assign({ 'onChange': {} }, { modelValue: (row_1.status), activeValue: (1), inactiveValue: (0) })));
    var __VLS_132 = __VLS_131.apply(void 0, __spreadArray([__assign({ 'onChange': {} }, { modelValue: (row_1.status), activeValue: (1), inactiveValue: (0) })], __VLS_functionalComponentArgsRest(__VLS_131), false));
    var __VLS_134 = void 0;
    var __VLS_135 = void 0;
    var __VLS_136 = ({ change: {} },
        { onChange: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleStatusChange(row_1);
                // @ts-ignore
                [handleStatusChange,];
            } });
    var __VLS_133;
}
var __VLS_127;
var __VLS_138 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    label: "创建时间",
    width: "180",
}));
var __VLS_140 = __VLS_139.apply(void 0, __spreadArray([{
        label: "创建时间",
        width: "180",
    }], __VLS_functionalComponentArgsRest(__VLS_139), false));
var __VLS_142 = __VLS_141.slots.default;
{
    var __VLS_143 = __VLS_141.slots.default;
    var row = __VLS_getSlotParameters(__VLS_143)[0].row;
    (__VLS_ctx.formatDate(row.createdTime));
    // @ts-ignore
    [format_1.formatDate,];
}
var __VLS_141;
var __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
ElTableColumn;
// @ts-ignore
var __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "操作",
    width: "150",
    fixed: "right",
}));
var __VLS_146 = __VLS_145.apply(void 0, __spreadArray([{
        label: "操作",
        width: "150",
        fixed: "right",
    }], __VLS_functionalComponentArgsRest(__VLS_145), false));
var __VLS_148 = __VLS_147.slots.default;
{
    var __VLS_149 = __VLS_147.slots.default;
    var row_2 = __VLS_getSlotParameters(__VLS_149)[0].row;
    var __VLS_150 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150(__assign({ 'onClick': {} }, { type: "primary", link: true, icon: (__VLS_ctx.Edit) })));
    var __VLS_152 = __VLS_151.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", link: true, icon: (__VLS_ctx.Edit) })], __VLS_functionalComponentArgsRest(__VLS_151), false));
    var __VLS_154 = void 0;
    var __VLS_155 = void 0;
    var __VLS_156 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleEdit(row_2);
                // @ts-ignore
                [icons_vue_1.Edit, handleEdit,];
            } });
    var __VLS_157 = __VLS_153.slots.default;
    var __VLS_153;
    var __VLS_158 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158(__assign({ 'onClick': {} }, { type: "danger", link: true, icon: (__VLS_ctx.Delete), disabled: (row_2.role === 'ADMIN') })));
    var __VLS_160 = __VLS_159.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", link: true, icon: (__VLS_ctx.Delete), disabled: (row_2.role === 'ADMIN') })], __VLS_functionalComponentArgsRest(__VLS_159), false));
    var __VLS_162 = void 0;
    var __VLS_163 = void 0;
    var __VLS_164 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleDelete(row_2);
                // @ts-ignore
                [icons_vue_1.Delete, handleDelete,];
            } });
    var __VLS_165 = __VLS_161.slots.default;
    var __VLS_161;
}
var __VLS_147;
var __VLS_80;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pagination" }));
var __VLS_166 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
ElPagination;
// @ts-ignore
var __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166(__assign(__assign({ 'onSizeChange': {} }, { 'onCurrentChange': {} }), { currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([10, 20, 50, 100]), total: (__VLS_ctx.total), layout: "total, sizes, prev, pager, next, jumper", background: true })));
var __VLS_168 = __VLS_167.apply(void 0, __spreadArray([__assign(__assign({ 'onSizeChange': {} }, { 'onCurrentChange': {} }), { currentPage: (__VLS_ctx.queryForm.current), pageSize: (__VLS_ctx.queryForm.size), pageSizes: ([10, 20, 50, 100]), total: (__VLS_ctx.total), layout: "total, sizes, prev, pager, next, jumper", background: true })], __VLS_functionalComponentArgsRest(__VLS_167), false));
var __VLS_170;
var __VLS_171;
var __VLS_172 = ({ sizeChange: {} },
    { onSizeChange: (__VLS_ctx.fetchList) });
var __VLS_173 = ({ currentChange: {} },
    { onCurrentChange: (__VLS_ctx.fetchList) });
// @ts-ignore
[queryForm, queryForm, total, fetchList, fetchList,];
var __VLS_169;
var __VLS_3;
var __VLS_175 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
var __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    name: "fade-zoom",
}));
var __VLS_177 = __VLS_176.apply(void 0, __spreadArray([{
        name: "fade-zoom",
    }], __VLS_functionalComponentArgsRest(__VLS_176), false));
var __VLS_179 = __VLS_178.slots.default;
var __VLS_180 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
ElDialog;
// @ts-ignore
var __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.editVisible),
    title: "用户详情",
    width: "780px",
    destroyOnClose: true,
    closeOnClickModal: (false),
    modalClass: ('edit-dialog-overlay'),
    customClass: ('edit-dialog-card'),
}));
var __VLS_182 = __VLS_181.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.editVisible),
        title: "用户详情",
        width: "780px",
        destroyOnClose: true,
        closeOnClickModal: (false),
        modalClass: ('edit-dialog-overlay'),
        customClass: ('edit-dialog-card'),
    }], __VLS_functionalComponentArgsRest(__VLS_181), false));
var __VLS_184 = __VLS_183.slots.default;
// @ts-ignore
[editVisible,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "edit-layout" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info-card" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info-header" }));
var __VLS_185 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
// @ts-ignore
ElAvatar;
// @ts-ignore
var __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    size: (60),
    src: (__VLS_ctx.processImageUrl(__VLS_ctx.editForm.avatar) || 'http://localhost:9000/animal-adopt/default.jpg'),
}));
var __VLS_187 = __VLS_186.apply(void 0, __spreadArray([{
        size: (60),
        src: (__VLS_ctx.processImageUrl(__VLS_ctx.editForm.avatar) || 'http://localhost:9000/animal-adopt/default.jpg'),
    }], __VLS_functionalComponentArgsRest(__VLS_186), false));
var __VLS_189 = __VLS_188.slots.default;
// @ts-ignore
[processImageUrl, editForm,];
((_b = __VLS_ctx.editForm.username) === null || _b === void 0 ? void 0 : _b.charAt(0));
// @ts-ignore
[editForm,];
var __VLS_188;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-text" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "name-line" }));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "username" }));
(__VLS_ctx.editForm.username || '-');
// @ts-ignore
[editForm,];
var __VLS_190 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
ElTag;
// @ts-ignore
var __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
    type: (__VLS_ctx.editForm.status === 1 ? 'success' : 'danger'),
    effect: "plain",
    size: "small",
}));
var __VLS_192 = __VLS_191.apply(void 0, __spreadArray([{
        type: (__VLS_ctx.editForm.status === 1 ? 'success' : 'danger'),
        effect: "plain",
        size: "small",
    }], __VLS_functionalComponentArgsRest(__VLS_191), false));
var __VLS_194 = __VLS_193.slots.default;
// @ts-ignore
[editForm,];
(__VLS_ctx.editForm.status === 1 ? '启用' : '禁用');
// @ts-ignore
[editForm,];
var __VLS_193;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "sub-text" }));
(__VLS_ctx.editForm.nickname || '暂无昵称');
// @ts-ignore
[editForm,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-grid" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "label" }));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "value muted" }));
(__VLS_ctx.editForm.phone || '-');
// @ts-ignore
[editForm,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "label" }));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "value muted" }));
(__VLS_ctx.editForm.email || '-');
// @ts-ignore
[editForm,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "label" }));
var __VLS_195 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
ElTag;
// @ts-ignore
var __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195(__assign({ class: "user-role-chip" }, { type: (__VLS_ctx.getRoleType(__VLS_ctx.editForm.role || '')), size: "small" })));
var __VLS_197 = __VLS_196.apply(void 0, __spreadArray([__assign({ class: "user-role-chip" }, { type: (__VLS_ctx.getRoleType(__VLS_ctx.editForm.role || '')), size: "small" })], __VLS_functionalComponentArgsRest(__VLS_196), false));
var __VLS_199 = __VLS_198.slots.default;
// @ts-ignore
[getRoleType, editForm,];
(__VLS_ctx.getRoleText(__VLS_ctx.editForm.role || '') || '未分配');
// @ts-ignore
[getRoleText, editForm,];
var __VLS_198;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "hint muted" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "action-card" }));
var __VLS_200 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200(__assign({ ref: "editFormRef", model: (__VLS_ctx.editForm), rules: (__VLS_ctx.editRules), labelWidth: "90px" }, { class: "edit-form" })));
var __VLS_202 = __VLS_201.apply(void 0, __spreadArray([__assign({ ref: "editFormRef", model: (__VLS_ctx.editForm), rules: (__VLS_ctx.editRules), labelWidth: "90px" }, { class: "edit-form" })], __VLS_functionalComponentArgsRest(__VLS_201), false));
/** @type {typeof __VLS_ctx.editFormRef} */ ;
var __VLS_204 = {};
var __VLS_206 = __VLS_203.slots.default;
// @ts-ignore
[editForm, editRules, editFormRef,];
var __VLS_207 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207(__assign({ label: "角色", prop: "role" }, { class: "role-narrow" })));
var __VLS_209 = __VLS_208.apply(void 0, __spreadArray([__assign({ label: "角色", prop: "role" }, { class: "role-narrow" })], __VLS_functionalComponentArgsRest(__VLS_208), false));
var __VLS_211 = __VLS_210.slots.default;
var __VLS_212 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.editForm.role),
    placeholder: "选择角色",
}));
var __VLS_214 = __VLS_213.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.editForm.role),
        placeholder: "选择角色",
    }], __VLS_functionalComponentArgsRest(__VLS_213), false));
var __VLS_216 = __VLS_215.slots.default;
// @ts-ignore
[editForm,];
for (var _f = 0, _g = __VLS_getVForSourceType((__VLS_ctx.roleOptions)); _f < _g.length; _f++) {
    var item = _g[_f][0];
    // @ts-ignore
    [roleOptions,];
    var __VLS_217 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    var __VLS_219 = __VLS_218.apply(void 0, __spreadArray([{
            key: (item.value),
            label: (item.label),
            value: (item.value),
        }], __VLS_functionalComponentArgsRest(__VLS_218), false));
}
var __VLS_215;
var __VLS_210;
var __VLS_222 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({
    label: "启用状态",
    prop: "status",
}));
var __VLS_224 = __VLS_223.apply(void 0, __spreadArray([{
        label: "启用状态",
        prop: "status",
    }], __VLS_functionalComponentArgsRest(__VLS_223), false));
var __VLS_226 = __VLS_225.slots.default;
var __VLS_227 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
ElSwitch;
// @ts-ignore
var __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227({
    modelValue: (__VLS_ctx.editForm.status),
    activeValue: (1),
    inactiveValue: (0),
}));
var __VLS_229 = __VLS_228.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.editForm.status),
        activeValue: (1),
        inactiveValue: (0),
    }], __VLS_functionalComponentArgsRest(__VLS_228), false));
// @ts-ignore
[editForm,];
var __VLS_225;
var __VLS_203;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "action-footer" }));
var __VLS_232 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232(__assign({ 'onClick': {} })));
var __VLS_234 = __VLS_233.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_233), false));
var __VLS_236;
var __VLS_237;
var __VLS_238 = ({ click: {} },
    { onClick: (__VLS_ctx.handleCancel) });
var __VLS_239 = __VLS_235.slots.default;
// @ts-ignore
[handleCancel,];
var __VLS_235;
var __VLS_240 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.saving) })));
var __VLS_242 = __VLS_241.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.saving) })], __VLS_functionalComponentArgsRest(__VLS_241), false));
var __VLS_244;
var __VLS_245;
var __VLS_246 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSubmit) });
var __VLS_247 = __VLS_243.slots.default;
// @ts-ignore
[saving, handleSubmit,];
var __VLS_243;
var __VLS_183;
var __VLS_178;
/** @type {__VLS_StyleScopedClasses['admin-user-list']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['active-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-header']} */ ;
/** @type {__VLS_StyleScopedClasses['user-text']} */ ;
/** @type {__VLS_StyleScopedClasses['name-line']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['user-role-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['action-card']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-form']} */ ;
/** @type {__VLS_StyleScopedClasses['role-narrow']} */ ;
/** @type {__VLS_StyleScopedClasses['action-footer']} */ ;
// @ts-ignore
var __VLS_205 = __VLS_204;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
