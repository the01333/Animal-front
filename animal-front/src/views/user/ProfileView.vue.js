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
var pinia_1 = require("pinia");
var element_plus_1 = require("element-plus");
var user_1 = require("@/stores/user");
var user_2 = require("@/api/user");
var application_1 = require("@/api/application");
var like_1 = require("@/api/like");
var favorite_1 = require("@/api/favorite");
var article_1 = require("@/api/article");
// 获取 userStore
var userStore = (0, user_1.useUserStore)();
var userInfo = (0, pinia_1.storeToRefs)(userStore).userInfo;
// 用户信息
var idCardFrontInput = (0, vue_1.ref)(null);
var idCardBackInput = (0, vue_1.ref)(null);
var updateIdCardFrontInput = (0, vue_1.ref)(null);
var updateIdCardBackInput = (0, vue_1.ref)(null);
var fileInputMap = {
    idCardFront: idCardFrontInput,
    idCardBack: idCardBackInput,
    updateIdCardFront: updateIdCardFrontInput,
    updateIdCardBack: updateIdCardBackInput
};
var triggerFileInput = function (field) {
    var _a, _b;
    (_b = (_a = fileInputMap[field]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.click();
};
var user = (0, vue_1.ref)({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    role: 'user',
    certificationStatus: 'not_submitted',
    certificationRejectReason: '',
    hasPassword: true
});
var basicForm = (0, vue_1.reactive)({
    name: '',
    email: '',
    phone: '',
    address: ''
});
// 认证表单
var certificationForm = (0, vue_1.reactive)({
    idCard: '',
    idCardFront: null,
    idCardBack: null,
    idCardFrontPreview: '',
    idCardBackPreview: ''
});
var pendingResubmitMode = (0, vue_1.ref)(false);
var resetCertificationFormState = function () {
    certificationForm.idCard = '';
    certificationForm.idCardFront = null;
    certificationForm.idCardBack = null;
    certificationForm.idCardFrontPreview = '';
    certificationForm.idCardBackPreview = '';
};
// 默认头像
var defaultAvatar = 'http://localhost:9000/animal-adopt/default.jpg';
var defaultPetCover = 'http://localhost:9000/animal-adopt/default.jpg';
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
// 用户角色
var userRole = (0, vue_1.computed)(function () {
    var role = String(user.value.role || '').toLowerCase();
    var roleMap = {
        'admin': '管理员',
        'super_admin': '超级管理员',
        'application_auditor': '审核员',
        'user': '普通用户'
    };
    return roleMap[role] || '普通用户';
});
// 激活的标签页
var route = (0, vue_router_1.useRoute)();
var resolveTab = function (tab) {
    if (tab === 'certification' || tab === 'applications' || tab === 'basic' || tab === 'likes' || tab === 'favorites')
        return tab;
    return 'basic';
};
var activeTab = (0, vue_1.ref)(resolveTab(route.query.tab));
// 点赞 / 收藏列表与分类状态
var likedItems = (0, vue_1.ref)([]);
var favoriteItems = (0, vue_1.ref)([]);
var likeCategory = (0, vue_1.ref)('pet');
var favoriteCategory = (0, vue_1.ref)('pet');
var loadingLikes = (0, vue_1.ref)(false);
var loadingFavorites = (0, vue_1.ref)(false);
var resolveCategoryFilter = function (category) {
    if (category === 'article')
        return 'article';
    return 'pet';
};
var applyCategoryFromRoute = function () {
    var category = resolveCategoryFilter(route.query.category);
    if (activeTab.value === 'likes') {
        likeCategory.value = category;
    }
    else if (activeTab.value === 'favorites') {
        favoriteCategory.value = category;
    }
};
var loadingProfile = (0, vue_1.ref)(false);
var syncUserFromStore = function () {
    if (!userInfo.value)
        return;
    var info = userInfo.value;
    user.value.name = info.username || info.email || '用户';
    user.value.email = info.email || '';
    user.value.phone = info.phone || '';
    user.value.address = info.address || '';
    user.value.avatar = info.avatar ? processImageUrl(info.avatar) : '';
    user.value.role = info.role || 'user';
    user.value.hasPassword = Object.prototype.hasOwnProperty.call(info, 'hasPassword') ? Boolean(info.hasPassword) : true;
    if (!editingBasic.value) {
        basicForm.name = user.value.name;
        basicForm.email = user.value.email;
        basicForm.phone = user.value.phone;
        basicForm.address = user.value.address;
    }
};
var loadUserProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loadingProfile.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, userStore.getUserInfo()];
            case 2:
                _a.sent();
                syncUserFromStore();
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.error('获取用户信息失败:', error_1);
                return [3 /*break*/, 5];
            case 4:
                loadingProfile.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.watch)(userInfo, function () {
    syncUserFromStore();
});
(0, vue_1.watch)(function () { return route.query.tab; }, function (tab) {
    if (tab === 'certification' || tab === 'basic' || tab === 'applications' || tab === 'likes' || tab === 'favorites') {
        activeTab.value = tab;
    }
    else {
        activeTab.value = 'basic';
    }
    applyCategoryFromRoute();
    ensureTabDataLoaded(activeTab.value);
});
(0, vue_1.watch)(function () { return route.query.category; }, function () {
    applyCategoryFromRoute();
});
(0, vue_1.onMounted)(function () {
    applyCategoryFromRoute();
});
(0, vue_1.watch)(activeTab, function (tab, prev) {
    if (prev === 'certification' && tab !== 'certification' && pendingResubmitMode.value) {
        pendingResubmitMode.value = false;
        resetCertificationFormState();
    }
});
// 导航项
var navItems = [
    { key: 'basic', label: '基本信息' },
    { key: 'certification', label: '领养者认证' },
    { key: 'applications', label: '我的申请' },
    { key: 'likes', label: '我的点赞' },
    { key: 'favorites', label: '我的收藏' }
];
// 编辑基本信息状态
var editingBasic = (0, vue_1.ref)(false);
// 领养申请列表
var applications = (0, vue_1.ref)([]);
var loadingApplications = (0, vue_1.ref)(false);
var cancelingId = (0, vue_1.ref)(null);
// 路由
var router = (0, vue_router_1.useRouter)();
var goAdmin = function () { router.push('/admin'); };
// 认证状态文本
var certificationStatusText = (0, vue_1.computed)(function () {
    switch (user.value.certificationStatus) {
        case 'not_submitted': return '未提交';
        case 'pending': return '审核中';
        case 'approved': return '已认证';
        case 'rejected': return '已拒绝';
        default: return '未知';
    }
});
// 认证状态样式
var certificationStatusClass = (0, vue_1.computed)(function () {
    return {
        'status-not-submitted': user.value.certificationStatus === 'not_submitted',
        'status-pending': user.value.certificationStatus === 'pending',
        'status-approved': user.value.certificationStatus === 'approved',
        'status-rejected': user.value.certificationStatus === 'rejected'
    };
});
var showCertificationForm = (0, vue_1.computed)(function () { return user.value.certificationStatus === 'not_submitted' || pendingResubmitMode.value; });
// 申请状态文本
var normalizeStatus = function (status) { return String(status || '').toLowerCase(); };
var applicationStatusText = function (status) {
    switch (normalizeStatus(status)) {
        case 'pending': return '审核中';
        case 'approved': return '已通过';
        case 'rejected': return '已拒绝';
        case 'cancelled': return '已撤销';
        default: return '未知';
    }
};
// 申请状态样式
var applicationStatusClass = function (status) {
    var normalized = normalizeStatus(status);
    return {
        'status-pending': normalized === 'pending',
        'status-approved': normalized === 'approved',
        'status-rejected': normalized === 'rejected',
        'status-cancelled': normalized === 'cancelled'
    };
};
// 切换编辑基本信息状态
var resetBasicForm = function () {
    basicForm.name = user.value.name;
    basicForm.email = user.value.email;
    basicForm.phone = user.value.phone;
    basicForm.address = user.value.address;
};
var toggleEditBasic = function () {
    if (editingBasic.value) {
        resetBasicForm();
        editingBasic.value = false;
    }
    else {
        resetBasicForm();
        editingBasic.value = true;
    }
};
// 更新基本信息
var updateBasicInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!editingBasic.value)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, user_2.updateUserInfo)({
                        username: basicForm.name,
                        email: basicForm.email,
                        phone: basicForm.phone,
                        address: basicForm.address
                    })];
            case 2:
                _a.sent();
                element_plus_1.ElMessage.success('基本信息更新成功');
                return [4 /*yield*/, userStore.getUserInfo()];
            case 3:
                _a.sent();
                syncUserFromStore();
                user.value.name = basicForm.name;
                user.value.email = basicForm.email;
                user.value.phone = basicForm.phone;
                user.value.address = basicForm.address;
                editingBasic.value = false;
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error('更新用户信息失败:', error_2);
                element_plus_1.ElMessage.error('更新失败，请稍后重试');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 头像输入框引用
