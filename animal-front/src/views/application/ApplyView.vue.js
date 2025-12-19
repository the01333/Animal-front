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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var pinia_1 = require("pinia");
var element_plus_1 = require("element-plus");
var user_1 = require("@/stores/user");
var pet_1 = require("@/api/pet");
var application_1 = require("@/api/application");
var user_2 = require("@/api/user");
var image_1 = require("@/utils/image");
var route = (0, vue_router_1.useRoute)();
var router = (0, vue_router_1.useRouter)();
var userStore = (0, user_1.useUserStore)();
var userInfo = (0, pinia_1.storeToRefs)(userStore).userInfo;
var pet = (0, vue_1.ref)(null);
var defaultImage = 'http://localhost:9000/animal-adopt/default.jpg';
var currentStep = (0, vue_1.ref)(1);
var submitting = (0, vue_1.ref)(false);
var applicationId = (0, vue_1.ref)('');
var adopterInfo = (0, vue_1.ref)({
    name: '',
    phone: '',
    email: '',
    address: '',
    certificationStatus: 'not_submitted'
});
var applicationForm = (0, vue_1.ref)({
    livingType: '',
    houseSize: null,
    yard: '',
    familyMembers: [{ name: '', age: null }],
    hasPetExperience: '',
    currentPets: '',
    petKnowledge: '',
    reason: '',
    agreeAgreement: false
});
var steps = [
    { key: 'base', label: '确认信息' },
    { key: 'living', label: '居住环境' },
    { key: 'experience', label: '养宠经验' },
    { key: 'agreement', label: '承诺协议' },
    { key: 'success', label: '提交完成' }
];
var REMOVED_LIVING_TYPE_VALUES = new Set(['other', 'school', 'kindergarten']);
var REMOVED_LIVING_TYPE_LABELS = new Set(['其他', '学校', '幼儿园']);
var filterLivingTypeItems = function (list) {
    return list.filter(function (item) {
        return item &&
            !REMOVED_LIVING_TYPE_VALUES.has(item.value) &&
            !REMOVED_LIVING_TYPE_LABELS.has(item.label);
    });
};
var DEFAULT_LIVING_TYPES = filterLivingTypeItems([
    { label: '别墅/独栋', value: 'house' },
    { label: '公寓', value: 'apartment' },
    { label: '宿舍', value: 'dormitory' }
]);
var LIVING_TYPE_STORAGE_KEY = 'custom_living_types';
var livingTypeOptions = (0, vue_1.ref)(__spreadArray([], DEFAULT_LIVING_TYPES, true));
var showAddLivingTypeInput = (0, vue_1.ref)(false);
var newLivingTypeName = (0, vue_1.ref)('');
var livingTypeError = (0, vue_1.ref)('');
var ensureLivingTypeValid = function () {
    if (!applicationForm.value.livingType)
        return;
    var exists = livingTypeOptions.value.some(function (item) { return item.value === applicationForm.value.livingType; });
    if (!exists) {
        applicationForm.value.livingType = '';
    }
};
var petImage = (0, vue_1.computed)(function () {
    if (!pet.value)
        return defaultImage;
    var cover = Array.isArray(pet.value.images) ? pet.value.images[0] : pet.value.coverImage;
    return (0, image_1.processImageUrl)(cover) || defaultImage;
});
var statusText = (0, vue_1.computed)(function () {
    if (!pet.value)
        return '—';
    var status = String(pet.value.adoptionStatus || '').toLowerCase();
    switch (status) {
        case 'available':
            return '可领养';
        case 'pending':
            return '审核中';
        case 'adopted':
            return '已领养';
        default:
            return '未知状态';
    }
});
var statusClass = (0, vue_1.computed)(function () {
    var _a;
    var status = String(((_a = pet.value) === null || _a === void 0 ? void 0 : _a.adoptionStatus) || 'unknown').toLowerCase();
    return "status-".concat(status);
});
var certificationStatusText = (0, vue_1.computed)(function () {
    switch (adopterInfo.value.certificationStatus) {
        case 'approved':
            return '已认证';
        case 'pending':
            return '审核中';
        case 'rejected':
            return '已拒绝';
        default:
            return '未认证';
    }
});
var certificationStatusClass = (0, vue_1.computed)(function () { return "cert-status ".concat(adopterInfo.value.certificationStatus); });
var isPersonalInfoComplete = (0, vue_1.computed)(function () { return !!(adopterInfo.value.name && adopterInfo.value.phone && adopterInfo.value.address); });
var showStatusActions = (0, vue_1.computed)(function () { return !isPersonalInfoComplete.value || adopterInfo.value.certificationStatus !== 'approved'; });
var showModifyInfoButton = (0, vue_1.computed)(function () { return isPersonalInfoComplete.value && adopterInfo.value.certificationStatus === 'approved'; });
var syncUserFromStore = function () {
    if (!userInfo.value)
        return;
    var info = userInfo.value;
    adopterInfo.value.name = info.realName || info.nickname || info.username || info.email || '用户';
    adopterInfo.value.phone = info.phone || '';
    adopterInfo.value.email = info.email || '';
    adopterInfo.value.address = info.address || '';
};
var loadLivingTypeOptions = function () {
    var stored = localStorage.getItem(LIVING_TYPE_STORAGE_KEY);
    if (!stored)
        return;
    try {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            var merged_1 = __spreadArray([], DEFAULT_LIVING_TYPES, true);
            parsed.forEach(function (item) {
                if (item && typeof item.value === 'string' && !merged_1.find(function (opt) { return opt.value === item.value; })) {
                    merged_1.push(item);
                }
            });
            livingTypeOptions.value = filterLivingTypeItems(merged_1);
            ensureLivingTypeValid();
        }
    }
    catch (error) {
        console.warn('解析居住类型失败', error);
    }
};
var saveCustomLivingTypes = function () {
    var custom = filterLivingTypeItems(livingTypeOptions.value.filter(function (item) { return !DEFAULT_LIVING_TYPES.find(function (def) { return def.value === item.value; }); }));
    localStorage.setItem(LIVING_TYPE_STORAGE_KEY, JSON.stringify(custom));
};
var openAddLivingType = function () {
    newLivingTypeName.value = '';
    livingTypeError.value = '';
    showAddLivingTypeInput.value = true;
};
var cancelAddLivingType = function () {
    showAddLivingTypeInput.value = false;
    newLivingTypeName.value = '';
    livingTypeError.value = '';
};
var confirmAddLivingType = function () {
    var name = newLivingTypeName.value.trim();
    if (!name) {
        livingTypeError.value = '请输入居住类型';
        return;
    }
    var value = name.toLowerCase().replace(/\s+/g, '_');
    if (livingTypeOptions.value.some(function (item) { return item.value === value || item.label === name; })) {
        livingTypeError.value = '该类型已存在';
        return;
    }
    livingTypeOptions.value = filterLivingTypeItems(__spreadArray(__spreadArray([], livingTypeOptions.value, true), [{ label: name, value: value }], false));
    applicationForm.value.livingType = value;
    saveCustomLivingTypes();
    cancelAddLivingType();
    element_plus_1.ElMessage.success('已新增居住类型');
};
var addFamilyMember = function () {
    applicationForm.value.familyMembers.push({ name: '', age: null });
};
var removeFamilyMember = function (index) {
    if (applicationForm.value.familyMembers.length === 1)
        return;
    applicationForm.value.familyMembers.splice(index, 1);
};
var goToProfileInfo = function () {
    router.push('/profile');
};
var goToCertification = function () {
    router.push({ name: 'profile', query: { tab: 'certification' } });
};
var validateStep = function (step) {
    switch (step) {
        case 1:
            if (!isPersonalInfoComplete.value) {
                element_plus_1.ElMessage.warning('请先完善个人信息');
                return false;
            }
            if (adopterInfo.value.certificationStatus !== 'approved') {
                element_plus_1.ElMessage.warning('请先完成领养者认证');
                return false;
            }
            return true;
        case 2:
            if (!applicationForm.value.livingType) {
                element_plus_1.ElMessage.warning('请选择居住类型');
                return false;
            }
            if (!applicationForm.value.houseSize || applicationForm.value.houseSize <= 0) {
                element_plus_1.ElMessage.warning('请填写正确的住房面积');
                return false;
            }
            if (!applicationForm.value.yard) {
                element_plus_1.ElMessage.warning('请选择是否有院子');
                return false;
            }
            if (!applicationForm.value.familyMembers.every(function (m) { return m.name && m.age !== null; })) {
                element_plus_1.ElMessage.warning('请完整填写家庭成员信息');
                return false;
            }
            return true;
        case 3:
            if (!applicationForm.value.hasPetExperience) {
                element_plus_1.ElMessage.warning('请选择是否有养宠经验');
                return false;
            }
            if (!applicationForm.value.petKnowledge.trim()) {
                element_plus_1.ElMessage.warning('请描述您对宠物知识的了解');
                return false;
            }
            if (!applicationForm.value.reason.trim()) {
                element_plus_1.ElMessage.warning('请填写申请原因');
                return false;
            }
            return true;
        case 4:
            if (!applicationForm.value.agreeAgreement) {
                element_plus_1.ElMessage.warning('请勾选领养承诺书');
                return false;
            }
            return true;
        default:
            return true;
    }
};
var nextStep = function () {
    if (!validateStep(currentStep.value))
        return;
    currentStep.value += 1;
};
var prevStep = function () {
    if (currentStep.value === 1)
        return;
    currentStep.value -= 1;
};
var buildFamilyInfo = function () {
    return applicationForm.value.familyMembers
        .map(function (member, index) { var _a; return "".concat(index + 1, ". ").concat(member.name, " (").concat((_a = member.age) !== null && _a !== void 0 ? _a : '-', "\u5C81)"); })
        .join('；');
};
var getLivingTypeLabel = function (value) { var _a; return ((_a = livingTypeOptions.value.find(function (item) { return item.value === value; })) === null || _a === void 0 ? void 0 : _a.label) || value; };
var buildCarePlan = function () {
    var yardText = applicationForm.value.yard === 'yes' ? '有院子' : '无院子';
    var experienceText = applicationForm.value.hasPetExperience === 'yes' ? '有养宠经验' : '暂无养宠经验';
    return "\u5C45\u4F4F\u7C7B\u578B\uFF1A".concat(getLivingTypeLabel(applicationForm.value.livingType), "\uFF1B\u4F4F\u623F\u9762\u79EF\uFF1A").concat(applicationForm.value.houseSize, "\u33A1\uFF1B").concat(yardText, "\uFF1B").concat(experienceText, "\uFF1B\u5BA0\u7269\u77E5\u8BC6\uFF1A").concat(applicationForm.value.petKnowledge);
};
var buildAdditionalInfo = function () { var _a; return ((_a = applicationForm.value.currentPets) === null || _a === void 0 ? void 0 : _a.trim()) || ''; };
var submitApplication = function () { return __awaiter(void 0, void 0, void 0, function () {
    var payload, res, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!pet.value) {
                    element_plus_1.ElMessage.error('未找到宠物信息，无法提交');
                    return [2 /*return*/];
                }
                if (!validateStep(4))
                    return [2 /*return*/];
                submitting.value = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                payload = {
                    petId: pet.value.id,
                    reason: applicationForm.value.reason.trim(),
                    familyInfo: buildFamilyInfo(),
                    careplan: buildCarePlan(),
                    additionalInfo: buildAdditionalInfo(),
                    contactPhone: adopterInfo.value.phone,
                    contactAddress: adopterInfo.value.address
                };
                return [4 /*yield*/, (0, application_1.submitApplication)(payload)];
            case 2:
                res = _a.sent();
                applicationId.value = String(res.data || '');
                currentStep.value = 5;
                element_plus_1.ElMessage.success('申请提交成功');
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.error('提交申请失败', error_1);
                element_plus_1.ElMessage.error('提交失败，请稍后再试');
                return [3 /*break*/, 5];
            case 4:
                submitting.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var loadPet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var petId, res, detail, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                petId = Number(route.params.petId);
                if (!petId)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, pet_1.getPetDetail)(petId)];
            case 2:
                res = _a.sent();
                detail = res.data;
                if (typeof detail.images === 'string') {
                    try {
                        detail.images = JSON.parse(detail.images);
                    }
                    catch (_b) {
                        detail.images = [];
                    }
                }
                pet.value = detail;
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('加载宠物信息失败', error_2);
                element_plus_1.ElMessage.error('加载宠物信息失败');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fetchCertificationInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, user_2.getCertificationInfo)()];
            case 1:
                res = _b.sent();
                adopterInfo.value.certificationStatus = (((_a = res.data) === null || _a === void 0 ? void 0 : _a.status) || 'not_submitted');
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.warn('获取认证状态失败', error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
(0, vue_1.watch)(userInfo, function () { return syncUserFromStore(); }, { immediate: true });
(0, vue_1.watch)(function () { return route.params.petId; }, function () {
    loadPet();
});
(0, vue_1.onMounted)(function () {
    syncUserFromStore();
    loadPet();
    loadLivingTypeOptions();
    fetchCertificationInfo();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pet-details']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-details']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-details']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-details']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-details']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-details']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-header']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-status']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-status']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-status']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-status']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['step-item']} */ ;
