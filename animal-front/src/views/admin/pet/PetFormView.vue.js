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
var icons_vue_1 = require("@element-plus/icons-vue");
var route = (0, vue_router_1.useRoute)();
var router = (0, vue_router_1.useRouter)();
var formRef = (0, vue_1.ref)();
var coverUploadRef = (0, vue_1.ref)();
var imagesUploadRef = (0, vue_1.ref)();
var isEdit = (0, vue_1.computed)(function () { return !!route.params.id; });
var imageList = (0, vue_1.ref)([]);
var coverImagePreview = (0, vue_1.ref)('');
var coverImageFile = (0, vue_1.ref)(null);
var imageFiles = (0, vue_1.ref)([]);
// 下拉框数据
var categoryOptions = (0, vue_1.ref)([]);
var adoptionStatusOptions = (0, vue_1.ref)([]);
var healthStatusOptions = (0, vue_1.ref)([]);
var ADD_CATEGORY_FLAG = '__ADD_CATEGORY__';
var showAddCategoryDialog = (0, vue_1.ref)(false);
var newCategoryName = (0, vue_1.ref)('');
var newCategoryError = (0, vue_1.ref)('');
var lastValidCategory = (0, vue_1.ref)('');
var form = (0, vue_1.reactive)({
    name: '',
    category: '',
    breed: '',
    gender: 1,
    age: 0,
    weight: 0,
    color: '',
    personality: '',
    healthStatus: 'healthy',
    adoptionStatus: 'available',
    description: '',
    coverImage: '',
    images: '',
    adoptionStatusText: ''
});
var uploadHeaders = (0, vue_1.computed)(function () {
    var token = localStorage.getItem('token');
    return token ? { Authorization: "Bearer ".concat(token) } : {};
});
var rules = {
    name: [{ required: true, message: '请输入宠物名称', trigger: 'blur' }],
    category: [{ required: true, message: '请选择宠物类型', trigger: 'change' }],
    breed: [{ required: true, message: '请输入品种', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
};
// 加载字典数据
function loadDictData() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, categoriesRes, adoptionStatusRes, healthStatusRes, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all([
                            (0, dict_1.getPetCategories)(),
                            (0, dict_1.getAdoptionStatuses)(),
                            (0, dict_1.getHealthStatuses)()
                        ])];
                case 1:
                    _a = _b.sent(), categoriesRes = _a[0], adoptionStatusRes = _a[1], healthStatusRes = _a[2];
                    if (categoriesRes.code === 200) {
                        categoryOptions.value = Object.entries(categoriesRes.data).map(function (_a) {
                            var value = _a[0], label = _a[1];
                            return ({
                                value: value,
                                label: label
                            });
                        });
                        lastValidCategory.value = form.category || '';
                    }
                    if (adoptionStatusRes.code === 200) {
                        adoptionStatusOptions.value = Object.entries(adoptionStatusRes.data).map(function (_a) {
                            var value = _a[0], label = _a[1];
                            return ({
                                value: value,
                                label: label
                            });
                        });
                    }
                    if (healthStatusRes.code === 200) {
                        healthStatusOptions.value = Object.entries(healthStatusRes.data).map(function (_a) {
                            var value = _a[0], label = _a[1];
                            return ({
                                value: value,
                                label: label
                            });
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('加载字典数据失败:', error_1);
                    element_plus_1.ElMessage.error('加载字典数据失败');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fetchDetail() {
    return __awaiter(this, void 0, void 0, function () {
        var id, res, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = Number(route.params.id);
                    if (!id)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, pet_1.getPetDetail)(id)];
                case 2:
                    res = _a.sent();
                    Object.assign(form, res.data);
                    lastValidCategory.value = form.category || '';
                    // 解析图片列表
                    if (form.images) {
                        try {
                            imageList.value = JSON.parse(form.images);
                        }
                        catch (_b) {
                            imageList.value = [];
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    element_plus_1.ElMessage.error('获取宠物详情失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function handleCoverSelect(file) {
    if (!file.raw)
        return;
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        coverImagePreview.value = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        coverImageFile.value = file.raw;
    };
    reader.readAsDataURL(file.raw);
}
function handleImagesSelect(file) {
    if (!file.raw)
        return;
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        imageList.value.push((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
        imageFiles.value.push(file.raw);
    };
    reader.readAsDataURL(file.raw);
}
function handleRemoveCover() {
    coverImagePreview.value = '';
    coverImageFile.value = null;
    if (coverUploadRef.value) {
        coverUploadRef.value.clearFiles();
    }
    element_plus_1.ElMessage.success('已删除封面图片');
}
function handleRemoveImage(index) {
    imageList.value.splice(index, 1);
    imageFiles.value.splice(index, 1);
    element_plus_1.ElMessage.success('已删除图片');
}
function openAddCategoryDialog() {
    newCategoryName.value = '';
    newCategoryError.value = '';
    showAddCategoryDialog.value = true;
}
function handleCategoryChange(value) {
    if (value === ADD_CATEGORY_FLAG) {
        form.category = lastValidCategory.value;
        openAddCategoryDialog();
        return;
    }
    lastValidCategory.value = value;
}
function handleAddCategoryDialogClosed() {
    showAddCategoryDialog.value = false;
    newCategoryName.value = '';
    newCategoryError.value = '';
}
function confirmAddCategory() {
    return __awaiter(this, void 0, void 0, function () {
        var name, exists, newOption, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = newCategoryName.value.trim();
                    if (!name) {
                        newCategoryError.value = '请输入类别名称';
                        return [2 /*return*/];
                    }
                    exists = categoryOptions.value.some(function (opt) { return opt.label === name; });
                    if (exists) {
                        newCategoryError.value = '该类别已存在';
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    // 仅传中文名称，由后端通过 AI 翻译生成英文编码并写入字典
                    return [4 /*yield*/, (0, dict_1.createPetCategoryAuto)(name)];
                case 2:
                    // 仅传中文名称，由后端通过 AI 翻译生成英文编码并写入字典
                    _a.sent();
                    element_plus_1.ElMessage.success('已新增宠物类别');
                    showAddCategoryDialog.value = false;
                    // 重新加载字典，确保与后端数据保持一致
                    return [4 /*yield*/, loadDictData()];
                case 3:
                    // 重新加载字典，确保与后端数据保持一致
                    _a.sent();
                    newOption = categoryOptions.value.find(function (opt) { return opt.label === name; });
                    if (newOption) {
                        form.category = newOption.value;
                        lastValidCategory.value = newOption.value;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('新增宠物类别失败:', error_3);
                    element_plus_1.ElMessage.error('新增宠物类别失败，请稍后重试');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function cancelAddCategory() {
    handleAddCategoryDialogClosed();
}
function uploadImages(petId) {
    return __awaiter(this, void 0, void 0, function () {
        var uploadPromises, formData, coverPromise, imagePromises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uploadPromises = [];
                    // 上传封面图片
                    if (coverImageFile.value) {
                        formData = new FormData();
                        formData.append('file', coverImageFile.value);
                        coverPromise = fetch("/api/pet/".concat(petId, "/upload-cover"), {
                            method: 'POST',
                            headers: __assign({}, uploadHeaders.value),
                            body: formData
                        })
                            .then(function (res) { return res.json(); })
                            .then(function (data) {
                            if (data.code === 200) {
                                form.coverImage = data.data;
                                // ElMessage.success('封面图片上传成功')
                            }
                            else {
                                throw new Error(data.message || '封面图片上传失败');
                            }
                        });
                        uploadPromises.push(coverPromise);
                    }
                    // 上传宠物图片
                    if (imageFiles.value.length > 0) {
                        imagePromises = imageFiles.value.map(function (file, index) {
                            var formData = new FormData();
                            formData.append('file', file);
                            return fetch("/api/pet/".concat(petId, "/upload-image"), {
                                method: 'POST',
                                headers: __assign({}, uploadHeaders.value),
                                body: formData
                            })
                                .then(function (res) { return res.json(); })
                                .then(function (data) {
                                if (data.code === 200) {
                                    imageList.value[index] = data.data;
                                }
                                else {
                                    throw new Error(data.message || "\u7B2C".concat(index + 1, "\u5F20\u56FE\u7247\u4E0A\u4F20\u5931\u8D25"));
                                }
                            });
                        });
                        uploadPromises.push.apply(uploadPromises, imagePromises);
                    }
                    if (!(uploadPromises.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all(uploadPromises)];
                case 1:
                    _a.sent();
                    form.images = JSON.stringify(imageList.value);
                    _a.label = 2;
                case 2: return [2 /*return*/];
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
                            var petId, res, error_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!valid)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 9, , 10]);
                                        petId = void 0;
                                        if (!isEdit.value) return [3 /*break*/, 3];
                                        petId = Number(route.params.id);
                                        return [4 /*yield*/, (0, pet_1.updatePet)(petId, form)];
                                    case 2:
                                        _a.sent();
                                        element_plus_1.ElMessage.success('宠物信息更新成功');
                                        return [3 /*break*/, 5];
                                    case 3: return [4 /*yield*/, (0, pet_1.createPet)(form)];
                                    case 4:
                                        res = _a.sent();
                                        if (!res.data || !res.data.id) {
                                            throw new Error('创建宠物失败：无法获取宠物ID');
                                        }
                                        petId = res.data.id;
                                        element_plus_1.ElMessage.success('宠物添加成功');
                                        _a.label = 5;
                                    case 5:
                                        if (!(coverImageFile.value || imageFiles.value.length > 0)) return [3 /*break*/, 8];
                                        // ElMessage.info('正在上传图片...')
                                        return [4 /*yield*/, uploadImages(petId)
                                            // 上传完成后，使用完整表单数据保存（包含最新图片URL）
                                        ];
                                    case 6:
                                        // ElMessage.info('正在上传图片...')
                                        _a.sent();
                                        // 上传完成后，使用完整表单数据保存（包含最新图片URL）
                                        return [4 /*yield*/, (0, pet_1.updatePet)(petId, form)
                                            // ElMessage.success('图片已保存')
                                        ];
                                    case 7:
                                        // 上传完成后，使用完整表单数据保存（包含最新图片URL）
                                        _a.sent();
                                        // ElMessage.success('图片已保存')
                                        console.log('图片已保存');
                                        _a.label = 8;
                                    case 8:
                                        router.push('/admin/pet/list');
                                        return [3 /*break*/, 10];
                                    case 9:
                                        error_4 = _a.sent();
                                        element_plus_1.ElMessage.error(error_4.message || (isEdit.value ? '更新失败' : '添加失败'));
                                        return [3 /*break*/, 10];
                                    case 10: return [2 /*return*/];
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
(0, vue_1.onMounted)(function () {
    loadDictData();
    if (isEdit.value) {
        fetchDetail();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-pet-form-page" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "admin-pet-form" }));
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
    (__VLS_ctx.isEdit ? '编辑宠物' : '添加宠物');
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
var __VLS_13 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    gutter: (20),
}));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
        gutter: (20),
    }], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_17 = __VLS_16.slots.default;
var __VLS_18 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    span: (12),
}));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_19), false));
var __VLS_22 = __VLS_21.slots.default;
var __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "宠物名称",
    prop: "name",
}));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{
        label: "宠物名称",
        prop: "name",
    }], __VLS_functionalComponentArgsRest(__VLS_24), false));
