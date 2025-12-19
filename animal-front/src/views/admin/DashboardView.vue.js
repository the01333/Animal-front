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
var echarts = require("echarts");
var stats_1 = require("@/api/stats");
var stats = (0, vue_1.reactive)({
    totalPets: 0,
    availablePets: 0,
    adoptedPets: 0,
    pendingApplications: 0,
    totalUsers: 0,
    todayVisits: 0
});
var categoryChartRef = (0, vue_1.ref)();
var statusChartRef = (0, vue_1.ref)();
var trendChartRef = (0, vue_1.ref)();
var categoryChart = null;
var statusChart = null;
var trendChart = null;
// 获取统计数据
function fetchStatistics() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, stats_1.getStatistics)()];
                case 1:
                    res = _a.sent();
                    if (res.data) {
                        Object.assign(stats, {
                            totalPets: res.data.totalPets || 0,
                            availablePets: res.data.availablePets || 0,
                            adoptedPets: res.data.adoptedPets || 0,
                            pendingApplications: res.data.pendingApplications || 0,
                            totalUsers: res.data.totalUsers || 0,
                            todayVisits: 0
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('获取统计数据失败:', error_1);
                    // 使用模拟数据
                    Object.assign(stats, {
                        totalPets: 0,
                        availablePets: 0,
                        adoptedPets: 0,
                        pendingApplications: 0,
                        totalUsers: 0,
                        todayVisits: 0
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 初始化宠物分类图表
function initCategoryChart() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, option, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!categoryChartRef.value)
                        return [2 /*return*/];
                    categoryChart = echarts.init(categoryChartRef.value);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, stats_1.getPetCategoryStats)()
                        // 这里 res 是 ApiResponse，真实数据在 res.data 中
                    ];
                case 2:
                    res = _a.sent();
                    data = (res.data || []).map(function (item) { return ({
                        value: item.count,
                        name: getCategoryName(item.category)
                    }); });
                    option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: '{b}: {c} ({d}%)'
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left'
                        },
                        series: [
                            {
                                type: 'pie',
                                radius: '60%',
                                data: data,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    categoryChart.setOption(option);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('获取宠物分类统计失败:', error_2);
                    // 使用模拟数据
                    categoryChart.setOption({
                        tooltip: { trigger: 'item' },
                        legend: { orient: 'vertical', left: 'left' },
                        series: [
                            {
                                type: 'pie',
                                radius: '60%',
                                data: [
                                    { value: 48, name: '猫咪' },
                                    { value: 52, name: '狗狗' },
                                    { value: 18, name: '兔子' },
                                    { value: 10, name: '其他' }
                                ]
                            }
                        ]
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 初始化申请状态图表
function initStatusChart() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, option, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!statusChartRef.value)
                        return [2 /*return*/];
                    statusChart = echarts.init(statusChartRef.value);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, stats_1.getApplicationStatusStats)()
                        // 这里 res 是 ApiResponse，真实数据在 res.data 中
                    ];
                case 2:
                    res = _a.sent();
                    data = (res.data || []).map(function (item) { return ({
                        value: item.count,
                        name: getStatusName(item.status)
                    }); });
                    option = {
                        tooltip: { trigger: 'item' },
                        legend: { bottom: 0 },
                        series: [
                            {
                                type: 'pie',
                                radius: ['40%', '70%'],
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    borderRadius: 10,
                                    borderColor: '#fff',
                                    borderWidth: 2
                                },
                                label: { show: false, position: 'center' },
                                emphasis: {
                                    label: { show: true, fontSize: 20, fontWeight: 'bold' }
                                },
                                labelLine: { show: false },
                                data: data
                            }
                        ]
                    };
                    statusChart.setOption(option);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('获取申请状态统计失败:', error_3);
                    // 使用模拟数据
                    statusChart.setOption({
                        tooltip: { trigger: 'item' },
                        legend: { bottom: 0 },
                        series: [
                            {
                                type: 'pie',
                                radius: ['40%', '70%'],
                                data: [
                                    { value: 15, name: '待审核' },
                                    { value: 72, name: '已通过' },
                                    { value: 8, name: '已拒绝' }
                                ]
                            }
                        ]
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 初始化访问趋势图表
function initTrendChart() {
    return __awaiter(this, void 0, void 0, function () {
        var res, dates, counts, option, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!trendChartRef.value)
                        return [2 /*return*/];
                    trendChart = echarts.init(trendChartRef.value);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, stats_1.getVisitTrend)(7)
                        // 这里 res 是 ApiResponse，真实数据在 res.data 中
                    ];
                case 2:
                    res = _a.sent();
                    dates = (res.data || []).map(function (item) { return item.date; });
                    counts = (res.data || []).map(function (item) { return item.count; });
                    option = {
                        tooltip: { trigger: 'axis' },
                        xAxis: { type: 'category', data: dates },
                        yAxis: {
                            type: 'value',
                            min: 0,
                            interval: 1 // Y 轴刻度间隔 1
                        },
                        series: [
                            {
                                data: counts,
                                type: 'line',
                                smooth: true,
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                                            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
                                        ]
                                    }
                                }
                            }
                        ]
                    };
                    trendChart.setOption(option);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('获取访问趋势失败:', error_4);
                    // 使用模拟数据
                    trendChart.setOption({
                        tooltip: { trigger: 'axis' },
                        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
                        yAxis: { type: 'value' },
                        series: [{ data: [120, 132, 101, 134, 90, 230, 210], type: 'line', smooth: true }]
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getCategoryName(category) {
    var names = {
        CAT: '猫咪',
        DOG: '狗狗',
        RABBIT: '兔子',
        BIRD: '鸟类',
        OTHER: '其他'
    };
    return names[category] || category;
}
function getStatusName(status) {
    var names = {
        PENDING: '待审核',
        APPROVED: '已通过',
        REJECTED: '已拒绝',
        CANCELLED: '已取消'
    };
    return names[status] || status;
}
// 响应式调整
function handleResize() {
    categoryChart === null || categoryChart === void 0 ? void 0 : categoryChart.resize();
    statusChart === null || statusChart === void 0 ? void 0 : statusChart.resize();
    trendChart === null || trendChart === void 0 ? void 0 : trendChart.resize();
}
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchStatistics()];
            case 1:
                _a.sent();
                return [4 /*yield*/, Promise.all([initCategoryChart(), initStatusChart(), initTrendChart()])];
            case 2:
                _a.sent();
                window.addEventListener('resize', handleResize);
                return [2 /*return*/];
        }
    });
}); });
(0, vue_1.onUnmounted)(function () {
    categoryChart === null || categoryChart === void 0 ? void 0 : categoryChart.dispose();
    statusChart === null || statusChart === void 0 ? void 0 : statusChart.dispose();
    trendChart === null || trendChart === void 0 ? void 0 : trendChart.dispose();
    window.removeEventListener('resize', handleResize);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "dashboard-view" }));
