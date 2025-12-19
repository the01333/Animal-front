"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPetCategories = getPetCategories;
exports.getGenders = getGenders;
exports.getAdoptionStatuses = getAdoptionStatuses;
exports.getHealthStatuses = getHealthStatuses;
exports.getAllDictData = getAllDictData;
exports.listDictItems = listDictItems;
exports.createDictItem = createDictItem;
exports.updateDictItem = updateDictItem;
exports.deleteDictItem = deleteDictItem;
exports.refreshDictCache = refreshDictCache;
exports.createPetCategoryAuto = createPetCategoryAuto;
var request_1 = require("@/utils/request");
/**
 * 获取宠物类型选项
 */
function getPetCategories() {
    return (0, request_1.default)({
        url: '/dict/petCategories',
        method: 'get'
    });
}
/**
 * 获取性别选项
 */
function getGenders() {
    return (0, request_1.default)({
        url: '/dict/genders',
        method: 'get'
    });
}
/**
 * 获取领养状态选项
 */
function getAdoptionStatuses() {
    return (0, request_1.default)({
        url: '/dict/adoptionStatuses',
        method: 'get'
    });
}
/**
 * 获取健康状态选项
 */
function getHealthStatuses() {
    return (0, request_1.default)({
        url: '/dict/healthStatuses',
        method: 'get'
    });
}
/**
 * 获取所有字典数据
 */
function getAllDictData() {
    return (0, request_1.default)({
        url: '/dict/all',
        method: 'get'
    });
}
function listDictItems(dictType) {
    return (0, request_1.default)({
        url: '/dict/items',
        method: 'get',
        params: dictType ? { dictType: dictType } : undefined
    });
}
function createDictItem(data) {
    return (0, request_1.default)({
        url: '/dict/items',
        method: 'post',
        data: data
    });
}
function updateDictItem(id, data) {
    return (0, request_1.default)({
        url: "/dict/items/".concat(id),
        method: 'put',
        data: data
    });
}
function deleteDictItem(id) {
    return (0, request_1.default)({
        url: "/dict/items/".concat(id),
        method: 'delete'
    });
}
/**
 * 刷新字典缓存（系统工具）
 */
function refreshDictCache() {
    return (0, request_1.default)({
        url: '/dict/refresh',
        method: 'post'
    });
}
/**
 * 自动创建宠物类别（仅传中文名称，后端用 AI 生成英文编码）
 */
function createPetCategoryAuto(label) {
    return (0, request_1.default)({
        url: '/dict/items/pet-category/auto',
        method: 'post',
        data: { label: label }
    });
}
