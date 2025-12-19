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
var icons_vue_1 = require("@element-plus/icons-vue");
var props = defineProps();
var router = (0, vue_router_1.useRouter)();
var defaultImage = 'http://localhost:9000/animal-adopt/default.jpg';
var statusText = (0, vue_1.computed)(function () {
    switch (props.pet.status) {
        case 'available': return '可领养';
        case 'adopted': return '已领养';
        case 'pending': return '领养中';
        default: return '未知';
    }
});
var statusType = (0, vue_1.computed)(function () {
    switch (props.pet.status) {
        case 'available': return 'success';
        case 'adopted': return 'info';
        case 'pending': return 'warning';
        default: return 'info';
    }
});
var goToDetail = function () {
    router.push("/pet/".concat(props.pet.id));
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_elements;
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['image']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
var __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
ElCard;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign({ 'onClick': {} }, { class: "pet-card" }), { bodyStyle: ({ padding: '0px' }), shadow: "hover" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "pet-card" }), { bodyStyle: ({ padding: '0px' }), shadow: "hover" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_4;
var __VLS_5;
var __VLS_6 = ({ click: {} },
    { onClick: (__VLS_ctx.goToDetail) });
var __VLS_7 = {};
var __VLS_8 = __VLS_3.slots.default;
// @ts-ignore
[goToDetail,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-image" }));
var __VLS_9 = {}.ElImage;
/** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
// @ts-ignore
ElImage;
// @ts-ignore
var __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9(__assign(__assign({ src: (__VLS_ctx.pet.image || __VLS_ctx.defaultImage), alt: (__VLS_ctx.pet.name), fit: "cover" }, { class: "image" }), { lazy: true })));
var __VLS_11 = __VLS_10.apply(void 0, __spreadArray([__assign(__assign({ src: (__VLS_ctx.pet.image || __VLS_ctx.defaultImage), alt: (__VLS_ctx.pet.name), fit: "cover" }, { class: "image" }), { lazy: true })], __VLS_functionalComponentArgsRest(__VLS_10), false));
var __VLS_13 = __VLS_12.slots.default;
// @ts-ignore
[pet, pet, defaultImage,];
{
    var __VLS_14 = __VLS_12.slots.placeholder;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-slot" }));
    var __VLS_15 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15(__assign({ class: "is-loading" })));
    var __VLS_17 = __VLS_16.apply(void 0, __spreadArray([__assign({ class: "is-loading" })], __VLS_functionalComponentArgsRest(__VLS_16), false));
    var __VLS_19 = __VLS_18.slots.default;
    var __VLS_20 = {}.Loading;
    /** @type {[typeof __VLS_components.Loading, ]} */ ;
    // @ts-ignore
    Loading;
    // @ts-ignore
    var __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_21), false));
    var __VLS_18;
}
{
    var __VLS_25 = __VLS_12.slots.error;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "image-slot" }));
    var __VLS_26 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    ElIcon;
    // @ts-ignore
    var __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({}));
    var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_27), false));
    var __VLS_30 = __VLS_29.slots.default;
    var __VLS_31 = {}.Picture;
    /** @type {[typeof __VLS_components.Picture, ]} */ ;
    // @ts-ignore
    Picture;
    // @ts-ignore
    var __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
    var __VLS_33 = __VLS_32.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_32), false));
    var __VLS_29;
}
var __VLS_12;
var __VLS_36 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
ElTag;
// @ts-ignore
var __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36(__assign(__assign({ type: (__VLS_ctx.statusType) }, { class: "status-tag" }), { effect: "dark" })));
var __VLS_38 = __VLS_37.apply(void 0, __spreadArray([__assign(__assign({ type: (__VLS_ctx.statusType) }, { class: "status-tag" }), { effect: "dark" })], __VLS_functionalComponentArgsRest(__VLS_37), false));
var __VLS_40 = __VLS_39.slots.default;
// @ts-ignore
[statusType,];
(__VLS_ctx.statusText);
// @ts-ignore
[statusText,];
var __VLS_39;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "pet-info" }));
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)(__assign({ class: "pet-name" }));
var __VLS_41 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41(__assign({ class: "name-icon" })));
var __VLS_43 = __VLS_42.apply(void 0, __spreadArray([__assign({ class: "name-icon" })], __VLS_functionalComponentArgsRest(__VLS_42), false));
var __VLS_45 = __VLS_44.slots.default;
var __VLS_46 = {}.Star;
/** @type {[typeof __VLS_components.Star, ]} */ ;
// @ts-ignore
Star;
// @ts-ignore
var __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({}));
var __VLS_48 = __VLS_47.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_47), false));
var __VLS_44;
(__VLS_ctx.pet.name);
// @ts-ignore
[pet,];
var __VLS_51 = {}.ElSpace;
/** @type {[typeof __VLS_components.ElSpace, typeof __VLS_components.elSpace, typeof __VLS_components.ElSpace, typeof __VLS_components.elSpace, ]} */ ;
// @ts-ignore
ElSpace;
// @ts-ignore
var __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    direction: "vertical",
    size: (8),
    fill: true,
}));
var __VLS_53 = __VLS_52.apply(void 0, __spreadArray([{
        direction: "vertical",
        size: (8),
        fill: true,
    }], __VLS_functionalComponentArgsRest(__VLS_52), false));