var __VLS_0 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ gutter: (20) }, { class: "stats-row" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ gutter: (20) }, { class: "stats-row" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4 = __VLS_3.slots.default;
var __VLS_5 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    xs: (24),
    sm: (12),
    md: (6),
}));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{
        xs: (24),
        sm: (12),
        md: (6),
    }], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_9 = __VLS_8.slots.default;
var __VLS_10 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(__assign({ class: "stat-card" }, { shadow: "hover" })));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ class: "stat-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
var __VLS_14 = __VLS_13.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-content" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-icon" }, { style: {} }));
var __VLS_15 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    color: "#1890ff",
    size: (40),
}));
var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([{
        color: "#1890ff",
        size: (40),
    }], __VLS_functionalComponentArgsRest(__VLS_16), false));
var __VLS_19 = __VLS_18.slots.default;
var __VLS_20 = {}.Orange;
/** @type {[typeof __VLS_components.Orange, ]} */ ;
// @ts-ignore
Orange;
// @ts-ignore
var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_21), false));
var __VLS_18;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-info" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-value" }));
(__VLS_ctx.stats.totalPets);
// @ts-ignore
[stats,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-label" }));
var __VLS_13;
var __VLS_8;
var __VLS_25 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    xs: (24),
    sm: (12),
    md: (6),
}));
var __VLS_27 = __VLS_26.apply(void 0, __spreadArray([{
        xs: (24),
        sm: (12),
        md: (6),
    }], __VLS_functionalComponentArgsRest(__VLS_26), false));
