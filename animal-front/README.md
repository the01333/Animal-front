# 🐾 i宠园 - 宠物领养系统前端

一个功能完善、界面美观的宠物领养平台前端系统，连接待领养宠物与爱心领养者。

## ✨ 项目简介

i宠园是一个基于 Vue 3 + TypeScript + Element Plus 构建的现代化宠物领养系统前端应用，提供了完整的宠物浏览、领养申请、用户管理、实时通讯和智能客服等功能。

### 核心特性

- 🎨 **现代化 UI 设计** - 基于 Element Plus 组件库，提供精美的界面和流畅的交互体验
- 📱 **响应式布局** - 完美适配各种屏幕尺寸，支持移动端访问
- 🚀 **高性能** - 采用 Vite 构建，图片懒加载，按需加载，快速响应
- 🔐 **完善的权限管理** - 支持多角色权限控制（管理员、审核员、管家、普通用户）
- 💬 **实时通讯** - 基于 WebSocket 的即时聊天功能，用户可与管家实时沟通
- 🤖 **AI 智能客服** - 集成 AI 问答系统，提供 24/7 智能咨询服务
- 🎯 **完整业务流程** - 涵盖宠物浏览、领养申请、审核管理等完整领养流程
- 🖼️ **瀑布流展示** - 采用瀑布流布局展示宠物信息，视觉效果出色

## 🛠️ 技术栈

### 核心框架
- **Vue 3.5+** - 采用 Composition API，提供更好的代码组织和类型推导
- **TypeScript 5.9** - 类型安全，提升代码质量和开发体验
- **Vite 7.1+** - 极速的开发服务器和构建工具

### UI 组件库
- **Element Plus 2.11+** - 成熟的 Vue 3 组件库
- **Element Plus Icons** - 丰富的图标资源
- **vue-waterfall-plugin-next** - 瀑布流布局插件

### 状态管理与路由
- **Vue Router 4.5+** - 官方路由管理器
- **Pinia 3.0+** - Vue 3 推荐的状态管理方案
- **pinia-plugin-persistedstate** - 状态持久化插件

### 工具库
- **Axios 1.7+** - HTTP 请求库
- **NProgress** - 页面加载进度条
- **ECharts 5.5+** - 数据可视化图表库
- **Sass** - CSS 预处理器

### 开发工具
- **Vue DevTools** - Vue 开发者工具
- **Prettier** - 代码格式化工具
- **vue-tsc** - Vue TypeScript 类型检查

## 📦 快速开始

### 环境要求

- **Node.js**: >= 20.19.0 或 >= 22.12.0
- **npm** / **pnpm** / **yarn**: 任选其一

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
npm run dev
```

启动成功后，访问 `http://localhost:5173` 即可查看应用。

### 构建生产版本

```bash
# 类型检查并构建
npm run build

# 仅构建（不检查类型）
npm run build-only

# 预览生产构建
npm run preview
```

### 代码检查与格式化

```bash
# TypeScript 类型检查
npm run type-check

# 代码格式化
npm run format
```

## 📁 项目结构

```
animal-front/
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口定义
│   ├── assets/         # 资源文件（图片、样式等）
│   ├── components/     # 公共组件
│   │   ├── common/     # 通用组件（导航栏、页脚等）
│   │   └── pet/        # 宠物相关组件
│   ├── layouts/        # 布局组件
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── views/          # 页面视图
│   │   ├── admin/      # 后台管理页面
│   │   ├── application/# 领养申请相关页面
│   │   ├── auth/       # 认证相关页面（登录、注册）
│   │   ├── chat/       # 聊天功能页面
│   │   ├── content/    # 内容页面（文章、指南）
│   │   ├── pet/        # 宠物相关页面
│   │   └── user/       # 用户中心页面
│   ├── App.vue         # 根组件
│   └── main.ts         # 应用入口
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 配置
└── package.json        # 项目依赖
```

## 🎯 功能模块

### 前台功能（用户端）

1. **首页展示**
   - 推荐宠物展示
   - 领养流程介绍
   - 成功案例统计
   - 快速操作入口

2. **宠物浏览**
   - 瀑布流布局展示
   - 多条件筛选（种类、年龄、性别、绝育状态等）
   - 关键词搜索
   - 宠物详情查看
   - 图片预览功能

3. **用户认证**
   - 用户注册
   - 登录/登出
   - 个人信息维护
   - 身份认证资料上传