var __VLS_27 = __VLS_26.slots.default;
var __VLS_28 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入宠物名称",
}));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.name),
        placeholder: "请输入宠物名称",
    }], __VLS_functionalComponentArgsRest(__VLS_29), false));
// @ts-ignore
[form,];
var __VLS_26;
var __VLS_21;
var __VLS_33 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    span: (12),
}));
var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_34), false));
var __VLS_37 = __VLS_36.slots.default;
var __VLS_38 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    label: "宠物类型",
    prop: "category",
}));
var __VLS_40 = __VLS_39.apply(void 0, __spreadArray([{
        label: "宠物类型",
        prop: "category",
    }], __VLS_functionalComponentArgsRest(__VLS_39), false));
var __VLS_42 = __VLS_41.slots.default;
var __VLS_43 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43(__assign({ 'onChange': {} }, { modelValue: (__VLS_ctx.form.category), placeholder: "请选择宠物类型", filterable: true, defaultFirstOption: true })));
var __VLS_45 = __VLS_44.apply(void 0, __spreadArray([__assign({ 'onChange': {} }, { modelValue: (__VLS_ctx.form.category), placeholder: "请选择宠物类型", filterable: true, defaultFirstOption: true })], __VLS_functionalComponentArgsRest(__VLS_44), false));
var __VLS_47;
var __VLS_48;
var __VLS_49 = ({ change: {} },
    { onChange: (__VLS_ctx.handleCategoryChange) });
