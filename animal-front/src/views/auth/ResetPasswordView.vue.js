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
var icons_vue_1 = require("@element-plus/icons-vue");
var user_1 = require("@/api/user");
defineOptions({
    name: 'ResetPasswordView'
});
var router = (0, vue_router_1.useRouter)();
var resetMethod = (0, vue_1.ref)('email');
// 邮箱重置表单
var emailFormRef = (0, vue_1.ref)();
var emailForm = (0, vue_1.reactive)({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
});
var validateEmailPassword = function (rule, value, callback) {
    if (value === '') {
        callback(new Error('请确认密码'));
    }
    else if (value !== emailForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
    }
    else {
        callback();
    }
};
var emailRules = {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, validator: validateEmailPassword, trigger: 'blur' }
    ]
};
// 手机重置表单
var phoneFormRef = (0, vue_1.ref)();
var phoneForm = (0, vue_1.reactive)({
    phone: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
});
var validatePhonePassword = function (rule, value, callback) {
    if (value === '') {
        callback(new Error('请确认密码'));
    }
    else if (value !== phoneForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
    }
    else {
        callback();
    }
};
var phoneRules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, validator: validatePhonePassword, trigger: 'blur' }
    ]
};
// 倒计时
var emailCountdown = (0, vue_1.ref)(0);
var emailTimer = null;
var phoneCountdown = (0, vue_1.ref)(0);
var phoneTimer = null;
var emailCodeSending = (0, vue_1.ref)(false);
var phoneCodeSending = (0, vue_1.ref)(false);
var emailLoading = (0, vue_1.ref)(false);
var phoneLoading = (0, vue_1.ref)(false);
var startEmailCountdown = function () {
    emailCountdown.value = 60;
    if (emailTimer)
        clearInterval(emailTimer);
    emailTimer = window.setInterval(function () {
        emailCountdown.value--;
        if (emailCountdown.value <= 0 && emailTimer) {
            clearInterval(emailTimer);
            emailTimer = null;
        }
    }, 1000);
};
var startPhoneCountdown = function () {
    phoneCountdown.value = 60;
    if (phoneTimer)
        clearInterval(phoneTimer);
    phoneTimer = window.setInterval(function () {
        phoneCountdown.value--;
        if (phoneCountdown.value <= 0 && phoneTimer) {
            clearInterval(phoneTimer);
            phoneTimer = null;
        }
    }, 1000);
};
// 发送邮箱验证码
var sendEmailCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!emailForm.email) {
                    element_plus_1.ElMessage.warning('请先输入邮箱');
                    return [2 /*return*/];
                }
                if (emailCountdown.value > 0 || emailCodeSending.value) {
                    return [2 /*return*/];
                }
                emailCodeSending.value = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, user_1.sendEmailVerificationCode)(emailForm.email, 'reset_password')];
            case 2:
                res = _c.sent();
                if (res.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startEmailCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(res.message || '发送验证码失败');
                }
                return [3 /*break*/, 5];
            case 3:
                error_1 = _c.sent();
                element_plus_1.ElMessage.error(((_b = (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '发送验证码失败');
                return [3 /*break*/, 5];
            case 4:
                emailCodeSending.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 发送手机验证码
var sendPhoneCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!phoneForm.phone) {
                    element_plus_1.ElMessage.warning('请先输入手机号');
                    return [2 /*return*/];
                }
                if (phoneCountdown.value > 0 || phoneCodeSending.value) {
                    return [2 /*return*/];
                }
                phoneCodeSending.value = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, user_1.sendPhoneVerificationCode)(phoneForm.phone, 'reset_password')];
            case 2:
                res = _c.sent();
                if (res.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startPhoneCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(res.message || '发送验证码失败');
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _c.sent();
                element_plus_1.ElMessage.error(((_b = (_a = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '发送验证码失败');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 邮箱重置密码
var handleEmailReset = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!emailFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, emailFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            if (!valid) {
                                element_plus_1.ElMessage.error('请完整填写所有字段');
                                return [2 /*return*/];
                            }
                            emailLoading.value = true;
                            try {
                                // TODO: 调用后端重置密码接口
                                // const res = await resetPasswordByEmail({...})
                                element_plus_1.ElMessage.success('密码重置成功，请重新登录');
                                setTimeout(function () {
                                    router.push('/');
                                }, 1500);
                            }
                            catch (error) {
                                element_plus_1.ElMessage.error(((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '重置密码失败');
                            }
                            finally {
                                emailLoading.value = false;
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 手机重置密码
var handlePhoneReset = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!phoneFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, phoneFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            if (!valid) {
                                element_plus_1.ElMessage.error('请完整填写所有字段');
                                return [2 /*return*/];
                            }
                            phoneLoading.value = true;
                            try {
                                // TODO: 调用后端重置密码接口
                                // const res = await resetPasswordByPhone({...})
                                element_plus_1.ElMessage.success('密码重置成功，请重新登录');
                                setTimeout(function () {
                                    router.push('/');
                                }, 1500);
                            }
                            catch (error) {
                                element_plus_1.ElMessage.error(((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '重置密码失败');
                            }
                            finally {
                                phoneLoading.value = false;
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 返回
var goBack = function () {
    router.back();
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "reset-password-container" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "reset-password-card" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header" }));
var __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign({ 'onClick': {} }, { link: true }), { class: "back-btn" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { link: true }), { class: "back-btn" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4;
var __VLS_5;
var __VLS_6 = ({ click: {} },
    { onClick: (__VLS_ctx.goBack) });
var __VLS_7 = __VLS_3.slots.default;
// @ts-ignore
[goBack,];
var __VLS_8 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_9), false));
var __VLS_12 = __VLS_11.slots.default;
var __VLS_13 = {}.ArrowLeft;
/** @type {[typeof __VLS_components.ArrowLeft, ]} */ ;
// @ts-ignore
icons_vue_1.ArrowLeft;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_11;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "title-section" }));
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)(__assign({ class: "title" }));
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "subtitle" }));
var __VLS_18 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
ElTabs;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18(__assign({ modelValue: (__VLS_ctx.resetMethod) }, { class: "reset-tabs" })));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.resetMethod) }, { class: "reset-tabs" })], __VLS_functionalComponentArgsRest(__VLS_19), false));
var __VLS_22 = __VLS_21.slots.default;
// @ts-ignore
[resetMethod,];
var __VLS_23 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
ElTabPane;
// @ts-ignore
var __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "邮箱重置",
    name: "email",
}));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{
        label: "邮箱重置",
        name: "email",
    }], __VLS_functionalComponentArgsRest(__VLS_24), false));
