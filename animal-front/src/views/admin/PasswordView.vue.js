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
var user_1 = require("@/api/user");
var element_plus_1 = require("element-plus");
var formRef = (0, vue_1.ref)();
var form = (0, vue_1.reactive)({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
var validateConfirmPassword = function (rule, value, callback) {
    if (value !== form.newPassword) {
        callback(new Error('两次输入的密码不一致'));
    }
    else {
        callback();
    }
};
var rules = {
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
};
function handleSubmit() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!formRef.value)
                        return [2 /*return*/];
                    return [4 /*yield*/, formRef.value.validate(function (valid) { return __awaiter(_this, void 0, void 0, function () {
                            var error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!valid)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, (0, user_1.changePassword)({
                                                oldPassword: form.oldPassword,
                                                newPassword: form.newPassword
                                            })];
                                    case 2:
                                        _a.sent();
                                        element_plus_1.ElMessage.success('密码修改成功');
                                        handleReset();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        element_plus_1.ElMessage.error('密码修改失败');
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
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
function handleReset() {
    var _a;
    (_a = formRef.value) === null || _a === void 0 ? void 0 : _a.resetFields();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "password-view" }));
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
}
var __VLS_6 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
ElForm;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6(__assign({ ref: "formRef", model: (__VLS_ctx.form), rules: (__VLS_ctx.rules), labelWidth: "100px" }, { style: {} })));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ ref: "formRef", model: (__VLS_ctx.form), rules: (__VLS_ctx.rules), labelWidth: "100px" }, { style: {} })], __VLS_functionalComponentArgsRest(__VLS_7), false));
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
    label: "旧密码",
    prop: "oldPassword",
}));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([{
        label: "旧密码",
        prop: "oldPassword",
    }], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_17 = __VLS_16.slots.default;
var __VLS_18 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.form.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入旧密码",
}));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.oldPassword),
        type: "password",
        showPassword: true,
        placeholder: "请输入旧密码",
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
    label: "新密码",
    prop: "newPassword",
}));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{
        label: "新密码",
        prop: "newPassword",
    }], __VLS_functionalComponentArgsRest(__VLS_24), false));
var __VLS_27 = __VLS_26.slots.default;
var __VLS_28 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.newPassword),
        type: "password",
        showPassword: true,
        placeholder: "请输入新密码",
    }], __VLS_functionalComponentArgsRest(__VLS_29), false));
// @ts-ignore
[form,];
var __VLS_26;
var __VLS_33 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    label: "确认密码",
    prop: "confirmPassword",
}));
var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
        label: "确认密码",
        prop: "confirmPassword",
    }], __VLS_functionalComponentArgsRest(__VLS_34), false));
var __VLS_37 = __VLS_36.slots.default;
var __VLS_38 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
ElInput;
// @ts-ignore
var __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}));
var __VLS_40 = __VLS_39.apply(void 0, __spreadArray([{
        modelValue: (__VLS_ctx.form.confirmPassword),
        type: "password",
        showPassword: true,
        placeholder: "请再次输入新密码",
    }], __VLS_functionalComponentArgsRest(__VLS_39), false));
// @ts-ignore
[form,];
var __VLS_36;
var __VLS_43 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
ElFormItem;
// @ts-ignore
var __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({}));
var __VLS_45 = __VLS_44.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_44), false));
var __VLS_47 = __VLS_46.slots.default;
var __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48(__assign({ 'onClick': {} }, { type: "primary" })));
var __VLS_50 = __VLS_49.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_49), false));
var __VLS_52;
var __VLS_53;
var __VLS_54 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSubmit) });
var __VLS_55 = __VLS_51.slots.default;
// @ts-ignore
[handleSubmit,];
var __VLS_51;
var __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56(__assign({ 'onClick': {} })));
var __VLS_58 = __VLS_57.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_57), false));
var __VLS_60;
var __VLS_61;
var __VLS_62 = ({ click: {} },
    { onClick: (__VLS_ctx.handleReset) });
var __VLS_63 = __VLS_59.slots.default;
// @ts-ignore
[handleReset,];
var __VLS_59;
var __VLS_46;
var __VLS_9;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['password-view']} */ ;
// @ts-ignore
var __VLS_11 = __VLS_10;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