var __VLS_50 = __VLS_46.slots.default;
// @ts-ignore
[form, handleCategoryChange,];
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.categoryOptions)); _i < _a.length; _i++) {
    var opt = _a[_i][0];
    // @ts-ignore
    [categoryOptions,];
    var __VLS_51 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
        key: (opt.value),
        label: (opt.label),
        value: (opt.value),
    }));
    var __VLS_53 = __VLS_52.apply(void 0, __spreadArray([{
            key: (opt.value),
            label: (opt.label),
            value: (opt.value),
        }], __VLS_functionalComponentArgsRest(__VLS_52), false));
}
var __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
ElOption;
// @ts-ignore
var __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56(__assign({ value: (__VLS_ctx.ADD_CATEGORY_FLAG) }, { class: "add-category-option" })));
var __VLS_58 = __VLS_57.apply(void 0, __spreadArray([__assign({ value: (__VLS_ctx.ADD_CATEGORY_FLAG) }, { class: "add-category-option" })], __VLS_functionalComponentArgsRest(__VLS_57), false));
var __VLS_60 = __VLS_59.slots.default;
// @ts-ignore
[ADD_CATEGORY_FLAG,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "add-category-entry" }));
var __VLS_61 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({}));
var __VLS_63 = __VLS_62.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_62), false));
var __VLS_65 = __VLS_64.slots.default;
var __VLS_66 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
icons_vue_1.Plus;
// @ts-ignore
var __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({}));
var __VLS_68 = __VLS_67.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_67), false));
var __VLS_64;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
var __VLS_59;
var __VLS_46;
var __VLS_41;
var __VLS_36;
var __VLS_16;
var __VLS_71 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    gutter: (20),
}));
var __VLS_73 = __VLS_72.apply(void 0, __spreadArray([{
        gutter: (20),
    }], __VLS_functionalComponentArgsRest(__VLS_72), false));
