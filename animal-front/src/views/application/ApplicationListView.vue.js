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
// 过滤条件
var filters = (0, vue_1.ref)({
    status: '',
    keyword: ''
});
// 分页数据
var currentPage = (0, vue_1.ref)(1);
var itemsPerPage = (0, vue_1.ref)(5);
var totalItems = (0, vue_1.ref)(0);
// 申请列表数据
var applications = (0, vue_1.ref)([
    {
        id: 'APP20251015001',
        petName: '小花',
        petImage: 'http://localhost:9000/animal-adopt/default.jpg',
        status: 'pending',
        applyDate: '2025-10-15',
        updateDate: '2025-10-15'
    },
    {
        id: 'APP20251010002',
        petName: '旺财',
        petImage: 'http://localhost:9000/animal-adopt/default.jpg',
        status: 'approved',
        applyDate: '2025-10-10',
        updateDate: '2025-10-12'
    },
    {
        id: 'APP20251001003',
        petName: '咪咪',
        petImage: 'http://localhost:9000/animal-adopt/default.jpg',
        status: 'rejected',
        applyDate: '2025-10-01',
        updateDate: '2025-10-05'
    }
]);
// 默认图片
var defaultImage = 'http://localhost:9000/animal-adopt/default.jpg';
// 路由
var router = (0, vue_router_1.useRouter)();
// 计算总项目数
totalItems.value = applications.value.length;
// 计算总页数
var totalPages = (0, vue_1.computed)(function () {
    return Math.ceil(totalItems.value / itemsPerPage.value);
});
// 过滤后的申请列表
var filteredApplications = (0, vue_1.computed)(function () {
    var result = applications.value;
    // 状态过滤
    if (filters.value.status) {
        result = result.filter(function (app) { return app.status === filters.value.status; });
    }
    // 关键词搜索
    if (filters.value.keyword) {
        var keyword_1 = filters.value.keyword.toLowerCase();
        result = result.filter(function (app) {
            return app.petName.toLowerCase().includes(keyword_1);
        });
    }
    // 更新总项目数
    totalItems.value = result.length;
    // 分页处理
    var start = (currentPage.value - 1) * itemsPerPage.value;
    var end = start + itemsPerPage.value;
    return result.slice(start, end);
});
// 申请状态文本
var applicationStatusText = function (status) {
    switch (status) {
        case 'pending': return '审核中';
        case 'approved': return '已通过';
        case 'rejected': return '已拒绝';
        case 'cancelled': return '已撤销';
        default: return '未知';
    }
};
// 申请状态样式
var applicationStatusClass = function (status) {
    return {
        'status-pending': status === 'pending',
        'status-approved': status === 'approved',
        'status-rejected': status === 'rejected',
        'status-cancelled': status === 'cancelled'
    };
};
// 重置过滤器
var resetFilters = function () {
    filters.value = {
        status: '',
        keyword: ''
    };
    currentPage.value = 1;
};
// 上一页
var prevPage = function () {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};
// 下一页
var nextPage = function () {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};
// 查看申请详情
var viewApplication = function (id) {
    router.push("/application/".concat(id));
};
// 撤销申请
var cancelApplication = function (id) {
    if (confirm('确定要撤销此领养申请吗？')) {
        // 在实际应用中，这里会调用后端API撤销申请
        var application = applications.value.find(function (app) { return app.id === id; });
        if (application) {
            application.status = 'cancelled';
        }
        alert('申请已撤销');
    }
};
(0, vue_1.onMounted)(function () {
    // 在实际应用中，这里会从API获取申请列表
    console.log('申请列表数据加载完成');
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['applications-container']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-reset']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['application-header']} */ ;
/** @type {__VLS_StyleScopedClasses['application-details']} */ ;
/** @type {__VLS_StyleScopedClasses['application-actions']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "applications-container" }));
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "applications-content" }));
if (__VLS_ctx.applications.length === 0) {
    // @ts-ignore
    [applications,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "empty-state" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "empty-icon" }));
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    var __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ to: "/pets" }, { class: "btn-browse-pets" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ to: "/pets" }, { class: "btn-browse-pets" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_4 = __VLS_3.slots.default;
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "filters" }));
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "filter-group" }));
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "status",
    });
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        id: "status",
        value: (__VLS_ctx.filters.status),
    });
    // @ts-ignore
    [filters,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "pending",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "approved",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "rejected",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "cancelled",
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "filter-group" }));
    __VLS_asFunctionalElement(__VLS_elements.input)(__assign({ type: "text", value: (__VLS_ctx.filters.keyword), placeholder: "搜索宠物名称..." }, { class: "search-input" }));
    // @ts-ignore
    [filters,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: (__VLS_ctx.resetFilters) }, { class: "btn-reset" }));
    // @ts-ignore
    [resetFilters,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "applications-list" }));
    var _loop_1 = function (application) {
        // @ts-ignore
        [filteredApplications,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ key: (application.id) }, { class: "application-item" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-header" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-info" }));
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (application.petImage || __VLS_ctx.defaultImage),
            alt: (application.petName),
        });
        // @ts-ignore
        [defaultImage,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
        (application.petName);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (application.applyDate);
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: (__VLS_ctx.applicationStatusClass(application.status)) }));
        // @ts-ignore
        [applicationStatusClass,];
        (__VLS_ctx.applicationStatusText(application.status));
        // @ts-ignore
        [applicationStatusText,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-details" }));
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "detail-item" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (application.id);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "detail-item" }));
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (application.updateDate);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "application-actions" }));
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.applications.length === 0))
                    return;
                __VLS_ctx.viewApplication(application.id);
                // @ts-ignore
                [viewApplication,];
            } }, { class: "btn-view" }));
        if (application.status === 'pending') {
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!!(__VLS_ctx.applications.length === 0))
                        return;
                    if (!(application.status === 'pending'))
                        return;
                    __VLS_ctx.cancelApplication(application.id);
                    // @ts-ignore
                    [cancelApplication,];
                } }, { class: "btn-cancel" }));
        }
    };
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.filteredApplications)); _i < _a.length; _i++) {
        var application = _a[_i][0];
        _loop_1(application);
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pagination" }));
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.prevPage) }, { disabled: (__VLS_ctx.currentPage === 1) }), { class: "btn-pagination" }));
    // @ts-ignore
    [prevPage, currentPage,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)(__assign({ class: "page-info" }));
    (__VLS_ctx.currentPage);
    (__VLS_ctx.totalPages);
    // @ts-ignore
    [currentPage, totalPages,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)(__assign(__assign({ onClick: (__VLS_ctx.nextPage) }, { disabled: (__VLS_ctx.currentPage === __VLS_ctx.totalPages) }), { class: "btn-pagination" }));
    // @ts-ignore
    [currentPage, totalPages, nextPage,];
}
/** @type {__VLS_StyleScopedClasses['applications-container']} */ ;
/** @type {__VLS_StyleScopedClasses['applications-content']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-browse-pets']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-reset']} */ ;
/** @type {__VLS_StyleScopedClasses['applications-list']} */ ;
/** @type {__VLS_StyleScopedClasses['application-item']} */ ;
/** @type {__VLS_StyleScopedClasses['application-header']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info']} */ ;
/** @type {__VLS_StyleScopedClasses['application-details']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['application-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-view']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['page-info']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-pagination']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
