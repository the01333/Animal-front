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
var registerFormRef = (0, vue_1.ref)();
var registerForm = (0, vue_1.reactive)({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});
var validatePassword = function (rule, value, callback) {
    if (value === '') {
        callback(new Error('请确认密码'));
    }
    else if (value !== registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
    }
    else {
        callback();
    }
};
var validateAgreeTerms = function (rule, value, callback) {
    if (!agreeTerms.value) {
        callback(new Error('请同意用户协议和隐私政策'));
    }
    else {
        callback();
    }
};
var rules = (0, vue_1.reactive)({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, validator: validatePassword, trigger: 'blur' }
    ],
    agreeTerms: [
        { validator: validateAgreeTerms, trigger: 'change' }
    ]
});
var agreeTerms = (0, vue_1.ref)(false);
var loading = (0, vue_1.ref)(false);
var router = (0, vue_router_1.useRouter)();
var handleRegister = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!registerFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, registerFormRef.value.validate(function (valid) {
                        if (valid) {
                            loading.value = true;
                            setTimeout(function () {
                                element_plus_1.ElMessage.success({
                                    message: '注册成功！请登录您的账户。',
                                    duration: 2000
                                });
                                loading.value = false;
                                router.push('/login');
                            }, 1000);
                        }
                        else {
                            element_plus_1.ElMessage.error('请填写完整的注册信息');
                        }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['register-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['register-container']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "register-container" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "register-wrapper" }));
var __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "register-card" }, { shadow: "always" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "register-card" }, { shadow: "always" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
{
    var __VLS_5 = __VLS_3.slots.header;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
    var __VLS_6 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    ElAvatar;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6(__assign({ size: (60) }, { class: "header-avatar" })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ size: (60) }, { class: "header-avatar" })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    var __VLS_10 = __VLS_9.slots.default;
    var __VLS_11 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({}));
    var __VLS_13 = __VLS_12.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_12), false));
    var __VLS_15 = __VLS_14.slots.default;
    var __VLS_16 = {}.UserFilled;
    /** @type {[typeof __VLS_components.UserFilled, ]} */ ;
    // @ts-ignore
    UserFilled;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_17), false));
    var __VLS_14;
    var __VLS_9;
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
var __VLS_21 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ref: "registerFormRef",
    model: (__VLS_ctx.registerForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    size: "large",
}));
var __VLS_23 = __VLS_22.apply(void 0, __spreadArray([{
        ref: "registerFormRef",
        model: (__VLS_ctx.registerForm),
        rules: (__VLS_ctx.rules),
        labelPosition: "top",
        size: "large",
    }], __VLS_functionalComponentArgsRest(__VLS_22), false));
/** @type {typeof __VLS_ctx.registerFormRef} */ ;
var __VLS_25 = {};
var __VLS_27 = __VLS_24.slots.default;
// @ts-ignore
[registerForm, rules, registerFormRef,];
var __VLS_28 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "用户名",
    prop: "username",
}));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
        label: "用户名",
        prop: "username",
    }], __VLS_functionalComponentArgsRest(__VLS_29), false));
var __VLS_32 = __VLS_31.slots.default;
var __VLS_33 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.registerForm.username),
    placeholder: "请输入用户名",
    prefixIcon: (__VLS_ctx.User),
    clearable: true,
}));
var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.registerForm.username),
        placeholder: "请输入用户名",
        prefixIcon: (__VLS_ctx.User),
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_34), false));
// @ts-ignore
[registerForm, icons_vue_1.User,];
var __VLS_31;
var __VLS_38 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    label: "邮箱",
    prop: "email",
}));
var __VLS_40 = __VLS_39.apply(void 0, __spreadArray([{
        label: "邮箱",
        prop: "email",
    }], __VLS_functionalComponentArgsRest(__VLS_39), false));
var __VLS_42 = __VLS_41.slots.default;
var __VLS_43 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.registerForm.email),
    type: "email",
    placeholder: "请输入邮箱",
    prefixIcon: (__VLS_ctx.Message),
    clearable: true,
}));
var __VLS_45 = __VLS_44.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.registerForm.email),
        type: "email",
        placeholder: "请输入邮箱",
        prefixIcon: (__VLS_ctx.Message),
        clearable: true,
    }], __VLS_functionalComponentArgsRest(__VLS_44), false));
// @ts-ignore
[registerForm, icons_vue_1.Message,];
var __VLS_41;
var __VLS_48 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "密码",
    prop: "password",
}));
var __VLS_50 = __VLS_49.apply(void 0, __spreadArray([{
        label: "密码",
        prop: "password",
    }], __VLS_functionalComponentArgsRest(__VLS_49), false));
