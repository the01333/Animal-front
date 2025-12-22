# 🐾 i宠园 - 宠物领养系统前端

> **让爱找到归宿** - 一个功能完善、界面美观的宠物领养平台前端系统，连接待领养宠物与爱心领养者。

[![Node.js](https://img.shields.io/badge/Node.js-v20.19.0%2B-green)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5%2B-4FC08D)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1%2B-646CFF)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## ✨ 项目简介

i宠园是一个基于 **Vue 3 + TypeScript + Element Plus** 构建的现代化宠物领养系统前端应用，提供了完整的宠物浏览、领养申请、用户管理、实时通讯和智能客服等功能。系统采用前后端分离架构，通过 RESTful API 与后端服务通信，支持多角色权限管理和完整的业务流程。

### 🎯 核心特性

- 🎨 **现代化 UI 设计** - 基于 Element Plus 组件库，提供精美的界面和流畅的交互体验
- 📱 **响应式布局** - 完美适配各种屏幕尺寸（PC、平板、手机），支持移动端访问
- 🚀 **高性能** - 采用 Vite 构建，支持图片懒加载、按需加载、代码分割，快速响应
- 🔐 **完善的权限管理** - 支持多角色权限控制（超级管理员、管理员、审核员、管家、普通用户）
- 💬 **实时通讯** - 基于 WebSocket 的即时聊天功能，用户可与管家实时沟通，支持消息历史记录
- 🤖 **AI 智能客服** - 集成 Spring AI 智能问答系统，提供 24/7 智能咨询服务，支持流式输出
- 🎯 **完整业务流程** - 涵盖宠物浏览、领养申请、审核管理等完整领养流程
- 🖼️ **瀑布流展示** - 采用瀑布流布局展示宠物信息，视觉效果出色
- 📊 **数据可视化** - 使用 ECharts 展示统计数据和业务指标
- 🔍 **智能搜索** - 支持多条件筛选、关键词搜索、高级搜索

## 🎓 毕业设计亮点（前端）

- **完整业务闭环** - 覆盖从访客浏览、注册登录、身份认证、提交领养申请、与客服沟通到领养结果反馈的完整前端流程，便于在论文中展示“业务全流程设计”。
- **前台门户 + 后台管理一体化** - 单一前端项目同时实现用户端和管理端两套界面，通过路由和权限控制进行隔离，结构清晰、层次分明。
- **多种交互形态组合** - 同时涵盖传统表单、瀑布流展示、图表可视化、实时聊天、AI 流式回复等多种交互形式，展示前端综合能力。
- **工程化与规范化实践** - TypeScript 全面类型约束、Pinia 状态管理、Axios 请求封装、路由守卫、统一错误处理，体现前端工程化和可维护性。
- **与后端深度协作** - 支持 REST API、WebSocket 实时通讯、SSE 流式输出、MinIO 图片访问等多种通信方式，可以在答辩中重点讲“前后端协同设计”。

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
- **后端服务**: 需要启动后端 API 服务（默认地址：`http://localhost:8080/api`）

### 安装依赖

```bash
# 进入项目目录
cd Animal-front/animal-front

# 使用 npm 安装依赖
npm install

# 或使用 pnpm（推荐，更快）
pnpm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 启动开发服务器
npm run dev

# 或使用 pnpm
pnpm dev
```

启动成功后，访问 `http://localhost:5173` 即可查看应用。

### 构建生产版本

```bash
# 类型检查并构建（推荐）
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

# 代码格式化（使用 Prettier）
npm run format
```

### 环境配置

项目支持多环境配置，通过 `.env*` 文件管理：

- `.env` - 全局环境变量
- `.env.development` - 开发环境
- `.env.production` - 生产环境

修改 API 地址：编辑 `.env.development` 或 `.env.production`

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📁 项目结构

```
animal-front/
├── public/                    # 静态资源
│   └── favicon.ico           # 网站图标
├── src/
│   ├── api/                  # API 接口定义
│   │   ├── user.ts          # 用户相关接口
│   │   ├── pet.ts           # 宠物相关接口
│   │   ├── adoption.ts      # 领养申请接口
│   │   ├── ai.ts            # AI 客服接口
│   │   ├── chat.ts          # 聊天接口
│   │   ├── article.ts       # 文章接口
│   │   └── ...
│   ├── assets/               # 资源文件
│   │   ├── images/          # 图片资源
│   │   ├── styles/          # 全局样式
│   │   └── fonts/           # 字体文件
│   ├── components/           # 公共组件
│   │   ├── common/          # 通用组件
│   │   │   ├── Navbar.vue   # 导航栏
│   │   │   ├── Footer.vue   # 页脚
│   │   │   └── ...
│   │   ├── pet/             # 宠物相关组件
│   │   ├── AIChatWidget.vue # AI 客服组件
│   │   └── ...
│   ├── layouts/              # 布局组件
│   │   ├── FrontLayout.vue  # 前台布局
│   │   └── AdminLayout.vue  # 后台布局
│   ├── router/               # 路由配置
│   │   ├── index.ts         # 路由主文件
│   │   └── routes.ts        # 路由定义
│   ├── stores/               # Pinia 状态管理
│   │   ├── user.ts          # 用户状态
│   │   ├── app.ts           # 应用状态
│   │   └── ...
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts         # 全局类型
│   ├── utils/                # 工具函数
│   │   ├── request.ts       # HTTP 请求工具
│   │   ├── storage.ts       # 本地存储工具
│   │   └── ...
│   ├── views/                # 页面视图
│   │   ├── admin/           # 后台管理页面
│   │   │   ├── dashboard/   # 仪表板
│   │   │   ├── pet/         # 宠物管理
│   │   │   ├── user/        # 用户管理
│   │   │   ├── adoption/    # 申请管理
│   │   │   └── ...
│   │   ├── application/     # 领养申请相关页面
│   │   ├── auth/            # 认证相关页面
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   └── ...
│   │   ├── chat/            # 聊天功能页面
│   │   ├── content/         # 内容页面
│   │   │   ├── GuideDetailView.vue
│   │   │   ├── StoryDetailView.vue
│   │   │   └── ...
│   │   ├── pet/             # 宠物相关页面
│   │   │   ├── PetListView.vue
│   │   │   ├── PetDetailView.vue
│   │   │   └── ...
│   │   ├── user/            # 用户中心页面
│   │   │   ├── ProfileView.vue
│   │   │   ├── CertificationView.vue
│   │   │   └── ...
│   │   ├── HomeView.vue     # 首页
│   │   └── ...
│   ├── App.vue              # 根组件
│   ├── main.ts              # 应用入口
│   └── style.css            # 全局样式
├── .env                      # 全局环境变量
├── .env.development          # 开发环境变量
├── .env.production           # 生产环境变量
├── .prettierrc.json          # Prettier 配置
├── index.html                # HTML 模板
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── tsconfig.app.json         # 应用 TypeScript 配置
├── tsconfig.node.json        # Node TypeScript 配置
└── package.json              # 项目依赖
```

## 🎯 功能模块

### 前台功能（用户端）

#### 1. 首页展示
- 推荐宠物展示（瀑布流布局）
- 领养流程介绍（4步流程）
- 成功案例统计（数据可视化）
- 快速操作入口（搜索、浏览、申请）
- 热门宠物排行

#### 2. 宠物浏览
- **瀑布流布局展示** - 响应式多列布局，视觉效果出色
- **多条件筛选** - 种类、年龄、性别、绝育状态、健康状态等
- **关键词搜索** - 支持宠物名称、品种、特征搜索
- **宠物详情查看** - 完整的宠物信息展示
- **图片预览功能** - 支持大图预览、轮播展示
- **收藏功能** - 收藏喜爱的宠物

#### 3. 用户认证
- **用户注册** - 邮箱/手机号注册，验证码验证
- **登录/登出** - 支持记住密码、自动登录
- **个人信息维护** - 修改头像、昵称、联系方式等
- **身份认证资料上传** - 身份证正反面、身份证号上传
- **认证状态查询** - 查看认证进度（未提交/审核中/已认证/已拒绝）

#### 4. 领养申请
- **提交领养申请** - 填写领养理由、家庭信息、照顾计划等
- **申请进度查询** - 实时查看申请状态（待审核/已通过/已拒绝）
- **申请历史记录** - 查看所有历史申请
- **撤销申请** - 支持撤销待审核的申请

#### 5. 实时通讯
- **联系管家私聊** - 与管家进行一对一沟通
- **消息发送/接收** - 实时消息推送
- **历史会话记录** - 保存聊天历史，支持查询
- **WebSocket 实时通讯** - 基于 WebSocket 的即时通讯

#### 6. AI 智能客服
- **24/7 在线问答** - 随时可用的智能客服
- **领养咨询** - 回答领养相关问题
- **智能推荐** - 根据用户需求推荐合适的宠物
- **问答历史记录** - 保存对话历史，支持查询
- **流式输出** - 支持 AI 流式回复，实时显示

#### 7. 内容浏览
- **领养指南** - 新手领养指南、宠物护理指南等
- **宠物知识科普** - 宠物健康、训练、营养等知识
- **成功领养故事** - 真实的领养案例分享
- **文章收藏** - 收藏喜爱的文章

#### 8. 用户中心与个人空间
- **个人资料管理** - 修改头像、昵称、联系方式等基础信息
- **认证状态查看** - 集中查看领养者认证状态和审核拒绝原因，支持重新发起认证
- **我的领养与收藏** - 查看历史领养申请记录、已收藏的宠物和文章
- **消息与对话入口** - 从个人中心快速进入人工客服会话和 AI 客服历史记录，形成统一的用户侧工作台

### 后台功能（管理端）

#### 1. 仪表盘
- **数据统计概览** - 宠物总数、可领养数、已领养数、用户总数
- **待办事项提醒** - 待审核申请、待审核认证等
- **业务指标图表** - 使用 ECharts 展示各类数据
- **快捷操作入口** - 快速访问常用功能

#### 2. 宠物管理
- **宠物信息 CRUD** - 创建、读取、更新、删除宠物信息
- **图片上传管理** - 支持封面图、多张宠物图片上传到 MinIO
- **状态管理** - 上架/下架宠物、更新领养状态
- **健康档案更新** - 记录宠物的健康信息、疫苗接种等
- **批量操作** - 支持批量删除、批量上架/下架

#### 3. 领养申请管理
- **申请列表查询** - 分页查询、多条件筛选
- **申请详情审核** - 查看完整的申请信息
- **审核操作** - 通过/驳回申请，添加审核意见
- **审核意见记录** - 记录审核历史和意见
- **自动状态更新** - 申请通过时自动更新宠物状态

#### 4. 用户管理
- **用户列表查看** - 分页查询、搜索用户
- **用户状态管理** - 启用/禁用用户账号
- **身份信息审核** - 审核用户上传的身份认证资料
- **权限分配** - 为用户分配角色（管理员、审核员、管家等）
- **用户详情查看** - 查看用户的完整信息和操作历史

#### 5. 人工客服管理
- **用户会话列表** - 查看所有用户会话
- **实时聊天界面** - 与用户进行实时聊天
- **会话状态管理** - 关闭/转接会话
- **消息历史记录** - 查看完整的聊天历史
- **客服工作统计** - 统计客服的工作量和满意度

#### 6. 内容管理
- **文章发布与编辑** - 创建、编辑、发布文章
- **分类管理** - 管理文章分类（指南、故事、新闻等）
- **公告管理** - 发布系统公告
- **知识库维护** - 维护宠物知识库

#### 7. 系统配置
- **系统参数配置** - 配置系统参数（如每页显示数量等）
- **操作日志查看** - 查看系统操作日志
- **权限角色管理** - 管理用户角色和权限

## 🔐 测试账号

### 超级管理员
```
用户名：普信小林
密码：123456
角色：超级管理员，拥有所有权限
```
### 管理员
```
用户名：admin
密码：123456
角色：审核员，可以审核领养申请和用户认证
```

### 普通用户
```
用户名：林林1
密码：123456
角色：普通用户，可以浏览宠物、提交申请
```




## 🌐 访问地址

| 功能 | 地址 |
|------|------|
| 前台首页 | http://localhost:5173 |
| 宠物列表 | http://localhost:5173/#/pets |
| 管理后台 | http://localhost:5173/#/admin/dashboard |
| 用户中心 | http://localhost:5173/#/user/profile |
| AI 客服 | 浮动窗口（全页面可用） |

## 🎨 UI/UX 特色

- **现代化设计风格** - 采用渐变色、卡片式设计，视觉效果出色
- **流畅的动画效果** - 卡片悬停、按钮交互、页面过渡等动画
- **友好的用户提示** - 表单验证、消息通知、加载状态等
- **无障碍支持** - 语义化标签、ARIA 属性，提升可访问性
- **图片优化** - 懒加载、占位符、预览功能
- **响应式设计** - 完美适配各种屏幕尺寸

## 🔧 开发指南

### IDE 推荐配置

推荐使用 [VS Code](https://code.visualstudio.com/) 并安装以下插件：

- **[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)** - Vue 3 官方插件（原 Volar）
- **[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)** - TypeScript 支持
- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** - 代码格式化
- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** - 代码检查
- **[Vite](https://marketplace.visualstudio.com/items?itemName=antfu.vite)** - Vite 支持

**注意**: 请禁用 Vetur 插件，以避免与 Volar 冲突。

### 浏览器开发工具

- **Chrome/Edge**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### TypeScript 支持

TypeScript 默认无法处理 `.vue` 文件的类型信息，因此我们使用 `vue-tsc` 进行类型检查。在编辑器中，需要安装 Volar 插件来让 TypeScript 语言服务识别 `.vue` 文件类型。

### API 配置

确保后端服务已启动，默认 API 地址为 `http://localhost:8080/api`。如需修改，请在相应的环境配置文件中调整。

### 代码风格

项目使用 Prettier 进行代码格式化，使用 ESLint 进行代码检查。提交代码前请运行：

```bash
npm run format
npm run type-check
```

## 📚 相关文档

- [快速开始指南](animal-front/快速开始.md) - 详细的安装和运行说明
- [UI 美化文档](animal-front/UI_IMPROVEMENTS.md) - UI 改进详细说明
- [功能与技术栈文档](animal-front/宠物领养系统毕业设计功能与技术栈文档.txt) - 完整的功能设计文档
- [Vite 配置参考](https://vite.dev/config/) - Vite 官方配置文档
- [Vue 3 文档](https://cn.vuejs.org/) - Vue 3 官方中文文档
- [Element Plus 文档](https://element-plus.org/zh-CN/) - Element Plus 组件库文档
- [TypeScript 文档](https://www.typescriptlang.org/docs/) - TypeScript 官方文档

## ❓ 常见问题

### Q: 依赖安装失败？
**A**: 尝试以下步骤：
1. 删除 `node_modules` 文件夹和 `package-lock.json`
2. 清除 npm 缓存：`npm cache clean --force`
3. 重新运行 `npm install`
4. 如果仍然失败，尝试使用 pnpm：`pnpm install`

### Q: 端口被占用？
**A**: 修改 `vite.config.ts` 中的 `server.port` 配置项：
```typescript
server: {
  port: 5174  // 改为其他端口
}
```

### Q: API 请求失败？
**A**: 检查以下几点：
1. 后端服务是否启动（http://localhost:8080）
2. API 地址配置是否正确（`.env.development`）
3. 浏览器控制台是否有 CORS 错误
4. 检查网络连接

### Q: 管理后台无法访问？
**A**: 
1. 确保使用管理员账号登录
2. 检查路由权限配置
3. 查看浏览器控制台是否有错误信息

### Q: 图片显示异常？
**A**:
1. 检查图片路径是否正确
2. 确认图片资源已正确放置在 `public` 或 `src/assets` 目录
3. 检查 MinIO 服务是否启动（用于上传的图片）
4. 查看浏览器网络标签中的图片请求是否成功

### Q: 如何调试 AI 客服功能？
**A**:
1. 打开浏览器开发者工具（F12）
2. 查看 Network 标签中的 WebSocket 连接
3. 查看 Console 标签中的错误信息
4. 确保后端 AI 服务已启动

### Q: 如何修改 API 请求超时时间？
**A**: 编辑 `src/utils/request.ts`，修改 `timeout` 配置：
```typescript
const request = axios.create({
  timeout: 30000  // 改为所需的超时时间（毫秒）
})
```

## 🚀 性能优化建议

- 使用 `npm run build` 生成生产版本，启用代码分割和压缩
- 启用图片懒加载，减少初始加载时间
- 使用 CDN 加速静态资源
- 启用 Gzip 压缩
- 定期清理浏览器缓存

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。在提交 PR 前，请确保：

1. 代码符合项目的编码规范
2. 运行 `npm run type-check` 确保类型检查通过
3. 运行 `npm run format` 格式化代码
4. 测试功能正常工作
5. 提交信息清晰明确

## 📄 许可证

本项目仅供学习和研究使用。

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：

- **Author**: YCcLin
- **Email**: 3149696140@qq.com
- **GitHub**: [https://github.com/the01333/Animal-front](https://github.com/the01333/Animal-front)

---

**用心关爱每一只宠物，让爱找到归宿** 🐾
