"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.formatFileSize = formatFileSize;
exports.formatNumber = formatNumber;
exports.formatRelativeTime = formatRelativeTime;
/**
 * 格式化日期时间
 */
function formatDate(date, format) {
    if (format === void 0) { format = 'YYYY-MM-DD HH:mm:ss'; }
    if (!date)
        return '-';
    var d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime()))
        return '-';
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var hour = String(d.getHours()).padStart(2, '0');
    var minute = String(d.getMinutes()).padStart(2, '0');
    var second = String(d.getSeconds()).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hour)
        .replace('mm', minute)
        .replace('ss', second);
}
/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
/**
 * 格式化数字（千分位）
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
/**
 * 相对时间
 */
function formatRelativeTime(date) {
    var d = typeof date === 'string' ? new Date(date) : date;
    var now = new Date();
    var diff = now.getTime() - d.getTime();
    var minute = 60 * 1000;
    var hour = 60 * minute;
    var day = 24 * hour;
    var week = 7 * day;
    var month = 30 * day;
    if (diff < minute) {
        return '刚刚';
    }
    else if (diff < hour) {
        return Math.floor(diff / minute) + '分钟前';
    }
    else if (diff < day) {
        return Math.floor(diff / hour) + '小时前';
    }
    else if (diff < week) {
        return Math.floor(diff / day) + '天前';
    }
    else if (diff < month) {
        return Math.floor(diff / week) + '周前';
    }
    else {
        return formatDate(d, 'YYYY-MM-DD');
    }
}
