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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var pinia_1 = require("pinia");
var user_1 = require("@/stores/user");
var authHelper_1 = require("@/utils/authHelper");
var icons_vue_1 = require("@element-plus/icons-vue");
var pet_1 = require("@/api/pet");
var favorite_1 = require("@/api/favorite");
var like_1 = require("@/api/like");
var application_1 = require("@/api/application");
var element_plus_1 = require("element-plus");
var route = (0, vue_router_1.useRoute)();
var router = (0, vue_router_1.useRouter)();
var userStore = (0, user_1.useUserStore)();
var isLoggedIn = (0, pinia_1.storeToRefs)(userStore).isLoggedIn;
var pet = (0, vue_1.ref)(null);
var defaultImage = 'http://localhost:9000/animal-adopt/default.jpg';
// 当前登录用户ID
var currentUserId = (0, vue_1.ref)(null);
// 随机推荐宠物
var recommendedPets = (0, vue_1.ref)([]);
var randomPetImages = (0, vue_1.ref)([]);
// 图片预览
var imageViewerVisible = (0, vue_1.ref)(false);
var imageViewerIndex = (0, vue_1.ref)(0);
var allGalleryImages = (0, vue_1.computed)(function () {
    return randomPetImages.value;
});
var adoptionNotices = (0, vue_1.ref)([
    {
        title: '年龄要求',
        content: '领养者需年满18周岁，具有完全民事行为能力'
    },
    {
        title: '居住环境',
        content: '需要有稳定的住所，且住所允许饲养宠物'
    },
    {
        title: '经济能力',
        content: '有稳定的收入来源，能够承担宠物的日常开销和医疗费用'
    },
    {
        title: '时间精力',
        content: '有足够的时间和精力照顾宠物，给予它充分的陪伴'
    },
    {
        title: '家人同意',
        content: '家庭成员都同意领养宠物，且无人对宠物过敏'
    },
    {
        title: '终身承诺',
        content: '承诺对宠物负责到底，不因任何原因遗弃宠物'
    }
]);
var genderText = (0, vue_1.computed)(function () {
    if (!pet.value)
        return '';
    return pet.value.gender === 1 ? '雄性 ♂' : pet.value.gender === 2 ? '雌性 ♀' : '未知';
});
var statusText = (0, vue_1.computed)(function () {
    if (!pet.value)
        return '';
    var s = String(pet.value.adoptionStatus || '');
    switch (s.toLowerCase()) {
        case 'available': return '可领养';
        case 'adopted': return '已领养';
        case 'pending': return '领养中';
        default: return '未知';
    }
});
var statusType = (0, vue_1.computed)(function () {
    if (!pet.value)
        return 'info';
    var s = String(pet.value.adoptionStatus || '').toLowerCase();
    switch (s) {
        case 'available': return 'success';
        case 'adopted': return 'primary';
        case 'pending': return 'warning';
        default: return 'info';
    }
});
var healthText = (0, vue_1.computed)(function () {
    if (!pet.value)
        return '';
    var s = String(pet.value.healthStatus || '').toLowerCase();
    switch (s) {
        case 'healthy': return '健康';
        case 'sick': return '生病';
        case 'injured': return '受伤';
        case 'recovering': return '恢复中';
        default: return '未知';
    }
});
var healthTagType = (0, vue_1.computed)(function () {
    if (!pet.value)
        return 'info';
    var s = String(pet.value.healthStatus || '').toLowerCase();
    switch (s) {
        case 'healthy': return 'success';
        case 'sick': return 'danger';
        case 'injured': return 'danger';
        case 'recovering': return 'warning';
        default: return 'info';
    }
});
var handleBack = function () {
    if (route.query.from === 'profile') {
        var tab = route.query.tab || 'likes';
        var category = route.query.category;
        router.push({ name: 'profile', query: { tab: tab, category: category } });
        return;
    }
    if (route.query.from === 'application-detail' && route.query.applicationId) {
        router.push({ name: 'application-detail', params: { id: route.query.applicationId } });
        return;
    }
    router.push('/pets');
};
var applyForAdoption = function () {
    if (!isLoggedIn.value) {
        element_plus_1.ElMessage.warning('请先登录后再申请领养');
        (0, authHelper_1.openAuthDialog)('login');
        return;
    }
    if (pet.value) {
        router.push("/apply/".concat(pet.value.id));
    }
};
var checkApplication = function () {
    router.push('/applications');
};
var favored = (0, vue_1.ref)(false);
var liked = (0, vue_1.ref)(false);
var favoriteCount = (0, vue_1.ref)(0);
var likeCount = (0, vue_1.ref)(0);
// 当前申请的状态
var applicationStatus = (0, vue_1.ref)('');
// 判断宠物是否由当前用户领养
var isCurrentUserAdopted = (0, vue_1.computed)(function () {
    var _a;
    if (!pet.value || !currentUserId.value)
        return false;
    // 检查宠物是否已被领养，且领养者是当前用户
    return ((_a = pet.value.adoptionStatus) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'adopted' && pet.value.adoptedBy === currentUserId.value;
});
// 判断当前用户是否有有效的申请（待审核或已批准）
var hasValidApplication = (0, vue_1.computed)(function () {
    var _a;
    var status = (_a = applicationStatus.value) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    // 只有待审核和已批准状态才算有效申请
    return status === 'pending' || status === 'approved';
});
// 申请状态文本
var applicationStatusText = (0, vue_1.computed)(function () {
    var _a;
    var status = (_a = applicationStatus.value) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    var statusMap = {
        'pending': '待批准',
        'approved': '已批准',
        'rejected': '已拒绝',
        'cancelled': '已撤销'
    };
    return statusMap[status] || '查看申请状态';
});
// 检查用户是否已申请过该宠物
var checkIfUserApplied = function () { return __awaiter(void 0, void 0, void 0, function () {
    var petId, response, applications, application, status_1, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!isLoggedIn.value) {
                    applicationStatus.value = '';
                    return [2 /*return*/];
                }
                petId = Number(route.params.id || ((_a = pet.value) === null || _a === void 0 ? void 0 : _a.id));
                if (!petId) {
                    applicationStatus.value = '';
                    return [2 /*return*/];
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, application_1.getMyApplications)({
                        current: 1,
                        size: 100
                    })];
            case 2:
                response = _d.sent();
                applications = ((_b = response.data) === null || _b === void 0 ? void 0 : _b.records) || [];
                application = applications.find(function (app) { return app.petId === petId; });
                if (!application) {
                    // 未申请过
                    applicationStatus.value = '';
                    console.log("\u2705 \u68C0\u67E5\u7533\u8BF7\u72B6\u6001: \u672A\u7533\u8BF7");
                    return [2 /*return*/];
                }
                status_1 = (_c = application.status) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                applicationStatus.value = status_1 || '';
                console.log("\u2705 \u68C0\u67E5\u7533\u8BF7\u72B6\u6001: \u7533\u8BF7\u72B6\u6001\u4E3A ".concat(status_1));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                console.error('❌ 检查申请状态失败:', error_1);
                applicationStatus.value = '';
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 获取随机宠物图片
var fetchRandomPetImages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, pet_1.getRandomPetImages)(6)];
            case 1:
                response = _a.sent();
                randomPetImages.value = response.data || [];
                console.log('✅ 获取随机宠物图片成功，共', randomPetImages.value.length, '张');
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('❌ 获取随机宠物图片失败:', error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var fetchPetDetail = function () { return __awaiter(void 0, void 0, void 0, function () {
    var petId, res, detail, favCountRes, e_1, likeCountRes, e_2, favRes, e_3, likeRes, e_4, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                petId = parseInt(route.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 19, , 20]);
                return [4 /*yield*/, (0, pet_1.getPetDetail)(petId)];
            case 2:
                res = _a.sent();
                if (!(res.code === 200)) return [3 /*break*/, 17];
                detail = res.data;
                detail.images = typeof detail.images === 'string' ? JSON.parse(detail.images || '[]') : detail.images;
                pet.value = detail;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, favorite_1.getPetFavoriteCount)(petId)];
            case 4:
                favCountRes = _a.sent();
                favoriteCount.value = favCountRes.data || 0;
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                favoriteCount.value = 0;
                return [3 /*break*/, 6];
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, (0, like_1.getPetLikeCount)(petId)];
            case 7:
                likeCountRes = _a.sent();
                likeCount.value = likeCountRes.data || 0;
                return [3 /*break*/, 9];
            case 8:
                e_2 = _a.sent();
                likeCount.value = 0;
                return [3 /*break*/, 9];
            case 9:
                if (!isLoggedIn.value) return [3 /*break*/, 16];
                _a.label = 10;
            case 10:
                _a.trys.push([10, 12, , 13]);
                return [4 /*yield*/, (0, favorite_1.isPetFavorited)(petId)];
            case 11:
                favRes = _a.sent();
                favored.value = !!favRes.data;
                return [3 /*break*/, 13];
            case 12:
                e_3 = _a.sent();
                // 获取收藏状态失败，保持默认值
                favored.value = false;
                return [3 /*break*/, 13];
            case 13:
                _a.trys.push([13, 15, , 16]);
                return [4 /*yield*/, (0, like_1.isPetLiked)(petId)];
            case 14:
                likeRes = _a.sent();
                liked.value = !!likeRes.data;
                return [3 /*break*/, 16];
            case 15:
                e_4 = _a.sent();
                // 获取点赞状态失败，保持默认值
                liked.value = false;
                return [3 /*break*/, 16];
            case 16: return [3 /*break*/, 18];
            case 17:
                element_plus_1.ElMessage.error(res.message || '获取宠物详情失败');
                _a.label = 18;
            case 18: return [3 /*break*/, 20];
            case 19:
                e_5 = _a.sent();
                element_plus_1.ElMessage.error('获取宠物详情失败');
                return [3 /*break*/, 20];
            case 20: return [2 /*return*/];
        }
    });
}); };
var toggleFavorite = function () { return __awaiter(void 0, void 0, void 0, function () {
    var id, e_6, petId, favRes;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!isLoggedIn.value) {
                    element_plus_1.ElMessage.warning('请先登录后再进行收藏操作');
                    (0, authHelper_1.openAuthDialog)('login');
                    return [2 /*return*/];
                }
                if (!pet.value)
                    return [2 /*return*/];
                id = pet.value.id;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 10]);
                if (!favored.value) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, favorite_1.removePetFavorite)(id)];
            case 2:
                _e.sent();
                favored.value = false;
                element_plus_1.ElMessage.success('已取消收藏');
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, favorite_1.addPetFavorite)(id)];
            case 4:
                _e.sent();
                favored.value = true;
                element_plus_1.ElMessage.success('已收藏');
                _e.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6:
                e_6 = _e.sent();
                if (!(((_c = (_b = (_a = e_6.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.includes('Duplicate')) || ((_d = e_6.message) === null || _d === void 0 ? void 0 : _d.includes('Duplicate')))) return [3 /*break*/, 7];
                favored.value = true;
                element_plus_1.ElMessage.success('已收藏');
                return [3 /*break*/, 9];
            case 7:
                element_plus_1.ElMessage.error('操作失败，请稍后重试');
                petId = parseInt(route.params.id);
                return [4 /*yield*/, (0, favorite_1.isPetFavorited)(petId)];
            case 8:
                favRes = _e.sent();
                favored.value = !!favRes.data;
                _e.label = 9;
            case 9: return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
var toggleLike = function () { return __awaiter(void 0, void 0, void 0, function () {
    var id, e_7, petId, likeRes;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!isLoggedIn.value) {
                    element_plus_1.ElMessage.warning('请先登录后再进行点赞操作');
                    (0, authHelper_1.openAuthDialog)('login');
                    return [2 /*return*/];
                }
                if (!pet.value)
                    return [2 /*return*/];
                id = pet.value.id;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 10]);
                if (!liked.value) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, like_1.unlikePet)(id)];
            case 2:
                _e.sent();
                liked.value = false;
                element_plus_1.ElMessage.success('已取消点赞');
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, like_1.likePet)(id)];
            case 4:
                _e.sent();
                liked.value = true;
                element_plus_1.ElMessage.success('已点赞');
                _e.label = 5;
            case 5: return [3 /*break*/, 10];
            case 6:
                e_7 = _e.sent();
                if (!(((_c = (_b = (_a = e_7.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.includes('Duplicate')) || ((_d = e_7.message) === null || _d === void 0 ? void 0 : _d.includes('Duplicate')))) return [3 /*break*/, 7];
                liked.value = true;
                element_plus_1.ElMessage.success('已点赞');
                return [3 /*break*/, 9];
            case 7:
                element_plus_1.ElMessage.error('操作失败，请稍后重试');
                petId = parseInt(route.params.id);
                return [4 /*yield*/, (0, like_1.isPetLiked)(petId)];
            case 8:
                likeRes = _e.sent();
                liked.value = !!likeRes.data;
                _e.label = 9;
            case 9: return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
/**
 * 更新点赞和收藏状态（仅当登录时）
 */
var updateLikeAndFavoriteStatus = function () { return __awaiter(void 0, void 0, void 0, function () {
    var petId, favRes, e_8, likeRes, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!pet.value)
                    return [2 /*return*/];
                petId = pet.value.id;
                console.log('🔄 更新点赞和收藏状态, isLoggedIn:', isLoggedIn.value);
                if (!isLoggedIn.value) return [3 /*break*/, 8];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log('📝 查询是否已收藏...');
                return [4 /*yield*/, (0, favorite_1.isPetFavorited)(petId)];
            case 2:
                favRes = _a.sent();
                console.log('✅ 收藏状态:', favRes.data);
                favored.value = !!favRes.data;
                return [3 /*break*/, 4];
            case 3:
                e_8 = _a.sent();
                console.error('❌ 查询收藏状态失败:', e_8);
                favored.value = false;
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                console.log('📝 查询是否已点赞...');
                return [4 /*yield*/, (0, like_1.isPetLiked)(petId)];
            case 5:
                likeRes = _a.sent();
                console.log('✅ 点赞状态:', likeRes.data);
                liked.value = !!likeRes.data;
                return [3 /*break*/, 7];
            case 6:
                e_9 = _a.sent();
                console.error('❌ 查询点赞状态失败:', e_9);
                liked.value = false;
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                // 未登录时重置状态
                console.log('🔄 未登录，重置状态');
                favored.value = false;
                liked.value = false;
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
// 初始化用户信息
var initUserInfo = function () {
    if (currentUserId.value)
        return;
    var userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            var user = JSON.parse(userInfo);
            currentUserId.value = user.id || user.userId;
        }
        catch (e) {
            console.error('解析用户信息失败:', e);
        }
    }
};
(0, vue_1.onMounted)(function () {
    initUserInfo();
    fetchRandomPetImages();
    fetchPetDetail();
    checkIfUserApplied();
});
// 监听路由参数变化，当宠物ID改变时重新加载数据
(0, vue_1.watch)(function () { return route.params.id; }, function (newId) {
    if (newId) {
        console.log('🔄 宠物ID变化，重新加载数据:', newId);
        fetchRandomPetImages();
        fetchPetDetail();
        checkIfUserApplied();
    }
}, { immediate: false });
// 监听登录状态变化，重新查询点赞和收藏状态
(0, vue_1.watch)(function () { return isLoggedIn.value; }, function (newVal) {
    console.log('👁️ 登录状态变化:', newVal);
    // 如果已经加载了宠物详情，重新查询点赞和收藏状态
    if (pet.value) {
        updateLikeAndFavoriteStatus();
        checkIfUserApplied();
    }
}, { immediate: false });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['gallery-image']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-name']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-main-image']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['gallery-image']} */ ;
if (__VLS_ctx.pet) {
    // @ts-ignore
    [pet,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-detail" }));
    var __VLS_0 = {}.ElPageHeader;
    /** @type {[typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, ]} */ ;
    // @ts-ignore
    ElPageHeader;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ 'onBack': {} }, { class: "page-header" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onBack': {} }, { class: "page-header" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_4 = void 0;
    var __VLS_5 = void 0;
    var __VLS_6 = ({ back: {} },
        { onBack: (__VLS_ctx.handleBack) });
    var __VLS_7 = __VLS_3.slots.default;
    // @ts-ignore
    [handleBack,];
    {
        var __VLS_8 = __VLS_3.slots.content;
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "header-content" }));
        var __VLS_9 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9(__assign({ class: "header-icon" })));
        var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([__assign({ class: "header-icon" })], __VLS_functionalComponentArgsRest(__VLS_10), false));
        var __VLS_13 = __VLS_12.slots.default;
        var __VLS_14 = {}.Star;
        /** @type {[typeof __VLS_components.Star, ]} */ ;
        // @ts-ignore
        icons_vue_1.Star;
        // @ts-ignore
        var __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
        var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_15), false));
        var __VLS_12;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "header-title" }));
    }
    var __VLS_3;
    var __VLS_19 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    ElCard;
    // @ts-ignore
    var __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19(__assign({ class: "pet-header-card" }, { shadow: "hover" })));
    var __VLS_21 = __VLS_20.apply(void 0, __spreadArray([__assign({ class: "pet-header-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_20), false));
    var __VLS_23 = __VLS_22.slots.default;
    var __VLS_24 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    ElRow;
    // @ts-ignore
    var __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        gutter: (30),
    }));
    var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([{
            gutter: (30),
        }], __VLS_functionalComponentArgsRest(__VLS_25), false));
    var __VLS_28 = __VLS_27.slots.default;
    var __VLS_29 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    ElCol;
    // @ts-ignore
    var __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        xs: (24),
        md: (12),
    }));
    var __VLS_31 = __VLS_30.apply(void 0, __spreadArray([{
            xs: (24),
            md: (12),
        }], __VLS_functionalComponentArgsRest(__VLS_30), false));
    var __VLS_33 = __VLS_32.slots.default;
    var __VLS_34 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    ElImage;
    // @ts-ignore
    var __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34(__assign({ src: ((__VLS_ctx.pet.images && __VLS_ctx.pet.images[0]) || __VLS_ctx.defaultImage), alt: (__VLS_ctx.pet.name), fit: "cover" }, { class: "pet-main-image" })));
    var __VLS_36 = __VLS_35.apply(void 0, __spreadArray([__assign({ src: ((__VLS_ctx.pet.images && __VLS_ctx.pet.images[0]) || __VLS_ctx.defaultImage), alt: (__VLS_ctx.pet.name), fit: "cover" }, { class: "pet-main-image" })], __VLS_functionalComponentArgsRest(__VLS_35), false));
    var __VLS_38 = __VLS_37.slots.default;
    // @ts-ignore
    [pet, pet, pet, defaultImage,];
    {
        var __VLS_39 = __VLS_37.slots.placeholder;
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-slot" }));
        var __VLS_40 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40(__assign({ class: "is-loading" })));
        var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([__assign({ class: "is-loading" })], __VLS_functionalComponentArgsRest(__VLS_41), false));
        var __VLS_44 = __VLS_43.slots.default;
        var __VLS_45 = {}.Loading;
        /** @type {[typeof __VLS_components.Loading, ]} */ ;
        // @ts-ignore
        icons_vue_1.Loading;
        // @ts-ignore
        var __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
        var __VLS_47 = __VLS_46.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_46), false));
        var __VLS_43;
    }
    var __VLS_37;
    var __VLS_32;
    var __VLS_50 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    ElCol;
    // @ts-ignore
    var __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        xs: (24),
        md: (12),
    }));
    var __VLS_52 = __VLS_51.apply(void 0, __spreadArray([{
            xs: (24),
            md: (12),
        }], __VLS_functionalComponentArgsRest(__VLS_51), false));
    var __VLS_54 = __VLS_53.slots.default;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-info" }));
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)(__assign({ class: "pet-name" }));
    var __VLS_55 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55(__assign({ class: "name-icon" })));
    var __VLS_57 = __VLS_56.apply(void 0, __spreadArray([__assign({ class: "name-icon" })], __VLS_functionalComponentArgsRest(__VLS_56), false));
    var __VLS_59 = __VLS_58.slots.default;
    var __VLS_60 = {}.Star;
    /** @type {[typeof __VLS_components.Star, ]} */ ;
    // @ts-ignore
    icons_vue_1.Star;
    // @ts-ignore
    var __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
    var __VLS_62 = __VLS_61.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_61), false));
    var __VLS_58;
    (__VLS_ctx.pet.name);
    // @ts-ignore
    [pet,];
    var __VLS_65 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65(__assign({ type: (__VLS_ctx.statusType), size: "large", effect: "dark" }, { class: "status-tag" })));
    var __VLS_67 = __VLS_66.apply(void 0, __spreadArray([__assign({ type: (__VLS_ctx.statusType), size: "large", effect: "dark" }, { class: "status-tag" })], __VLS_functionalComponentArgsRest(__VLS_66), false));
    var __VLS_69 = __VLS_68.slots.default;
    // @ts-ignore
    [statusType,];
    (__VLS_ctx.statusText);
    // @ts-ignore
    [statusText,];
    var __VLS_68;
    var __VLS_70 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    ElDescriptions;
    // @ts-ignore
    var __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
        column: (2),
        border: true,
        size: "large",
    }));
    var __VLS_72 = __VLS_71.apply(void 0, __spreadArray([{
            column: (2),
            border: true,
            size: "large",
        }], __VLS_functionalComponentArgsRest(__VLS_71), false));
    var __VLS_74 = __VLS_73.slots.default;
    var __VLS_75 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({}));
    var __VLS_77 = __VLS_76.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_76), false));
    var __VLS_79 = __VLS_78.slots.default;
    {
        var __VLS_80 = __VLS_78.slots.label;
        var __VLS_81 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
        var __VLS_83 = __VLS_82.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_82), false));
        var __VLS_85 = __VLS_84.slots.default;
        var __VLS_86 = {}.Grid;
        /** @type {[typeof __VLS_components.Grid, ]} */ ;
        // @ts-ignore
        icons_vue_1.Grid;
        // @ts-ignore
        var __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({}));
        var __VLS_88 = __VLS_87.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_87), false));
        var __VLS_84;
    }
    (__VLS_ctx.pet.breed);
    // @ts-ignore
    [pet,];
    var __VLS_78;
    var __VLS_91 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({}));
    var __VLS_93 = __VLS_92.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_92), false));
    var __VLS_95 = __VLS_94.slots.default;
    {
        var __VLS_96 = __VLS_94.slots.label;
        var __VLS_97 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({}));
        var __VLS_99 = __VLS_98.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_98), false));
        var __VLS_101 = __VLS_100.slots.default;
        var __VLS_102 = {}.Clock;
        /** @type {[typeof __VLS_components.Clock, ]} */ ;
        // @ts-ignore
        icons_vue_1.Clock;
        // @ts-ignore
        var __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({}));
        var __VLS_104 = __VLS_103.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_103), false));
        var __VLS_100;
    }
    (__VLS_ctx.pet.age);
    // @ts-ignore
    [pet,];
    var __VLS_94;
    var __VLS_107 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({}));
    var __VLS_109 = __VLS_108.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_108), false));
    var __VLS_111 = __VLS_110.slots.default;
    {
        var __VLS_112 = __VLS_110.slots.label;
        var __VLS_113 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({}));
        var __VLS_115 = __VLS_114.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_114), false));
        var __VLS_117 = __VLS_116.slots.default;
        var __VLS_118 = {}.User;
        /** @type {[typeof __VLS_components.User, ]} */ ;
        // @ts-ignore
        icons_vue_1.User;
        // @ts-ignore
        var __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({}));
        var __VLS_120 = __VLS_119.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_119), false));
        var __VLS_116;
    }
    (__VLS_ctx.genderText);
    // @ts-ignore
    [genderText,];
    var __VLS_110;
    var __VLS_123 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    ElDescriptionsItem;
    // @ts-ignore
    var __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({}));
    var __VLS_125 = __VLS_124.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_124), false));
    var __VLS_127 = __VLS_126.slots.default;
    {
        var __VLS_128 = __VLS_126.slots.label;
        var __VLS_129 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({}));
        var __VLS_131 = __VLS_130.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_130), false));
        var __VLS_133 = __VLS_132.slots.default;
        var __VLS_134 = {}.MagicStick;
        /** @type {[typeof __VLS_components.MagicStick, ]} */ ;
        // @ts-ignore
        icons_vue_1.MagicStick;
        // @ts-ignore
        var __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({}));
        var __VLS_136 = __VLS_135.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_135), false));
        var __VLS_132;
    }
    var __VLS_139 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    ElTag;
    // @ts-ignore
    var __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
        type: (__VLS_ctx.healthTagType),
        size: "small",
    }));
    var __VLS_141 = __VLS_140.apply(void 0, __spreadArray([{
            type: (__VLS_ctx.healthTagType),
            size: "small",
        }], __VLS_functionalComponentArgsRest(__VLS_140), false));
    var __VLS_143 = __VLS_142.slots.default;
    // @ts-ignore
    [healthTagType,];
    (__VLS_ctx.healthText);
    // @ts-ignore
    [healthText,];
    var __VLS_142;
    var __VLS_126;
    var __VLS_73;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-actions" }));
    if (__VLS_ctx.isCurrentUserAdopted) {
        // @ts-ignore
        [isCurrentUserAdopted,];
        var __VLS_144 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            type: "success",
            size: "large",
            icon: (__VLS_ctx.Document),
            disabled: true,
        }));
        var __VLS_146 = __VLS_145.apply(void 0, __spreadArray([{
                type: "success",
                size: "large",
                icon: (__VLS_ctx.Document),
                disabled: true,
            }], __VLS_functionalComponentArgsRest(__VLS_145), false));
        var __VLS_148 = __VLS_147.slots.default;
        // @ts-ignore
        [icons_vue_1.Document,];
        var __VLS_147;
    }
    else if (__VLS_ctx.hasValidApplication) {
        // @ts-ignore
        [hasValidApplication,];
        var __VLS_149 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149(__assign({ 'onClick': {} }, { type: "warning", size: "large", icon: (__VLS_ctx.Document) })));
        var __VLS_151 = __VLS_150.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "warning", size: "large", icon: (__VLS_ctx.Document) })], __VLS_functionalComponentArgsRest(__VLS_150), false));
        var __VLS_153 = void 0;
        var __VLS_154 = void 0;
        var __VLS_155 = ({ click: {} },
            { onClick: (__VLS_ctx.checkApplication) });
        var __VLS_156 = __VLS_152.slots.default;
        // @ts-ignore
        [icons_vue_1.Document, checkApplication,];
        (__VLS_ctx.applicationStatusText);
        // @ts-ignore
        [applicationStatusText,];
        var __VLS_152;
    }
    else if (((_a = __VLS_ctx.pet.adoptionStatus) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'adopted') {
        // @ts-ignore
        [pet,];
        var __VLS_157 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
            type: "info",
            size: "large",
            icon: (__VLS_ctx.Document),
            disabled: true,
        }));
        var __VLS_159 = __VLS_158.apply(void 0, __spreadArray([{
                type: "info",
                size: "large",
                icon: (__VLS_ctx.Document),
                disabled: true,
            }], __VLS_functionalComponentArgsRest(__VLS_158), false));
        var __VLS_161 = __VLS_160.slots.default;
        // @ts-ignore
        [icons_vue_1.Document,];
        var __VLS_160;
    }
    else if (((_b = __VLS_ctx.pet.adoptionStatus) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'available') {
        // @ts-ignore
        [pet,];
        var __VLS_162 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        ElButton;
        // @ts-ignore
        var __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162(__assign({ 'onClick': {} }, { type: "primary", size: "large", icon: (__VLS_ctx.CirclePlus) })));
        var __VLS_164 = __VLS_163.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", size: "large", icon: (__VLS_ctx.CirclePlus) })], __VLS_functionalComponentArgsRest(__VLS_163), false));
        var __VLS_166 = void 0;
        var __VLS_167 = void 0;
        var __VLS_168 = ({ click: {} },
            { onClick: (__VLS_ctx.applyForAdoption) });
        var __VLS_169 = __VLS_165.slots.default;
        // @ts-ignore
        [icons_vue_1.CirclePlus, applyForAdoption,];
        var __VLS_165;
    }
    var __VLS_170 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170(__assign({ 'onClick': {} }, { type: (__VLS_ctx.favored ? 'warning' : 'default'), icon: (__VLS_ctx.Star), size: "large", plain: true })));
    var __VLS_172 = __VLS_171.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: (__VLS_ctx.favored ? 'warning' : 'default'), icon: (__VLS_ctx.Star), size: "large", plain: true })], __VLS_functionalComponentArgsRest(__VLS_171), false));
    var __VLS_174 = void 0;
    var __VLS_175 = void 0;
    var __VLS_176 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleFavorite) });
    var __VLS_177 = __VLS_173.slots.default;
    // @ts-ignore
    [favored, icons_vue_1.Star, toggleFavorite,];
    (__VLS_ctx.favored ? '已收藏' : '收藏');
    // @ts-ignore
    [favored,];
    var __VLS_173;
    var __VLS_178 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178(__assign({ 'onClick': {} }, { type: (__VLS_ctx.liked ? 'primary' : 'default'), size: "large", plain: true })));
    var __VLS_180 = __VLS_179.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: (__VLS_ctx.liked ? 'primary' : 'default'), size: "large", plain: true })], __VLS_functionalComponentArgsRest(__VLS_179), false));
    var __VLS_182 = void 0;
    var __VLS_183 = void 0;
    var __VLS_184 = ({ click: {} },
        { onClick: (__VLS_ctx.toggleLike) });
    var __VLS_185 = __VLS_181.slots.default;
    // @ts-ignore
    [liked, toggleLike,];
    (__VLS_ctx.liked ? '已点赞' : '点赞');
    // @ts-ignore
    [liked,];
    var __VLS_181;
    var __VLS_186 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
        icon: (__VLS_ctx.Share),
        size: "large",
        plain: true,
    }));
    var __VLS_188 = __VLS_187.apply(void 0, __spreadArray([{
            icon: (__VLS_ctx.Share),
            size: "large",
            plain: true,
        }], __VLS_functionalComponentArgsRest(__VLS_187), false));
    var __VLS_190 = __VLS_189.slots.default;
    // @ts-ignore
    [icons_vue_1.Share,];
    var __VLS_189;
    var __VLS_53;
    var __VLS_27;
    var __VLS_22;
    var __VLS_191 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    ElCard;
    // @ts-ignore
    var __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191(__assign({ class: "pet-description-card" }, { shadow: "hover" })));
    var __VLS_193 = __VLS_192.apply(void 0, __spreadArray([__assign({ class: "pet-description-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_192), false));
    var __VLS_195 = __VLS_194.slots.default;
    {
        var __VLS_196 = __VLS_194.slots.header;
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
        var __VLS_197 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({}));
        var __VLS_199 = __VLS_198.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_198), false));
        var __VLS_201 = __VLS_200.slots.default;
        var __VLS_202 = {}.Document;
        /** @type {[typeof __VLS_components.Document, ]} */ ;
        // @ts-ignore
        icons_vue_1.Document;
        // @ts-ignore
        var __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({}));
        var __VLS_204 = __VLS_203.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_203), false));
        var __VLS_200;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    var __VLS_207 = {}.ElText;
    /** @type {[typeof __VLS_components.ElText, typeof __VLS_components.elText, typeof __VLS_components.ElText, typeof __VLS_components.elText, ]} */ ;
    // @ts-ignore
    ElText;
    // @ts-ignore
    var __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207(__assign({ size: "large" }, { class: "description-text" })));
    var __VLS_209 = __VLS_208.apply(void 0, __spreadArray([__assign({ size: "large" }, { class: "description-text" })], __VLS_functionalComponentArgsRest(__VLS_208), false));
    var __VLS_211 = __VLS_210.slots.default;
    (__VLS_ctx.pet.description);
    // @ts-ignore
    [pet,];
    var __VLS_210;
    var __VLS_212 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    ElDivider;
    // @ts-ignore
    var __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({}));
    var __VLS_214 = __VLS_213.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_213), false));
    var __VLS_217 = {}.ElAlert;
    /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
    // @ts-ignore
    ElAlert;
    // @ts-ignore
    var __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
        title: "温馨提示",
        type: "info",
        closable: (false),
        showIcon: true,
    }));
    var __VLS_219 = __VLS_218.apply(void 0, __spreadArray([{
            title: "温馨提示",
            type: "info",
            closable: (false),
            showIcon: true,
        }], __VLS_functionalComponentArgsRest(__VLS_218), false));
    var __VLS_221 = __VLS_220.slots.default;
    {
        var __VLS_222 = __VLS_220.slots.default;
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        var __VLS_223 = {}.ElLink;
        /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
        // @ts-ignore
        ElLink;
        // @ts-ignore
        var __VLS_224 = __VLS_asFunctionalComponent(__VLS_223, new __VLS_223(__assign({ 'onClick': {} }, { type: "primary" })));
        var __VLS_225 = __VLS_224.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary" })], __VLS_functionalComponentArgsRest(__VLS_224), false));
        var __VLS_227 = void 0;
        var __VLS_228 = void 0;
        var __VLS_229 = ({ click: {} },
            { onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.pet))
                        return;
                    __VLS_ctx.$router.push('/guides');
                    // @ts-ignore
                    [$router,];
                } });
        var __VLS_230 = __VLS_226.slots.default;
        var __VLS_226;
    }
    var __VLS_220;
    var __VLS_194;
    var __VLS_231 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    ElCard;
    // @ts-ignore
    var __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231(__assign({ class: "pet-gallery-card" }, { shadow: "hover" })));
    var __VLS_233 = __VLS_232.apply(void 0, __spreadArray([__assign({ class: "pet-gallery-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_232), false));
    var __VLS_235 = __VLS_234.slots.default;
    {
        var __VLS_236 = __VLS_234.slots.header;
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
        var __VLS_237 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({}));
        var __VLS_239 = __VLS_238.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_238), false));
        var __VLS_241 = __VLS_240.slots.default;
        var __VLS_242 = {}.Picture;
        /** @type {[typeof __VLS_components.Picture, ]} */ ;
        // @ts-ignore
        icons_vue_1.Picture;
        // @ts-ignore
        var __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({}));
        var __VLS_244 = __VLS_243.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_243), false));
        var __VLS_240;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    var __VLS_247 = {}.ElSpace;
    /** @type {[typeof __VLS_components.ElSpace, typeof __VLS_components.elSpace, typeof __VLS_components.ElSpace, typeof __VLS_components.elSpace, ]} */ ;
    // @ts-ignore
    ElSpace;
    // @ts-ignore
    var __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({
        wrap: true,
        size: (15),
    }));
    var __VLS_249 = __VLS_248.apply(void 0, __spreadArray([{
            wrap: true,
            size: (15),
        }], __VLS_functionalComponentArgsRest(__VLS_248), false));
    var __VLS_251 = __VLS_250.slots.default;
    var _loop_1 = function (image, index) {
        // @ts-ignore
        [randomPetImages,];
        var __VLS_252 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        ElImage;
        // @ts-ignore
        var __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252(__assign(__assign(__assign({ 'onClick': {} }, { key: ("random-".concat(index)), src: (image), fit: "cover" }), { class: "gallery-image" }), { lazy: true })));
        var __VLS_254 = __VLS_253.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onClick': {} }, { key: ("random-".concat(index)), src: (image), fit: "cover" }), { class: "gallery-image" }), { lazy: true })], __VLS_functionalComponentArgsRest(__VLS_253), false));
        var __VLS_256 = void 0;
        var __VLS_257 = void 0;
        var __VLS_258 = ({ click: {} },
            { onClick: (function () { __VLS_ctx.imageViewerIndex = index; __VLS_ctx.imageViewerVisible = true; }) });
        // @ts-ignore
        [imageViewerIndex, imageViewerVisible,];
    };
    var __VLS_255;
    for (var _i = 0, _c = __VLS_getVForSourceType((__VLS_ctx.randomPetImages.slice(0, 6))); _i < _c.length; _i++) {
        var _d = _c[_i], image = _d[0], index = _d[1];
        _loop_1(image, index);
    }
    var __VLS_250;
    var __VLS_234;
    var __VLS_260 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    ElCard;
    // @ts-ignore
    var __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260(__assign({ class: "adoption-notice-card" }, { shadow: "hover" })));
    var __VLS_262 = __VLS_261.apply(void 0, __spreadArray([__assign({ class: "adoption-notice-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_261), false));
    var __VLS_264 = __VLS_263.slots.default;
    {
        var __VLS_265 = __VLS_263.slots.header;
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
        var __VLS_266 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({}));
        var __VLS_268 = __VLS_267.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_267), false));
        var __VLS_270 = __VLS_269.slots.default;
        var __VLS_271 = {}.Warning;
        /** @type {[typeof __VLS_components.Warning, ]} */ ;
        // @ts-ignore
        icons_vue_1.Warning;
        // @ts-ignore
        var __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({}));
        var __VLS_273 = __VLS_272.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_272), false));
        var __VLS_269;
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    var __VLS_276 = {}.ElTimeline;
    /** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
    // @ts-ignore
    ElTimeline;
    // @ts-ignore
    var __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({}));
    var __VLS_278 = __VLS_277.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_277), false));
    var __VLS_280 = __VLS_279.slots.default;
    for (var _e = 0, _f = __VLS_getVForSourceType((__VLS_ctx.adoptionNotices)); _e < _f.length; _e++) {
        var _g = _f[_e], notice = _g[0], index = _g[1];
        // @ts-ignore
        [adoptionNotices,];
        var __VLS_281 = {}.ElTimelineItem;
        /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
        // @ts-ignore
        ElTimelineItem;
        // @ts-ignore
        var __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
            key: (index),
            timestamp: (notice.title),
            placement: "top",
            color: (index % 2 === 0 ? '#409EFF' : '#67C23A'),
        }));
        var __VLS_283 = __VLS_282.apply(void 0, __spreadArray([{
                key: (index),
                timestamp: (notice.title),
                placement: "top",
                color: (index % 2 === 0 ? '#409EFF' : '#67C23A'),
            }], __VLS_functionalComponentArgsRest(__VLS_282), false));
        var __VLS_285 = __VLS_284.slots.default;
        var __VLS_286 = {}.ElCard;
        /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
        // @ts-ignore
        ElCard;
        // @ts-ignore
        var __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
            shadow: "never",
        }));
        var __VLS_288 = __VLS_287.apply(void 0, __spreadArray([{
                shadow: "never",
            }], __VLS_functionalComponentArgsRest(__VLS_287), false));
        var __VLS_290 = __VLS_289.slots.default;
        var __VLS_291 = {}.ElText;
        /** @type {[typeof __VLS_components.ElText, typeof __VLS_components.elText, typeof __VLS_components.ElText, typeof __VLS_components.elText, ]} */ ;
        // @ts-ignore
        ElText;
        // @ts-ignore
        var __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({}));
        var __VLS_293 = __VLS_292.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_292), false));
        var __VLS_295 = __VLS_294.slots.default;
        (notice.content);
        var __VLS_294;
        var __VLS_289;
        var __VLS_284;
    }
    var __VLS_279;
    var __VLS_263;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-not-found" }));
    var __VLS_296 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    ElEmpty;
    // @ts-ignore
    var __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
        description: "宠物未找到",
    }));
    var __VLS_298 = __VLS_297.apply(void 0, __spreadArray([{
            description: "宠物未找到",
        }], __VLS_functionalComponentArgsRest(__VLS_297), false));
    var __VLS_300 = __VLS_299.slots.default;
    {
        var __VLS_301 = __VLS_299.slots.image;
        var __VLS_302 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        ElIcon;
        // @ts-ignore
        var __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
            size: (100),
        }));
        var __VLS_304 = __VLS_303.apply(void 0, __spreadArray([{
                size: (100),
            }], __VLS_functionalComponentArgsRest(__VLS_303), false));
        var __VLS_306 = __VLS_305.slots.default;
        var __VLS_307 = {}.QuestionFilled;
        /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
        // @ts-ignore
        icons_vue_1.QuestionFilled;
        // @ts-ignore
        var __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({}));
        var __VLS_309 = __VLS_308.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_308), false));
        var __VLS_305;
    }
    var __VLS_312 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    ElButton;
    // @ts-ignore
    var __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312(__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.ArrowLeft) })));
    var __VLS_314 = __VLS_313.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.ArrowLeft) })], __VLS_functionalComponentArgsRest(__VLS_313), false));
    var __VLS_316 = void 0;
    var __VLS_317 = void 0;
    var __VLS_318 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.pet))
                    return;
                __VLS_ctx.$router.push('/pets');
                // @ts-ignore
                [$router, icons_vue_1.ArrowLeft,];
            } });
    var __VLS_319 = __VLS_315.slots.default;
    var __VLS_315;
    var __VLS_299;
}
if (__VLS_ctx.imageViewerVisible && __VLS_ctx.allGalleryImages.length > 0) {
    // @ts-ignore
    [imageViewerVisible, allGalleryImages,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.imageViewerVisible && __VLS_ctx.allGalleryImages.length > 0))
                return;
            __VLS_ctx.imageViewerVisible = false;
            // @ts-ignore
            [imageViewerVisible,];
        } }, { class: "image-viewer-overlay" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () { } }, { class: "image-viewer-container" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.imageViewerVisible && __VLS_ctx.allGalleryImages.length > 0))
                return;
            __VLS_ctx.imageViewerVisible = false;
            // @ts-ignore
            [imageViewerVisible,];
        } }, { class: "close-btn" }));
    var __VLS_320 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
        size: (24),
    }));
    var __VLS_322 = __VLS_321.apply(void 0, __spreadArray([{
            size: (24),
        }], __VLS_functionalComponentArgsRest(__VLS_321), false));
    var __VLS_324 = __VLS_323.slots.default;
    var __VLS_325 = {}.Close;
    /** @type {[typeof __VLS_components.Close, ]} */ ;
    // @ts-ignore
    icons_vue_1.Close;
    // @ts-ignore
    var __VLS_326 = __VLS_asFunctionalComponent(__VLS_325, new __VLS_325({}));
    var __VLS_327 = __VLS_326.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_326), false));
    var __VLS_323;
    __VLS_asFunctionalElement(__VLS_elements.img)(__assign({ src: (__VLS_ctx.allGalleryImages[__VLS_ctx.imageViewerIndex]), alt: ("\u56FE\u7247 ".concat(__VLS_ctx.imageViewerIndex + 1)) }, { class: "viewer-image" }));
    // @ts-ignore
    [imageViewerIndex, imageViewerIndex, allGalleryImages,];
}
/** @type {__VLS_StyleScopedClasses['pet-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['header-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-header-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-main-image']} */ ;
/** @type {__VLS_StyleScopedClasses['image-slot']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-name']} */ ;
/** @type {__VLS_StyleScopedClasses['name-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-description-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['description-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-gallery-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['gallery-image']} */ ;
/** @type {__VLS_StyleScopedClasses['adoption-notice-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-not-found']} */ ;
/** @type {__VLS_StyleScopedClasses['image-viewer-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['image-viewer-container']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['viewer-image']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
