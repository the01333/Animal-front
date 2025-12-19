"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatistics = getStatistics;
exports.getPetCategoryStats = getPetCategoryStats;
exports.getApplicationStatusStats = getApplicationStatusStats;
exports.getVisitTrend = getVisitTrend;
exports.manualSyncViewCount = manualSyncViewCount;
var request_1 = require("@/utils/request");
/**
 * 获取统计数据（管理员）
 */
function getStatistics() {
    return (0, request_1.default)({
        url: '/stats/dashboard',
        method: 'get'
    });
}
/**
 * 获取宠物分类统计
 */
function getPetCategoryStats() {
    return (0, request_1.default)({
        url: '/stats/pet-category',
        method: 'get'
    });
}
/**
 * 获取申请状态统计
 */
function getApplicationStatusStats() {
    return (0, request_1.default)({
        url: '/stats/application-status',
        method: 'get'
    });
}
/**
 * 获取最近访问趋势
 */
function getVisitTrend(days) {
    if (days === void 0) { days = 7; }
    return (0, request_1.default)({
        url: '/stats/visit-trend',
        method: 'get',
        params: { days: days }
    });
}
/**
 * 手动触发浏览次数同步任务
 */
function manualSyncViewCount() {
    return (0, request_1.default)({
        url: '/stats/view-count/sync',
        method: 'post'
    });
}
