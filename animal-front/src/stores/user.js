"use strict";
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
exports.useUserStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var user_1 = require("@/api/user");
exports.useUserStore = (0, pinia_1.defineStore)('user', function () {
    var token = (0, vue_1.ref)('');
    var userInfo = (0, vue_1.ref)(null);
    var isLoggedIn = (0, vue_1.computed)(function () { return !!token.value; });
    var isAdmin = (0, vue_1.computed)(function () {
        var _a;
        var role = String(((_a = userInfo.value) === null || _a === void 0 ? void 0 : _a.role) || '').toLowerCase();
        return role === 'admin' || role === 'super_admin';
    });
    var isManager = (0, vue_1.computed)(function () {
        var _a;
        var role = String(((_a = userInfo.value) === null || _a === void 0 ? void 0 : _a.role) || '').toLowerCase();
        return role === 'admin' || role === 'super_admin';
    });
    // 登录
    function login(username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, user_1.login)({ username: username, password: password })];
                    case 1:
                        res = _a.sent();
                        token.value = res.data.token;
                        userInfo.value = res.data.userInfo || res.data.user;
                        localStorage.setItem('token', token.value);
                        localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
                        return [2 /*return*/, res];
                }
            });
        });
    }
    // 获取用户信息
    function getUserInfo() {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, user_1.getUserInfo)()];
                    case 1:
                        res = _a.sent();
                        userInfo.value = res.data;
                        localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
                        return [2 /*return*/, res];
                }
            });
        });
    }
    // 登出
    function logout() {
        token.value = '';
        userInfo.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
    }
    // 从本地存储恢复
    function restoreFromStorage() {
        var storedToken = localStorage.getItem('token');
        var storedUserInfo = localStorage.getItem('userInfo');
        if (storedToken) {
            token.value = storedToken;
        }
        if (storedUserInfo) {
            try {
                userInfo.value = JSON.parse(storedUserInfo);
            }
            catch (e) {
                console.error('解析用户信息失败:', e);
            }
        }
    }
    return {
        token: token,
        userInfo: userInfo,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        isManager: isManager,
        login: login,
        getUserInfo: getUserInfo,
        logout: logout,
        restoreFromStorage: restoreFromStorage
    };
}, {
    persist: true
});