var __VLS_75 = __VLS_74.slots.default;
var __VLS_76 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    span: (12),
}));
var __VLS_78 = __VLS_77.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_77), false));
var __VLS_80 = __VLS_79.slots.default;
var __VLS_81 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    label: "品种",
    prop: "breed",
}));
var __VLS_83 = __VLS_82.apply(void 0, __spreadArray([{
        label: "品种",
        prop: "breed",
    }], __VLS_functionalComponentArgsRest(__VLS_82), false));
var __VLS_85 = __VLS_84.slots.default;
var __VLS_86 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.form.breed),
    placeholder: "请输入品种",
}));
var __VLS_88 = __VLS_87.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.breed),
        placeholder: "请输入品种",
    }], __VLS_functionalComponentArgsRest(__VLS_87), false));
// @ts-ignore
[form,];
var __VLS_84;
var __VLS_79;
var __VLS_91 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    span: (12),
}));
var __VLS_93 = __VLS_92.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_92), false));
var __VLS_95 = __VLS_94.slots.default;
var __VLS_96 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "性别",
    prop: "gender",
}));
var __VLS_98 = __VLS_97.apply(void 0, __spreadArray([{
        label: "性别",
        prop: "gender",
    }], __VLS_functionalComponentArgsRest(__VLS_97), false));
var __VLS_100 = __VLS_99.slots.default;
var __VLS_101 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
ElRadioGroup;
// @ts-ignore
var __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    modelValue: (__VLS_ctx.form.gender),
}));
var __VLS_103 = __VLS_102.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.gender),
    }], __VLS_functionalComponentArgsRest(__VLS_102), false));
var __VLS_105 = __VLS_104.slots.default;
// @ts-ignore
[form,];
var __VLS_106 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
ElRadio;
// @ts-ignore
var __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    value: (1),
}));
var __VLS_108 = __VLS_107.apply(void 0, __spreadArray([{
        value: (1),
    }], __VLS_functionalComponentArgsRest(__VLS_107), false));
var __VLS_110 = __VLS_109.slots.default;
var __VLS_109;
var __VLS_111 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
ElRadio;
// @ts-ignore
var __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    value: (2),
}));
var __VLS_113 = __VLS_112.apply(void 0, __spreadArray([{
        value: (2),
    }], __VLS_functionalComponentArgsRest(__VLS_112), false));
var __VLS_115 = __VLS_114.slots.default;
var __VLS_114;
var __VLS_104;
var __VLS_99;
var __VLS_94;
var __VLS_74;
var __VLS_116 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    gutter: (20),
}));
var __VLS_118 = __VLS_117.apply(void 0, __spreadArray([{
        gutter: (20),
    }], __VLS_functionalComponentArgsRest(__VLS_117), false));
var __VLS_120 = __VLS_119.slots.default;
var __VLS_121 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    span: (12),
}));
var __VLS_123 = __VLS_122.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_122), false));
var __VLS_125 = __VLS_124.slots.default;
var __VLS_126 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    label: "年龄",
    prop: "age",
}));
var __VLS_128 = __VLS_127.apply(void 0, __spreadArray([{
        label: "年龄",
        prop: "age",
    }], __VLS_functionalComponentArgsRest(__VLS_127), false));
var __VLS_130 = __VLS_129.slots.default;
var __VLS_131 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
ElInputNumber;
// @ts-ignore
var __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    modelValue: (__VLS_ctx.form.age),
    min: (0),
    max: (30),
}));
var __VLS_133 = __VLS_132.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.age),
        min: (0),
        max: (30),
    }], __VLS_functionalComponentArgsRest(__VLS_132), false));