var avatarInput = (0, vue_1.ref)();
// 触发头像上传
var triggerAvatarUpload = function () {
    var _a;
    (_a = avatarInput.value) === null || _a === void 0 ? void 0 : _a.click();
};
// 处理头像上传
var handleAvatarUpload = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var target, file, loadingInstance, res, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                target = event.target;
                file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
                if (!file)
                    return [2 /*return*/];
                // 验证文件类型
                if (!file.type.startsWith('image/')) {
                    element_plus_1.ElMessage.error('请选择图片文件');
                    return [2 /*return*/];
                }
                // 验证文件大小（限制为 5MB）
                if (file.size > 5 * 1024 * 1024) {
                    element_plus_1.ElMessage.error('图片大小不能超过 5MB');
                    return [2 /*return*/];
                }
                loadingInstance = null;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, 5, 6]);
                loadingInstance = element_plus_1.ElLoading.service({
                    lock: true,
                    text: '正在上传头像...',
                    background: 'rgba(0, 0, 0, 0.35)'
                });
                return [4 /*yield*/, (0, user_2.uploadUserAvatar)(file)
                    // 更新本地用户信息
                ];
            case 2:
                res = _c.sent();
                // 更新本地用户信息
                if ((_b = res.data) === null || _b === void 0 ? void 0 : _b.avatar) {
                    user.value.avatar = processImageUrl(res.data.avatar);
                }
                // 刷新用户信息
                return [4 /*yield*/, userStore.getUserInfo()];
            case 3:
                // 刷新用户信息
                _c.sent();
                syncUserFromStore();
                element_plus_1.ElMessage.success('头像更新成功');
                return [3 /*break*/, 6];
            case 4:
                error_3 = _c.sent();
                console.error('上传头像失败:', error_3);
                element_plus_1.ElMessage.error('上传头像失败，请稍后重试');
                return [3 /*break*/, 6];
            case 5:
                loadingInstance === null || loadingInstance === void 0 ? void 0 : loadingInstance.close();
                // 清空输入框
                if (avatarInput.value) {
                    avatarInput.value.value = '';
                }
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
// 处理文件上传
var handleFileUpload = function (field, event) {
    var _a;
    var target = event.target;
    var file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        // 保存文件
        if (field === 'idCardFront') {
            certificationForm.idCardFront = file;
        }
        else {
            certificationForm.idCardBack = file;
        }
        // 生成预览
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a, _b;
            if (field === 'idCardFront') {
                certificationForm.idCardFrontPreview = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            }
            else {
                certificationForm.idCardBackPreview = (_b = e.target) === null || _b === void 0 ? void 0 : _b.result;
            }
        };
        reader.readAsDataURL(file);
    }
};
// 提交认证
var submitCertificationHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, formData, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!certificationForm.idCard) {
                    element_plus_1.ElMessage.error('请输入身份证号码');
                    return [2 /*return*/];
                }
                if (!certificationForm.idCardFront) {
                    element_plus_1.ElMessage.error('请上传身份证正面照片');
                    return [2 /*return*/];
                }
                if (!certificationForm.idCardBack) {
                    element_plus_1.ElMessage.error('请上传身份证反面照片');
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, element_plus_1.ElMessageBox.confirm('请确认您填写的信息和上传的证件照片均准确无误，\n是否确认提交？', '确认提交', {
                        confirmButtonText: '确认提交',
                        cancelButtonText: '重新检查',
                        type: 'warning'
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                return [2 /*return*/];
            case 4:
                _b.trys.push([4, 6, , 7]);
                formData = new FormData();
                formData.append('idCard', certificationForm.idCard);
                formData.append('idCardFront', certificationForm.idCardFront);
                formData.append('idCardBack', certificationForm.idCardBack);
                return [4 /*yield*/, (0, user_2.submitCertification)(formData)
                    // 提交成功后更新状态
                ];
            case 5:
                _b.sent();
                // 提交成功后更新状态
                user.value.certificationStatus = 'pending';
                // 清空表单
                certificationForm.idCard = '';
                certificationForm.idCardFront = null;
                certificationForm.idCardBack = null;
                certificationForm.idCardFrontPreview = '';
                certificationForm.idCardBackPreview = '';
                element_plus_1.ElMessage.success('认证申请提交成功，请等待审核');
                return [3 /*break*/, 7];
            case 6:
                error_4 = _b.sent();
                element_plus_1.ElMessage.error('提交认证失败，请重试');
                console.error('提交认证失败:', error_4);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// 重新提交认证
var resubmitCertification = function (options) {
    user.value.certificationStatus = 'not_submitted';
    if (options === null || options === void 0 ? void 0 : options.preserveForm)
        return;
    resetCertificationFormState();
};
// 更新认证表单数据
var showPasswordDialog = (0, vue_1.ref)(false);
var passwordForm = (0, vue_1.reactive)({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
var passwordErrors = (0, vue_1.reactive)({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});
var openPasswordDialog = function () {
    resetPasswordForm();
    showPasswordDialog.value = true;
};
var closePasswordDialog = function () {
    showPasswordDialog.value = false;
};
var resetPasswordForm = function () {
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    passwordErrors.oldPassword = '';
    passwordErrors.newPassword = '';
    passwordErrors.confirmPassword = '';
};
var hasPassword = (0, vue_1.computed)(function () { return user.value.hasPassword !== false; });
var validatePasswordForm = function () {
    var valid = true;
    passwordErrors.oldPassword = '';
    passwordErrors.newPassword = '';
    passwordErrors.confirmPassword = '';
    if (hasPassword.value && !passwordForm.oldPassword) {
        passwordErrors.oldPassword = '请输入旧密码';
        valid = false;
    }
    if (!passwordForm.newPassword) {
        passwordErrors.newPassword = '请输入新密码';
        valid = false;
    }
    else if (passwordForm.newPassword.length < 6) {
        passwordErrors.newPassword = '密码长度至少 6 位';
        valid = false;
    }
    if (!passwordForm.confirmPassword) {
        passwordErrors.confirmPassword = '请再次输入新密码';
        valid = false;
    }
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        passwordErrors.confirmPassword = '两次输入的新密码不一致';
        valid = false;
    }
    return valid;
};
var submitPasswordChange = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!validatePasswordForm())
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, user_2.changePassword)({
                        oldPassword: hasPassword.value ? passwordForm.oldPassword : '',
                        newPassword: passwordForm.newPassword
                    })];
            case 2:
                _a.sent();
                element_plus_1.ElMessage.success(hasPassword.value ? '密码修改成功' : '密码设置成功');
                resetPasswordForm();
                closePasswordDialog();
                return [4 /*yield*/, userStore.getUserInfo()];
            case 3:
                _a.sent();
                user.value.hasPassword = true;
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error('修改密码失败:', error_5);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var showUpdateForm = (0, vue_1.ref)(false);
var updateCertificationForm = (0, vue_1.reactive)({
    idCard: '',
    idCardFront: null,
    idCardBack: null,
    idCardFrontPreview: '',
    idCardBackPreview: ''
});
// 打开更新认证表单
var updateCertification = function () {
    showUpdateForm.value = true;
    // 可选：预填当前的身份证号码
    updateCertificationForm.idCard = '';
    updateCertificationForm.idCardFront = null;
    updateCertificationForm.idCardBack = null;
    updateCertificationForm.idCardFrontPreview = '';
    updateCertificationForm.idCardBackPreview = '';
};
// 处理更新认证文件上传
var handleUpdateFileUpload = function (field, event) {
    var _a;
    var target = event.target;
    var file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        // 保存文件
        if (field === 'idCardFront') {
            updateCertificationForm.idCardFront = file;
        }
        else {
            updateCertificationForm.idCardBack = file;
        }
        // 生成预览
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a, _b;
            if (field === 'idCardFront') {
                updateCertificationForm.idCardFrontPreview = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            }
            else {
                updateCertificationForm.idCardBackPreview = (_b = e.target) === null || _b === void 0 ? void 0 : _b.result;
            }
        };
        reader.readAsDataURL(file);
    }
};
// 提交更新认证
var submitUpdateCertificationHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, formData, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!updateCertificationForm.idCard) {
                    element_plus_1.ElMessage.error('请输入身份证号码');
                    return [2 /*return*/];
                }
                if (!updateCertificationForm.idCardFront) {
                    element_plus_1.ElMessage.error('请上传身份证正面照片');
                    return [2 /*return*/];
                }
                if (!updateCertificationForm.idCardBack) {
                    element_plus_1.ElMessage.error('请上传身份证反面照片');
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, element_plus_1.ElMessageBox.confirm('请再次核对更新后的信息与证件照片，确认提交审核？', '确认更新', {
                        confirmButtonText: '确认提交',
                        cancelButtonText: '再检查一下',
                        type: 'warning'
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                return [2 /*return*/];
            case 4:
                _b.trys.push([4, 6, , 7]);
                formData = new FormData();
                formData.append('idCard', updateCertificationForm.idCard);
                formData.append('idCardFront', updateCertificationForm.idCardFront);
                formData.append('idCardBack', updateCertificationForm.idCardBack);
                // 调用更新认证 API
                return [4 /*yield*/, (0, user_2.submitCertification)(formData)
                    // 更新成功后状态变为待审核
                ];
            case 5:
                // 调用更新认证 API
                _b.sent();
                // 更新成功后状态变为待审核
                user.value.certificationStatus = 'pending';
                showUpdateForm.value = false;
                // 清空表单
                updateCertificationForm.idCard = '';
                updateCertificationForm.idCardFront = null;
                updateCertificationForm.idCardBack = null;
                updateCertificationForm.idCardFrontPreview = '';
                updateCertificationForm.idCardBackPreview = '';
                element_plus_1.ElMessage.success('认证信息更新成功，请等待审核');
                return [3 /*break*/, 7];
            case 6:
                error_6 = _b.sent();
                element_plus_1.ElMessage.error('更新认证失败，请重试');
                console.error('更新认证失败:', error_6);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// 取消更新认证
var cancelUpdateCertification = function () {
    showUpdateForm.value = false;
    updateCertificationForm.idCard = '';
    updateCertificationForm.idCardFront = null;
    updateCertificationForm.idCardBack = null;
    updateCertificationForm.idCardFrontPreview = '';
    updateCertificationForm.idCardBackPreview = '';
};
var requestResubmitDuringPending = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, element_plus_1.ElMessageBox.confirm('当前认证正在审核中，确认撤回并重新上传吗？', '重新上传确认', {
                        confirmButtonText: '重新上传',
                        cancelButtonText: '再等等',
                        type: 'warning'
                    })];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = _b.sent();
                return [2 /*return*/];
            case 3:
                pendingResubmitMode.value = true;
                resetCertificationFormState();
                element_plus_1.ElMessage.info('请重新填写认证信息并再次提交。');
                return [2 /*return*/];
        }
    });
}); };
// 申请时间格式化
var formatDateTime = function (value) {
    if (!value)
        return '—';
    var date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return value;
    return date.toLocaleString('zh-CN', { hour12: false });
};
var getPetCover = function (application) {
    return processImageUrl(application.petCoverImage) || defaultPetCover;
};
var formatPetCategory = function (category) {
    if (!category)
        return '宠物';
    var map = {
        dog: '狗狗',
        cat: '猫咪'
    };
    return map[category.toLowerCase()] || category;
};
var loadApplications = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (loadingApplications.value)
                    return [2 /*return*/];
                loadingApplications.value = true;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, (0, application_1.getMyApplications)({ current: 1, size: 50 })];
            case 2:
                res = _b.sent();
                applications.value = ((_a = res.data) === null || _a === void 0 ? void 0 : _a.records) || [];
                return [3 /*break*/, 5];
            case 3:
                error_7 = _b.sent();
                console.error('获取申请列表失败:', error_7);
                element_plus_1.ElMessage.error('加载申请列表失败，请稍后重试');
                return [3 /*break*/, 5];
            case 4:
                loadingApplications.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// 查看申请详情
