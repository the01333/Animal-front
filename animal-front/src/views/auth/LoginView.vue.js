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
var user_1 = require("@/api/user");
var router = (0, vue_router_1.useRouter)();
var loading = (0, vue_1.ref)(false);
var loginType = (0, vue_1.ref)('password');
var autoLogin = (0, vue_1.ref)(false);
var showTip = (0, vue_1.ref)(false);
var tipMessage = (0, vue_1.ref)('');
// 密码登录表单
var passwordFormRef = (0, vue_1.ref)();
var passwordForm = (0, vue_1.reactive)({
    account: '',
    password: ''
});
var passwordRules = (0, vue_1.reactive)({
    account: [
        { required: true, message: '请输入邮箱或手机号', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ]
});
// 验证码登录表单
var codeFormRef = (0, vue_1.ref)();
var codeType = (0, vue_1.ref)('email');
var codeForm = (0, vue_1.reactive)({
    target: '',
    code: ''
});
var codeRules = (0, vue_1.reactive)({
    target: [
        { required: true, message: '请输入邮箱或手机号', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ]
});
var countdown = (0, vue_1.ref)(0);
var countdownTimer = null;
var sendingCode = (0, vue_1.ref)(false);
// 密码登录
var handlePasswordLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!passwordFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, passwordFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var response, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!valid)
                                        return [2 /*return*/];
                                    loading.value = true;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, (0, user_1.login)({
                                            username: passwordForm.account,
                                            password: passwordForm.password
                                        })];
                                case 2:
                                    response = _a.sent();
                                    if (response.code === 200) {
                                        localStorage.setItem('token', response.data.token);
                                        localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
                                        showSuccessTip('登录成功！正在跳转...');
                                        redirectAfterLogin();
                                    }
                                    return [3 /*break*/, 5];
                                case 3:
                                    error_1 = _a.sent();
                                    console.error('登录失败:', error_1);
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
// 验证码登录
var handleCodeLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!codeFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, codeFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var resp, _a, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!valid)
                                        return [2 /*return*/];
                                    loading.value = true;
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 6, 7, 8]);
                                    if (!(codeType.value === 'email')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, user_1.loginByEmailCode)(codeForm.target, codeForm.code)];
                                case 2:
                                    _a = _b.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, (0, user_1.loginByPhoneCode)(codeForm.target, codeForm.code)];
                                case 4:
                                    _a = _b.sent();
                                    _b.label = 5;
                                case 5:
                                    resp = _a;
                                    if (resp.code === 200) {
                                        localStorage.setItem('token', resp.data.token);
                                        localStorage.setItem('userInfo', JSON.stringify(resp.data.userInfo));
                                        showSuccessTip('登录成功！正在跳转...');
                                        redirectAfterLogin(1000);
                                    }
                                    return [3 /*break*/, 8];
                                case 6:
                                    error_2 = _b.sent();
                                    console.error('登录失败:', error_2);
                                    return [3 /*break*/, 8];
                                case 7:
                                    loading.value = false;
                                    return [7 /*endfinally*/];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 发送验证码
var sendVerificationCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var endpoint, response, error_3;
    var _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!codeForm.target) {
                    element_plus_1.ElMessage.warning("\u8BF7\u5148\u8F93\u5165".concat(codeType.value === 'email' ? '邮箱' : '手机号'));
                    return [2 /*return*/];
                }
                if (countdown.value > 0 || sendingCode.value) {
                    return [2 /*return*/];
                }
                sendingCode.value = true;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, 4, 5]);
                endpoint = codeType.value === 'email' ? '/api/verification/email/send' : '/api/verification/phone/send';
                return [4 /*yield*/, axios_1.default.post(endpoint, (_a = {},
                        _a[codeType.value] = codeForm.target,
                        _a.purpose = 'login',
                        _a))];
            case 2:
                response = _d.sent();
                if (response.data.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(response.data.message || '发送失败');
                }
                return [3 /*break*/, 5];
            case 3:
                error_3 = _d.sent();
                element_plus_1.ElMessage.error(((_c = (_b = error_3.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || '发送失败');
                return [3 /*break*/, 5];
            case 4:
                sendingCode.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var startCountdown = function () {
    countdown.value = 60;
    countdownTimer && clearInterval(countdownTimer);
    countdownTimer = window.setInterval(function () {
        countdown.value -= 1;
        if (countdown.value <= 0 && countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            countdown.value = 0;
        }
    }, 1000);
};
var redirectAfterLogin = function (delay) {
    if (delay === void 0) { delay = 1500; }
    setTimeout(function () {
        var redirect = router.currentRoute.value.query.redirect;
        if (redirect) {
            window.location.href = redirect;
        }
        else {
            router.push('/');
        }
    }, delay);
};
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
/** @type {__VLS_StyleScopedClasses['code-type-radio']} */ ;
/** @type {__VLS_StyleScopedClasses['code-type-radio']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['social-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['wechat-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['qq-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['social-login']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "login-container" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "login-wrapper" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "login-card" }));
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
            __VLS_ctx.$router.push('/register');
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
var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(__assign({ modelValue: (__VLS_ctx.loginType) }, { class: "login-tabs" })));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.loginType) }, { class: "login-tabs" })], __VLS_functionalComponentArgsRest(__VLS_9), false));
var __VLS_12 = __VLS_11.slots.default;
// @ts-ignore
[loginType,];
var __VLS_13 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
ElTabPane;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "密码登录",
    name: "password",
}));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
        label: "密码登录",
        name: "password",
    }], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_17 = __VLS_16.slots.default;
var __VLS_18 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    size: "large",
}));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
        ref: "passwordFormRef",
        model: (__VLS_ctx.passwordForm),
        rules: (__VLS_ctx.passwordRules),
        size: "large",
    }], __VLS_functionalComponentArgsRest(__VLS_19), false));
/** @type {typeof __VLS_ctx.passwordFormRef} */ ;
var __VLS_22 = {};
var __VLS_24 = __VLS_21.slots.default;
// @ts-ignore
[passwordForm, passwordRules, passwordFormRef,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_25 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    prop: "account",
}));
var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{
        prop: "account",
    }], __VLS_functionalComponentArgsRest(__VLS_26), false));
