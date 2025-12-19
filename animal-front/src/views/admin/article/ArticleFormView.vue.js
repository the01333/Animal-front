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
var md_editor_v3_1 = require("md-editor-v3");
require("md-editor-v3/lib/style.css");
var icons_vue_1 = require("@element-plus/icons-vue");
var route = (0, vue_router_1.useRoute)();
var router = (0, vue_router_1.useRouter)();
var formRef = (0, vue_1.ref)();
var isEdit = (0, vue_1.computed)(function () { return !!route.params.id; });
var categoryOptions = (0, vue_1.ref)([]);
var guideCategoryOptions = (0, vue_1.ref)([]);
var storyCategoryOptions = (0, vue_1.ref)([]);
var editorToolbars = ['bold', 'underline', 'italic', 'strikeThrough', 'title', 'quote', 'unorderedList', 'orderedList', 'task', 'codeBlock', 'link', 'image', 'table', 'mermaid', 'pageFullscreen', 'preview', 'previewOnly', 'fullscreen', 'catalog'];
var form = (0, vue_1.reactive)({
    id: undefined,
    title: '',
    category: 'GUIDE',
    summary: '',
    content: '',
    author: '',
    guideCategory: '',
    coverImage: '',
    tags: []
});
var tagsInput = (0, vue_1.ref)('');
var coverImagePreview = (0, vue_1.ref)('');
var coverUploading = (0, vue_1.ref)(false);
var coverImageFile = (0, vue_1.ref)(null);
var rules = {
    title: [
        {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
        }
    ],
    category: [
        {
            required: true,
            message: '请选择分类',
            trigger: 'change'
        }
    ],
    content: [
        {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
        }
    ],
    guideCategory: [
        {
            required: function () { return form.category === 'GUIDE'; },
            message: '请输入指南分类',
            trigger: 'blur'
        }
    ],
    author: [
        {
            required: function () { return form.category === 'STORY'; },
            message: '请输入作者',
            trigger: 'blur'
        }
    ]
};
function fetchDetail() {
    return __awaiter(this, void 0, void 0, function () {
        var id, preferredCategory, candidates, detailFetched, _i, candidates_1, cat, res, err_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = Number(route.params.id);
                    if (!id)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    preferredCategory = route.query.category || form.category || 'GUIDE';
                    candidates = preferredCategory ? [preferredCategory, preferredCategory === 'GUIDE' ? 'STORY' : 'GUIDE'] : ['GUIDE', 'STORY'];
                    detailFetched = false;
                    _i = 0, candidates_1 = candidates;
                    _a.label = 2;
                case 2:
                    if (!(_i < candidates_1.length)) return [3 /*break*/, 7];
                    cat = candidates_1[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, article_1.getArticleDetail)(cat, id)];
                case 4:
                    res = _a.sent();
                    Object.assign(form, res.data);
                    form.category = cat;
                    tagsInput.value = (res.data.tags || []).join(',');
                    coverImagePreview.value = res.data.coverImage || '';
                    detailFetched = true;
                    return [3 /*break*/, 7];
                case 5:
                    err_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    if (!detailFetched) {
                        throw new Error('not found');
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    element_plus_1.ElMessage.error('获取文章详情失败');
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
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
                            var error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!valid)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 7, , 8]);
                                        return [4 /*yield*/, uploadCoverIfNeeded()];
                                    case 2:
                                        _a.sent();
                                        form.tags = tagsInput.value
                                            .split(',')
                                            .map(function (tag) { return tag.trim(); })
                                            .filter(Boolean);
                                        if (!isEdit.value) return [3 /*break*/, 4];
                                        return [4 /*yield*/, (0, article_1.updateArticle)(form.category, Number(route.params.id), form)];
                                    case 3:
                                        _a.sent();
                                        element_plus_1.ElMessage.success('更新成功');
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, (0, article_1.createArticle)(form)];
                                    case 5:
                                        _a.sent();
                                        element_plus_1.ElMessage.success('发布成功');
                                        _a.label = 6;
                                    case 6:
                                        router.push('/admin/article/list');
                                        return [3 /*break*/, 8];
                                    case 7:
                                        error_2 = _a.sent();
                                        element_plus_1.ElMessage.error(isEdit.value ? '更新失败' : '发布失败');
                                        return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
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
function handleCancel() {
    router.back();
}
var handleCoverChange = function (uploadFile, uploadFiles) {
    if (!uploadFile.raw)
        return;
    var reader = new FileReader();
    reader.onload = function () {
        coverImagePreview.value = reader.result;
    };
    reader.readAsDataURL(uploadFile.raw);
    coverImageFile.value = uploadFile.raw;
    if (uploadFiles) {
        uploadFiles.splice(0, uploadFiles.length);
    }
};
var handleRemoveCover = function () {
    coverImagePreview.value = '';
    form.coverImage = '';
    coverImageFile.value = null;
};
var uploadCoverIfNeeded = function () { return __awaiter(void 0, void 0, void 0, function () {
    var fd, res, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!coverImageFile.value)
                    return [2 /*return*/];
                coverUploading.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                fd = new FormData();
                fd.append('file', coverImageFile.value);
                return [4 /*yield*/, (0, article_1.uploadArticleCover)(fd)];
            case 2:
                res = _a.sent();
                form.coverImage = res.data;
                coverImageFile.value = null;
                return [3 /*break*/, 5];
            case 3:
                error_3 = _a.sent();
                element_plus_1.ElMessage.error('封面上传失败，请重试');
                throw error_3;
            case 4:
                coverUploading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.onMounted)(function () {
    loadCategories();
    if (isEdit.value) {
        fetchDetail();
    }
});
function loadCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_4, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, article_1.getArticleCategories)()];
                case 1:
                    res = _c.sent();
                    categoryOptions.value = res.data || [];
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _c.sent();
                    categoryOptions.value = [
                        { value: 'GUIDE', label: '领养指南' },
                        { value: 'STORY', label: '领养故事' }
                    ];
                    console.warn('获取文章分类失败，使用默认分类', error_4);
                    return [3 /*break*/, 3];
                case 3:
                    // 加载指南分类
                    _a = guideCategoryOptions;
                    return [4 /*yield*/, (0, article_1.getGuideCategoriesList)()
                        // 加载故事分类
                    ];
                case 4:
                    // 加载指南分类
                    _a.value = _c.sent();
                    // 加载故事分类
                    _b = storyCategoryOptions;
                    return [4 /*yield*/, (0, article_1.getStoryCategoriesList)()];
                case 5:
                    // 加载故事分类
                    _b.value = _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var handleGuideCategoryChange = function () {
    // 分类变化时的处理（如果需要）
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-article-form" }));
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
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.isEdit ? '编辑文章' : '发布文章');
    // @ts-ignore
    [isEdit,];
}
var __VLS_6 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{
        ref: "formRef",
        model: (__VLS_ctx.form),
        rules: (__VLS_ctx.rules),
        labelWidth: "100px",
    }], __VLS_functionalComponentArgsRest(__VLS_7), false));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_10 = {};