// @ts-ignore
[form,];
var __VLS_129;
var __VLS_124;
var __VLS_136 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    span: (12),
}));
var __VLS_138 = __VLS_137.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_137), false));
var __VLS_140 = __VLS_139.slots.default;
var __VLS_141 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    label: "体重(kg)",
    prop: "weight",
}));
var __VLS_143 = __VLS_142.apply(void 0, __spreadArray([{
        label: "体重(kg)",
        prop: "weight",
    }], __VLS_functionalComponentArgsRest(__VLS_142), false));
var __VLS_145 = __VLS_144.slots.default;
var __VLS_146 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
ElInputNumber;
// @ts-ignore
var __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.form.weight),
    min: (0),
    precision: (2),
}));
var __VLS_148 = __VLS_147.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.weight),
        min: (0),
        precision: (2),
    }], __VLS_functionalComponentArgsRest(__VLS_147), false));
// @ts-ignore
[form,];
var __VLS_144;
var __VLS_139;
var __VLS_119;
var __VLS_151 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    gutter: (20),
}));
var __VLS_153 = __VLS_152.apply(void 0, __spreadArray([{
        gutter: (20),
    }], __VLS_functionalComponentArgsRest(__VLS_152), false));
var __VLS_155 = __VLS_154.slots.default;
var __VLS_156 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    span: (12),
}));
var __VLS_158 = __VLS_157.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_157), false));
var __VLS_160 = __VLS_159.slots.default;
var __VLS_161 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    label: "颜色",
    prop: "color",
}));
var __VLS_163 = __VLS_162.apply(void 0, __spreadArray([{
        label: "颜色",
        prop: "color",
    }], __VLS_functionalComponentArgsRest(__VLS_162), false));
var __VLS_165 = __VLS_164.slots.default;
var __VLS_166 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
    modelValue: (__VLS_ctx.form.color),
    placeholder: "例如：白色、棕色、黑白相间",
}));
var __VLS_168 = __VLS_167.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.color),
        placeholder: "例如：白色、棕色、黑白相间",
    }], __VLS_functionalComponentArgsRest(__VLS_167), false));
// @ts-ignore
[form,];
var __VLS_164;
var __VLS_159;
var __VLS_171 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    span: (12),
}));
var __VLS_173 = __VLS_172.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_172), false));
var __VLS_175 = __VLS_174.slots.default;
var __VLS_176 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "性格描述",
    prop: "personality",
}));
var __VLS_178 = __VLS_177.apply(void 0, __spreadArray([{
        label: "性格描述",
        prop: "personality",
    }], __VLS_functionalComponentArgsRest(__VLS_177), false));
var __VLS_180 = __VLS_179.slots.default;
var __VLS_181 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
    modelValue: (__VLS_ctx.form.personality),
    placeholder: "例如：活泼、温顺、调皮",
}));
var __VLS_183 = __VLS_182.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.personality),
        placeholder: "例如：活泼、温顺、调皮",
    }], __VLS_functionalComponentArgsRest(__VLS_182), false));
// @ts-ignore
[form,];
var __VLS_179;
var __VLS_174;
var __VLS_154;
var __VLS_186 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
    gutter: (20),
}));
var __VLS_188 = __VLS_187.apply(void 0, __spreadArray([{
        gutter: (20),
    }], __VLS_functionalComponentArgsRest(__VLS_187), false));
var __VLS_190 = __VLS_189.slots.default;
var __VLS_191 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
    span: (12),
}));
var __VLS_193 = __VLS_192.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_192), false));
var __VLS_195 = __VLS_194.slots.default;
var __VLS_196 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "健康状态",
    prop: "healthStatus",
}));
var __VLS_198 = __VLS_197.apply(void 0, __spreadArray([{
        label: "健康状态",
        prop: "healthStatus",
    }], __VLS_functionalComponentArgsRest(__VLS_197), false));
var __VLS_200 = __VLS_199.slots.default;
var __VLS_201 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
    modelValue: (__VLS_ctx.form.healthStatus),
    placeholder: "请选择健康状态",
}));
var __VLS_203 = __VLS_202.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.healthStatus),
        placeholder: "请选择健康状态",
    }], __VLS_functionalComponentArgsRest(__VLS_202), false));
