"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./polyfill-global");
require("./assets/main.css");
require("./assets/markdown.css");
var vue_1 = require("vue");
var pinia_1 = require("pinia");
var pinia_plugin_persistedstate_1 = require("pinia-plugin-persistedstate");
var element_plus_1 = require("element-plus");
require("element-plus/dist/index.css");
var ElementPlusIconsVue = require("@element-plus/icons-vue");
var zh_cn_1 = require("element-plus/es/locale/lang/zh-cn");
var vue_waterfall_plugin_next_1 = require("vue-waterfall-plugin-next");
require("vue-waterfall-plugin-next/dist/style.css");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
var app = (0, vue_1.createApp)(App_vue_1.default);
var pinia = (0, pinia_1.createPinia)();
pinia.use(pinia_plugin_persistedstate_1.default);
// 注册所有 Element Plus 图标
for (var _i = 0, _a = Object.entries(ElementPlusIconsVue); _i < _a.length; _i++) {
    var _b = _a[_i], key = _b[0], component = _b[1];
    app.component(key, component);
}
app.use(pinia);
app.use(router_1.default);
app.use(element_plus_1.default, {
    locale: zh_cn_1.default
});
// 注册瀑布流组件
app.component('LazyImg', vue_waterfall_plugin_next_1.LazyImg);
app.component('Waterfall', vue_waterfall_plugin_next_1.Waterfall);
app.mount('#app');