var __VLS_29 = __VLS_28.slots.default;
var __VLS_30 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    modelValue: (__VLS_ctx.passwordForm.account),
    placeholder: "请输入邮箱或手机号",
    clearable: true,
}));
var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.passwordForm.account),
        placeholder: "请输入邮箱或手机号",
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_31), false));
// @ts-ignore
[passwordForm,];
var __VLS_28;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
var __VLS_35 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35(__assign({ type: "primary", underline: (false) }, { class: "forgot-link" })));
var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([__assign({ type: "primary", underline: (false) }, { class: "forgot-link" })], __VLS_functionalComponentArgsRest(__VLS_36), false));
var __VLS_39 = __VLS_38.slots.default;
var __VLS_38;
var __VLS_40 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "password",
}));
var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{
        prop: "password",
    }], __VLS_functionalComponentArgsRest(__VLS_41), false));
var __VLS_44 = __VLS_43.slots.default;
var __VLS_45 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.passwordForm.password), type: "password", placeholder: "请输入密码", showPassword: true })));
var __VLS_47 = __VLS_46.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.passwordForm.password), type: "password", placeholder: "请输入密码", showPassword: true })], __VLS_functionalComponentArgsRest(__VLS_46), false));
var __VLS_49;
var __VLS_50;
var __VLS_51 = ({ keyup: {} },
    { onKeyup: (__VLS_ctx.handlePasswordLogin) });
// @ts-ignore
[passwordForm, handlePasswordLogin,];
var __VLS_48;
var __VLS_43;
var __VLS_53 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({}));
var __VLS_55 = __VLS_54.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_54), false));
var __VLS_57 = __VLS_56.slots.default;
var __VLS_58 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
ElCheckbox;
// @ts-ignore
var __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.autoLogin),
}));
var __VLS_60 = __VLS_59.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.autoLogin),
    }], __VLS_functionalComponentArgsRest(__VLS_59), false));
var __VLS_62 = __VLS_61.slots.default;
// @ts-ignore
[autoLogin,];
var __VLS_61;
var __VLS_56;
var __VLS_63 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "login-btn" })));
var __VLS_65 = __VLS_64.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "login-btn" })], __VLS_functionalComponentArgsRest(__VLS_64), false));
var __VLS_67;
var __VLS_68;
var __VLS_69 = ({ click: {} },
    { onClick: (__VLS_ctx.handlePasswordLogin) });
var __VLS_70 = __VLS_66.slots.default;
// @ts-ignore
[handlePasswordLogin, loading,];
var __VLS_66;
var __VLS_21;
var __VLS_16;
var __VLS_71 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
ElTabPane;
// @ts-ignore
var __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    label: "验证码登录",
    name: "code",
}));
var __VLS_73 = __VLS_72.apply(void 0, __spreadArray([{
        label: "验证码登录",
        name: "code",
    }], __VLS_functionalComponentArgsRest(__VLS_72), false));
var __VLS_75 = __VLS_74.slots.default;
var __VLS_76 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ref: "codeFormRef",
    model: (__VLS_ctx.codeForm),
    rules: (__VLS_ctx.codeRules),
    size: "large",
}));
var __VLS_78 = __VLS_77.apply(void 0, __spreadArray([{
        ref: "codeFormRef",
        model: (__VLS_ctx.codeForm),
        rules: (__VLS_ctx.codeRules),
        size: "large",
    }], __VLS_functionalComponentArgsRest(__VLS_77), false));