var viewApplication = function (id) {
    router.push("/application/".concat(id));
};
// 撤销申请
var cancelApplication = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (cancelingId.value)
                    return [2 /*return*/];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, element_plus_1.ElMessageBox.confirm('确定要撤销此领养申请吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                return [2 /*return*/];
            case 4:
                cancelingId.value = id;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, 9, 10]);
                return [4 /*yield*/, (0, application_1.cancelApplication)(id)];
            case 6:
                _b.sent();
                element_plus_1.ElMessage.success('申请已撤销');
                return [4 /*yield*/, loadApplications()];
            case 7:
                _b.sent();
                return [3 /*break*/, 10];
            case 8:
                error_8 = _b.sent();
                console.error('撤销申请失败:', error_8);
                element_plus_1.ElMessage.error('撤销失败，请稍后再试');
                return [3 /*break*/, 10];
            case 9:
                cancelingId.value = null;
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
// 获取项目图片
var getItemImage = function (item) {
    if (item.image) {
        return processImageUrl(item.image);
    }
    return defaultPetCover;
};
// 获取项目类型标签
var getItemTypeLabel = function (type) {
    var typeMap = {
        pet: '宠物',
        guide: '领养指南',
        story: '领养故事'
    };
    return typeMap[type] || type;
};
var filteredLikedItems = (0, vue_1.computed)(function () {
    return likedItems.value.filter(function (item) {
        return likeCategory.value === 'pet' ? item.type === 'pet' : item.type !== 'pet';
    });
});
var filteredFavoriteItems = (0, vue_1.computed)(function () {
    return favoriteItems.value.filter(function (item) {
        return favoriteCategory.value === 'pet' ? item.type === 'pet' : item.type !== 'pet';
    });
});
var buildProfileReturnQuery = function (tab, category) { return ({
    from: 'profile',
    tab: tab,
    category: category
}); };
// 查看点赞项目
var viewLikedItem = function (item) {
    if (item.type === 'pet') {
        router.push({ path: "/pet/".concat(item.id), query: buildProfileReturnQuery('likes', likeCategory.value) });
    }
    else if (item.type === 'guide') {
        router.push({ path: "/guide/".concat(item.id), query: buildProfileReturnQuery('likes', 'article') });
    }
    else if (item.type === 'story') {
        router.push({ path: "/story/".concat(item.id), query: buildProfileReturnQuery('likes', 'article') });
    }
};
var viewFavoriteItem = function (item) {
    if (item.type === 'pet') {
        router.push({ path: "/pet/".concat(item.id), query: buildProfileReturnQuery('favorites', favoriteCategory.value) });
    }
    else if (item.type === 'guide') {
        router.push({ path: "/guide/".concat(item.id), query: buildProfileReturnQuery('favorites', 'article') });
    }
    else if (item.type === 'story') {
        router.push({ path: "/story/".concat(item.id), query: buildProfileReturnQuery('favorites', 'article') });
    }
};
// 加载点赞列表
var mapPetToItem = function (pet) { return ({
    id: pet.id,
    type: 'pet',
    title: pet.name,
    description: pet.breed,
    image: pet.coverImage
}); };
var mapArticleToItem = function (article) { return ({
    id: article.id,
    type: article.category === 'GUIDE' ? 'guide' : 'story',
    title: article.title,
    description: article.summary || (article.author ? "\u4F5C\u8005\uFF1A".concat(article.author) : undefined),
    image: article.coverImage,
    relationTime: article.relationTime
}); };
var sortByRelationTime = function (items) {
    return items.sort(function (a, b) {
        var t1 = a.relationTime ? new Date(a.relationTime).getTime() : 0;
        var t2 = b.relationTime ? new Date(b.relationTime).getTime() : 0;
        return t2 - t1;
    });
};
var loadLikes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, petRes, articleRes, pets, articles, error_9;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (loadingLikes.value)
                    return [2 /*return*/];
                loadingLikes.value = true;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, Promise.all([
                        (0, like_1.getUserLikedPets)({ current: 1, size: 50 }),
                        (0, article_1.getUserLikedArticles)({ current: 1, size: 50 })
                    ])];
            case 2:
                _a = _d.sent(), petRes = _a[0], articleRes = _a[1];
                pets = (((_b = petRes.data) === null || _b === void 0 ? void 0 : _b.records) || []).map(mapPetToItem);
                articles = (((_c = articleRes.data) === null || _c === void 0 ? void 0 : _c.records) || []).map(mapArticleToItem);
                likedItems.value = sortByRelationTime(__spreadArray(__spreadArray([], pets, true), articles, true));
                return [3 /*break*/, 5];
            case 3:
                error_9 = _d.sent();
                console.error('获取点赞列表失败:', error_9);
                element_plus_1.ElMessage.error('加载点赞列表失败，请稍后重试');
                likedItems.value = [];
                return [3 /*break*/, 5];
            case 4:
                loadingLikes.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var loadFavorites = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, petRes, articleRes, pets, articles, error_10;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (loadingFavorites.value)
                    return [2 /*return*/];
                loadingFavorites.value = true;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, Promise.all([
                        (0, favorite_1.getUserFavoritePets)({ current: 1, size: 50 }),
                        (0, article_1.getUserFavoritedArticles)({ current: 1, size: 50 })
                    ])];
            case 2:
                _a = _d.sent(), petRes = _a[0], articleRes = _a[1];
                pets = (((_b = petRes.data) === null || _b === void 0 ? void 0 : _b.records) || []).map(mapPetToItem);
                articles = (((_c = articleRes.data) === null || _c === void 0 ? void 0 : _c.records) || []).map(mapArticleToItem);
                favoriteItems.value = sortByRelationTime(__spreadArray(__spreadArray([], pets, true), articles, true));
                return [3 /*break*/, 5];
            case 3:
                error_10 = _d.sent();
                console.error('获取收藏列表失败:', error_10);
                element_plus_1.ElMessage.error('加载收藏列表失败，请稍后重试');
                favoriteItems.value = [];
                return [3 /*break*/, 5];
            case 4:
                loadingFavorites.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var ensureTabDataLoaded = function (tab) {
    if (tab === 'applications' && applications.value.length === 0 && !loadingApplications.value) {
        loadApplications();
    }
    else if (tab === 'likes' && likedItems.value.length === 0 && !loadingLikes.value) {
        loadLikes();
    }
    else if (tab === 'favorites' && favoriteItems.value.length === 0 && !loadingFavorites.value) {
        loadFavorites();
    }
};
(0, vue_1.watch)(activeTab, function (tab) {
    ensureTabDataLoaded(tab);
});
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadUserProfile()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, user_2.getCertificationInfo)()];
            case 3:
                res = _a.sent();
                if (res.data) {
                    user.value.certificationStatus = res.data.status;
                    user.value.certificationRejectReason = res.data.rejectReason || '';
                }
                return [3 /*break*/, 5];
            case 4:
                error_11 = _a.sent();
                console.error('获取认证信息失败:', error_11);
                return [3 /*break*/, 5];
            case 5:
                ensureTabDataLoaded(activeTab.value);
                return [2 /*return*/];
        }
    });
}); });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['profile-container']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card__header']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card__header']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['el-dialog__close']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button--default']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button--primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-option']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-option']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-option']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message-rejected']} */ ;
/** @type {__VLS_StyleScopedClasses['certification-form']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['application-pet']} */ ;
/** @type {__VLS_StyleScopedClasses['application-pet']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['status-pending']} */ ;
/** @type {__VLS_StyleScopedClasses['status-approved']} */ ;
/** @type {__VLS_StyleScopedClasses['status-rejected']} */ ;
/** @type {__VLS_StyleScopedClasses['status-pending']} */ ;
/** @type {__VLS_StyleScopedClasses['status-approved']} */ ;
/** @type {__VLS_StyleScopedClasses['status-rejected']} */ ;
/** @type {__VLS_StyleScopedClasses['status-cancelled']} */ ;
/** @type {__VLS_StyleScopedClasses['like-item']} */ ;
/** @type {__VLS_StyleScopedClasses['favorite-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-image']} */ ;
/** @type {__VLS_StyleScopedClasses['like-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-image']} */ ;
/** @type {__VLS_StyleScopedClasses['favorite-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-image']} */ ;
/** @type {__VLS_StyleScopedClasses['item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view-item']} */ ;
/** @type {__VLS_StyleScopedClasses['section-head']} */ ;
/** @type {__VLS_StyleScopedClasses['section-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['section-head']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-resubmit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-resubmit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-update-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-update-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-content']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['likes-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['favorites-grid']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-container" }));
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-content" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-sidebar" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "avatar" }));
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: (__VLS_ctx.user.avatar ? __VLS_ctx.processImageUrl(__VLS_ctx.user.avatar) : __VLS_ctx.defaultAvatar),
    alt: (__VLS_ctx.user.name),
});
// @ts-ignore
[user, user, user, processImageUrl, defaultAvatar,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.triggerAvatarUpload) }, { class: "btn-edit-avatar" }));
// @ts-ignore
[triggerAvatarUpload,];
__VLS_asFunctionalElement(__VLS_elements.input)(__assign(__assign({ onChange: (__VLS_ctx.handleAvatarUpload) }, { ref: "avatarInput", type: "file", accept: "image/*" }), { style: {} }));
/** @type {typeof __VLS_ctx.avatarInput} */ ;
// @ts-ignore
[handleAvatarUpload, avatarInput,];
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
(__VLS_ctx.user.name);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "user-role" }));
(__VLS_ctx.userRole);
// @ts-ignore
[userRole,];
if (__VLS_ctx.userStore.isManager) {
    // @ts-ignore
    [userStore,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.goAdmin) }, { class: "btn-admin" }));
    // @ts-ignore
    [goAdmin,];
}
__VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)(__assign({ class: "profile-nav" }));
__VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({});
var _loop_1 = function (item) {
    // @ts-ignore
    [navItems,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.activeTab = item.key;
            // @ts-ignore
            [activeTab,];
        } }, { key: (item.key) }), { class: ({ active: __VLS_ctx.activeTab === item.key }) }));
    // @ts-ignore
    [activeTab,];
    (item.label);
};
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.navItems)); _i < _a.length; _i++) {
    var item = _a[_i][0];
    _loop_1(item);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-main" }));
if (__VLS_ctx.activeTab === 'basic') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-section" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)(__assign({ onSubmit: (__VLS_ctx.updateBasicInfo) }));
    // @ts-ignore
    [updateBasicInfo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        value: (__VLS_ctx.basicForm.name),
        type: "text",
        readonly: (!__VLS_ctx.editingBasic),
    });
    // @ts-ignore
    [basicForm, editingBasic,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "email",
        readonly: (!__VLS_ctx.editingBasic),
    });
    (__VLS_ctx.basicForm.email);
    // @ts-ignore
    [basicForm, editingBasic,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "phone",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        id: "phone",
        type: "tel",
        readonly: (!__VLS_ctx.editingBasic),
    });
    (__VLS_ctx.basicForm.phone);
    // @ts-ignore
    [basicForm, editingBasic,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "address",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        id: "address",
        value: (__VLS_ctx.basicForm.address),
        type: "text",
        readonly: (!__VLS_ctx.editingBasic),
    });
    // @ts-ignore
    [basicForm, editingBasic,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.toggleEditBasic) }, { type: "button" }), { class: "btn-edit" }));
    // @ts-ignore
    [toggleEditBasic,];
    (__VLS_ctx.editingBasic ? '取消' : '编辑');
    // @ts-ignore
    [editingBasic,];
    if (__VLS_ctx.editingBasic) {
        // @ts-ignore
        [editingBasic,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ type: "submit" }, { class: "btn-save" }));
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "password-card" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "password-card__header" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.hasPassword ? '定期修改密码可以提升账户安全' : '尚未设置密码，建议立即设置');
    // @ts-ignore
    [hasPassword,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.openPasswordDialog) }, { class: "btn-inline" }));
    // @ts-ignore
    [openPasswordDialog,];
    (__VLS_ctx.hasPassword ? '修改密码' : '设置密码');
    // @ts-ignore
    [hasPassword,];
    if (!__VLS_ctx.hasPassword) {
        // @ts-ignore
        [hasPassword,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.openPasswordDialog) }, { class: "btn-link" }));
        // @ts-ignore
        [openPasswordDialog,];
    }
    var __VLS_0 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    ElDialog;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign({ modelValue: (__VLS_ctx.showPasswordDialog), title: (__VLS_ctx.hasPassword ? '修改密码' : '设置密码'), width: "460px" }, { class: "password-dialog" }), { destroyOnClose: true })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ modelValue: (__VLS_ctx.showPasswordDialog), title: (__VLS_ctx.hasPassword ? '修改密码' : '设置密码'), width: "460px" }, { class: "password-dialog" }), { destroyOnClose: true })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_4 = __VLS_3.slots.default;
    // @ts-ignore
    [hasPassword, showPasswordDialog,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "password-form" }));
    var __VLS_5 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    ElForm;
    // @ts-ignore
    var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        labelPosition: "top",
        model: (__VLS_ctx.passwordForm),
    }));
    var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{
            labelPosition: "top",
            model: (__VLS_ctx.passwordForm),
        }], __VLS_functionalComponentArgsRest(__VLS_6), false));
    var __VLS_9 = __VLS_8.slots.default;
    // @ts-ignore
    [passwordForm,];
    var __VLS_10 = {}.TransitionGroup;
    /** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, ]} */ ;
    // @ts-ignore
    TransitionGroup;
    // @ts-ignore
    var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        name: "fade-slide",
        tag: "div",
    }));
    var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([{
            name: "fade-slide",
            tag: "div",
        }], __VLS_functionalComponentArgsRest(__VLS_11), false));
    var __VLS_14 = __VLS_13.slots.default;
    if (__VLS_ctx.hasPassword) {
        // @ts-ignore
        [hasPassword,];
        var __VLS_15 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        ElFormItem;
        // @ts-ignore
        var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
            key: "old",
            label: "旧密码",
            error: (__VLS_ctx.passwordErrors.oldPassword),
        }));
        var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
                key: "old",
                label: "旧密码",
                error: (__VLS_ctx.passwordErrors.oldPassword),
            }], __VLS_functionalComponentArgsRest(__VLS_16), false));
        var __VLS_19 = __VLS_18.slots.default;
        // @ts-ignore
        [passwordErrors,];
        var __VLS_20 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        ElInput;
        // @ts-ignore
        var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            modelValue: (__VLS_ctx.passwordForm.oldPassword),
            type: "password",
            placeholder: "请输入旧密码",
            showPassword: true,
        }));
        var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{
                modelValue: (__VLS_ctx.passwordForm.oldPassword),
                type: "password",
                placeholder: "请输入旧密码",
                showPassword: true,
            }], __VLS_functionalComponentArgsRest(__VLS_21), false));
        // @ts-ignore
        [passwordForm,];
        var __VLS_18;
    }
    var __VLS_25 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        key: "new",
        label: "新密码",
        error: (__VLS_ctx.passwordErrors.newPassword),
    }));
    var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{
            key: "new",
            label: "新密码",
            error: (__VLS_ctx.passwordErrors.newPassword),
        }], __VLS_functionalComponentArgsRest(__VLS_26), false));
    var __VLS_29 = __VLS_28.slots.default;
    // @ts-ignore
    [passwordErrors,];
    var __VLS_30 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        modelValue: (__VLS_ctx.passwordForm.newPassword),
        type: "password",
        placeholder: "请输入新密码",
        showPassword: true,
    }));
    var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.passwordForm.newPassword),
            type: "password",
            placeholder: "请输入新密码",
            showPassword: true,
        }], __VLS_functionalComponentArgsRest(__VLS_31), false));
    // @ts-ignore
    [passwordForm,];
    var __VLS_28;
    var __VLS_35 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    ElFormItem;
    // @ts-ignore
    var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        key: "confirm",
        label: "确认新密码",
        error: (__VLS_ctx.passwordErrors.confirmPassword),
    }));
    var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([{
            key: "confirm",
            label: "确认新密码",
            error: (__VLS_ctx.passwordErrors.confirmPassword),
        }], __VLS_functionalComponentArgsRest(__VLS_36), false));
    var __VLS_39 = __VLS_38.slots.default;
    // @ts-ignore
    [passwordErrors,];
    var __VLS_40 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    ElInput;
    // @ts-ignore
    var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        modelValue: (__VLS_ctx.passwordForm.confirmPassword),
        type: "password",
        placeholder: "请再次输入新密码",
        showPassword: true,
    }));
    var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{
            modelValue: (__VLS_ctx.passwordForm.confirmPassword),
            type: "password",
            placeholder: "请再次输入新密码",
            showPassword: true,
        }], __VLS_functionalComponentArgsRest(__VLS_41), false));
    // @ts-ignore
    [passwordForm,];
    var __VLS_38;
    var __VLS_13;
    var __VLS_8;
    {
        var __VLS_45 = __VLS_3.slots.footer;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "dialog-footer" }));
        var __VLS_46 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46(__assign({ 'onClick': {} })));
        var __VLS_48 = __VLS_47.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_47), false));
        var __VLS_50 = void 0;
        var __VLS_51 = void 0;
        var __VLS_52 = ({ click: {} },
            { onClick: (__VLS_ctx.closePasswordDialog) });
        var __VLS_53 = __VLS_49.slots.default;
        // @ts-ignore
        [closePasswordDialog,];
        var __VLS_49;
        var __VLS_54 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54(__assign({ 'onClick': {} }, { type: "primary" })));
        var __VLS_56 = __VLS_55.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_55), false));
        var __VLS_58 = void 0;
        var __VLS_59 = void 0;
        var __VLS_60 = ({ click: {} },
            { onClick: (__VLS_ctx.submitPasswordChange) });
        var __VLS_61 = __VLS_57.slots.default;
        // @ts-ignore
        [submitPasswordChange,];
        var __VLS_57;
    }
    var __VLS_3;
}
if (__VLS_ctx.activeTab === 'certification') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-section" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "certification-status" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "status-info" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "status-label" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: (__VLS_ctx.certificationStatusClass) }));
    // @ts-ignore
    [certificationStatusClass,];
    (__VLS_ctx.certificationStatusText);
    // @ts-ignore
    [certificationStatusText,];
    if (__VLS_ctx.user.certificationStatus === 'pending' && !__VLS_ctx.pendingResubmitMode) {
        // @ts-ignore
        [user, pendingResubmitMode,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "status-message" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.requestResubmitDuringPending) }, { class: "btn-resubmit" }));
        // @ts-ignore
        [requestResubmitDuringPending,];
    }
    if (__VLS_ctx.user.certificationStatus === 'rejected') {
        // @ts-ignore
        [user,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "status-message status-message-rejected" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "reject-reason" }));
        (__VLS_ctx.user.certificationRejectReason);
        // @ts-ignore
        [user,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.resubmitCertification) }, { class: "btn-resubmit" }));
        // @ts-ignore
        [resubmitCertification,];
    }
    if (__VLS_ctx.user.certificationStatus === 'approved') {
        // @ts-ignore
        [user,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "status-message" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.updateCertification) }, { class: "btn-update-certification" }));
        // @ts-ignore
        [updateCertification,];
    }
    if (__VLS_ctx.showCertificationForm) {
        // @ts-ignore
        [showCertificationForm,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "certification-form" }));
        if (__VLS_ctx.pendingResubmitMode) {
            // @ts-ignore
            [pendingResubmitMode,];
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "notice" }));
        }
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)(__assign({ onSubmit: (__VLS_ctx.submitCertificationHandler) }));
        // @ts-ignore
        [submitCertificationHandler,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            for: "idCard",
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            id: "idCard",
            value: (__VLS_ctx.certificationForm.idCard),
            type: "text",
            required: true,
        });
        // @ts-ignore
        [certificationForm,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            for: "idCardFront",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'certification'))
                    return;
                if (!(__VLS_ctx.showCertificationForm))
                    return;
                __VLS_ctx.triggerFileInput('idCardFront');
                // @ts-ignore
                [triggerFileInput,];
            } }, { class: "file-upload" }));
        __VLS_asFunctionalElement(__VLS_elements.input)(__assign({ onChange: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'certification'))
                    return;
                if (!(__VLS_ctx.showCertificationForm))
                    return;
                __VLS_ctx.handleFileUpload('idCardFront', $event);
                // @ts-ignore
                [handleFileUpload,];
            } }, { ref: "idCardFrontInput", id: "idCardFront", type: "file", accept: "image/*" }));
        /** @type {typeof __VLS_ctx.idCardFrontInput} */ ;
        // @ts-ignore
        [idCardFrontInput,];
        if (__VLS_ctx.certificationForm.idCardFrontPreview) {
            // @ts-ignore
            [certificationForm,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "file-preview" }));
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (__VLS_ctx.certificationForm.idCardFrontPreview),
                alt: "身份证正面",
            });
            // @ts-ignore
            [certificationForm,];
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            for: "idCardBack",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'certification'))
                    return;
                if (!(__VLS_ctx.showCertificationForm))
                    return;
                __VLS_ctx.triggerFileInput('idCardBack');
                // @ts-ignore
                [triggerFileInput,];
            } }, { class: "file-upload" }));
        __VLS_asFunctionalElement(__VLS_elements.input)(__assign({ onChange: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'certification'))
                    return;
                if (!(__VLS_ctx.showCertificationForm))
                    return;
                __VLS_ctx.handleFileUpload('idCardBack', $event);
                // @ts-ignore
                [handleFileUpload,];
            } }, { ref: "idCardBackInput", id: "idCardBack", type: "file", accept: "image/*" }));
        /** @type {typeof __VLS_ctx.idCardBackInput} */ ;
        // @ts-ignore
        [idCardBackInput,];
        if (__VLS_ctx.certificationForm.idCardBackPreview) {
            // @ts-ignore
            [certificationForm,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "file-preview" }));
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (__VLS_ctx.certificationForm.idCardBackPreview),
                alt: "身份证反面",
            });
            // @ts-ignore
            [certificationForm,];
        }
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ type: "submit" }, { class: "btn-submit-certification" }));
    }
    if (__VLS_ctx.user.certificationStatus === 'approved' && __VLS_ctx.showUpdateForm) {
        // @ts-ignore
        [user, showUpdateForm,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "certification-form" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)(__assign({ onSubmit: (__VLS_ctx.submitUpdateCertificationHandler) }));
        // @ts-ignore
        [submitUpdateCertificationHandler,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            for: "updateIdCard",
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            id: "updateIdCard",
            value: (__VLS_ctx.updateCertificationForm.idCard),
            type: "text",
            required: true,
        });
        // @ts-ignore
        [updateCertificationForm,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            for: "updateIdCardFront",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'certification'))
                    return;
                if (!(__VLS_ctx.user.certificationStatus === 'approved' && __VLS_ctx.showUpdateForm))
                    return;
                __VLS_ctx.triggerFileInput('updateIdCardFront');
                // @ts-ignore
                [triggerFileInput,];
            } }, { class: "file-upload" }));
        __VLS_asFunctionalElement(__VLS_elements.input)(__assign({ onChange: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'certification'))
                    return;
                if (!(__VLS_ctx.user.certificationStatus === 'approved' && __VLS_ctx.showUpdateForm))
                    return;
                __VLS_ctx.handleUpdateFileUpload('idCardFront', $event);
                // @ts-ignore
                [handleUpdateFileUpload,];
            } }, { ref: "updateIdCardFrontInput", id: "updateIdCardFront", type: "file", accept: "image/*" }));
        /** @type {typeof __VLS_ctx.updateIdCardFrontInput} */ ;
        // @ts-ignore
        [updateIdCardFrontInput,];
        if (__VLS_ctx.updateCertificationForm.idCardFrontPreview) {
            // @ts-ignore
            [updateCertificationForm,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "file-preview" }));
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (__VLS_ctx.updateCertificationForm.idCardFrontPreview),
                alt: "身份证正面",
            });
            // @ts-ignore
            [updateCertificationForm,];
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            for: "updateIdCardBack",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'certification'))
                    return;
                if (!(__VLS_ctx.user.certificationStatus === 'approved' && __VLS_ctx.showUpdateForm))
                    return;
                __VLS_ctx.triggerFileInput('updateIdCardBack');
                // @ts-ignore
                [triggerFileInput,];
            } }, { class: "file-upload" }));
        __VLS_asFunctionalElement(__VLS_elements.input)(__assign({ onChange: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.activeTab === 'certification'))
                    return;
                if (!(__VLS_ctx.user.certificationStatus === 'approved' && __VLS_ctx.showUpdateForm))
                    return;
                __VLS_ctx.handleUpdateFileUpload('idCardBack', $event);
                // @ts-ignore
                [handleUpdateFileUpload,];
            } }, { ref: "updateIdCardBackInput", id: "updateIdCardBack", type: "file", accept: "image/*" }));
        /** @type {typeof __VLS_ctx.updateIdCardBackInput} */ ;
        // @ts-ignore
        [updateIdCardBackInput,];
        if (__VLS_ctx.updateCertificationForm.idCardBackPreview) {
            // @ts-ignore
            [updateCertificationForm,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "file-preview" }));
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (__VLS_ctx.updateCertificationForm.idCardBackPreview),
                alt: "身份证反面",
            });
            // @ts-ignore
            [updateCertificationForm,];
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-actions" }));
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ type: "submit" }, { class: "btn-submit-certification" }));
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.cancelUpdateCertification) }, { type: "button" }), { class: "btn-cancel" }));
        // @ts-ignore
        [cancelUpdateCertification,];
    }
}
if (__VLS_ctx.activeTab === 'applications') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-section" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "section-head" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    if (__VLS_ctx.applications.length) {
        // @ts-ignore
        [applications,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "application-count" }));
        (__VLS_ctx.applications.length);
        // @ts-ignore
        [applications,];
    }
    if (__VLS_ctx.loadingApplications) {
        // @ts-ignore
        [loadingApplications,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "applications-loading" }));
    }
    else if (__VLS_ctx.applications.length === 0) {
        // @ts-ignore
        [applications,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "no-applications" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        var __VLS_62 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
        // @ts-ignore
        RouterLink;
        // @ts-ignore
        var __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62(__assign({ to: "/pets" }, { class: "btn-browse-pets" })));
        var __VLS_64 = __VLS_63.apply(void 0, __spreadArray([__assign({ to: "/pets" }, { class: "btn-browse-pets" })], __VLS_functionalComponentArgsRest(__VLS_63), false));
        var __VLS_66 = __VLS_65.slots.default;
        var __VLS_65;
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "applications-list" }));
        var _loop_2 = function (application) {
            // @ts-ignore
            [applications,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (application.id) }, { class: "application-item" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-pet" }));
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (__VLS_ctx.getPetCover(application)),
                alt: (application.petName || '宠物封面'),
            });
            // @ts-ignore
            [getPetCover,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-pet-meta" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "pet-name" }));
            (application.petName || '未命名宠物');
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "pet-category" }));
            (__VLS_ctx.formatPetCategory(application.petCategory));
            // @ts-ignore
            [formatPetCategory,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-body" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-header" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "application-no" }));
            (application.applicationNo || '—');
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "timeline" }));
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
            (__VLS_ctx.formatDateTime(application.createTime));
            // @ts-ignore
            [formatDateTime,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
            (__VLS_ctx.formatDateTime(application.updateTime));
            // @ts-ignore
            [formatDateTime,];
            __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: (__VLS_ctx.applicationStatusClass(application.status)) }));
            // @ts-ignore
            [applicationStatusClass,];
            (__VLS_ctx.applicationStatusText(application.status));
            // @ts-ignore
            [applicationStatusText,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-snippet" }));
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
            __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
            (application.reason || '—');
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
            __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
            (application.familyInfo || '—');
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-actions" }));
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.activeTab === 'applications'))
                        return;
                    if (!!(__VLS_ctx.loadingApplications))
                        return;
                    if (!!(__VLS_ctx.applications.length === 0))
                        return;
                    __VLS_ctx.viewApplication(application.id);
                    // @ts-ignore
                    [viewApplication,];
                } }, { class: "btn-view" }));
            if (__VLS_ctx.normalizeStatus(application.status) === 'pending') {
                // @ts-ignore
                [normalizeStatus,];
                __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.activeTab === 'applications'))
                            return;
                        if (!!(__VLS_ctx.loadingApplications))
                            return;
                        if (!!(__VLS_ctx.applications.length === 0))
                            return;
                        if (!(__VLS_ctx.normalizeStatus(application.status) === 'pending'))
                            return;
                        __VLS_ctx.cancelApplication(application.id);
                        // @ts-ignore
                        [cancelApplication,];
                    } }, { disabled: (__VLS_ctx.cancelingId === application.id) }), { class: "btn-cancel" }));
                // @ts-ignore
                [cancelingId,];
                (__VLS_ctx.cancelingId === application.id ? '撤销中...' : '撤销申请');
                // @ts-ignore
                [cancelingId,];
            }
        };
        for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.applications)); _b < _c.length; _b++) {
            var application = _c[_b][0];
            _loop_2(application);
        }
    }
}
if (__VLS_ctx.activeTab === 'likes') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-section" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "section-head" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "section-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "category-toggle pill-toggle" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'likes'))
                return;
            __VLS_ctx.likeCategory = 'pet';
            // @ts-ignore
            [likeCategory,];
        } }, { class: "pill-option" }), { type: "button" }), { class: ({ active: __VLS_ctx.likeCategory === 'pet' }) }));
    // @ts-ignore
    [likeCategory,];
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "pill-icon" }, { viewBox: "0 0 24 24", 'aria-hidden': "true" }));
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "6",
        cy: "9",
        r: "2.4",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "18",
        cy: "9",
        r: "2.4",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "9",
        cy: "4.5",
        r: "2.2",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "15",
        cy: "4.5",
        r: "2.2",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M12 11c-2.7 0-5.2 1.7-5.2 4.6 0 2.4 2 4.4 5.2 4.4s5.2-2 5.2-4.4C17.2 12.7 14.7 11 12 11Z",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'likes'))
                return;
            __VLS_ctx.likeCategory = 'article';
            // @ts-ignore
            [likeCategory,];
        } }, { class: "pill-option" }), { type: "button" }), { class: ({ active: __VLS_ctx.likeCategory === 'article' }) }));
    // @ts-ignore
    [likeCategory,];
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "pill-icon" }, { viewBox: "0 0 24 24", 'aria-hidden': "true" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M14 3v4a1 1 0 0 0 1 1h4",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M9 13h6",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M9 17h4",
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    if (__VLS_ctx.filteredLikedItems.length) {
        // @ts-ignore
        [filteredLikedItems,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "count-badge" }));
        (__VLS_ctx.filteredLikedItems.length);
        // @ts-ignore
        [filteredLikedItems,];
    }
    if (__VLS_ctx.loadingLikes) {
        // @ts-ignore
        [loadingLikes,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "loading-message" }));
    }
    else if (__VLS_ctx.filteredLikedItems.length === 0) {
        // @ts-ignore
        [filteredLikedItems,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "empty-message" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "likes-grid" }));
        var _loop_3 = function (item) {
            // @ts-ignore
            [filteredLikedItems,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: ("".concat(item.type, "-").concat(item.id)) }, { class: "like-item" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "item-image" }));
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (__VLS_ctx.getItemImage(item)),
                alt: (item.title),
            });
            // @ts-ignore
            [getItemImage,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "item-info" }));
            __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
            (item.title);
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "item-type" }));
            (__VLS_ctx.getItemTypeLabel(item.type));
            // @ts-ignore
            [getItemTypeLabel,];
            if (item.description) {
                __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "item-description" }));
                (item.description);
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "item-actions" }));
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.activeTab === 'likes'))
                        return;
                    if (!!(__VLS_ctx.loadingLikes))
                        return;
                    if (!!(__VLS_ctx.filteredLikedItems.length === 0))
                        return;
                    __VLS_ctx.viewLikedItem(item);
                    // @ts-ignore
                    [viewLikedItem,];
                } }, { class: "btn-view-item" }));
        };
        for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.filteredLikedItems)); _d < _e.length; _d++) {
            var item = _e[_d][0];
            _loop_3(item);
        }
    }
}
if (__VLS_ctx.activeTab === 'favorites') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "profile-section" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "section-head" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "section-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "category-toggle pill-toggle" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'favorites'))
                return;
            __VLS_ctx.favoriteCategory = 'pet';
            // @ts-ignore
            [favoriteCategory,];
        } }, { class: "pill-option" }), { type: "button" }), { class: ({ active: __VLS_ctx.favoriteCategory === 'pet' }) }));
    // @ts-ignore
    [favoriteCategory,];
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "pill-icon" }, { viewBox: "0 0 24 24", 'aria-hidden': "true" }));
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "6",
        cy: "9",
        r: "2.4",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "18",
        cy: "9",
        r: "2.4",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "9",
        cy: "4.5",
        r: "2.2",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "15",
        cy: "4.5",
        r: "2.2",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M12 11c-2.7 0-5.2 1.7-5.2 4.6 0 2.4 2 4.4 5.2 4.4s5.2-2 5.2-4.4C17.2 12.7 14.7 11 12 11Z",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.activeTab === 'favorites'))
                return;
            __VLS_ctx.favoriteCategory = 'article';
            // @ts-ignore
            [favoriteCategory,];
        } }, { class: "pill-option" }), { type: "button" }), { class: ({ active: __VLS_ctx.favoriteCategory === 'article' }) }));
    // @ts-ignore
    [favoriteCategory,];
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)(__assign({ class: "pill-icon" }, { viewBox: "0 0 24 24", 'aria-hidden': "true" }));
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M14 3v4a1 1 0 0 0 1 1h4",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M9 13h6",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "M9 17h4",
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    if (__VLS_ctx.filteredFavoriteItems.length) {
        // @ts-ignore
        [filteredFavoriteItems,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "count-badge" }));
        (__VLS_ctx.filteredFavoriteItems.length);
        // @ts-ignore
        [filteredFavoriteItems,];
    }
    if (__VLS_ctx.loadingFavorites) {
        // @ts-ignore
        [loadingFavorites,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "loading-message" }));
    }
    else if (__VLS_ctx.filteredFavoriteItems.length === 0) {
        // @ts-ignore
        [filteredFavoriteItems,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "empty-message" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "favorites-grid" }));
        var _loop_4 = function (item) {
            // @ts-ignore
            [filteredFavoriteItems,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: ("".concat(item.type, "-").concat(item.id)) }, { class: "favorite-item" }));
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "item-image" }));
            __VLS_asFunctionalElement(__VLS_elements.img)({
                src: (__VLS_ctx.getItemImage(item)),
                alt: (item.title),
            });
            // @ts-ignore
            [getItemImage,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "item-info" }));
            __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({});
            (item.title);
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "item-type" }));
            (__VLS_ctx.getItemTypeLabel(item.type));
            // @ts-ignore
            [getItemTypeLabel,];
            if (item.description) {
                __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "item-description" }));
                (item.description);
            }
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "item-actions" }));
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.activeTab === 'favorites'))
                        return;
                    if (!!(__VLS_ctx.loadingFavorites))
                        return;
                    if (!!(__VLS_ctx.filteredFavoriteItems.length === 0))
                        return;
                    __VLS_ctx.viewFavoriteItem(item);
                    // @ts-ignore
                    [viewFavoriteItem,];
                } }, { class: "btn-view-item" }));
        };
        for (var _f = 0, _g = __VLS_getVForSourceType((__VLS_ctx.filteredFavoriteItems)); _f < _g.length; _f++) {
            var item = _g[_f][0];
            _loop_4(item);
        }
    }
}
/** @type {__VLS_StyleScopedClasses['profile-container']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-content']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-edit-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-role']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-admin']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-main']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card__header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-link']} */ ;
/** @type {__VLS_StyleScopedClasses['password-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['password-form']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['certification-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status-info']} */ ;
/** @type {__VLS_StyleScopedClasses['status-label']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-resubmit']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message-rejected']} */ ;
/** @type {__VLS_StyleScopedClasses['reject-reason']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-resubmit']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-update-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['certification-form']} */ ;
/** @type {__VLS_StyleScopedClasses['notice']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['certification-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-head']} */ ;
/** @type {__VLS_StyleScopedClasses['application-count']} */ ;
/** @type {__VLS_StyleScopedClasses['applications-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['no-applications']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-browse-pets']} */ ;
/** @type {__VLS_StyleScopedClasses['applications-list']} */ ;
/** @type {__VLS_StyleScopedClasses['application-item']} */ ;
/** @type {__VLS_StyleScopedClasses['application-pet']} */ ;
/** @type {__VLS_StyleScopedClasses['application-pet-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-name']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-category']} */ ;
/** @type {__VLS_StyleScopedClasses['application-body']} */ ;
/** @type {__VLS_StyleScopedClasses['application-header']} */ ;
/** @type {__VLS_StyleScopedClasses['application-no']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline']} */ ;
/** @type {__VLS_StyleScopedClasses['application-snippet']} */ ;
/** @type {__VLS_StyleScopedClasses['application-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-head']} */ ;
/** @type {__VLS_StyleScopedClasses['section-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['category-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-option']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-option']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['count-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-message']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-message']} */ ;
/** @type {__VLS_StyleScopedClasses['likes-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['like-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-image']} */ ;
/** @type {__VLS_StyleScopedClasses['item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['item-type']} */ ;
/** @type {__VLS_StyleScopedClasses['item-description']} */ ;
/** @type {__VLS_StyleScopedClasses['item-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view-item']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-head']} */ ;
/** @type {__VLS_StyleScopedClasses['section-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['category-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-option']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-option']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['pill-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['count-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-message']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-message']} */ ;
/** @type {__VLS_StyleScopedClasses['favorites-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['favorite-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-image']} */ ;
/** @type {__VLS_StyleScopedClasses['item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['item-type']} */ ;
/** @type {__VLS_StyleScopedClasses['item-description']} */ ;
/** @type {__VLS_StyleScopedClasses['item-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view-item']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
