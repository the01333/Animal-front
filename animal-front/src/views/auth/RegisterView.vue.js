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
var icons_vue_1 = require("@element-plus/icons-vue");
var element_plus_1 = require("element-plus");
var axios_1 = require("axios");
var router = (0, vue_router_1.useRouter)();
var loading = (0, vue_1.ref)(false);
var registerType = (0, vue_1.ref)('email');
var showTip = (0, vue_1.ref)(false);
var tipMessage = (0, vue_1.ref)('');
// 邮箱注册表单
var emailFormRef = (0, vue_1.ref)();
var emailForm = (0, vue_1.reactive)({
    email: '',
    code: '',
    password: '',
    agreeTerms: false
});
var validateAgreeTerms = function (rule, value, callback) {
    if (!emailForm.agreeTerms) {
        callback(new Error('请同意用户协议和隐私政策'));
    }
    else {
        callback();
    }
};
var emailRules = (0, vue_1.reactive)({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ],
    agreeTerms: [
        { validator: validateAgreeTerms, trigger: 'change' }
    ]
});
// 手机注册表单
var phoneFormRef = (0, vue_1.ref)();
var phoneForm = (0, vue_1.reactive)({
    phone: '',
    code: '',
    password: '',
    agreeTerms: false
});
var validatePhoneAgreeTerms = function (rule, value, callback) {
    if (!phoneForm.agreeTerms) {
        callback(new Error('请同意用户协议和隐私政策'));
    }
    else {
        callback();
    }
};
var phoneRules = (0, vue_1.reactive)({
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ],
    agreeTerms: [
        { validator: validatePhoneAgreeTerms, trigger: 'change' }
    ]
});
var countdown = (0, vue_1.ref)(0);
var countdownTimer = null;
var sendingCode = (0, vue_1.ref)(false);
// 邮箱注册
var handleEmailRegister = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!emailFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, emailFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var response, error_1;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!valid) return [3 /*break*/, 5];
                                    loading.value = true;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, axios_1.default.post('/api/user/register', {
                                            email: emailForm.email,
                                            password: emailForm.password,
                                            code: emailForm.code,
                                            registerType: 'email'
                                        })];
                                case 2:
                                    response = _c.sent();
                                    if (response.data.code === 200) {
                                        showSuccessTip('注册成功！正在跳转到登录页...');
                                        setTimeout(function () {
                                            router.push('/login');
                                        }, 1500);
                                    }
                                    else {
                                        element_plus_1.ElMessage.error(response.data.message || '注册失败');
                                    }
                                    return [3 /*break*/, 5];
                                case 3:
                                    error_1 = _c.sent();
                                    element_plus_1.ElMessage.error(((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '注册失败，请检查网络连接');
                                    return [3 /*break*/, 5];
                                case 4:
                                    loading.value = false;
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
}); };
// 手机注册
var handlePhoneRegister = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!phoneFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, phoneFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var response, error_2;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!valid) return [3 /*break*/, 5];
                                    loading.value = true;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, axios_1.default.post('/api/user/register', {
                                            phone: phoneForm.phone,
                                            password: phoneForm.password,
                                            code: phoneForm.code,
                                            registerType: 'phone'
                                        })];
                                case 2:
                                    response = _c.sent();
                                    if (response.data.code === 200) {
                                        showSuccessTip('注册成功！正在跳转到登录页...');
                                        setTimeout(function () {
                                            router.push('/login');
                                        }, 1500);
                                    }
                                    else {
                                        element_plus_1.ElMessage.error(response.data.message || '注册失败');
                                    }
                                    return [3 /*break*/, 5];
                                case 3:
                                    error_2 = _c.sent();
                                    element_plus_1.ElMessage.error(((_b = (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '注册失败，请检查网络连接');
                                    return [3 /*break*/, 5];
                                case 4:
                                    loading.value = false;
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
}); };
// 发送邮箱验证码
var sendEmailCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!emailForm.email) {
                    element_plus_1.ElMessage.warning('请先输入邮箱');
                    return [2 /*return*/];
                }
                if (countdown.value > 0 || sendingCode.value) {
                    return [2 /*return*/];
                }
                sendingCode.value = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, axios_1.default.post('/api/verification/email/send', {
                        email: emailForm.email,
                        purpose: 'register'
                    })];
            case 2:
                response = _c.sent();
                if (response.data.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(response.data.message || '发送失败');
                }
                return [3 /*break*/, 5];
            case 3:
                error_3 = _c.sent();
                element_plus_1.ElMessage.error(((_b = (_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '发送失败');
                return [3 /*break*/, 5];
            case 4:
                sendingCode.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 发送手机验证码
var sendPhoneCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!phoneForm.phone) {
                    element_plus_1.ElMessage.warning('请先输入手机号');
                    return [2 /*return*/];
                }
                if (countdown.value > 0 || sendingCode.value) {
                    return [2 /*return*/];
                }
                sendingCode.value = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post('/api/verification/phone/send', {
                        phone: phoneForm.phone,
                        purpose: 'register'
                    })];
            case 2:
                response = _c.sent();
                if (response.data.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(response.data.message || '发送失败');
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _c.sent();
                element_plus_1.ElMessage.error(((_b = (_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '发送失败');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 倒计时
var startCountdown = function () {
    countdown.value = 60;
    countdownTimer = window.setInterval(function () {
        countdown.value--;
        if (countdown.value <= 0 && countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
    }, 1000);
};
// 显示成功提示
var showSuccessTip = function (message) {
    tipMessage.value = message;
    showTip.value = true;
    setTimeout(function () {
        showTip.value = false;
    }, 3000);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['register-card']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "register-container" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "register-wrapper" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "register-card" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)(__assign({ class: "title" }));
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "subtitle" }));
var __VLS_0 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ 'onClick': {} }, { type: "primary", underline: (false) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", underline: (false) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4;
var __VLS_5;
var __VLS_6 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.$router.push('/login');
            // @ts-ignore
            [$router,];
        } });