var __VLS_205 = __VLS_204.slots.default;
// @ts-ignore
[form,];
for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.healthStatusOptions)); _b < _c.length; _b++) {
    var opt = _c[_b][0];
    // @ts-ignore
    [healthStatusOptions,];
    var __VLS_206 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
        key: (opt.value),
        label: (opt.label),
        value: (opt.value),
    }));
    var __VLS_208 = __VLS_207.apply(void 0, __spreadArray([{
            key: (opt.value),
            label: (opt.label),
            value: (opt.value),
        }], __VLS_functionalComponentArgsRest(__VLS_207), false));
}
var __VLS_204;
var __VLS_199;
var __VLS_194;
var __VLS_211 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
    span: (12),
}));
var __VLS_213 = __VLS_212.apply(void 0, __spreadArray([{
        span: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_212), false));
var __VLS_215 = __VLS_214.slots.default;
var __VLS_216 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "领养状态",
    prop: "adoptionStatusText",
}));
var __VLS_218 = __VLS_217.apply(void 0, __spreadArray([{
        label: "领养状态",
        prop: "adoptionStatusText",
    }], __VLS_functionalComponentArgsRest(__VLS_217), false));
var __VLS_220 = __VLS_219.slots.default;
var __VLS_221 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
ElSelect;
// @ts-ignore
var __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    modelValue: (__VLS_ctx.form.adoptionStatusText),
    placeholder: "请选择领养状态",
}));
var __VLS_223 = __VLS_222.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.adoptionStatusText),
        placeholder: "请选择领养状态",
    }], __VLS_functionalComponentArgsRest(__VLS_222), false));
var __VLS_225 = __VLS_224.slots.default;
// @ts-ignore
[form,];
for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.adoptionStatusOptions)); _d < _e.length; _d++) {
    var opt = _e[_d][0];
    // @ts-ignore
    [adoptionStatusOptions,];
    var __VLS_226 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    ElOption;
    // @ts-ignore
    var __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
        key: (opt.value),
        label: (opt.label),
        value: (opt.value),
    }));
    var __VLS_228 = __VLS_227.apply(void 0, __spreadArray([{
            key: (opt.value),
            label: (opt.label),
            value: (opt.value),
        }], __VLS_functionalComponentArgsRest(__VLS_227), false));
}
var __VLS_224;
var __VLS_219;
var __VLS_214;
var __VLS_189;
var __VLS_231 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
    label: "描述",
    prop: "description",
}));
var __VLS_233 = __VLS_232.apply(void 0, __spreadArray([{
        label: "描述",
        prop: "description",
    }], __VLS_functionalComponentArgsRest(__VLS_232), false));
var __VLS_235 = __VLS_234.slots.default;
var __VLS_236 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入宠物详细描述",
}));
var __VLS_238 = __VLS_237.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.description),
        type: "textarea",
        rows: (4),
        placeholder: "请输入宠物详细描述",
    }], __VLS_functionalComponentArgsRest(__VLS_237), false));
// @ts-ignore
[form,];
var __VLS_234;
var __VLS_241 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
    label: "封面图片",
}));
var __VLS_243 = __VLS_242.apply(void 0, __spreadArray([{
        label: "封面图片",
    }], __VLS_functionalComponentArgsRest(__VLS_242), false));
var __VLS_245 = __VLS_244.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-upload-section" }));
var __VLS_246 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
ElUpload;
// @ts-ignore
var __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246(__assign(__assign(__assign({ 'onChange': {} }, { ref: "coverUploadRef" }), { class: "cover-uploader" }), { autoUpload: (false), accept: "image/*" })));
var __VLS_248 = __VLS_247.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onChange': {} }, { ref: "coverUploadRef" }), { class: "cover-uploader" }), { autoUpload: (false), accept: "image/*" })], __VLS_functionalComponentArgsRest(__VLS_247), false));
var __VLS_250;
var __VLS_251;
var __VLS_252 = ({ change: {} },
    { onChange: (__VLS_ctx.handleCoverSelect) });