/** @type {typeof __VLS_ctx.codeFormRef} */ ;
var __VLS_80 = {};
var __VLS_82 = __VLS_79.slots.default;
// @ts-ignore
[codeForm, codeRules, codeFormRef,];
var __VLS_83 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
ElRadioGroup;
// @ts-ignore
var __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83(__assign({ modelValue: (__VLS_ctx.codeType) }, { class: "code-type-radio" })));
var __VLS_85 = __VLS_84.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.codeType) }, { class: "code-type-radio" })], __VLS_functionalComponentArgsRest(__VLS_84), false));
var __VLS_87 = __VLS_86.slots.default;
// @ts-ignore
[codeType,];
var __VLS_88 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
ElRadioButton;
// @ts-ignore
var __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "email",
}));
var __VLS_90 = __VLS_89.apply(void 0, __spreadArray([{
        label: "email",
    }], __VLS_functionalComponentArgsRest(__VLS_89), false));
var __VLS_92 = __VLS_91.slots.default;
var __VLS_91;
var __VLS_93 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
ElRadioButton;
// @ts-ignore
var __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    label: "phone",
}));
var __VLS_95 = __VLS_94.apply(void 0, __spreadArray([{
        label: "phone",
    }], __VLS_functionalComponentArgsRest(__VLS_94), false));
var __VLS_97 = __VLS_96.slots.default;
var __VLS_96;
var __VLS_86;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
(__VLS_ctx.codeType === 'email' ? '邮箱' : '手机号');
// @ts-ignore
[codeType,];
var __VLS_98 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    prop: "target",
}));
var __VLS_100 = __VLS_99.apply(void 0, __spreadArray([{
        prop: "target",
    }], __VLS_functionalComponentArgsRest(__VLS_99), false));
var __VLS_102 = __VLS_101.slots.default;
var __VLS_103 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    modelValue: (__VLS_ctx.codeForm.target),
    placeholder: (__VLS_ctx.codeType === 'email' ? '请输入邮箱地址' : '请输入手机号'),
    clearable: true,
}));
var __VLS_105 = __VLS_104.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.codeForm.target),
        placeholder: (__VLS_ctx.codeType === 'email' ? '请输入邮箱地址' : '请输入手机号'),
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_104), false));
// @ts-ignore
[codeForm, codeType,];
var __VLS_101;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
var __VLS_108 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "code",
}));
var __VLS_110 = __VLS_109.apply(void 0, __spreadArray([{
        prop: "code",
    }], __VLS_functionalComponentArgsRest(__VLS_109), false));
var __VLS_112 = __VLS_111.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "code-input-wrapper" }));
var __VLS_113 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.codeForm.code), placeholder: "请输入验证码" })));
var __VLS_115 = __VLS_114.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.codeForm.code), placeholder: "请输入验证码" })], __VLS_functionalComponentArgsRest(__VLS_114), false));
var __VLS_117;
var __VLS_118;
var __VLS_119 = ({ keyup: {} },
    { onKeyup: (__VLS_ctx.handleCodeLogin) });
// @ts-ignore
[codeForm, handleCodeLogin,];
var __VLS_116;
var __VLS_121 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.countdown > 0 || __VLS_ctx.sendingCode) })));
var __VLS_123 = __VLS_122.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.countdown > 0 || __VLS_ctx.sendingCode) })], __VLS_functionalComponentArgsRest(__VLS_122), false));
var __VLS_125;
var __VLS_126;
var __VLS_127 = ({ click: {} },
    { onClick: (__VLS_ctx.sendVerificationCode) });
var __VLS_128 = __VLS_124.slots.default;
// @ts-ignore
[countdown, sendingCode, sendVerificationCode,];
(__VLS_ctx.countdown > 0 ? "".concat(__VLS_ctx.countdown, "\u79D2\u540E\u91CD\u8BD5") : '获取验证码');
// @ts-ignore
[countdown, countdown,];
var __VLS_124;
var __VLS_111;
var __VLS_129 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "login-btn" })));
var __VLS_131 = __VLS_130.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading) }), { class: "login-btn" })], __VLS_functionalComponentArgsRest(__VLS_130), false));
var __VLS_133;
var __VLS_134;
var __VLS_135 = ({ click: {} },
    { onClick: (__VLS_ctx.handleCodeLogin) });
var __VLS_136 = __VLS_132.slots.default;
// @ts-ignore
[loading, handleCodeLogin,];
var __VLS_132;
var __VLS_79;
var __VLS_74;
var __VLS_11;
if (__VLS_ctx.showTip) {
    // @ts-ignore
    [showTip,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "success-tip" }));
    var __VLS_137 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137(__assign({ class: "tip-icon" })));
    var __VLS_139 = __VLS_138.apply(void 0, __spreadArray([__assign({ class: "tip-icon" })], __VLS_functionalComponentArgsRest(__VLS_138), false));
    var __VLS_141 = __VLS_140.slots.default;
    var __VLS_142 = {}.CircleCheck;
    /** @type {[typeof __VLS_components.CircleCheck, ]} */ ;
    // @ts-ignore
    icons_vue_1.CircleCheck;
    // @ts-ignore
    var __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({}));
    var __VLS_144 = __VLS_143.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_143), false));
    var __VLS_140;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.tipMessage);
    // @ts-ignore
    [tipMessage,];
}
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['login-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-link']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['code-type-radio']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['success-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tip-icon']} */ ;
// @ts-ignore
var __VLS_23 = __VLS_22, __VLS_81 = __VLS_80;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