var __VLS_7 = __VLS_3.slots.default;
var __VLS_3;
var __VLS_8 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
ElTabs;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(__assign({ modelValue: (__VLS_ctx.registerType) }, { class: "register-tabs" })));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.registerType) }, { class: "register-tabs" })], __VLS_functionalComponentArgsRest(__VLS_9), false));
var __VLS_12 = __VLS_11.slots.default;
// @ts-ignore
[registerType,];
var __VLS_13 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
ElTabPane;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "邮箱注册",
    name: "email",
}));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
        label: "邮箱注册",
        name: "email",
    }], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_17 = __VLS_16.slots.default;
var __VLS_18 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    ref: "emailFormRef",
    model: (__VLS_ctx.emailForm),
    rules: (__VLS_ctx.emailRules),
    size: "large",
}));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
        ref: "emailFormRef",
        model: (__VLS_ctx.emailForm),
        rules: (__VLS_ctx.emailRules),
        size: "large",
    }], __VLS_functionalComponentArgsRest(__VLS_19), false));
/** @type {typeof __VLS_ctx.emailFormRef} */ ;
var __VLS_22 = {};
var __VLS_24 = __VLS_21.slots.default;
// @ts-ignore
[emailForm, emailRules, emailFormRef,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_25 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    prop: "email",
}));
var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{
        prop: "email",
    }], __VLS_functionalComponentArgsRest(__VLS_26), false));
var __VLS_29 = __VLS_28.slots.default;
var __VLS_30 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    modelValue: (__VLS_ctx.emailForm.email),
    placeholder: "请输入邮箱地址",
    clearable: true,
}));
var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.emailForm.email),
        placeholder: "请输入邮箱地址",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_31), false));
// @ts-ignore
[emailForm,];
var __VLS_28;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    prop: "code",
}));
var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([{
        prop: "code",
    }], __VLS_functionalComponentArgsRest(__VLS_36), false));
var __VLS_39 = __VLS_38.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "code-input-wrapper" }));
var __VLS_40 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.emailForm.code),
    placeholder: "请输入验证码",
}));
var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.emailForm.code),
        placeholder: "请输入验证码",
    }], __VLS_functionalComponentArgsRest(__VLS_41), false));