var __VLS_12 = __VLS_9.slots.default;
// @ts-ignore
[form, rules, formRef,];
var __VLS_13 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "标题",
    prop: "title",
}));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
        label: "标题",
        prop: "title",
    }], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_17 = __VLS_16.slots.default;
var __VLS_18 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.form.title),
    placeholder: "请输入文章标题",
}));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.title),
        placeholder: "请输入文章标题",
    }], __VLS_functionalComponentArgsRest(__VLS_19), false));
// @ts-ignore
[form,];
var __VLS_16;
var __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "分类",
    prop: "category",
}));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{
        label: "分类",
        prop: "category",
    }], __VLS_functionalComponentArgsRest(__VLS_24), false));
var __VLS_27 = __VLS_26.slots.default;
var __VLS_28 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.form.category),
    placeholder: "请选择分类",
}));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.category),
        placeholder: "请选择分类",
    }], __VLS_functionalComponentArgsRest(__VLS_29), false));
var __VLS_32 = __VLS_31.slots.default;
// @ts-ignore
[form,];
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.categoryOptions)); _i < _a.length; _i++) {
    var option = _a[_i][0];
    // @ts-ignore
    [categoryOptions,];
    var __VLS_33 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        key: (option.value),
        label: (option.label),
        value: (option.value),
    }));
    var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
            key: (option.value),
            label: (option.label),
            value: (option.value),
        }], __VLS_functionalComponentArgsRest(__VLS_34), false));
}
var __VLS_31;
var __VLS_26;
var __VLS_38 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    label: "摘要",
    prop: "summary",
}));
var __VLS_40 = __VLS_39.apply(void 0, __spreadArray([{
        label: "摘要",
        prop: "summary",
    }], __VLS_functionalComponentArgsRest(__VLS_39), false));