/** @type {typeof __VLS_ctx.coverUploadRef} */ ;
var __VLS_253 = {};
var __VLS_255 = __VLS_249.slots.default;
// @ts-ignore
[handleCoverSelect, coverUploadRef,];
{
    var __VLS_256 = __VLS_249.slots.default;
    if (__VLS_ctx.coverImagePreview) {
        // @ts-ignore
        [coverImagePreview,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "cover-preview" }));
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.coverImagePreview),
            alt: "封面图片预览",
        });
        // @ts-ignore
        [coverImagePreview,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "cover-actions" }));
        var __VLS_257 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257(__assign({ 'onClick': {} }, { type: "danger", size: "small" })));
        var __VLS_259 = __VLS_258.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", size: "small" })], __VLS_functionalComponentArgsRest(__VLS_258), false));
        var __VLS_261 = void 0;
        var __VLS_262 = void 0;
        var __VLS_263 = ({ click: {} },
            { onClick: (__VLS_ctx.handleRemoveCover) });
        var __VLS_264 = __VLS_260.slots.default;
        // @ts-ignore
        [handleRemoveCover,];
        var __VLS_260;
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "upload-placeholder" }));
        var __VLS_265 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265(__assign({ class: "icon" })));
        var __VLS_267 = __VLS_266.apply(void 0, __spreadArray([__assign({ class: "icon" })], __VLS_functionalComponentArgsRest(__VLS_266), false));
        var __VLS_269 = __VLS_268.slots.default;
        var __VLS_270 = {}.Plus;
        /** @type {[typeof __VLS_components.Plus, ]} */ ;
        // @ts-ignore
        icons_vue_1.Plus;
        // @ts-ignore
        var __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({}));
        var __VLS_272 = __VLS_271.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_271), false));
        var __VLS_268;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
}
var __VLS_249;
var __VLS_244;
var __VLS_275 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_276 = __VLS_asFunctionalComponent(__VLS_275, new __VLS_275({
    label: "宠物图片",
}));
var __VLS_277 = __VLS_276.apply(void 0, __spreadArray([{
        label: "宠物图片",
    }], __VLS_functionalComponentArgsRest(__VLS_276), false));
var __VLS_279 = __VLS_278.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-upload-section" }));
var __VLS_280 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
ElUpload;
// @ts-ignore
var __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280(__assign(__assign(__assign({ 'onChange': {} }, { ref: "imagesUploadRef" }), { class: "pet-images-uploader" }), { autoUpload: (false), multiple: true, accept: "image/*" })));
var __VLS_282 = __VLS_281.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onChange': {} }, { ref: "imagesUploadRef" }), { class: "pet-images-uploader" }), { autoUpload: (false), multiple: true, accept: "image/*" })], __VLS_functionalComponentArgsRest(__VLS_281), false));
var __VLS_284;
var __VLS_285;
var __VLS_286 = ({ change: {} },
    { onChange: (__VLS_ctx.handleImagesSelect) });
/** @type {typeof __VLS_ctx.imagesUploadRef} */ ;
var __VLS_287 = {};
var __VLS_289 = __VLS_283.slots.default;
// @ts-ignore
[handleImagesSelect, imagesUploadRef,];
{
    var __VLS_290 = __VLS_283.slots.default;
    var __VLS_291 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
        type: "primary",
    }));
    var __VLS_293 = __VLS_292.apply(void 0, __spreadArray([{
            type: "primary",
        }], __VLS_functionalComponentArgsRest(__VLS_292), false));
    var __VLS_295 = __VLS_294.slots.default;
    var __VLS_294;
}
{
    var __VLS_296 = __VLS_283.slots.tip;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "el-upload__tip" }));
}
var __VLS_283;
if (__VLS_ctx.imageList.length > 0) {
    // @ts-ignore
    [imageList,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-list" }));
    var _loop_1 = function (img, index) {
        // @ts-ignore
        [imageList,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (index) }, { class: "image-item" }));
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (img),
            alt: ("\u5BA0\u7269\u56FE\u7247".concat(index + 1)),
        });
        var __VLS_297 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297(__assign({ 'onClick': {} }, { type: "danger", size: "small" })));
        var __VLS_299 = __VLS_298.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "danger", size: "small" })], __VLS_functionalComponentArgsRest(__VLS_298), false));
        var __VLS_301 = void 0;
        var __VLS_302 = void 0;
        var __VLS_303 = ({ click: {} },
            { onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.imageList.length > 0))
                        return;
                    __VLS_ctx.handleRemoveImage(index);
                    // @ts-ignore
                    [handleRemoveImage,];
                } });
        var __VLS_304 = __VLS_300.slots.default;
    };
    var __VLS_300;
    for (var _f = 0, _g = __VLS_getVForSourceType((__VLS_ctx.imageList)); _f < _g.length; _f++) {
        var _h = _g[_f], img = _h[0], index = _h[1];
        _loop_1(img, index);
    }
}
var __VLS_278;
var __VLS_305 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({}));
var __VLS_307 = __VLS_306.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_306), false));
var __VLS_309 = __VLS_308.slots.default;
var __VLS_310 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310(__assign({ 'onClick': {} }, { type: "primary" })));
var __VLS_312 = __VLS_311.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_311), false));
var __VLS_314;
var __VLS_315;
var __VLS_316 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSubmit) });
var __VLS_317 = __VLS_313.slots.default;
// @ts-ignore
[handleSubmit,];
var __VLS_313;
var __VLS_318 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318(__assign({ 'onClick': {} })));
var __VLS_320 = __VLS_319.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_319), false));
var __VLS_322;
var __VLS_323;
var __VLS_324 = ({ click: {} },
    { onClick: (__VLS_ctx.handleCancel) });