// @ts-ignore
[emailForm,];
var __VLS_45 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.countdown > 0 || __VLS_ctx.sendingCode) })));
var __VLS_47 = __VLS_46.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.countdown > 0 || __VLS_ctx.sendingCode) })], __VLS_functionalComponentArgsRest(__VLS_46), false));
var __VLS_49;
var __VLS_50;
var __VLS_51 = ({ click: {} },
    { onClick: (__VLS_ctx.sendEmailCode) });
var __VLS_52 = __VLS_48.slots.default;
// @ts-ignore
[countdown, sendingCode, sendEmailCode,];
(__VLS_ctx.countdown > 0 ? "".concat(__VLS_ctx.countdown, "\u79D2\u540E\u91CD\u8BD5") : '获取验证码');
// @ts-ignore
[countdown, countdown,];
var __VLS_48;
var __VLS_38;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_53 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    prop: "password",
}));
var __VLS_55 = __VLS_54.apply(void 0, __spreadArray([{
        prop: "password",
    }], __VLS_functionalComponentArgsRest(__VLS_54), false));
var __VLS_57 = __VLS_56.slots.default;
var __VLS_58 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.emailForm.password),
    type: "password",
    placeholder: "请设置密码（至少6个字符）",
    showPassword: true,
}));
var __VLS_60 = __VLS_59.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.emailForm.password),
        type: "password",
        placeholder: "请设置密码（至少6个字符）",
        showPassword: true,
    }], __VLS_functionalComponentArgsRest(__VLS_59), false));
// @ts-ignore
[emailForm,];
var __VLS_56;
var __VLS_63 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    prop: "agreeTerms",
}));
var __VLS_65 = __VLS_64.apply(void 0, __spreadArray([{
        prop: "agreeTerms",
    }], __VLS_functionalComponentArgsRest(__VLS_64), false));
var __VLS_67 = __VLS_66.slots.default;
var __VLS_68 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
ElCheckbox;
// @ts-ignore
var __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    modelValue: (__VLS_ctx.emailForm.agreeTerms),
}));
var __VLS_70 = __VLS_69.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.emailForm.agreeTerms),
    }], __VLS_functionalComponentArgsRest(__VLS_69), false));
var __VLS_72 = __VLS_71.slots.default;
// @ts-ignore
[emailForm,];
var __VLS_73 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    type: "primary",
    underline: (false),
}));
var __VLS_75 = __VLS_74.apply(void 0, __spreadArray([{
        type: "primary",
        underline: (false),
    }], __VLS_functionalComponentArgsRest(__VLS_74), false));
var __VLS_77 = __VLS_76.slots.default;
var __VLS_76;
var __VLS_78 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    type: "primary",
    underline: (false),
}));
var __VLS_80 = __VLS_79.apply(void 0, __spreadArray([{
        type: "primary",
        underline: (false),
    }], __VLS_functionalComponentArgsRest(__VLS_79), false));
var __VLS_82 = __VLS_81.slots.default;
var __VLS_81;
var __VLS_71;
var __VLS_66;
var __VLS_83 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "register-btn" })));
var __VLS_85 = __VLS_84.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "register-btn" })], __VLS_functionalComponentArgsRest(__VLS_84), false));
var __VLS_87;
var __VLS_88;
var __VLS_89 = ({ click: {} },
    { onClick: (__VLS_ctx.handleEmailRegister) });
var __VLS_90 = __VLS_86.slots.default;
// @ts-ignore
[loading, handleEmailRegister,];
var __VLS_86;
var __VLS_21;
var __VLS_16;
var __VLS_91 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
ElTabPane;
// @ts-ignore
var __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "手机注册",
    name: "phone",
}));
var __VLS_93 = __VLS_92.apply(void 0, __spreadArray([{
        label: "手机注册",
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
    placeholder: "请输入手机号",
    clearable: true,
}));
var __VLS_110 = __VLS_109.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.phoneForm.phone),
        placeholder: "请输入手机号",
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
var __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.countdown > 0 || __VLS_ctx.sendingCode) })));
var __VLS_125 = __VLS_124.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.countdown > 0 || __VLS_ctx.sendingCode) })], __VLS_functionalComponentArgsRest(__VLS_124), false));
var __VLS_127;
var __VLS_128;
var __VLS_129 = ({ click: {} },
    { onClick: (__VLS_ctx.sendPhoneCode) });