var __VLS_42 = __VLS_41.slots.default;
var __VLS_43 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.form.summary),
    type: "textarea",
    rows: (3),
    placeholder: "请输入文章摘要",
}));
var __VLS_45 = __VLS_44.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.summary),
        type: "textarea",
        rows: (3),
        placeholder: "请输入文章摘要",
    }], __VLS_functionalComponentArgsRest(__VLS_44), false));
// @ts-ignore
[form,];
var __VLS_41;
var __VLS_48 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "封面图片",
    prop: "coverImage",
}));
var __VLS_50 = __VLS_49.apply(void 0, __spreadArray([{
        label: "封面图片",
        prop: "coverImage",
    }], __VLS_functionalComponentArgsRest(__VLS_49), false));
var __VLS_52 = __VLS_51.slots.default;
var __VLS_53 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
ElUpload;
// @ts-ignore
var __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53(__assign(__assign({ 'onChange': {} }, { class: "cover-uploader" }), { showFileList: (false), autoUpload: (false), accept: "image/*", disabled: (__VLS_ctx.coverUploading) })));
var __VLS_55 = __VLS_54.apply(void 0, __spreadArray([__assign(__assign({ 'onChange': {} }, { class: "cover-uploader" }), { showFileList: (false), autoUpload: (false), accept: "image/*", disabled: (__VLS_ctx.coverUploading) })], __VLS_functionalComponentArgsRest(__VLS_54), false));
var __VLS_57;
var __VLS_58;
var __VLS_59 = ({ change: {} },
    { onChange: (__VLS_ctx.handleCoverChange) });
var __VLS_60 = __VLS_56.slots.default;
// @ts-ignore
[coverUploading, handleCoverChange,];
if (__VLS_ctx.coverImagePreview || __VLS_ctx.form.coverImage) {
    // @ts-ignore
    [form, coverImagePreview,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "cover-preview" }));
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.coverImagePreview || __VLS_ctx.form.coverImage),
        alt: "封面预览",
    });
    // @ts-ignore
    [form, coverImagePreview,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "cover-actions" }));
    var __VLS_61 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61(__assign({ 'onClick': {} }, { type: "danger", size: "small", text: true })));
    var __VLS_63 = __VLS_62.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", size: "small", text: true })], __VLS_functionalComponentArgsRest(__VLS_62), false));
    var __VLS_65 = void 0;
    var __VLS_66 = void 0;
    var __VLS_67 = ({ click: {} },
        { onClick: (__VLS_ctx.handleRemoveCover) });
    var __VLS_68 = __VLS_64.slots.default;
    // @ts-ignore
    [handleRemoveCover,];
    var __VLS_64;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "cover-placeholder" }));
    var __VLS_69 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
    var __VLS_71 = __VLS_70.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_70), false));
    var __VLS_73 = __VLS_72.slots.default;
    var __VLS_74 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    icons_vue_1.Plus;
    // @ts-ignore
    var __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({}));
    var __VLS_76 = __VLS_75.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_75), false));
    var __VLS_72;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.coverUploading ? '上传中...' : '点击上传封面');
    // @ts-ignore
    [coverUploading,];
}
var __VLS_56;
var __VLS_51;
if (__VLS_ctx.form.category === 'GUIDE') {
    // @ts-ignore
    [form,];
    var __VLS_79 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
        label: "指南分类",
        prop: "guideCategory",
    }));
    var __VLS_81 = __VLS_80.apply(void 0, __spreadArray([{
            label: "指南分类",
            prop: "guideCategory",
        }], __VLS_functionalComponentArgsRest(__VLS_80), false));
    var __VLS_83 = __VLS_82.slots.default;
    var __VLS_84 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    ElSelect;
    // @ts-ignore
    var __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84(__assign({ 'onChange': {} }, { modelValue: (__VLS_ctx.form.guideCategory), placeholder: "请选择或输入指南分类", filterable: true, allowCreate: true, defaultFirstOption: true })));
    var __VLS_86 = __VLS_85.apply(void 0, __spreadArray([__assign({ 'onChange': {} }, { modelValue: (__VLS_ctx.form.guideCategory), placeholder: "请选择或输入指南分类", filterable: true, allowCreate: true, defaultFirstOption: true })], __VLS_functionalComponentArgsRest(__VLS_85), false));
    var __VLS_88 = void 0;
    var __VLS_89 = void 0;
    var __VLS_90 = ({ change: {} },
        { onChange: (__VLS_ctx.handleGuideCategoryChange) });
    var __VLS_91 = __VLS_87.slots.default;
    // @ts-ignore
    [form, handleGuideCategoryChange,];
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.guideCategoryOptions)); _b < _c.length; _b++) {
        var category = _c[_b][0];
        // @ts-ignore
        [guideCategoryOptions,];
        var __VLS_92 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        ElOption;
        // @ts-ignore
        var __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            key: (category),
            label: (category),
            value: (category),
        }));
        var __VLS_94 = __VLS_93.apply(void 0, __spreadArray([{
                key: (category),
                label: (category),
                value: (category),
            }], __VLS_functionalComponentArgsRest(__VLS_93), false));
    }
    var __VLS_87;
    var __VLS_82;
}
var __VLS_97 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    label: "内容",
    prop: "content",
}));
var __VLS_99 = __VLS_98.apply(void 0, __spreadArray([{
        label: "内容",
        prop: "content",
    }], __VLS_functionalComponentArgsRest(__VLS_98), false));