var __VLS_29 = __VLS_28.slots.default;
var __VLS_30 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30(__assign({ class: "stat-card" }, { shadow: "hover" })));
var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([__assign({ class: "stat-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_31), false));
var __VLS_34 = __VLS_33.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-content" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-icon" }, { style: {} }));
var __VLS_35 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    color: "#52c41a",
    size: (40),
}));
var __VLS_37 = __VLS_36.apply(void 0, __spreadArray([{
        color: "#52c41a",
        size: (40),
    }], __VLS_functionalComponentArgsRest(__VLS_36), false));
var __VLS_39 = __VLS_38.slots.default;
var __VLS_40 = {}.CircleCheck;
/** @type {[typeof __VLS_components.CircleCheck, ]} */ ;
// @ts-ignore
CircleCheck;
// @ts-ignore
var __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
var __VLS_42 = __VLS_41.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_41), false));
var __VLS_38;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-info" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-value" }));
(__VLS_ctx.stats.availablePets);
// @ts-ignore
[stats,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-label" }));
var __VLS_33;
var __VLS_28;
var __VLS_45 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    xs: (24),
    sm: (12),
    md: (6),
}));
var __VLS_47 = __VLS_46.apply(void 0, __spreadArray([{
        xs: (24),
        sm: (12),
        md: (6),
    }], __VLS_functionalComponentArgsRest(__VLS_46), false));
var __VLS_49 = __VLS_48.slots.default;
var __VLS_50 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50(__assign({ class: "stat-card" }, { shadow: "hover" })));
var __VLS_52 = __VLS_51.apply(void 0, __spreadArray([__assign({ class: "stat-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_51), false));
var __VLS_54 = __VLS_53.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-content" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-icon" }, { style: {} }));
var __VLS_55 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    color: "#fa8c16",
    size: (40),
}));
var __VLS_57 = __VLS_56.apply(void 0, __spreadArray([{
        color: "#fa8c16",
        size: (40),
    }], __VLS_functionalComponentArgsRest(__VLS_56), false));
var __VLS_59 = __VLS_58.slots.default;
var __VLS_60 = {}.Document;
/** @type {[typeof __VLS_components.Document, ]} */ ;
// @ts-ignore
Document;
// @ts-ignore
var __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
var __VLS_62 = __VLS_61.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_61), false));
var __VLS_58;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-info" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-value" }));
(__VLS_ctx.stats.pendingApplications);
// @ts-ignore
[stats,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-label" }));
var __VLS_53;
var __VLS_48;
var __VLS_65 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    xs: (24),
    sm: (12),
    md: (6),
}));
var __VLS_67 = __VLS_66.apply(void 0, __spreadArray([{
        xs: (24),
        sm: (12),
        md: (6),
    }], __VLS_functionalComponentArgsRest(__VLS_66), false));
var __VLS_69 = __VLS_68.slots.default;
var __VLS_70 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70(__assign({ class: "stat-card" }, { shadow: "hover" })));
var __VLS_72 = __VLS_71.apply(void 0, __spreadArray([__assign({ class: "stat-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_71), false));
var __VLS_74 = __VLS_73.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-content" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-icon" }, { style: {} }));
var __VLS_75 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    color: "#eb2f96",
    size: (40),
}));
var __VLS_77 = __VLS_76.apply(void 0, __spreadArray([{
        color: "#eb2f96",
        size: (40),
    }], __VLS_functionalComponentArgsRest(__VLS_76), false));
