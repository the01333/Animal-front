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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequest = authRequest;
exports.authPost = authPost;
exports.authPut = authPut;
exports.authDelete = authDelete;
exports.authGet = authGet;
var authHelper_1 = require("@/utils/authHelper");
/**
 * 发送需要认证的请求
 * @param url 请求 URL
 * @param options 请求选项
 * @returns 响应数据
 */
function authRequest(url_1) {
    return __awaiter(this, arguments, void 0, function (url, options) {
        var token, headers, response, errorMessage, errorData, e_1, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 检查是否已登录
                    if (!(0, authHelper_1.isLoggedIn)()) {
                        (0, authHelper_1.handleAuthError)(401, '未登录');
                        throw new Error('当前未登录，请先登录');
                    }
                    token = localStorage.getItem('token');
                    headers = __assign({ 'Content-Type': 'application/json' }, options.headers);
                    if (token) {
                        headers['Authorization'] = token;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, fetch(url, {
                            method: options.method || 'GET',
                            headers: headers,
                            credentials: 'include',
                            body: options.body ? JSON.stringify(options.body) : undefined
                        })
                        // 处理 401 错误
                    ];
                case 2:
                    response = _a.sent();
                    if (!(response.status === 401)) return [3 /*break*/, 7];
                    errorMessage = '登录信息已过期，请重新登录';
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, response.json()];
                case 4:
                    errorData = _a.sent();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    (0, authHelper_1.handleAuthError)(401, errorMessage);
                    throw new Error(errorMessage);
                case 7:
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 8: return [2 /*return*/, _a.sent()];
                case 9:
                    error_1 = _a.sent();
                    console.error('认证请求失败:', error_1);
                    throw error_1;
                case 10: return [2 /*return*/];
            }
        });
    });
}
/**
 * 发送 POST 请求（需要认证）
 */
function authPost(url, body) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, authRequest(url, {
                    method: 'POST',
                    body: body
                })];
        });
    });
}
/**
 * 发送 PUT 请求（需要认证）
 */
function authPut(url, body) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, authRequest(url, {
                    method: 'PUT',
                    body: body
                })];
        });
    });
}
/**
 * 发送 DELETE 请求（需要认证）
 */
function authDelete(url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, authRequest(url, {
                    method: 'DELETE'
                })];
        });
    });
}
/**
 * 发送 GET 请求（需要认证）
 */
function authGet(url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, authRequest(url, {
                    method: 'GET'
                })];
        });
    });
}