var __VLS_27 = __VLS_26.slots.default;
var __VLS_28 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ref: "emailFormRef",
    model: (__VLS_ctx.emailForm),
    rules: (__VLS_ctx.emailRules),
    size: "large",
}));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
        ref: "emailFormRef",
        model: (__VLS_ctx.emailForm),
        rules: (__VLS_ctx.emailRules),
        size: "large",
    }], __VLS_functionalComponentArgsRest(__VLS_29), false));
/** @type {typeof __VLS_ctx.emailFormRef} */ ;
var __VLS_32 = {};
var __VLS_34 = __VLS_31.slots.default;
// @ts-ignore
[emailForm, emailRules, emailFormRef,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    prop: "email",
}));
var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([{
        prop: "email",
    }], __VLS_functionalComponentArgsRest(__VLS_36), false));
var __VLS_39 = __VLS_38.slots.default;
var __VLS_40 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.emailForm.email),
    placeholder: "请输入注册邮箱",
    clearable: true,
}));
var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.emailForm.email),
        placeholder: "请输入注册邮箱",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_41), false));
// @ts-ignore
[emailForm,];
var __VLS_38;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_45 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    prop: "code",
}));
var __VLS_47 = __VLS_46.apply(void 0, __spreadArray([{
        prop: "code",
    }], __VLS_functionalComponentArgsRest(__VLS_46), false));
var __VLS_49 = __VLS_48.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "code-input-wrapper" }));
var __VLS_50 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    modelValue: (__VLS_ctx.emailForm.code),
    placeholder: "请输入验证码",
}));
var __VLS_52 = __VLS_51.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.emailForm.code),
        placeholder: "请输入验证码",
    }], __VLS_functionalComponentArgsRest(__VLS_51), false));
