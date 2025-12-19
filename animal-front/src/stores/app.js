"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
exports.useAppStore = (0, pinia_1.defineStore)('app', function () {
    // 侧边栏折叠状态
    var sidebarCollapsed = (0, vue_1.ref)(false);
    // 设备类型
    var device = (0, vue_1.ref)('desktop');
    // 主题
    var theme = (0, vue_1.ref)('light');
    // 客服未读总数（客服端），用于后台左侧导航红点提示
    var csUnreadForAgent = (0, vue_1.ref)(0);
    // 客服未读总数（用户端），用于前台人工客服入口红点提示
    var csUnreadForUser = (0, vue_1.ref)(0);
    // 切换侧边栏
    function toggleSidebar() {
        sidebarCollapsed.value = !sidebarCollapsed.value;
    }
    // 设置设备类型
    function setDevice(type) {
        device.value = type;
    }
    // 切换主题
    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    }
    // 设置客服未读总数（客服端）
    function setCsUnreadForAgent(count) {
        csUnreadForAgent.value = count > 0 ? count : 0;
    }
    // 设置客服未读总数（用户端）
    function setCsUnreadForUser(count) {
        csUnreadForUser.value = count > 0 ? count : 0;
    }
    return {
        sidebarCollapsed: sidebarCollapsed,
        device: device,
        theme: theme,
        csUnreadForAgent: csUnreadForAgent,
        csUnreadForUser: csUnreadForUser,
        toggleSidebar: toggleSidebar,
        setDevice: setDevice,
        toggleTheme: toggleTheme,
        setCsUnreadForAgent: setCsUnreadForAgent,
        setCsUnreadForUser: setCsUnreadForUser
    };
}, {
    persist: true
});