var __VLS_325 = __VLS_321.slots.default;
// @ts-ignore
[handleCancel,];
var __VLS_321;
var __VLS_308;
var __VLS_9;
var __VLS_3;
var __VLS_326 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
ElDialog;
// @ts-ignore
var __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326(__assign({ 'onClosed': {} }, { modelValue: (__VLS_ctx.showAddCategoryDialog), title: "新增宠物类别", width: "400px" })));
var __VLS_328 = __VLS_327.apply(void 0, __spreadArray([__assign({ 'onClosed': {} }, { modelValue: (__VLS_ctx.showAddCategoryDialog), title: "新增宠物类别", width: "400px" })], __VLS_functionalComponentArgsRest(__VLS_327), false));
var __VLS_330;
var __VLS_331;
var __VLS_332 = ({ closed: {} },
    { onClosed: (__VLS_ctx.handleAddCategoryDialogClosed) });
var __VLS_333 = __VLS_329.slots.default;
// @ts-ignore
[showAddCategoryDialog, handleAddCategoryDialogClosed,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "add-category-dialog-body" }));
var __VLS_334 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_335 = __VLS_asFunctionalComponent(__VLS_334, new __VLS_334({
    labelWidth: "80px",
}));
var __VLS_336 = __VLS_335.apply(void 0, __spreadArray([{
        labelWidth: "80px",
    }], __VLS_functionalComponentArgsRest(__VLS_335), false));
var __VLS_338 = __VLS_337.slots.default;
var __VLS_339 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_340 = __VLS_asFunctionalComponent(__VLS_339, new __VLS_339({
    label: "类别名称",
    error: (__VLS_ctx.newCategoryError),
}));
var __VLS_341 = __VLS_340.apply(void 0, __spreadArray([{
        label: "类别名称",
        error: (__VLS_ctx.newCategoryError),
    }], __VLS_functionalComponentArgsRest(__VLS_340), false));
var __VLS_343 = __VLS_342.slots.default;
// @ts-ignore
[newCategoryError,];
var __VLS_344 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.newCategoryName), placeholder: "请输入新的宠物类别", maxlength: "20", showWordLimit: true })));
var __VLS_346 = __VLS_345.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.newCategoryName), placeholder: "请输入新的宠物类别", maxlength: "20", showWordLimit: true })], __VLS_functionalComponentArgsRest(__VLS_345), false));
var __VLS_348;
var __VLS_349;
var __VLS_350 = ({ keyup: {} },
    { onKeyup: (__VLS_ctx.confirmAddCategory) });
// @ts-ignore
[newCategoryName, confirmAddCategory,];
var __VLS_347;
var __VLS_342;
var __VLS_337;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "add-category-tip" }));
{
    var __VLS_352 = __VLS_329.slots.footer;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "dialog-footer" }));
    var __VLS_353 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_354 = __VLS_asFunctionalComponent(__VLS_353, new __VLS_353(__assign({ 'onClick': {} })));
    var __VLS_355 = __VLS_354.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_354), false));
    var __VLS_357 = void 0;
    var __VLS_358 = void 0;
    var __VLS_359 = ({ click: {} },
        { onClick: (__VLS_ctx.cancelAddCategory) });
    var __VLS_360 = __VLS_356.slots.default;
    // @ts-ignore
    [cancelAddCategory,];
    var __VLS_356;
    var __VLS_361 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_362 = __VLS_asFunctionalComponent(__VLS_361, new __VLS_361(__assign({ 'onClick': {} }, { type: "primary" })));
    var __VLS_363 = __VLS_362.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_362), false));
    var __VLS_365 = void 0;
    var __VLS_366 = void 0;
    var __VLS_367 = ({ click: {} },
        { onClick: (__VLS_ctx.confirmAddCategory) });
    var __VLS_368 = __VLS_364.slots.default;
    // @ts-ignore
    [confirmAddCategory,];
    var __VLS_364;
}
var __VLS_329;
/** @type {__VLS_StyleScopedClasses['admin-pet-form-page']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-pet-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['add-category-option']} */ ;
/** @type {__VLS_StyleScopedClasses['add-category-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['image-upload-section']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['image-upload-section']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-images-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
/** @type {__VLS_StyleScopedClasses['image-list']} */ ;
/** @type {__VLS_StyleScopedClasses['image-item']} */ ;
/** @type {__VLS_StyleScopedClasses['add-category-dialog-body']} */ ;
/** @type {__VLS_StyleScopedClasses['add-category-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_11 = __VLS_10, __VLS_254 = __VLS_253, __VLS_288 = __VLS_287;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