// @ts-ignore
[emailForm,];
var __VLS_55 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.emailCountdown > 0 || __VLS_ctx.emailCodeSending) })));
var __VLS_57 = __VLS_56.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.emailCountdown > 0 || __VLS_ctx.emailCodeSending) })], __VLS_functionalComponentArgsRest(__VLS_56), false));
var __VLS_59;
var __VLS_60;
var __VLS_61 = ({ click: {} },
    { onClick: (__VLS_ctx.sendEmailCode) });
var __VLS_62 = __VLS_58.slots.default;
// @ts-ignore
[emailCountdown, emailCodeSending, sendEmailCode,];
(__VLS_ctx.emailCountdown > 0 ? "".concat(__VLS_ctx.emailCountdown, "\u79D2\u540E\u91CD\u8BD5") : __VLS_ctx.emailCodeSending ? '发送中...' : '获取验证码');
// @ts-ignore
[emailCountdown, emailCountdown, emailCodeSending,];
var __VLS_58;
var __VLS_48;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    prop: "newPassword",
}));
var __VLS_65 = __VLS_64.apply(void 0, __spreadArray([{
        prop: "newPassword",
    }], __VLS_functionalComponentArgsRest(__VLS_64), false));
var __VLS_67 = __VLS_66.slots.default;
var __VLS_68 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    modelValue: (__VLS_ctx.emailForm.newPassword),
    type: "password",
    placeholder: "请输入新密码（至少6个字符）",
    showPassword: true,
}));
var __VLS_70 = __VLS_69.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.emailForm.newPassword),
        type: "password",
        placeholder: "请输入新密码（至少6个字符）",
        showPassword: true,
    }], __VLS_functionalComponentArgsRest(__VLS_69), false));
// @ts-ignore
[emailForm,];
var __VLS_66;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_73 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    prop: "confirmPassword",
}));
var __VLS_75 = __VLS_74.apply(void 0, __spreadArray([{
        prop: "confirmPassword",
    }], __VLS_functionalComponentArgsRest(__VLS_74), false));
var __VLS_77 = __VLS_76.slots.default;
var __VLS_78 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    modelValue: (__VLS_ctx.emailForm.confirmPassword),
    type: "password",
    placeholder: "请再次输入新密码",
    showPassword: true,
}));
var __VLS_80 = __VLS_79.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.emailForm.confirmPassword),
        type: "password",
        placeholder: "请再次输入新密码",
        showPassword: true,
    }], __VLS_functionalComponentArgsRest(__VLS_79), false));
// @ts-ignore
[emailForm,];
var __VLS_76;
var __VLS_83 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.emailLoading) }), { class: "submit-btn" })));
var __VLS_85 = __VLS_84.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.emailLoading) }), { class: "submit-btn" })], __VLS_functionalComponentArgsRest(__VLS_84), false));
var __VLS_87;
var __VLS_88;
var __VLS_89 = ({ click: {} },
    { onClick: (__VLS_ctx.handleEmailReset) });
var __VLS_90 = __VLS_86.slots.default;
// @ts-ignore
[emailLoading, handleEmailReset,];
var __VLS_86;
var __VLS_31;
var __VLS_26;
var __VLS_91 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
ElTabPane;
// @ts-ignore
var __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "手机重置",
    name: "phone",
}));
var __VLS_93 = __VLS_92.apply(void 0, __spreadArray([{
        label: "手机重置",
        name: "phone",
    }], __VLS_functionalComponentArgsRest(__VLS_92), false));
var __VLS_95 = __VLS_94.slots.default;
var __VLS_96 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ref: "phoneFormRef",
    model: (__VLS_ctx.phoneForm),
    rules: (__VLS_ctx.phoneRules),
    size: "large",
}));
var __VLS_98 = __VLS_97.apply(void 0, __spreadArray([{
        ref: "phoneFormRef",
        model: (__VLS_ctx.phoneForm),
        rules: (__VLS_ctx.phoneRules),
        size: "large",
    }], __VLS_functionalComponentArgsRest(__VLS_97), false));
/** @type {typeof __VLS_ctx.phoneFormRef} */ ;
var __VLS_100 = {};
var __VLS_102 = __VLS_99.slots.default;
// @ts-ignore
[phoneForm, phoneRules, phoneFormRef,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_103 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    prop: "phone",
}));
var __VLS_105 = __VLS_104.apply(void 0, __spreadArray([{
        prop: "phone",
    }], __VLS_functionalComponentArgsRest(__VLS_104), false));