var __VLS_130 = __VLS_126.slots.default;
// @ts-ignore
[countdown, sendingCode, sendPhoneCode,];
(__VLS_ctx.countdown > 0 ? "".concat(__VLS_ctx.countdown, "\u79D2\u540E\u91CD\u8BD5") : '获取验证码');
// @ts-ignore
[countdown, countdown,];
var __VLS_126;
var __VLS_116;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_131 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    prop: "password",
}));
var __VLS_133 = __VLS_132.apply(void 0, __spreadArray([{
        prop: "password",
    }], __VLS_functionalComponentArgsRest(__VLS_132), false));
var __VLS_135 = __VLS_134.slots.default;
var __VLS_136 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    modelValue: (__VLS_ctx.phoneForm.password),
    type: "password",
    placeholder: "请设置密码（至少6个字符）",
    showPassword: true,
}));
var __VLS_138 = __VLS_137.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.phoneForm.password),
        type: "password",
        placeholder: "请设置密码（至少6个字符）",
        showPassword: true,
    }], __VLS_functionalComponentArgsRest(__VLS_137), false));
// @ts-ignore
[phoneForm,];
var __VLS_134;
var __VLS_141 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    prop: "agreeTerms",
}));
var __VLS_143 = __VLS_142.apply(void 0, __spreadArray([{
        prop: "agreeTerms",
    }], __VLS_functionalComponentArgsRest(__VLS_142), false));
var __VLS_145 = __VLS_144.slots.default;
var __VLS_146 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
ElCheckbox;
// @ts-ignore
var __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.phoneForm.agreeTerms),
}));
var __VLS_148 = __VLS_147.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.phoneForm.agreeTerms),
    }], __VLS_functionalComponentArgsRest(__VLS_147), false));
var __VLS_150 = __VLS_149.slots.default;
// @ts-ignore
[phoneForm,];
var __VLS_151 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    type: "primary",
    underline: (false),
}));
var __VLS_153 = __VLS_152.apply(void 0, __spreadArray([{
        type: "primary",
        underline: (false),
    }], __VLS_functionalComponentArgsRest(__VLS_152), false));
var __VLS_155 = __VLS_154.slots.default;
var __VLS_154;
var __VLS_156 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    type: "primary",
    underline: (false),
}));
var __VLS_158 = __VLS_157.apply(void 0, __spreadArray([{
        type: "primary",
        underline: (false),
    }], __VLS_functionalComponentArgsRest(__VLS_157), false));
var __VLS_160 = __VLS_159.slots.default;
var __VLS_159;
var __VLS_149;
var __VLS_144;
var __VLS_161 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "register-btn" })));
var __VLS_163 = __VLS_162.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "register-btn" })], __VLS_functionalComponentArgsRest(__VLS_162), false));
var __VLS_165;
var __VLS_166;
var __VLS_167 = ({ click: {} },
    { onClick: (__VLS_ctx.handlePhoneRegister) });
var __VLS_168 = __VLS_164.slots.default;
// @ts-ignore
[loading, handlePhoneRegister,];
var __VLS_164;
var __VLS_99;
var __VLS_94;
var __VLS_11;
if (__VLS_ctx.showTip) {
    // @ts-ignore
    [showTip,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "success-tip" }));
    var __VLS_169 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169(__assign({ class: "tip-icon" })));
    var __VLS_171 = __VLS_170.apply(void 0, __spreadArray([__assign({ class: "tip-icon" })], __VLS_functionalComponentArgsRest(__VLS_170), false));
    var __VLS_173 = __VLS_172.slots.default;
    var __VLS_174 = {}.CircleCheck;
    /** @type {[typeof __VLS_components.CircleCheck, ]} */ ;
    // @ts-ignore
    icons_vue_1.CircleCheck;
    // @ts-ignore
    var __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({}));
    var __VLS_176 = __VLS_175.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_175), false));
    var __VLS_172;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.tipMessage);
    // @ts-ignore
    [tipMessage,];
}
/** @type {__VLS_StyleScopedClasses['register-container']} */ ;
/** @type {__VLS_StyleScopedClasses['register-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['register-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['register-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['success-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tip-icon']} */ ;
// @ts-ignore
var __VLS_23 = __VLS_22, __VLS_101 = __VLS_100;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