var __VLS_55 = __VLS_54.slots.default;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
var __VLS_56 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
var __VLS_58 = __VLS_57.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_57), false));
var __VLS_60 = __VLS_59.slots.default;
var __VLS_61 = {}.Grid;
/** @type {[typeof __VLS_components.Grid, ]} */ ;
// @ts-ignore
Grid;
// @ts-ignore
var __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({}));
var __VLS_63 = __VLS_62.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_62), false));
var __VLS_59;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.pet.breed);
// @ts-ignore
[pet,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "info-item" }));
var __VLS_66 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
ElIcon;
// @ts-ignore
var __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({}));
var __VLS_68 = __VLS_67.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_67), false));
var __VLS_70 = __VLS_69.slots.default;
var __VLS_71 = {}.Clock;
/** @type {[typeof __VLS_components.Clock, ]} */ ;
// @ts-ignore
Clock;
// @ts-ignore
var __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({}));
var __VLS_73 = __VLS_72.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_72), false));
var __VLS_69;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.pet.age);
// @ts-ignore
[pet,];
var __VLS_54;
var __VLS_76 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
ElDivider;
// @ts-ignore
var __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76(__assign({ style: {} })));
var __VLS_78 = __VLS_77.apply(void 0, __spreadArray([__assign({ style: {} })], __VLS_functionalComponentArgsRest(__VLS_77), false));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)(__assign({ class: "button-group" }));
var __VLS_81 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
ElButton;
// @ts-ignore
var __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81(__assign(__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.View) }), { class: "view-btn" })));
var __VLS_83 = __VLS_82.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { type: "primary", icon: (__VLS_ctx.View) }), { class: "view-btn" })], __VLS_functionalComponentArgsRest(__VLS_82), false));
var __VLS_85;
var __VLS_86;
var __VLS_87 = ({ click: {} },
    { onClick: (__VLS_ctx.goToDetail) });
var __VLS_88 = __VLS_84.slots.default;
// @ts-ignore
[goToDetail, icons_vue_1.View,];
var __VLS_84;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['pet-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-image']} */ ;
/** @type {__VLS_StyleScopedClasses['image']} */ ;
/** @type {__VLS_StyleScopedClasses['image-slot']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['image-slot']} */ ;
/** @type {__VLS_StyleScopedClasses['status-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-info']} */ ;
/** @type {__VLS_StyleScopedClasses['pet-name']} */ ;
/** @type {__VLS_StyleScopedClasses['name-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['button-group']} */ ;
/** @type {__VLS_StyleScopedClasses['view-btn']} */ ;
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