var __VLS_52 = __VLS_51.slots.default;
var __VLS_53 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.registerForm.password),
    type: "password",
    placeholder: "请输入密码（至少6个字符）",
    prefixIcon: (__VLS_ctx.Lock),
    showPassword: true,
}));
var __VLS_55 = __VLS_54.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.registerForm.password),
        type: "password",
        placeholder: "请输入密码（至少6个字符）",
        prefixIcon: (__VLS_ctx.Lock),
        showPassword: true,
    }], __VLS_functionalComponentArgsRest(__VLS_54), false));
// @ts-ignore
[registerForm, icons_vue_1.Lock,];
var __VLS_51;
var __VLS_58 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    label: "确认密码",
    prop: "confirmPassword",
}));
var __VLS_60 = __VLS_59.apply(void 0, __spreadArray([{
        label: "确认密码",
        prop: "confirmPassword",
    }], __VLS_functionalComponentArgsRest(__VLS_59), false));
var __VLS_62 = __VLS_61.slots.default;
var __VLS_63 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.registerForm.confirmPassword), type: "password", placeholder: "请再次输入密码", prefixIcon: (__VLS_ctx.Lock), showPassword: true })));
var __VLS_65 = __VLS_64.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.registerForm.confirmPassword), type: "password", placeholder: "请再次输入密码", prefixIcon: (__VLS_ctx.Lock), showPassword: true })], __VLS_functionalComponentArgsRest(__VLS_64), false));
var __VLS_67;
var __VLS_68;
var __VLS_69 = ({ keyup: {} },
    { onKeyup: (__VLS_ctx.handleRegister) });
// @ts-ignore
[registerForm, icons_vue_1.Lock, handleRegister,];
var __VLS_66;
var __VLS_61;
var __VLS_71 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    prop: "agreeTerms",
}));
var __VLS_73 = __VLS_72.apply(void 0, __spreadArray([{
        prop: "agreeTerms",
    }], __VLS_functionalComponentArgsRest(__VLS_72), false));
var __VLS_75 = __VLS_74.slots.default;
var __VLS_76 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
ElCheckbox;
// @ts-ignore
var __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    modelValue: (__VLS_ctx.agreeTerms),
}));
var __VLS_78 = __VLS_77.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.agreeTerms),
    }], __VLS_functionalComponentArgsRest(__VLS_77), false));
var __VLS_80 = __VLS_79.slots.default;
// @ts-ignore
[agreeTerms,];
var __VLS_81 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    type: "primary",
    underline: (false),
}));
var __VLS_83 = __VLS_82.apply(void 0, __spreadArray([{
        type: "primary",
        underline: (false),
    }], __VLS_functionalComponentArgsRest(__VLS_82), false));
var __VLS_85 = __VLS_84.slots.default;
var __VLS_84;
var __VLS_86 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    type: "primary",
    underline: (false),
}));
var __VLS_88 = __VLS_87.apply(void 0, __spreadArray([{
        type: "primary",
        underline: (false),
    }], __VLS_functionalComponentArgsRest(__VLS_87), false));
var __VLS_90 = __VLS_89.slots.default;
var __VLS_89;
var __VLS_79;
var __VLS_74;
var __VLS_91 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({}));
var __VLS_93 = __VLS_92.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_92), false));
var __VLS_95 = __VLS_94.slots.default;
var __VLS_96 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading), icon: (__VLS_ctx.CirclePlus) }), { class: "register-btn" })));
var __VLS_98 = __VLS_97.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loading), icon: (__VLS_ctx.CirclePlus) }), { class: "register-btn" })], __VLS_functionalComponentArgsRest(__VLS_97), false));
var __VLS_100;
var __VLS_101;
var __VLS_102 = ({ click: {} },
    { onClick: (__VLS_ctx.handleRegister) });
var __VLS_103 = __VLS_99.slots.default;
// @ts-ignore
[handleRegister, loading, icons_vue_1.CirclePlus,];
(__VLS_ctx.loading ? '注册中...' : '注册');
// @ts-ignore
[loading,];
var __VLS_99;
var __VLS_94;
var __VLS_24;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "login-link" }));
var __VLS_104 = {}.ElText;
/** @type {[typeof __VLS_components.ElText, typeof __VLS_components.elText, typeof __VLS_components.ElText, typeof __VLS_components.elText, ]} */ ;
// @ts-ignore
ElText;
// @ts-ignore
var __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
var __VLS_106 = __VLS_105.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_105), false));
var __VLS_108 = __VLS_107.slots.default;
var __VLS_107;
var __VLS_109 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
ElLink;
// @ts-ignore
var __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109(__assign({ 'onClick': {} }, { type: "primary", underline: (false) })));
var __VLS_111 = __VLS_110.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", underline: (false) })], __VLS_functionalComponentArgsRest(__VLS_110), false));
var __VLS_113;
var __VLS_114;
var __VLS_115 = ({ click: {} },
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
var __VLS_116 = __VLS_112.slots.default;
var __VLS_112;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['register-container']} */ ;
/** @type {__VLS_StyleScopedClasses['register-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['register-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-link']} */ ;
// @ts-ignore
var __VLS_26 = __VLS_25;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