var __VLS_79 = __VLS_78.slots.default;
var __VLS_80 = {}.User;
/** @type {[typeof __VLS_components.User, ]} */ ;
// @ts-ignore
User;
// @ts-ignore
var __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
var __VLS_82 = __VLS_81.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_81), false));
var __VLS_78;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-info" }));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-value" }));
(__VLS_ctx.stats.totalUsers);
// @ts-ignore
[stats,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "stat-label" }));
var __VLS_73;
var __VLS_68;
var __VLS_3;
var __VLS_85 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85(__assign({ gutter: (20) }, { class: "chart-row" })));
var __VLS_87 = __VLS_86.apply(void 0, __spreadArray([__assign({ gutter: (20) }, { class: "chart-row" })], __VLS_functionalComponentArgsRest(__VLS_86), false));
var __VLS_89 = __VLS_88.slots.default;
var __VLS_90 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    xs: (24),
    md: (12),
}));
var __VLS_92 = __VLS_91.apply(void 0, __spreadArray([{
        xs: (24),
        md: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_91), false));
var __VLS_94 = __VLS_93.slots.default;
var __VLS_95 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95(__assign({ class: "chart-card" }, { shadow: "hover" })));
var __VLS_97 = __VLS_96.apply(void 0, __spreadArray([__assign({ class: "chart-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_96), false));
var __VLS_99 = __VLS_98.slots.default;
{
    var __VLS_100 = __VLS_98.slots.header;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ ref: "categoryChartRef" }, { class: "chart-container" }));
/** @type {typeof __VLS_ctx.categoryChartRef} */ ;
// @ts-ignore
[categoryChartRef,];
var __VLS_98;
var __VLS_93;
var __VLS_101 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    xs: (24),
    md: (12),
}));
var __VLS_103 = __VLS_102.apply(void 0, __spreadArray([{
        xs: (24),
        md: (12),
    }], __VLS_functionalComponentArgsRest(__VLS_102), false));
var __VLS_105 = __VLS_104.slots.default;
var __VLS_106 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106(__assign({ class: "chart-card" }, { shadow: "hover" })));
var __VLS_108 = __VLS_107.apply(void 0, __spreadArray([__assign({ class: "chart-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_107), false));
var __VLS_110 = __VLS_109.slots.default;
{
    var __VLS_111 = __VLS_109.slots.header;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ ref: "statusChartRef" }, { class: "chart-container" }));
/** @type {typeof __VLS_ctx.statusChartRef} */ ;
// @ts-ignore
[statusChartRef,];
var __VLS_109;
var __VLS_104;
var __VLS_88;
var __VLS_112 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    gutter: (20),
}));
var __VLS_114 = __VLS_113.apply(void 0, __spreadArray([{
        gutter: (20),
    }], __VLS_functionalComponentArgsRest(__VLS_113), false));
var __VLS_116 = __VLS_115.slots.default;
var __VLS_117 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    span: (24),
}));
var __VLS_119 = __VLS_118.apply(void 0, __spreadArray([{
        span: (24),
    }], __VLS_functionalComponentArgsRest(__VLS_118), false));
var __VLS_121 = __VLS_120.slots.default;
var __VLS_122 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122(__assign({ class: "chart-card" }, { shadow: "hover" })));
var __VLS_124 = __VLS_123.apply(void 0, __spreadArray([__assign({ class: "chart-card" }, { shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_123), false));
var __VLS_126 = __VLS_125.slots.default;
{
    var __VLS_127 = __VLS_125.slots.header;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ ref: "trendChartRef" }, { class: "chart-container" }));
/** @type {typeof __VLS_ctx.trendChartRef} */ ;
// @ts-ignore
[trendChartRef,];
var __VLS_125;
var __VLS_120;
var __VLS_115;
var __VLS_128 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128(__assign({ shadow: "hover" }, { class: "quick-actions-card" })));
var __VLS_130 = __VLS_129.apply(void 0, __spreadArray([__assign({ shadow: "hover" }, { class: "quick-actions-card" })], __VLS_functionalComponentArgsRest(__VLS_129), false));
var __VLS_132 = __VLS_131.slots.default;
{
    var __VLS_133 = __VLS_131.slots.header;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "card-header" }));
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
var __VLS_134 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
ElRow;
// @ts-ignore
var __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    gutter: (20),
}));
var __VLS_136 = __VLS_135.apply(void 0, __spreadArray([{
        gutter: (20),
    }], __VLS_functionalComponentArgsRest(__VLS_135), false));
var __VLS_138 = __VLS_137.slots.default;
var __VLS_139 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    xs: (12),
    sm: (6),
}));
var __VLS_141 = __VLS_140.apply(void 0, __spreadArray([{
        xs: (12),
        sm: (6),
    }], __VLS_functionalComponentArgsRest(__VLS_140), false));