var __VLS_101 = __VLS_100.slots.default;
var __VLS_102 = {}.MdEditor;
/** @type {[typeof __VLS_components.MdEditor, ]} */ ;
// @ts-ignore
md_editor_v3_1.MdEditor;
// @ts-ignore
var __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    modelValue: (__VLS_ctx.form.content),
    toolbars: (__VLS_ctx.editorToolbars),
    height: "400px",
    placeholder: "请输入文章内容，支持 Markdown 语法",
}));
var __VLS_104 = __VLS_103.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.content),
        toolbars: (__VLS_ctx.editorToolbars),
        height: "400px",
        placeholder: "请输入文章内容，支持 Markdown 语法",
    }], __VLS_functionalComponentArgsRest(__VLS_103), false));
// @ts-ignore
[form, editorToolbars,];
var __VLS_100;
if (__VLS_ctx.form.category === 'STORY') {
    // @ts-ignore
    [form,];
    var __VLS_107 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
        label: "作者",
        prop: "author",
    }));
    var __VLS_109 = __VLS_108.apply(void 0, __spreadArray([{
            label: "作者",
            prop: "author",
        }], __VLS_functionalComponentArgsRest(__VLS_108), false));
    var __VLS_111 = __VLS_110.slots.default;
    var __VLS_112 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        modelValue: (__VLS_ctx.form.author),
        placeholder: "请输入作者",
    }));
    var __VLS_114 = __VLS_113.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.form.author),
            placeholder: "请输入作者",
        }], __VLS_functionalComponentArgsRest(__VLS_113), false));
    // @ts-ignore
    [form,];
    var __VLS_110;
}
if (__VLS_ctx.form.category === 'STORY') {
    // @ts-ignore
    [form,];
    var __VLS_117 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
        label: "标签",
        prop: "tags",
    }));
    var __VLS_119 = __VLS_118.apply(void 0, __spreadArray([{
            label: "标签",
            prop: "tags",
        }], __VLS_functionalComponentArgsRest(__VLS_118), false));
    var __VLS_121 = __VLS_120.slots.default;
    var __VLS_122 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        modelValue: (__VLS_ctx.tagsInput),
        placeholder: "请输入标签，逗号分隔",
    }));
    var __VLS_124 = __VLS_123.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.tagsInput),
            placeholder: "请输入标签，逗号分隔",
        }], __VLS_functionalComponentArgsRest(__VLS_123), false));
    // @ts-ignore
    [tagsInput,];
    var __VLS_120;
}
var __VLS_127 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({}));
var __VLS_129 = __VLS_128.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_128), false));
var __VLS_131 = __VLS_130.slots.default;
var __VLS_132 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132(__assign({ 'onClick': {} }, { type: "primary" })));
var __VLS_134 = __VLS_133.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_133), false));
var __VLS_136;
var __VLS_137;
var __VLS_138 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSubmit) });
var __VLS_139 = __VLS_135.slots.default;
// @ts-ignore
[handleSubmit,];
var __VLS_135;
var __VLS_140 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140(__assign({ 'onClick': {} })));
var __VLS_142 = __VLS_141.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_141), false));
var __VLS_144;
var __VLS_145;
var __VLS_146 = ({ click: {} },
    { onClick: (__VLS_ctx.handleCancel) });
var __VLS_147 = __VLS_143.slots.default;
// @ts-ignore
[handleCancel,];
var __VLS_143;
var __VLS_130;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['admin-article-form']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-placeholder']} */ ;
// @ts-ignore
var __VLS_11 = __VLS_10;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
