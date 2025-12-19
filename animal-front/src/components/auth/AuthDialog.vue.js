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
var user_1 = require("@/stores/user");
var user_2 = require("@/api/user");
defineOptions({
    name: 'AuthDialog'
});
var props = defineProps();
var emit = defineEmits(['update:modelValue', 'login-success', 'register-success']);
var dialogVisible = (0, vue_1.computed)({
    get: function () { return props.modelValue; },
    set: function (value) { return emit('update:modelValue', value); }
});
var router = (0, vue_router_1.useRouter)();
var activeTab = (0, vue_1.ref)(props.defaultTab || 'login');
// 当前登录/注册方式
var loginMethod = (0, vue_1.ref)('phone');
var registerMethod = (0, vue_1.ref)('phone');
// 登录表单 - 手机
var loginPhoneFormRef = (0, vue_1.ref)();
var loginPhoneForm = (0, vue_1.reactive)({
    phone: '',
    code: ''
});
var loginPhoneRules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ]
};
// 登录表单 - 邮箱
var loginEmailFormRef = (0, vue_1.ref)();
var loginEmailForm = (0, vue_1.reactive)({
    email: '',
    code: ''
});
var loginEmailRules = {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ]
};
// 登录表单 - 账号密码
var loginPasswordFormRef = (0, vue_1.ref)();
var loginPasswordForm = (0, vue_1.reactive)({
    username: '',
    password: ''
});
var loginPasswordRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名长度至少3个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
    ]
};
// 注册表单 - 手机
var registerPhoneFormRef = (0, vue_1.ref)();
var registerPhoneForm = (0, vue_1.reactive)({
    phone: '',
    code: '',
    agree: false
});
var validatePhoneAgree = function (rule, value, callback) {
    if (!registerPhoneForm.agree) {
        callback(new Error('请同意用户协议和隐私政策'));
    }
    else {
        callback();
    }
};
var registerPhoneRules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ],
    agree: [
        { validator: validatePhoneAgree, trigger: 'change' }
    ]
};
// 注册表单 - 邮箱
var registerEmailFormRef = (0, vue_1.ref)();
var registerEmailForm = (0, vue_1.reactive)({
    email: '',
    code: '',
    agree: false
});
var validateEmailAgree = function (rule, value, callback) {
    if (!registerEmailForm.agree) {
        callback(new Error('请同意用户协议和隐私政策'));
    }
    else {
        callback();
    }
};
var registerEmailRules = {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码为6位数字', trigger: 'blur' }
    ],
    agree: [
        { validator: validateEmailAgree, trigger: 'change' }
    ]
};
// 倒计时
var loginCountdown = (0, vue_1.ref)(0);
var loginTimer = null;
var registerCountdown = (0, vue_1.ref)(0);
var registerTimer = null;
// 验证码发送中标记，防止接口返回前重复点击
var loginCodeSending = (0, vue_1.ref)(false);
var registerCodeSending = (0, vue_1.ref)(false);
var loginLoading = (0, vue_1.ref)(false);
var registerLoading = (0, vue_1.ref)(false);
var userStore = (0, user_1.useUserStore)();
var setLoginState = function (token, userInfo) {
    userStore.token = token;
    userStore.userInfo = userInfo;
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
};
var startLoginCountdown = function () {
    loginCountdown.value = 60;
    if (loginTimer)
        clearInterval(loginTimer);
    loginTimer = window.setInterval(function () {
        loginCountdown.value--;
        if (loginCountdown.value <= 0 && loginTimer) {
            clearInterval(loginTimer);
            loginTimer = null;
        }
    }, 1000);
};
var startRegisterCountdown = function () {
    registerCountdown.value = 60;
    if (registerTimer)
        clearInterval(registerTimer);
    registerTimer = window.setInterval(function () {
        registerCountdown.value--;
        if (registerCountdown.value <= 0 && registerTimer) {
            clearInterval(registerTimer);
            registerTimer = null;
        }
    }, 1000);
};
// 发送登录验证码
var sendLoginCode = function (type) { return __awaiter(void 0, void 0, void 0, function () {
    var res, res, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (loginCountdown.value > 0 || loginCodeSending.value) {
                    return [2 /*return*/];
                }
                // 先校验输入是否完整
                if (type === 'phone') {
                    if (!loginPhoneForm.phone) {
                        element_plus_1.ElMessage.warning('请先输入手机号');
                        return [2 /*return*/];
                    }
                }
                else {
                    if (!loginEmailForm.email) {
                        element_plus_1.ElMessage.warning('请先输入邮箱');
                        return [2 /*return*/];
                    }
                }
                loginCodeSending.value = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, 7, 8]);
                if (!(type === 'phone')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, user_2.sendPhoneVerificationCode)(loginPhoneForm.phone, 'login')];
            case 2:
                res = _c.sent();
                if (res.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startLoginCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(res.message || '发送验证码失败');
                }
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, user_2.sendEmailVerificationCode)(loginEmailForm.email, 'login')];
            case 4:
                res = _c.sent();
                if (res.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startLoginCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(res.message || '发送验证码失败');
                }
                _c.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                error_1 = _c.sent();
                element_plus_1.ElMessage.error(((_b = (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '发送验证码失败');
                return [3 /*break*/, 8];
            case 7:
                loginCodeSending.value = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
// 发送注册验证码（本质上也是登录验证码，后端会自动完成首次注册）
var sendRegisterCode = function (type) { return __awaiter(void 0, void 0, void 0, function () {
    var res, res, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (registerCountdown.value > 0 || registerCodeSending.value) {
                    return [2 /*return*/];
                }
                // 先校验输入是否完整
                if (type === 'phone') {
                    if (!registerPhoneForm.phone) {
                        element_plus_1.ElMessage.warning('请先输入手机号');
                        return [2 /*return*/];
                    }
                    registerCodeSending.value = true;
                }
                else {
                    if (!registerEmailForm.email) {
                        element_plus_1.ElMessage.warning('请先输入邮箱');
                        return [2 /*return*/];
                    }
                    registerCodeSending.value = true;
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, 7, 8]);
                if (!(type === 'phone')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, user_2.sendPhoneVerificationCode)(registerPhoneForm.phone, 'login')];
            case 2:
                res = _c.sent();
                if (res.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startRegisterCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(res.message || '发送验证码失败');
                }
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, user_2.sendEmailVerificationCode)(registerEmailForm.email, 'login')];
            case 4:
                res = _c.sent();
                if (res.code === 200) {
                    element_plus_1.ElMessage.success('验证码已发送');
                    startRegisterCountdown();
                }
                else {
                    element_plus_1.ElMessage.error(res.message || '发送验证码失败');
                }
                _c.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                error_2 = _c.sent();
                element_plus_1.ElMessage.error(((_b = (_a = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '发送验证码失败');
                return [3 /*break*/, 8];
            case 7:
                registerCodeSending.value = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
// 登录（验证码）
var handleLoginByCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loginLoading.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, 7, 8]);
                if (!(loginMethod.value === 'phone')) return [3 /*break*/, 3];
                if (!loginPhoneFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, loginPhoneFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!valid) {
                                        element_plus_1.ElMessage.error('请完整填写手机号和验证码');
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, (0, user_2.loginByPhoneCode)(loginPhoneForm.phone, loginPhoneForm.code)];
                                case 1:
                                    res = _a.sent();
                                    if (res.code === 200) {
                                        setLoginState(res.data.token, res.data.userInfo);
                                        element_plus_1.ElMessage.success({ message: '登录成功！', duration: 1500 });
                                        setTimeout(function () {
                                            dialogVisible.value = false;
                                            emit('login-success');
                                        }, 300);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                if (!loginEmailFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, loginEmailFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!valid) {
                                        element_plus_1.ElMessage.error('请完整填写邮箱和验证码');
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, (0, user_2.loginByEmailCode)(loginEmailForm.email, loginEmailForm.code)];
                                case 1:
                                    res = _a.sent();
                                    if (res.code === 200) {
                                        setLoginState(res.data.token, res.data.userInfo);
                                        element_plus_1.ElMessage.success({ message: '登录成功！', duration: 1500 });
                                        setTimeout(function () {
                                            dialogVisible.value = false;
                                            emit('login-success');
                                        }, 300);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                error_3 = _a.sent();
                console.error('登录失败:', error_3);
                return [3 /*break*/, 8];
            case 7:
                loginLoading.value = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
// 登录（账号密码）
var handleLoginByPassword = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loginLoading.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                if (!loginPasswordFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, loginPasswordFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!valid) {
                                        element_plus_1.ElMessage.error('请完整填写用户名和密码');
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, (0, user_2.login)({
                                            username: loginPasswordForm.username,
                                            password: loginPasswordForm.password
                                        })];
                                case 1:
                                    res = _a.sent();
                                    if (res.code === 200) {
                                        setLoginState(res.data.token, res.data.user || res.data.userInfo);
                                        element_plus_1.ElMessage.success({ message: '登录成功！', duration: 1500 });
                                        setTimeout(function () {
                                            dialogVisible.value = false;
                                            emit('login-success');
                                        }, 300);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_4 = _a.sent();
                console.error('登录失败:', error_4);
                return [3 /*break*/, 5];
            case 4:
                loginLoading.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 跳转到重置密码页面
var goToResetPassword = function () {
    dialogVisible.value = false;
    router.push('/reset-password');
};
// 注册（验证码，首次登录自动注册）
var handleRegisterByCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                registerLoading.value = true;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, 7, 8]);
                if (!(registerMethod.value === 'phone')) return [3 /*break*/, 3];
                if (!registerPhoneFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, registerPhoneFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!valid) {
                                        element_plus_1.ElMessage.error('请完整填写手机号和验证码，并勾选同意协议');
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, (0, user_2.loginByPhoneCode)(registerPhoneForm.phone, registerPhoneForm.code)];
                                case 1:
                                    res = _a.sent();
                                    if (res.code === 200) {
                                        setLoginState(res.data.token, res.data.userInfo);
                                        element_plus_1.ElMessage.success({ message: '注册并登录成功！', duration: 1800 });
                                        emit('register-success');
                                        setTimeout(function () {
                                            dialogVisible.value = false;
                                        }, 300);
                                    }
                                    else {
                                        element_plus_1.ElMessage.error(res.message || '注册失败');
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _c.sent();
                return [3 /*break*/, 5];
            case 3:
                if (!registerEmailFormRef.value)
                    return [2 /*return*/];
                return [4 /*yield*/, registerEmailFormRef.value.validate(function (valid) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!valid) {
                                        element_plus_1.ElMessage.error('请完整填写邮箱和验证码，并勾选同意协议');
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, (0, user_2.loginByEmailCode)(registerEmailForm.email, registerEmailForm.code)];
                                case 1:
                                    res = _a.sent();
                                    if (res.code === 200) {
                                        setLoginState(res.data.token, res.data.userInfo);
                                        element_plus_1.ElMessage.success({ message: '注册并登录成功！', duration: 1800 });
                                        emit('register-success');
                                        setTimeout(function () {
                                            dialogVisible.value = false;
                                        }, 300);
                                    }
                                    else {
                                        element_plus_1.ElMessage.error(res.message || '注册失败');
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                error_5 = _c.sent();
                element_plus_1.ElMessage.error(((_b = (_a = error_5 === null || error_5 === void 0 ? void 0 : error_5.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '注册失败，请稍后重试');
                return [3 /*break*/, 8];
            case 7:
                registerLoading.value = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
// 切换到注册
var resetLoginForms = function () {
    loginPhoneForm.phone = '';
    loginPhoneForm.code = '';
    loginEmailForm.email = '';
    loginEmailForm.code = '';
    loginPasswordForm.username = '';
    loginPasswordForm.password = '';
    loginCountdown.value = 0;
    if (loginTimer) {
        clearInterval(loginTimer);
        loginTimer = null;
    }
};
var resetRegisterForms = function () {
    registerPhoneForm.phone = '';
    registerPhoneForm.code = '';
    registerPhoneForm.agree = false;
    registerEmailForm.email = '';
    registerEmailForm.code = '';
    registerEmailForm.agree = false;
    registerCountdown.value = 0;
    if (registerTimer) {
        clearInterval(registerTimer);
        registerTimer = null;
    }
};
var switchToRegister = function () {
    activeTab.value = 'register';
    registerMethod.value = 'phone';
    resetLoginForms();
};
// 切换到登录
var switchToLogin = function () {
    activeTab.value = 'login';
    loginMethod.value = 'phone';
    resetRegisterForms();
};
// 监听对话框关闭，重置表单
(0, vue_1.watch)(dialogVisible, function (newVal) {
    if (!newVal) {
        resetLoginForms();
        resetRegisterForms();
        activeTab.value = props.defaultTab || 'login';
        loginMethod.value = 'phone';
        registerMethod.value = 'phone';
    }
});
(0, vue_1.watch)(registerMethod, function () {
    registerPhoneForm.agree = false;
    registerEmailForm.agree = false;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['auth-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['el-link']} */ ;
/** @type {__VLS_StyleScopedClasses['method-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['method-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-link']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__content']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tabs__item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['el-checkbox__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['el-checkbox__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-dialog-content']} */ ;
/** @type {__VLS_StyleScopedClasses['el-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['el-link']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-checkbox__input']} */ ;
/** @type {__VLS_StyleScopedClasses['is-checked']} */ ;
/** @type {__VLS_StyleScopedClasses['el-checkbox__label']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-text']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-dialog-content']} */ ;
/** @type {__VLS_StyleScopedClasses['el-form-item__content']} */ ;
/** @type {__VLS_StyleScopedClasses['el-form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['el-dialog__body']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-title']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button']} */ ;
var __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
ElDialog;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ modelValue: (__VLS_ctx.dialogVisible), title: (null), width: "480", closeOnClickModal: (false), alignCenter: true, destroyOnClose: true, appendToBody: true }, { class: "auth-dialog" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.dialogVisible), title: (null), width: "480", closeOnClickModal: (false), alignCenter: true, destroyOnClose: true, appendToBody: true }, { class: "auth-dialog" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = {};
var __VLS_5 = __VLS_3.slots.default;
// @ts-ignore
[dialogVisible,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "auth-dialog-content" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "dialog-header" }));
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)(__assign({ class: "dialog-title" }));
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "dialog-subtitle" }));
if (__VLS_ctx.activeTab === 'login') {
    // @ts-ignore
    [activeTab,];
    var __VLS_6 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    ElLink;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6(__assign({ 'onClick': {} }, { type: "primary", underline: (false) })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", underline: (false) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    var __VLS_10 = void 0;
    var __VLS_11 = void 0;
    var __VLS_12 = ({ click: {} },
        { onClick: (__VLS_ctx.switchToRegister) });
    var __VLS_13 = __VLS_9.slots.default;
    // @ts-ignore
    [switchToRegister,];
    var __VLS_9;
}
else {
    var __VLS_14 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    ElLink;
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14(__assign({ 'onClick': {} }, { type: "primary", underline: (false) })));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", underline: (false) })], __VLS_functionalComponentArgsRest(__VLS_15), false));
    var __VLS_18 = void 0;
    var __VLS_19 = void 0;
    var __VLS_20 = ({ click: {} },
        { onClick: (__VLS_ctx.switchToLogin) });
    var __VLS_21 = __VLS_17.slots.default;
    // @ts-ignore
    [switchToLogin,];
    var __VLS_17;
}
if (__VLS_ctx.activeTab === 'login') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-container" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-inner" }));
    var __VLS_22 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    ElTabs;
    // @ts-ignore
    var __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22(__assign({ modelValue: (__VLS_ctx.loginMethod) }, { class: "method-tabs" })));
    var __VLS_24 = __VLS_23.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.loginMethod) }, { class: "method-tabs" })], __VLS_functionalComponentArgsRest(__VLS_23), false));
    var __VLS_26 = __VLS_25.slots.default;
    // @ts-ignore
    [loginMethod,];
    var __VLS_27 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
        label: "手机号登录",
        name: "phone",
    }));
    var __VLS_29 = __VLS_28.apply(void 0, __spreadArray([{
            label: "手机号登录",
            name: "phone",
        }], __VLS_functionalComponentArgsRest(__VLS_28), false));
    var __VLS_31 = __VLS_30.slots.default;
    var __VLS_32 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    ElForm;
    // @ts-ignore
    var __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ref: "loginPhoneFormRef",
        model: (__VLS_ctx.loginPhoneForm),
        rules: (__VLS_ctx.loginPhoneRules),
        size: "large",
    }));
    var __VLS_34 = __VLS_33.apply(void 0, __spreadArray([{
            ref: "loginPhoneFormRef",
            model: (__VLS_ctx.loginPhoneForm),
            rules: (__VLS_ctx.loginPhoneRules),
            size: "large",
        }], __VLS_functionalComponentArgsRest(__VLS_33), false));
    /** @type {typeof __VLS_ctx.loginPhoneFormRef} */ ;
    var __VLS_36 = {};
    var __VLS_38 = __VLS_35.slots.default;
    // @ts-ignore
    [loginPhoneForm, loginPhoneRules, loginPhoneFormRef,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_39 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        prop: "phone",
    }));
    var __VLS_41 = __VLS_40.apply(void 0, __spreadArray([{
            prop: "phone",
        }], __VLS_functionalComponentArgsRest(__VLS_40), false));
    var __VLS_43 = __VLS_42.slots.default;
    var __VLS_44 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        modelValue: (__VLS_ctx.loginPhoneForm.phone),
        placeholder: "请输入手机号",
        clearable: true,
    }));
    var __VLS_46 = __VLS_45.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.loginPhoneForm.phone),
            placeholder: "请输入手机号",
            clearable: true,
        }], __VLS_functionalComponentArgsRest(__VLS_45), false));
    // @ts-ignore
    [loginPhoneForm,];
    var __VLS_42;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_49 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        prop: "code",
    }));
    var __VLS_51 = __VLS_50.apply(void 0, __spreadArray([{
            prop: "code",
        }], __VLS_functionalComponentArgsRest(__VLS_50), false));
    var __VLS_53 = __VLS_52.slots.default;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "code-input-wrapper" }));
    var __VLS_54 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.loginPhoneForm.code), placeholder: "请输入验证码" })));
    var __VLS_56 = __VLS_55.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.loginPhoneForm.code), placeholder: "请输入验证码" })], __VLS_functionalComponentArgsRest(__VLS_55), false));
    var __VLS_58 = void 0;
    var __VLS_59 = void 0;
    var __VLS_60 = ({ keyup: {} },
        { onKeyup: (__VLS_ctx.handleLoginByCode) });
    // @ts-ignore
    [loginPhoneForm, handleLoginByCode,];
    var __VLS_57;
    var __VLS_62 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.loginCountdown > 0 || __VLS_ctx.loginCodeSending) })));
    var __VLS_64 = __VLS_63.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.loginCountdown > 0 || __VLS_ctx.loginCodeSending) })], __VLS_functionalComponentArgsRest(__VLS_63), false));
    var __VLS_66 = void 0;
    var __VLS_67 = void 0;
    var __VLS_68 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'login'))
                    return;
                __VLS_ctx.sendLoginCode('phone');
                // @ts-ignore
                [loginCountdown, loginCodeSending, sendLoginCode,];
            } });
    var __VLS_69 = __VLS_65.slots.default;
    (__VLS_ctx.loginCountdown > 0 ? "".concat(__VLS_ctx.loginCountdown, "\u79D2\u540E\u91CD\u8BD5") : '获取验证码');
    // @ts-ignore
    [loginCountdown, loginCountdown,];
    var __VLS_65;
    var __VLS_52;
    var __VLS_70 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loginLoading) }), { class: "submit-btn" })));
    var __VLS_72 = __VLS_71.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loginLoading) }), { class: "submit-btn" })], __VLS_functionalComponentArgsRest(__VLS_71), false));
    var __VLS_74 = void 0;
    var __VLS_75 = void 0;
    var __VLS_76 = ({ click: {} },
        { onClick: (__VLS_ctx.handleLoginByCode) });
    var __VLS_77 = __VLS_73.slots.default;
    // @ts-ignore
    [handleLoginByCode, loginLoading,];
    var __VLS_73;
    var __VLS_35;
    var __VLS_30;
    var __VLS_78 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        label: "邮箱登录",
        name: "email",
    }));
    var __VLS_80 = __VLS_79.apply(void 0, __spreadArray([{
            label: "邮箱登录",
            name: "email",
        }], __VLS_functionalComponentArgsRest(__VLS_79), false));
    var __VLS_82 = __VLS_81.slots.default;
    var __VLS_83 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    ElForm;
    // @ts-ignore
    var __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        ref: "loginEmailFormRef",
        model: (__VLS_ctx.loginEmailForm),
        rules: (__VLS_ctx.loginEmailRules),
        size: "large",
    }));
    var __VLS_85 = __VLS_84.apply(void 0, __spreadArray([{
            ref: "loginEmailFormRef",
            model: (__VLS_ctx.loginEmailForm),
            rules: (__VLS_ctx.loginEmailRules),
            size: "large",
        }], __VLS_functionalComponentArgsRest(__VLS_84), false));
    /** @type {typeof __VLS_ctx.loginEmailFormRef} */ ;
    var __VLS_87 = {};
    var __VLS_89 = __VLS_86.slots.default;
    // @ts-ignore
    [loginEmailForm, loginEmailRules, loginEmailFormRef,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_90 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        prop: "email",
    }));
    var __VLS_92 = __VLS_91.apply(void 0, __spreadArray([{
            prop: "email",
        }], __VLS_functionalComponentArgsRest(__VLS_91), false));
    var __VLS_94 = __VLS_93.slots.default;
    var __VLS_95 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        modelValue: (__VLS_ctx.loginEmailForm.email),
        placeholder: "请输入邮箱地址",
        clearable: true,
    }));
    var __VLS_97 = __VLS_96.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.loginEmailForm.email),
            placeholder: "请输入邮箱地址",
            clearable: true,
        }], __VLS_functionalComponentArgsRest(__VLS_96), false));
    // @ts-ignore
    [loginEmailForm,];
    var __VLS_93;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_100 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        prop: "code",
    }));
    var __VLS_102 = __VLS_101.apply(void 0, __spreadArray([{
            prop: "code",
        }], __VLS_functionalComponentArgsRest(__VLS_101), false));
    var __VLS_104 = __VLS_103.slots.default;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "code-input-wrapper" }));
    var __VLS_105 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.loginEmailForm.code), placeholder: "请输入验证码" })));
    var __VLS_107 = __VLS_106.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.loginEmailForm.code), placeholder: "请输入验证码" })], __VLS_functionalComponentArgsRest(__VLS_106), false));
    var __VLS_109 = void 0;
    var __VLS_110 = void 0;
    var __VLS_111 = ({ keyup: {} },
        { onKeyup: (__VLS_ctx.handleLoginByCode) });
    // @ts-ignore
    [handleLoginByCode, loginEmailForm,];
    var __VLS_108;
    var __VLS_113 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.loginCountdown > 0 || __VLS_ctx.loginCodeSending) })));
    var __VLS_115 = __VLS_114.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.loginCountdown > 0 || __VLS_ctx.loginCodeSending) })], __VLS_functionalComponentArgsRest(__VLS_114), false));
    var __VLS_117 = void 0;
    var __VLS_118 = void 0;
    var __VLS_119 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'login'))
                    return;
                __VLS_ctx.sendLoginCode('email');
                // @ts-ignore
                [loginCountdown, loginCodeSending, sendLoginCode,];
            } });
    var __VLS_120 = __VLS_116.slots.default;
    (__VLS_ctx.loginCountdown > 0 ? "".concat(__VLS_ctx.loginCountdown, "\u79D2\u540E\u91CD\u8BD5") : '获取验证码');
    // @ts-ignore
    [loginCountdown, loginCountdown,];
    var __VLS_116;
    var __VLS_103;
    var __VLS_121 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loginLoading) }), { class: "submit-btn" })));
    var __VLS_123 = __VLS_122.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loginLoading) }), { class: "submit-btn" })], __VLS_functionalComponentArgsRest(__VLS_122), false));
    var __VLS_125 = void 0;
    var __VLS_126 = void 0;
    var __VLS_127 = ({ click: {} },
        { onClick: (__VLS_ctx.handleLoginByCode) });
    var __VLS_128 = __VLS_124.slots.default;
    // @ts-ignore
    [handleLoginByCode, loginLoading,];
    var __VLS_124;
    var __VLS_86;
    var __VLS_81;
    var __VLS_129 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
        label: "密码登录",
        name: "password",
    }));
    var __VLS_131 = __VLS_130.apply(void 0, __spreadArray([{
            label: "密码登录",
            name: "password",
        }], __VLS_functionalComponentArgsRest(__VLS_130), false));
    var __VLS_133 = __VLS_132.slots.default;
    var __VLS_134 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    ElForm;
    // @ts-ignore
    var __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
        ref: "loginPasswordFormRef",
        model: (__VLS_ctx.loginPasswordForm),
        rules: (__VLS_ctx.loginPasswordRules),
        size: "large",
    }));
    var __VLS_136 = __VLS_135.apply(void 0, __spreadArray([{
            ref: "loginPasswordFormRef",
            model: (__VLS_ctx.loginPasswordForm),
            rules: (__VLS_ctx.loginPasswordRules),
            size: "large",
        }], __VLS_functionalComponentArgsRest(__VLS_135), false));
    /** @type {typeof __VLS_ctx.loginPasswordFormRef} */ ;
    var __VLS_138 = {};
    var __VLS_140 = __VLS_137.slots.default;
    // @ts-ignore
    [loginPasswordForm, loginPasswordRules, loginPasswordFormRef,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_141 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
        prop: "username",
    }));
    var __VLS_143 = __VLS_142.apply(void 0, __spreadArray([{
            prop: "username",
        }], __VLS_functionalComponentArgsRest(__VLS_142), false));
    var __VLS_145 = __VLS_144.slots.default;
    var __VLS_146 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
        modelValue: (__VLS_ctx.loginPasswordForm.username),
        placeholder: "请输入用户名",
        clearable: true,
    }));
    var __VLS_148 = __VLS_147.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.loginPasswordForm.username),
            placeholder: "请输入用户名",
            clearable: true,
        }], __VLS_functionalComponentArgsRest(__VLS_147), false));
    // @ts-ignore
    [loginPasswordForm,];
    var __VLS_144;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    var __VLS_151 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    ElLink;
    // @ts-ignore
    var __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151(__assign(__assign({ 'onClick': {} }, { type: "primary", underline: (false) }), { class: "forgot-link" })));
    var __VLS_153 = __VLS_152.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", underline: (false) }), { class: "forgot-link" })], __VLS_functionalComponentArgsRest(__VLS_152), false));
    var __VLS_155 = void 0;
    var __VLS_156 = void 0;
    var __VLS_157 = ({ click: {} },
        { onClick: (__VLS_ctx.goToResetPassword) });
    var __VLS_158 = __VLS_154.slots.default;
    // @ts-ignore
    [goToResetPassword,];
    var __VLS_154;
    var __VLS_159 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
        prop: "password",
    }));
    var __VLS_161 = __VLS_160.apply(void 0, __spreadArray([{
            prop: "password",
        }], __VLS_functionalComponentArgsRest(__VLS_160), false));
    var __VLS_163 = __VLS_162.slots.default;
    var __VLS_164 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.loginPasswordForm.password), type: "password", placeholder: "请输入密码", showPassword: true })));
    var __VLS_166 = __VLS_165.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.loginPasswordForm.password), type: "password", placeholder: "请输入密码", showPassword: true })], __VLS_functionalComponentArgsRest(__VLS_165), false));
    var __VLS_168 = void 0;
    var __VLS_169 = void 0;
    var __VLS_170 = ({ keyup: {} },
        { onKeyup: (__VLS_ctx.handleLoginByPassword) });
    // @ts-ignore
    [loginPasswordForm, handleLoginByPassword,];
    var __VLS_167;
    var __VLS_162;
    var __VLS_172 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loginLoading) }), { class: "submit-btn" })));
    var __VLS_174 = __VLS_173.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.loginLoading) }), { class: "submit-btn" })], __VLS_functionalComponentArgsRest(__VLS_173), false));
    var __VLS_176 = void 0;
    var __VLS_177 = void 0;
    var __VLS_178 = ({ click: {} },
        { onClick: (__VLS_ctx.handleLoginByPassword) });
    var __VLS_179 = __VLS_175.slots.default;
    // @ts-ignore
    [loginLoading, handleLoginByPassword,];
    var __VLS_175;
    var __VLS_137;
    var __VLS_132;
    var __VLS_25;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-container" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-inner" }));
    var __VLS_180 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    ElTabs;
    // @ts-ignore
    var __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180(__assign({ modelValue: (__VLS_ctx.registerMethod) }, { class: "method-tabs" })));
    var __VLS_182 = __VLS_181.apply(void 0, __spreadArray([__assign({ modelValue: (__VLS_ctx.registerMethod) }, { class: "method-tabs" })], __VLS_functionalComponentArgsRest(__VLS_181), false));
    var __VLS_184 = __VLS_183.slots.default;
    // @ts-ignore
    [registerMethod,];
    var __VLS_185 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
        label: "手机注册",
        name: "phone",
    }));
    var __VLS_187 = __VLS_186.apply(void 0, __spreadArray([{
            label: "手机注册",
            name: "phone",
        }], __VLS_functionalComponentArgsRest(__VLS_186), false));
    var __VLS_189 = __VLS_188.slots.default;
    var __VLS_190 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    ElForm;
    // @ts-ignore
    var __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
        ref: "registerPhoneFormRef",
        model: (__VLS_ctx.registerPhoneForm),
        rules: (__VLS_ctx.registerPhoneRules),
        size: "large",
    }));
    var __VLS_192 = __VLS_191.apply(void 0, __spreadArray([{
            ref: "registerPhoneFormRef",
            model: (__VLS_ctx.registerPhoneForm),
            rules: (__VLS_ctx.registerPhoneRules),
            size: "large",
        }], __VLS_functionalComponentArgsRest(__VLS_191), false));
    /** @type {typeof __VLS_ctx.registerPhoneFormRef} */ ;
    var __VLS_194 = {};
    var __VLS_196 = __VLS_193.slots.default;
    // @ts-ignore
    [registerPhoneForm, registerPhoneRules, registerPhoneFormRef,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_197 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
        prop: "phone",
    }));
    var __VLS_199 = __VLS_198.apply(void 0, __spreadArray([{
            prop: "phone",
        }], __VLS_functionalComponentArgsRest(__VLS_198), false));
    var __VLS_201 = __VLS_200.slots.default;
    var __VLS_202 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
        modelValue: (__VLS_ctx.registerPhoneForm.phone),
        placeholder: "请输入手机号",
        clearable: true,
    }));
    var __VLS_204 = __VLS_203.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.registerPhoneForm.phone),
            placeholder: "请输入手机号",
            clearable: true,
        }], __VLS_functionalComponentArgsRest(__VLS_203), false));
    // @ts-ignore
    [registerPhoneForm,];
    var __VLS_200;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_207 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
        prop: "code",
    }));
    var __VLS_209 = __VLS_208.apply(void 0, __spreadArray([{
            prop: "code",
        }], __VLS_functionalComponentArgsRest(__VLS_208), false));
    var __VLS_211 = __VLS_210.slots.default;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "code-input-wrapper" }));
    var __VLS_212 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.registerPhoneForm.code), placeholder: "请输入验证码" })));
    var __VLS_214 = __VLS_213.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.registerPhoneForm.code), placeholder: "请输入验证码" })], __VLS_functionalComponentArgsRest(__VLS_213), false));
    var __VLS_216 = void 0;
    var __VLS_217 = void 0;
    var __VLS_218 = ({ keyup: {} },
        { onKeyup: (__VLS_ctx.handleRegisterByCode) });
    // @ts-ignore
    [registerPhoneForm, handleRegisterByCode,];
    var __VLS_215;
    var __VLS_220 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.registerCountdown > 0 || __VLS_ctx.registerCodeSending) })));
    var __VLS_222 = __VLS_221.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.registerCountdown > 0 || __VLS_ctx.registerCodeSending) })], __VLS_functionalComponentArgsRest(__VLS_221), false));
    var __VLS_224 = void 0;
    var __VLS_225 = void 0;
    var __VLS_226 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.activeTab === 'login'))
                    return;
                __VLS_ctx.sendRegisterCode('phone');
                // @ts-ignore
                [registerCountdown, registerCodeSending, sendRegisterCode,];
            } });
    var __VLS_227 = __VLS_223.slots.default;
    (__VLS_ctx.registerCountdown > 0 ? "".concat(__VLS_ctx.registerCountdown, "\u79D2\u540E\u91CD\u8BD5") : '获取验证码');
    // @ts-ignore
    [registerCountdown, registerCountdown,];
    var __VLS_223;
    var __VLS_210;
    var __VLS_228 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228(__assign({ prop: "agree" }, { class: "agreement-item agreement-item-phone" })));
    var __VLS_230 = __VLS_229.apply(void 0, __spreadArray([__assign({ prop: "agree" }, { class: "agreement-item agreement-item-phone" })], __VLS_functionalComponentArgsRest(__VLS_229), false));
    var __VLS_232 = __VLS_231.slots.default;
    var __VLS_233 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    ElCheckbox;
    // @ts-ignore
    var __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
        modelValue: (__VLS_ctx.registerPhoneForm.agree),
    }));
    var __VLS_235 = __VLS_234.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.registerPhoneForm.agree),
        }], __VLS_functionalComponentArgsRest(__VLS_234), false));
    var __VLS_237 = __VLS_236.slots.default;
    // @ts-ignore
    [registerPhoneForm,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "agreement-text" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    var __VLS_238 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    ElLink;
    // @ts-ignore
    var __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
        type: "primary",
        underline: (false),
    }));
    var __VLS_240 = __VLS_239.apply(void 0, __spreadArray([{
            type: "primary",
            underline: (false),
        }], __VLS_functionalComponentArgsRest(__VLS_239), false));
    var __VLS_242 = __VLS_241.slots.default;
    var __VLS_241;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    var __VLS_243 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    ElLink;
    // @ts-ignore
    var __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243({
        type: "primary",
        underline: (false),
    }));
    var __VLS_245 = __VLS_244.apply(void 0, __spreadArray([{
            type: "primary",
            underline: (false),
        }], __VLS_functionalComponentArgsRest(__VLS_244), false));
    var __VLS_247 = __VLS_246.slots.default;
    var __VLS_246;
    var __VLS_236;
    var __VLS_231;
    var __VLS_248 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.registerLoading) }), { class: "submit-btn" })));
    var __VLS_250 = __VLS_249.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.registerLoading) }), { class: "submit-btn" })], __VLS_functionalComponentArgsRest(__VLS_249), false));
    var __VLS_252 = void 0;
    var __VLS_253 = void 0;
    var __VLS_254 = ({ click: {} },
        { onClick: (__VLS_ctx.handleRegisterByCode) });
    var __VLS_255 = __VLS_251.slots.default;
    // @ts-ignore
    [handleRegisterByCode, registerLoading,];
    var __VLS_251;
    var __VLS_193;
    var __VLS_188;
    var __VLS_256 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    ElTabPane;
    // @ts-ignore
    var __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        label: "邮箱注册",
        name: "email",
    }));
    var __VLS_258 = __VLS_257.apply(void 0, __spreadArray([{
            label: "邮箱注册",
            name: "email",
        }], __VLS_functionalComponentArgsRest(__VLS_257), false));
    var __VLS_260 = __VLS_259.slots.default;
    var __VLS_261 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    ElForm;
    // @ts-ignore
    var __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
        ref: "registerEmailFormRef",
        model: (__VLS_ctx.registerEmailForm),
        rules: (__VLS_ctx.registerEmailRules),
        size: "large",
    }));
    var __VLS_263 = __VLS_262.apply(void 0, __spreadArray([{
            ref: "registerEmailFormRef",
            model: (__VLS_ctx.registerEmailForm),
            rules: (__VLS_ctx.registerEmailRules),
            size: "large",
        }], __VLS_functionalComponentArgsRest(__VLS_262), false));
    /** @type {typeof __VLS_ctx.registerEmailFormRef} */ ;
    var __VLS_265 = {};
    var __VLS_267 = __VLS_264.slots.default;
    // @ts-ignore
    [registerEmailForm, registerEmailRules, registerEmailFormRef,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_268 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
        prop: "email",
    }));
    var __VLS_270 = __VLS_269.apply(void 0, __spreadArray([{
            prop: "email",
        }], __VLS_functionalComponentArgsRest(__VLS_269), false));
    var __VLS_272 = __VLS_271.slots.default;
    var __VLS_273 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
        modelValue: (__VLS_ctx.registerEmailForm.email),
        placeholder: "请输入邮箱地址",
        clearable: true,
    }));
    var __VLS_275 = __VLS_274.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.registerEmailForm.email),
            placeholder: "请输入邮箱地址",
            clearable: true,
        }], __VLS_functionalComponentArgsRest(__VLS_274), false));
    // @ts-ignore
    [registerEmailForm,];
    var __VLS_271;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-label" }));
    var __VLS_278 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_279 = __VLS_asFunctionalComponent(__VLS_278, new __VLS_278({
        prop: "code",
    }));
    var __VLS_280 = __VLS_279.apply(void 0, __spreadArray([{
            prop: "code",
        }], __VLS_functionalComponentArgsRest(__VLS_279), false));
    var __VLS_282 = __VLS_281.slots.default;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "code-input-wrapper" }));
    var __VLS_283 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_284 = __VLS_asFunctionalComponent(__VLS_283, new __VLS_283(__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.registerEmailForm.code), placeholder: "请输入验证码" })));
    var __VLS_285 = __VLS_284.apply(void 0, __spreadArray([__assign({ 'onKeyup': {} }, { modelValue: (__VLS_ctx.registerEmailForm.code), placeholder: "请输入验证码" })], __VLS_functionalComponentArgsRest(__VLS_284), false));
    var __VLS_287 = void 0;
    var __VLS_288 = void 0;
    var __VLS_289 = ({ keyup: {} },
        { onKeyup: (__VLS_ctx.handleRegisterByCode) });
    // @ts-ignore
    [handleRegisterByCode, registerEmailForm,];
    var __VLS_286;
    var __VLS_291 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291(__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.registerCountdown > 0 || __VLS_ctx.registerCodeSending) })));
    var __VLS_293 = __VLS_292.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { disabled: (__VLS_ctx.registerCountdown > 0 || __VLS_ctx.registerCodeSending) })], __VLS_functionalComponentArgsRest(__VLS_292), false));
    var __VLS_295 = void 0;
    var __VLS_296 = void 0;
    var __VLS_297 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.activeTab === 'login'))
                    return;
                __VLS_ctx.sendRegisterCode('email');
                // @ts-ignore
                [registerCountdown, registerCodeSending, sendRegisterCode,];
            } });
    var __VLS_298 = __VLS_294.slots.default;
    (__VLS_ctx.registerCountdown > 0 ? "".concat(__VLS_ctx.registerCountdown, "\u79D2\u540E\u91CD\u8BD5") : '获取验证码');
    // @ts-ignore
    [registerCountdown, registerCountdown,];
    var __VLS_294;
    var __VLS_281;
    var __VLS_299 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299(__assign({ prop: "agree" }, { class: "agreement-item" })));
    var __VLS_301 = __VLS_300.apply(void 0, __spreadArray([__assign({ prop: "agree" }, { class: "agreement-item" })], __VLS_functionalComponentArgsRest(__VLS_300), false));
    var __VLS_303 = __VLS_302.slots.default;
    var __VLS_304 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    ElCheckbox;
    // @ts-ignore
    var __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
        modelValue: (__VLS_ctx.registerEmailForm.agree),
    }));
    var __VLS_306 = __VLS_305.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.registerEmailForm.agree),
        }], __VLS_functionalComponentArgsRest(__VLS_305), false));
    var __VLS_308 = __VLS_307.slots.default;
    // @ts-ignore
    [registerEmailForm,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "agreement-text" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    var __VLS_309 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    ElLink;
    // @ts-ignore
    var __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
        type: "primary",
        underline: (false),
    }));
    var __VLS_311 = __VLS_310.apply(void 0, __spreadArray([{
            type: "primary",
            underline: (false),
        }], __VLS_functionalComponentArgsRest(__VLS_310), false));
    var __VLS_313 = __VLS_312.slots.default;
    var __VLS_312;
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    var __VLS_314 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    ElLink;
    // @ts-ignore
    var __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
        type: "primary",
        underline: (false),
    }));
    var __VLS_316 = __VLS_315.apply(void 0, __spreadArray([{
            type: "primary",
            underline: (false),
        }], __VLS_functionalComponentArgsRest(__VLS_315), false));
    var __VLS_318 = __VLS_317.slots.default;
    var __VLS_317;
    var __VLS_307;
    var __VLS_302;
    var __VLS_319 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_320 = __VLS_asFunctionalComponent(__VLS_319, new __VLS_319(__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.registerLoading) }), { class: "submit-btn" })));
    var __VLS_321 = __VLS_320.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", loading: (__VLS_ctx.registerLoading) }), { class: "submit-btn" })], __VLS_functionalComponentArgsRest(__VLS_320), false));
    var __VLS_323 = void 0;
    var __VLS_324 = void 0;
    var __VLS_325 = ({ click: {} },
        { onClick: (__VLS_ctx.handleRegisterByCode) });
    var __VLS_326 = __VLS_322.slots.default;
    // @ts-ignore
    [handleRegisterByCode, registerLoading,];
    var __VLS_322;
    var __VLS_264;
    var __VLS_259;
    var __VLS_183;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['auth-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-dialog-content']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-title']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['method-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-link']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['method-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-item']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-item-phone']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-text']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['code-input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-item']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-text']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
// @ts-ignore
var __VLS_37 = __VLS_36, __VLS_88 = __VLS_87, __VLS_139 = __VLS_138, __VLS_195 = __VLS_194, __VLS_266 = __VLS_265;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    emits: {},
    __typeProps: {},
});
exports.default = {};