var __VLS_107 = __VLS_106.slots.default;
var __VLS_108 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.phoneForm.phone),
    placeholder: "请输入注册手机号",
    clearable: true,
}));
var __VLS_110 = __VLS_109.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.phoneForm.phone),
        placeholder: "请输入注册手机号",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_109), false));
// @ts-ignore
[phoneForm,];
var __VLS_106;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_113 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    prop: "code",
}));
var __VLS_115 = __VLS_114.apply(void 0, __spreadArray([{
        prop: "code",
    }], __VLS_functionalComponentArgsRest(__VLS_114), false));
var __VLS_117 = __VLS_116.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "code-input-wrapper" }));
var __VLS_118 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    modelValue: (__VLS_ctx.phoneForm.code),
    placeholder: "请输入验证码",
}));
var __VLS_120 = __VLS_119.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.phoneForm.code),
        placeholder: "请输入验证码",
    }], __VLS_functionalComponentArgsRest(__VLS_119), false));
// @ts-ignore
[phoneForm,];
var __VLS_123 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.phoneCountdown > 0 || __VLS_ctx.phoneCodeSending) })));
var __VLS_125 = __VLS_124.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.phoneCountdown > 0 || __VLS_ctx.phoneCodeSending) })], __VLS_functionalComponentArgsRest(__VLS_124), false));
var __VLS_127;
var __VLS_128;
var __VLS_129 = ({ click: {} },
    { onClick: (__VLS_ctx.sendPhoneCode) });
var __VLS_130 = __VLS_126.slots.default;
// @ts-ignore
[phoneCountdown, phoneCodeSending, sendPhoneCode,];
(__VLS_ctx.phoneCountdown > 0 ? "".concat(__VLS_ctx.phoneCountdown, "\u79D2\u540E\u91CD\u8BD5") : '获取验证码');
// @ts-ignore
[phoneCountdown, phoneCountdown,];
var __VLS_126;
var __VLS_116;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_131 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    prop: "newPassword",
}));
var __VLS_133 = __VLS_132.apply(void 0, __spreadArray([{
        prop: "newPassword",
    }], __VLS_functionalComponentArgsRest(__VLS_132), false));
var __VLS_135 = __VLS_134.slots.default;
var __VLS_136 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    modelValue: (__VLS_ctx.phoneForm.newPassword),
    type: "password",
    placeholder: "请输入新密码（至少6个字符）",
    showPassword: true,
}));
var __VLS_138 = __VLS_137.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.phoneForm.newPassword),
        type: "password",
        placeholder: "请输入新密码（至少6个字符）",
        showPassword: true,
    }], __VLS_functionalComponentArgsRest(__VLS_137), false));
// @ts-ignore
[phoneForm,];
var __VLS_134;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_141 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    prop: "confirmPassword",
}));
var __VLS_143 = __VLS_142.apply(void 0, __spreadArray([{
        prop: "confirmPassword",
    }], __VLS_functionalComponentArgsRest(__VLS_142), false));
var __VLS_145 = __VLS_144.slots.default;
var __VLS_146 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.phoneForm.confirmPassword),
    type: "password",
    placeholder: "请再次输入新密码",
    showPassword: true,
}));
var __VLS_148 = __VLS_147.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.phoneForm.confirmPassword),
        type: "password",
        placeholder: "请再次输入新密码",
        showPassword: true,
    }], __VLS_functionalComponentArgsRest(__VLS_147), false));
// @ts-ignore
[phoneForm,];
var __VLS_144;
var __VLS_151 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.phoneLoading) }), { class: "submit-btn" })));
var __VLS_153 = __VLS_152.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.phoneLoading) }), { class: "submit-btn" })], __VLS_functionalComponentArgsRest(__VLS_152), false));
var __VLS_155;
var __VLS_156;
var __VLS_157 = ({ click: {} },
    { onClick: (__VLS_ctx.handlePhoneReset) });
var __VLS_158 = __VLS_154.slots.default;
// @ts-ignore
[phoneLoading, handlePhoneReset,];
var __VLS_154;
var __VLS_99;
var __VLS_94;
var __VLS_21;
/** @type {__VLS_StyleScopedClasses['reset-password-container']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['title-section']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
// @ts-ignore
var __VLS_33 = __VLS_32, __VLS_101 = __VLS_100;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