var __VLS_143 = __VLS_142.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/admin/pet/add');
        // @ts-ignore
        [$router,];
    } }, { class: "quick-action-item" }));
var __VLS_144 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    size: (32),
    color: "#409EFF",
}));
var __VLS_146 = __VLS_145.apply(void 0, __spreadArray([{
        size: (32),
        color: "#409EFF",
    }], __VLS_functionalComponentArgsRest(__VLS_145), false));
var __VLS_148 = __VLS_147.slots.default;
var __VLS_149 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
Plus;
// @ts-ignore
var __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({}));
var __VLS_151 = __VLS_150.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_150), false));
var __VLS_147;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
var __VLS_142;
var __VLS_154 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    xs: (12),
    sm: (6),
}));
var __VLS_156 = __VLS_155.apply(void 0, __spreadArray([{
        xs: (12),
        sm: (6),
    }], __VLS_functionalComponentArgsRest(__VLS_155), false));
var __VLS_158 = __VLS_157.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/admin/application/pending');
        // @ts-ignore
        [$router,];
    } }, { class: "quick-action-item" }));
var __VLS_159 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    size: (32),
    color: "#67C23A",
}));
var __VLS_161 = __VLS_160.apply(void 0, __spreadArray([{
        size: (32),
        color: "#67C23A",
    }], __VLS_functionalComponentArgsRest(__VLS_160), false));
var __VLS_163 = __VLS_162.slots.default;
var __VLS_164 = {}.DocumentChecked;
/** @type {[typeof __VLS_components.DocumentChecked, ]} */ ;
// @ts-ignore
DocumentChecked;
// @ts-ignore
var __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
var __VLS_166 = __VLS_165.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_165), false));
var __VLS_162;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
var __VLS_157;
var __VLS_169 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    xs: (12),
    sm: (6),
}));
var __VLS_171 = __VLS_170.apply(void 0, __spreadArray([{
        xs: (12),
        sm: (6),
    }], __VLS_functionalComponentArgsRest(__VLS_170), false));
var __VLS_173 = __VLS_172.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/admin/article/add');
        // @ts-ignore
        [$router,];
    } }, { class: "quick-action-item" }));
var __VLS_174 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
    size: (32),
    color: "#E6A23C",
}));
var __VLS_176 = __VLS_175.apply(void 0, __spreadArray([{
        size: (32),
        color: "#E6A23C",
    }], __VLS_functionalComponentArgsRest(__VLS_175), false));
var __VLS_178 = __VLS_177.slots.default;
var __VLS_179 = {}.Edit;
/** @type {[typeof __VLS_components.Edit, ]} */ ;
// @ts-ignore
Edit;
// @ts-ignore
var __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({}));
var __VLS_181 = __VLS_180.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_180), false));
var __VLS_177;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
var __VLS_172;
var __VLS_184 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
ElCol;
// @ts-ignore
var __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    xs: (12),
    sm: (6),
}));
var __VLS_186 = __VLS_185.apply(void 0, __spreadArray([{
        xs: (12),
        sm: (6),
    }], __VLS_functionalComponentArgsRest(__VLS_185), false));
var __VLS_188 = __VLS_187.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$router.push('/admin/user/list');
        // @ts-ignore
        [$router,];
    } }, { class: "quick-action-item" }));
var __VLS_189 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
    size: (32),
    color: "#F56C6C",
}));
var __VLS_191 = __VLS_190.apply(void 0, __spreadArray([{
        size: (32),
        color: "#F56C6C",
    }], __VLS_functionalComponentArgsRest(__VLS_190), false));
var __VLS_193 = __VLS_192.slots.default;
var __VLS_194 = {}.UserFilled;
/** @type {[typeof __VLS_components.UserFilled, ]} */ ;
// @ts-ignore
UserFilled;
// @ts-ignore
var __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({}));
var __VLS_196 = __VLS_195.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_195), false));
var __VLS_192;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
var __VLS_187;
var __VLS_137;
var __VLS_131;
/** @type {__VLS_StyleScopedClasses['dashboard-view']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-row']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-content']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-row']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-container']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-actions-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-action-item']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-action-item']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-action-item']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-action-item']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