/** @type {__VLS_StyleScopedClasses['step-number']} */ ;
/** @type {__VLS_StyleScopedClasses['step-item']} */ ;
/** @type {__VLS_StyleScopedClasses['step-number']} */ ;
/** @type {__VLS_StyleScopedClasses['step-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['step-label']} */ ;
/** @type {__VLS_StyleScopedClasses['step-item']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['step-label']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add-type']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['member-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-header']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-header']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-side-card']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-side-card']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-side-card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['inline']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['inline']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-step']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-box']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-box']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-check']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-step']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step-header']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-header']} */ ;
/** @type {__VLS_StyleScopedClasses['step-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-actions__text']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-actions__text']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-actions__btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modify-info-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modify-info-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['status-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['status-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['status-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['status-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-go-modify']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-prev']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-next']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-prev']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-next']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit']} */ ;
/** @type {__VLS_StyleScopedClasses['success-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['member-item']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "apply-container" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "apply-header" }));
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
(((_a = __VLS_ctx.pet) === null || _a === void 0 ? void 0 : _a.name) || '——');
// @ts-ignore
[pet,];
if (__VLS_ctx.pet) {
    // @ts-ignore
    [pet,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-info-summary" }));
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.petImage),
        alt: (__VLS_ctx.pet.name),
    });
    // @ts-ignore
    [pet, petImage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-details" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    (__VLS_ctx.pet.name);
    // @ts-ignore
    [pet,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.pet.breed);
    (__VLS_ctx.pet.age);
    // @ts-ignore
    [pet, pet,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: (__VLS_ctx.statusClass) }));
    // @ts-ignore
    [statusClass,];
    (__VLS_ctx.statusText);
    // @ts-ignore
    [statusText,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "apply-content" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "apply-steps" }));
for (var _i = 0, _b = __VLS_getVForSourceType((__VLS_ctx.steps)); _i < _b.length; _i++) {
    var _c = _b[_i], step = _c[0], index = _c[1];
    // @ts-ignore
    [steps,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign(__assign({ key: (step.key) }, { class: "step-item" }), { class: ({ active: __VLS_ctx.currentStep === index + 1, completed: __VLS_ctx.currentStep > index + 1 }) }));
    // @ts-ignore
    [currentStep, currentStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-number" }));
    (index + 1);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-label" }));
    (step.label);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "apply-form" }));
if (__VLS_ctx.currentStep === 1) {
    // @ts-ignore
    [currentStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step-header" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step-title" }));
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-header-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "step-indicator step-indicator--info" }));
    if (__VLS_ctx.showModifyInfoButton) {
        // @ts-ignore
        [showModifyInfoButton,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.goToProfileInfo) }, { class: "modify-info-btn" }));
        // @ts-ignore
        [goToProfileInfo,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.adopterInfo.name || '—');
    // @ts-ignore
    [adopterInfo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.adopterInfo.phone || '—');
    // @ts-ignore
    [adopterInfo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.adopterInfo.email || '—');
    // @ts-ignore
    [adopterInfo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.adopterInfo.address || '—');
    // @ts-ignore
    [adopterInfo,];
    if (!__VLS_ctx.isPersonalInfoComplete) {
        // @ts-ignore
        [isPersonalInfoComplete,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info-actions" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info-actions__card" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info-actions__icon" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "user-info-actions__text" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "title" }));
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "desc" }));
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.goToProfileInfo) }, { class: "user-info-actions__btn" }));
        // @ts-ignore
        [goToProfileInfo,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "certification-status" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "status-item" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: (__VLS_ctx.certificationStatusClass) }));
    // @ts-ignore
    [certificationStatusClass,];
    (__VLS_ctx.certificationStatusText);
    // @ts-ignore
    [certificationStatusText,];
    if (__VLS_ctx.showStatusActions) {
        // @ts-ignore
        [showStatusActions,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "status-actions" }));
        if (__VLS_ctx.adopterInfo.certificationStatus !== 'approved') {
            // @ts-ignore
            [adopterInfo,];
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.goToCertification) }, { class: "btn-go-certification" }));
            // @ts-ignore
            [goToCertification,];
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.nextStep) }, { class: "btn-next" }));
    // @ts-ignore
    [nextStep,];
}
if (__VLS_ctx.currentStep === 2) {
    // @ts-ignore
    [currentStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step living-step" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step-header" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step-title" }));
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-header-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "step-indicator step-indicator--living" }));
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)(__assign({ onSubmit: (__VLS_ctx.nextStep) }));
    // @ts-ignore
    [nextStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group living-type-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "livingType",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "living-type-select" }));
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        id: "livingType",
        value: (__VLS_ctx.applicationForm.livingType),
        required: true,
    });
    // @ts-ignore
    [applicationForm,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "",
    });
    for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.livingTypeOptions)); _d < _e.length; _d++) {
        var item = _e[_d][0];
        // @ts-ignore
        [livingTypeOptions,];
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            key: (item.value),
            value: (item.value),
        });
        (item.label);
    }
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.openAddLivingType) }, { type: "button" }), { class: "btn-add-type" }));
    // @ts-ignore
    [openAddLivingType,];
    if (__VLS_ctx.showAddLivingTypeInput) {
        // @ts-ignore
        [showAddLivingTypeInput,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "add-type-inline" }));
        __VLS_asFunctionalElement(__VLS_elements.input)(__assign({ onKeyup: (__VLS_ctx.confirmAddLivingType) }, { value: (__VLS_ctx.newLivingTypeName), type: "text", maxlength: "20", placeholder: "请输入新的居住类型" }));
        // @ts-ignore
        [confirmAddLivingType, newLivingTypeName,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.confirmAddLivingType) }, { type: "button" }), { class: "btn-confirm" }));
        // @ts-ignore
        [confirmAddLivingType,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.cancelAddLivingType) }, { type: "button" }), { class: "btn-cancel" }));
        // @ts-ignore
        [cancelAddLivingType,];
    }
    if (__VLS_ctx.livingTypeError) {
        // @ts-ignore
        [livingTypeError,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "error-text" }));
        (__VLS_ctx.livingTypeError);
        // @ts-ignore
        [livingTypeError,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "houseSize",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        id: "houseSize",
        type: "number",
        min: "0",
        required: true,
    });
    (__VLS_ctx.applicationForm.houseSize);
    // @ts-ignore
    [applicationForm,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "yard",
    });
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        id: "yard",
        value: (__VLS_ctx.applicationForm.yard),
        required: true,
    });
    // @ts-ignore
    [applicationForm,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "yes",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "no",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "family-members" }));
    var _loop_1 = function (member, index) {
        // @ts-ignore
        [applicationForm,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (index) }, { class: "member-item" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "member-fields" }));
        __VLS_asFunctionalElement(__VLS_elements.input)({
            value: (member.name),
            type: "text",
            placeholder: "姓名",
            required: true,
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "number",
            placeholder: "年龄",
            min: "0",
            required: true,
        });
        (member.age);
        if (__VLS_ctx.applicationForm.familyMembers.length > 1 && index > 0) {
            // @ts-ignore
            [applicationForm,];
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.currentStep === 2))
                        return;
                    if (!(__VLS_ctx.applicationForm.familyMembers.length > 1 && index > 0))
                        return;
                    __VLS_ctx.removeFamilyMember(index);
                    // @ts-ignore
                    [removeFamilyMember,];
                } }, { type: "button" }), { class: "btn-remove" }));
        }
    };
    for (var _f = 0, _g = __VLS_getVForSourceType((__VLS_ctx.applicationForm.familyMembers)); _f < _g.length; _f++) {
        var _h = _g[_f], member = _h[0], index = _h[1];
        _loop_1(member, index);
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "family-members-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.addFamilyMember) }, { type: "button" }), { class: "btn-add-member" }));
    // @ts-ignore
    [addFamilyMember,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.prevStep) }, { type: "button" }), { class: "btn-prev" }));
    // @ts-ignore
    [prevStep,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ type: "submit" }, { class: "btn-next" }));
}
if (__VLS_ctx.currentStep === 3) {
    // @ts-ignore
    [currentStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step experience-step" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "experience-header" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "step-indicator step-indicator--experience" }));
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)(__assign({ onSubmit: (__VLS_ctx.nextStep) }, { class: "experience-layout" }));
    // @ts-ignore
    [nextStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "experience-side-card" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "experience-fields" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group inline" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "hasPetExperience",
    });
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        id: "hasPetExperience",
        value: (__VLS_ctx.applicationForm.hasPetExperience),
        required: true,
    });
    // @ts-ignore
    [applicationForm,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "yes",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "no",
    });
    if (__VLS_ctx.applicationForm.hasPetExperience === 'yes') {
        // @ts-ignore
        [applicationForm,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            for: "currentPets",
        });
        __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
            id: "currentPets",
            value: (__VLS_ctx.applicationForm.currentPets),
            rows: "3",
            placeholder: "请描述宠物品种、性格、照料频次等情况",
        });
        // @ts-ignore
        [applicationForm,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "petKnowledge",
    });
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        id: "petKnowledge",
        value: (__VLS_ctx.applicationForm.petKnowledge),
        rows: "3",
        placeholder: "例如：疫苗驱虫、饮食搭配、行为训练等",
        required: true,
    });
    // @ts-ignore
    [applicationForm,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "reason",
    });
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        id: "reason",
        value: (__VLS_ctx.applicationForm.reason),
        rows: "3",
        placeholder: "分享您选择这只宠物的原因，以及未来生活规划",
        required: true,
    });
    // @ts-ignore
    [applicationForm,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.prevStep) }, { type: "button" }), { class: "btn-prev" }));
    // @ts-ignore
    [prevStep,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ type: "submit" }, { class: "btn-next" }));
}
if (__VLS_ctx.currentStep === 4) {
    // @ts-ignore
    [currentStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step agreement-step" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agreement-content" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agreement-hero" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agreement-icon" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)(__assign({ class: "agreement-eyebrow" }));
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agreement-columns" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agreement-box" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.ol, __VLS_elements.ol)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "agreement-box" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.ol, __VLS_elements.ol)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "commitment-quote" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)(__assign({ class: "checkbox-label agreement-check" }));
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "checkbox",
        required: true,
    });
    (__VLS_ctx.applicationForm.agreeAgreement);
    // @ts-ignore
    [applicationForm,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "step-actions" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.prevStep) }, { type: "button" }), { class: "btn-prev" }));
    // @ts-ignore
    [prevStep,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.submitApplication) }, { class: "btn-submit" }), { disabled: (__VLS_ctx.submitting) }));
    // @ts-ignore
    [submitApplication, submitting,];
    (__VLS_ctx.submitting ? '提交中...' : '提交申请');
    // @ts-ignore
    [submitting,];
}
if (__VLS_ctx.currentStep === 5) {
    // @ts-ignore
    [currentStep,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "form-step success-step" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "success-icon" }));
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (__VLS_ctx.applicationId);
    // @ts-ignore
    [applicationId,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "success-actions" }));
    var __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "btn-view-applications" }, { to: "/applications" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "btn-view-applications" }, { to: "/applications" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_4 = __VLS_3.slots.default;
    var __VLS_3;
    var __VLS_5 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5(__assign({ class: "btn-home" }, { to: "/" })));
    var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign({ class: "btn-home" }, { to: "/" })], __VLS_functionalComponentArgsRest(__VLS_6), false));
    var __VLS_9 = __VLS_8.slots.default;
    var __VLS_8;
}
/** @type {__VLS_StyleScopedClasses['apply-container']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-header']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-details']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-content']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['step-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['completed']} */ ;
/** @type {__VLS_StyleScopedClasses['step-number']} */ ;
/** @type {__VLS_StyleScopedClasses['step-label']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step-title']} */ ;
/** @type {__VLS_StyleScopedClasses['step-header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['step-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['step-indicator--info']} */ ;
/** @type {__VLS_StyleScopedClasses['modify-info-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-actions__card']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-actions__icon']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-actions__text']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['desc']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info-actions__btn']} */ ;
/** @type {__VLS_StyleScopedClasses['certification-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status-item']} */ ;
/** @type {__VLS_StyleScopedClasses['status-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-go-certification']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-next']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step']} */ ;
/** @type {__VLS_StyleScopedClasses['living-step']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step-title']} */ ;
/** @type {__VLS_StyleScopedClasses['step-header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['step-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['step-indicator--living']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['living-type-group']} */ ;
/** @type {__VLS_StyleScopedClasses['living-type-select']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add-type']} */ ;
/** @type {__VLS_StyleScopedClasses['add-type-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['error-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['family-members']} */ ;
/** @type {__VLS_StyleScopedClasses['member-item']} */ ;
/** @type {__VLS_StyleScopedClasses['member-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-remove']} */ ;
/** @type {__VLS_StyleScopedClasses['family-members-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add-member']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-prev']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-next']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-step']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-header']} */ ;
/** @type {__VLS_StyleScopedClasses['step-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['step-indicator--experience']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-side-card']} */ ;
/** @type {__VLS_StyleScopedClasses['experience-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['inline']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-prev']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-next']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-step']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-content']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-columns']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-box']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-box']} */ ;
/** @type {__VLS_StyleScopedClasses['commitment-quote']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['agreement-check']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-prev']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-submit']} */ ;
/** @type {__VLS_StyleScopedClasses['form-step']} */ ;
/** @type {__VLS_StyleScopedClasses['success-step']} */ ;
/** @type {__VLS_StyleScopedClasses['success-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['success-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view-applications']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-home']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
