"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImageUrl = processImageUrl;
var MINIO_LOCAL_BASE = 'http://localhost:9000';
var MINIO_OBJECT_BASE = "".concat(MINIO_LOCAL_BASE, "/animal-adopt");
var IP_PORT_PATTERN = /https?:\/\/\d+\.\d+\.\d+\.\d+:9000/g;
/**
 * 统一处理图片 URL：
 * 1. 去掉 @ 前缀
 * 2. 将内网 IP 替换为 localhost:9000
 * 3. 相对路径补全 MinIO 前缀
 */
function processImageUrl(url) {
    if (!url)
        return '';
    var normalized = url.trim();
    if (!normalized)
        return '';
    if (normalized.startsWith('@')) {
        normalized = normalized.substring(1);
    }
    normalized = normalized.replace(IP_PORT_PATTERN, MINIO_LOCAL_BASE);
    if (!/^https?:\/\//i.test(normalized)) {
        normalized = "".concat(MINIO_OBJECT_BASE).concat(normalized.startsWith('/') ? '' : '/').concat(normalized);
    }
    return normalized;
}