4. **领养申请**
   - 提交领养申请
   - 申请进度查询
   - 申请历史记录
   - 撤销申请

5. **实时通讯**
   - 联系管家私聊
   - 消息发送/接收
   - 历史会话记录
   - WebSocket 实时通讯

6. **AI 智能客服**
   - 24/7 在线问答
   - 领养咨询
   - 智能推荐
   - 问答历史记录

7. **内容浏览**
   - 领养指南
   - 宠物知识科普
   - 成功领养故事
   - 宠物收藏/关注

### 后台功能（管理端）

1. **仪表盘**
   - 数据统计概览
   - 待办事项提醒
   - 业务指标图表
   - 快捷操作入口

2. **宠物管理**
   - 宠物信息 CRUD
   - 图片上传管理
   - 状态管理（上架/下架）
   - 健康档案更新

3. **领养申请管理**
   - 申请列表查询
   - 申请详情审核
   - 审核操作（通过/驳回）
   - 审核意见记录

4. **用户管理**
   - 用户列表查看
   - 用户状态管理
   - 身份信息审核
   - 权限分配

5. **人工客服管理**
   - 用户会话列表
   - 实时聊天界面
   - 会话状态管理
   - 消息历史记录

6. **内容管理**
   - 文章发布与编辑
   - 公告管理
   - 知识库维护

7. **系统配置**
   - 系统参数配置
   - 操作日志查看
   - 权限角色管理

## 🔐 测试账号

### 管理员账号
```
用户名：admin
密码：admin123
```

### 普通用户
```
用户名：user
密码：user123
```

## 🌐 访问地址

- **前台首页**: http://localhost:5173
- **宠物列表**: http://localhost:5173/#/pets
- **管理后台**: http://localhost:5173/#/admin/dashboard

## 🎨 UI/UX 特色

- **现代化设计风格** - 采用渐变色、卡片式设计，视觉效果出色
- **流畅的动画效果** - 卡片悬停、按钮交互、页面过渡等动画
- **友好的用户提示** - 表单验证、消息通知、加载状态等
- **无障碍支持** - 语义化标签、ARIA 属性，提升可访问性
- **图片优化** - 懒加载、占位符、预览功能

## 🔧 开发指南

### IDE 推荐配置

推荐使用 [VS Code](https://code.visualstudio.com/) 并安装以下插件：
- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (原 Volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

**注意**: 请禁用 Vetur 插件，以避免与 Volar 冲突。

### 浏览器开发工具

- **Chrome/Edge**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### TypeScript 支持

TypeScript 默认无法处理 `.vue` 文件的类型信息，因此我们使用 `vue-tsc` 进行类型检查。在编辑器中，需要安装 Volar 插件来让 TypeScript 语言服务识别 `.vue` 文件类型。

### API 配置

确保后端服务已启动，默认 API 地址为 `http://localhost:8080/api`。如需修改，请在相应的环境配置文件中调整。

## 📚 相关文档

- [快速开始指南](./快速开始.md) - 详细的安装和运行说明
- [UI 美化文档](./UI_IMPROVEMENTS.md) - UI 改进详细说明
- [功能与技术栈文档](./宠物领养系统毕业设计功能与技术栈文档.txt) - 完整的功能设计文档
- [Vite 配置参考](https://vite.dev/config/) - Vite 官方配置文档
- [Vue 3 文档](https://cn.vuejs.org/) - Vue 3 官方中文文档
- [Element Plus 文档](https://element-plus.org/zh-CN/) - Element Plus 组件库文档

## ❓ 常见问题

### 依赖安装失败？
尝试删除 `node_modules` 文件夹和 `package-lock.json`，然后重新运行 `npm install`。

### 端口被占用？
修改 `vite.config.ts` 中的 `server.port` 配置项。

### API 请求失败？
检查后端服务是否启动，确认 API 地址配置是否正确。

### 管理后台无法访问？
确保使用管理员账号登录，并检查路由权限配置。

### 图片显示异常？
检查图片路径是否正确，确认图片资源已正确放置在 `public` 或 `src/assets` 目录。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。在提交 PR 前，请确保：

1. 代码符合项目的编码规范
2. 运行 `npm run type-check` 确保类型检查通过
3. 运行 `npm run format` 格式化代码
4. 测试功能正常工作

## 📄 许可证

本项目仅供学习和研究使用。

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：

- Author: YCcLin
- Contact E-mail: 3149696140@qq.com

---

**用心关爱每一只宠物，让爱找到归宿** 🐾
